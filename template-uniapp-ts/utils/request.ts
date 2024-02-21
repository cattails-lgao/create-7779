import { isEmptyObj, isArray, isObject, isFunc } from '@/utils/index';
import { SUCCESS_CODE, TOKENNAME, CLIENTID, ERROR_TYPE } from '@/constants';
import { LOGIN_TOKEN } from '@/constants';
import cache from '@/utils/cache';

// import { toLogin, _doRefreshAccToken } from '@/api';

interface ConfigType {
	rootUrl: string;
	urlPath: RequestNameSpace.UrlPathType;
	data?: Record<string, any>;
	query?: Record<string, any>;
	routeParams?: Record<string, any>;
	header?: Record<string, any>;
	relevantLogin?: boolean;
	noAuthCode?: boolean;
	isNotHandlerTokenExpired?: boolean; // 不处理token过去
	[key: string]: any;
}

type Response = <T>(
	config: ConfigType,
	response: UniNamespace.RequestSuccessCallbackResult
) => Promise<ResponseNameSpace.ResponsDataType<T>>;

interface Interceptor {
	request: ((config: ConfigType) => ConfigType) | null;
	response: Response | null;
}

export interface ErrorReson {
	code: ERROR_TYPE;
	msg: string;
}

/**
 * @description:
 * @param {object} query
 * @return {string}
 */
function queryString(query: Record<string, any>): string {
	let strArr: string[] = [];
	for (let key in query) {
		if (isArray(query[key]) || isObject(query[key])) {
			strArr.push(key + '=' + JSON.stringify(query[key]));
		} else {
			strArr.push(key + '=' + query[key]);
		}
	}

	return strArr.join('&');
}

const routerParamReg = /:\w+/gi;
function generateUrl(url: string, routeParams: Record<string, any>, query: Record<string, any>) {
	// 正则匹配路径参数 并替换参数
	url = url.replace(routerParamReg, (item: string) => {
		const key = item.slice(1);
		if (Object.prototype.hasOwnProperty.call(routeParams, key)) {
			return routeParams[key];
		}
		return '';
	});

	if (!isEmptyObj(query)) {
		url += '?' + queryString(query);
	}

	return url;
}

function Axios() {
	// 请求队列
	const requestTask: Map<string, UniNamespace.RequestTask> = new Map();

	// 拦截器
	const interceptor: Interceptor = {
		request: null, // 请求前
		response: null // 请求后
	};

	function useInterceptorRequest(callback: (config: ConfigType) => ConfigType) {
		if (isFunc(callback)) interceptor.request = callback;
	}

	function useInterceptorResponse(callback: Response) {
		if (isFunc(callback)) interceptor.response = callback;
	}

	/**
	 * 请求
	 */
	function request<T>(config: ConfigType) {
		if (interceptor.request != null) {
			config = interceptor.request(config);
		}

		const options: UniNamespace.RequestOptions = {
			url: config.url || '',
			method: config.urlPath.method,
			header: config.header,
			data: config.data
		};

		return new Promise<ResponseNameSpace.ResponsDataType<T>>((resolve, reject: (reson: ErrorReson) => void) => {
			const task = uni.request({
				...options,
				success: response => {
					if (interceptor.response !== null) {
						resolve(interceptor.response<T>(config, response));
					}
				},
				fail: () => {
					uni.showToast({
						title: ERROR_TYPE[ERROR_TYPE.ERR_NETWORK],
						icon: 'none'
					});
					reject({
						code: ERROR_TYPE.ERR_NETWORK,
						msg: ERROR_TYPE[ERROR_TYPE.ERR_NETWORK]
					});
				},
				complete: (complete: any) => {
					// 请求完成删除key
					requestTask.delete(config.abortKey);

					// 开发环境输入请求日志
					// if (process.env.DEV_ENV === DEV_ENV.DEV) {
					console.log(
						`${config.urlPath.method}：${complete.statusCode}->${config.url}, params: ${JSON.stringify(
							config.data || {}
						)}, header:${JSON.stringify(config.header)}, response:${JSON.stringify(complete.data)}`
					);
					// }
				}
			});

			requestTask.set(config.abortKey, task);
		});
	}

	return {
		request,
		useInterceptorRequest,
		useInterceptorResponse
	};
}

const axios = Axios();

axios.useInterceptorRequest((config: ConfigType) => {
	const defaultConfig = {
		header: {},
		url: config.rootUrl + generateUrl(config.urlPath.url, config.routeParams || {}, config.query || {}),
		abortKey: 'r_' + config.url,
		...config
	};

	if (config.relevantLogin) {
		defaultConfig.header[TOKENNAME] = 'Basic ' + btoa(CLIENTID);
	} else {
		defaultConfig.header[TOKENNAME] = 'Bearer ' + cache.get(LOGIN_TOKEN);
	}

	return defaultConfig;
});
axios.useInterceptorResponse(function<T>(config: ConfigType, response: UniNamespace.RequestSuccessCallbackResult) {
	const statusCode = response.statusCode;
	const ret = response.data as ResponseNameSpace.ResponsDataType<T>;

	if (statusCode == ERROR_TYPE.ERR_CODE_EQ_200) {
		if (config.noAuthCode) {
			return Promise.resolve({
				code: SUCCESS_CODE,
				msg: '',
				data: (ret as unknown) as T
			});
		} else {
			if (ret.code === SUCCESS_CODE || ret.code === 200) {
				return Promise.resolve(ret);
			} else {
				showTitle(ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_CODE_EQ_200]);
				return Promise.reject({
					code: ERROR_TYPE.ERR_CODE_EQ_200,
					msg: ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_CODE_EQ_200]
				});
			}
		}
	} else if (statusCode == ERROR_TYPE.ERR_CODE_401) {
		// 未携带token或者token格式错误
		// toLogin();
		showTitle(ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_CODE_401]);
		return Promise.reject({
			code: ERROR_TYPE.ERR_CODE_401,
			msg: ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_CODE_401]
		});
	} else if (statusCode == ERROR_TYPE.ERR_CODE_424) {
		return handler_ERR_CODE_424<T>(config, ret);
	} else {
		showTitle(ret.msg || String(statusCode));
		return Promise.reject({
			code: ERROR_TYPE.ERR_CODE_NEQ_200,
			msg: ret.msg || String(statusCode)
		});
	}
});

let isRefreshing = false; // 是否正在刷新
let errorRequests: Array<() => void> = []; // 请求错误的
function handler_ERR_CODE_424<T>(config: ConfigType, ret: ResponseNameSpace.ResponsDataType<T>) {
	if (!config.relevantLogin) {
		if (!isRefreshing) {
			isRefreshing = true;
			return new Promise((resolve: (value: Promise<any>) => void) => {
				// _doRefreshAccToken().then((rRet: boolean) => {
				// 	isRefreshing = false;
				// 	// 刷新失败
				// 	if (!rRet) {
				// 		if (!config.isNotHandlerTokenExpired) toLogin();
				// 		showTitle(ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_REFRESH]);
				// 		resolve(
				// 			Promise.reject({
				// 				code: ERROR_TYPE.ERR_REFRESH,
				// 				msg: ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_REFRESH]
				// 			})
				// 		);
				// 		return;
				// 	}
				// 	errorRequests.forEach((cb: () => void) => cb());
				// 	errorRequests = [];
				// 	// 执行最开始就错误的
				// 	const p = axios
				// 		.request<T>(config)
				// 		.then(aRsp => aRsp)
				// 		.catch(err => Promise.reject(err));
				// 	resolve(p);
				// });
			});
		} else {
			return new Promise((resolve: (value: Promise<ResponseNameSpace.ResponsDataType<T>>) => void) => {
				errorRequests.push(() => {
					const p = axios
						.request<T>(config)
						.then(aRsp => aRsp)
						.catch(err => Promise.reject(err));
					resolve(p);
				});
			});
		}
	}
	showTitle(ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_CODE_424]);
	return Promise.reject({
		code: ERROR_TYPE.ERR_CODE_424,
		msg: ret.msg || ERROR_TYPE[ERROR_TYPE.ERR_CODE_424]
	});
}

function showTitle(msg: string) {
	uni.showToast({
		title: msg,
		icon: 'none'
	});
}

export default axios;
