import { isFunc, isEmptyObj, isBoolean, isObject, isArray } from '@/utils/index';
import { DEV_ENV } from '@/constants';

enum RouterFuncType {
	NavigateTo = 'navigateTo',
	RedirectTo = 'redirectTo',
	ReLaunch = 'reLaunch',
	SwitchTab = 'switchTab',
	NavigateBack = 'navigateBack'
}

export enum AnimateType {
	slideInRight = 'slide-in-right', // slide-out-right	新窗体从右侧进入
	slideInLeft = 'slide-in-left', // slide-out-left	新窗体从左侧进入
	slideInTop = 'slide-in-top', // slide-out-top	新窗体从顶部进入
	slideInBottom = 'slide-in-bottom', // slide-out-bottom	新窗体从底部进入
	popIn = 'pop-in', // pop-out	新窗体从左侧进入，且老窗体被挤压而出
	fadeIn = 'fade-in', // fade-out	新窗体从透明到不透明逐渐显示
	zoomOut = 'zoom-out', // zoom-in	新窗体从小到大缩放显示
	zoomFadeOut = 'zoom-fade-out', // zoom-fade-in	新窗体从小到大逐渐放大并且从透明到不透明逐渐显示
	none = 'none'
}

const AnimationDuration = 300;

interface InterceptorsType {
	entry: null | ((_config: ConfitType) => ConfitType);
	leave: null | (() => void);
}

type AnimationType =
	| 'auto'
	| 'none'
	| 'slide-in-right'
	| 'slide-in-left'
	| 'slide-in-top'
	| 'slide-in-bottom'
	| 'fade-in'
	| 'zoom-out'
	| 'zoom-fade-out'
	| 'pop-in';

interface ConfitType {
	path: RouterNameSpace.RouterPathType;
	query?: Record<string, any>;
	events?: Record<string, (value?: any) => void>;
	success?: (value: UniNamespace.NavigateToSuccessOptions) => void;
	fail?: (value: any) => void;
	complete?: (value: any) => void;
	animationType?: AnimationType;
}

interface DefaultConfigData {
	url: string | HBuilderX.PageURIString;
	animationType?: AnimationType;
	animationDuration?: number;
	success?: (value: UniNamespace.NavigateToSuccessOptions) => void;
	fail?: (value: any) => void;
	complete?: (value: any) => void;
	events?: Record<string, (value: any) => void>;
}

function Router(entryCallback: null | ((_config: ConfitType) => ConfitType), leaveCallback: null | (() => void)) {
	// 拦截器
	const interceptors: InterceptorsType = {
		entry: entryCallback,
		leave: leaveCallback
	};

	/**
	 * 路由列表
	 */
	function getRoutes() {
		return getCurrentPages();
	}

	/**
	 * 获取当前路由
	 */
	function getCurrentRoute() {
		const routerList = getRoutes();
		return routerList[routerList.length - 1];
	}

	/**
	 * 生成路由配置
	 * @param {Object} funcType
	 * @param {Object} _config
	 */
	function generateOpt(funcType: string, _config: ConfitType) {
		const config = Object.assign({}, _config);

		let defaultConfig: DefaultConfigData = {
			url: '',
			complete: complete => {
				if (process.env.DEV_ENV === DEV_ENV.DEV) {
					console.log(JSON.stringify(_config));
					console.log(JSON.stringify(complete));
				}
			}
		};

		if (funcType !== RouterFuncType.SwitchTab && config.query && !isEmptyObj(config.query)) defaultConfig.url = _queryString(config);
		else defaultConfig.url = config && config.path ? config.path.path : '';

		if (funcType === RouterFuncType.NavigateTo) {
			if (config.events && !isEmptyObj(config.events)) {
				defaultConfig.events = config.events;
			}

			if (config.animationType) {
				defaultConfig.animationDuration = AnimationDuration;
				defaultConfig.animationType = config.animationType;
			}
		}

		if (config.success && isFunc(config.success)) {
			defaultConfig.success = config.success;
		}
		if (config.fail && isFunc(config.fail)) {
			defaultConfig.fail = config.fail;
		}
		if (config.complete && isFunc(config.complete)) {
			defaultConfig.complete = config.complete;
		}

		return defaultConfig;
	}

	/**
	 * 跳转到应用内的某个页面
	 * @param {object} _config
	 * @param {object} _config.path RouterPathType
	 * @param {object} _config.query
	 * @param {object} _config.events
	 * @param {object} _config.success
	 * @param {object} _config.fail
	 * @param {object} _config.complete
	 */
	function navigateTo(_config: ConfitType) {
		// 校验路由
		if (!_checkRouter(_config)) return;

		let config: ConfitType;
		if (interceptors.entry && isFunc(interceptors.entry)) config = interceptors.entry(_config);
		else config = _config;

		const options = generateOpt(RouterFuncType.NavigateTo, config);

		uni.navigateTo(options);
	}

	function redirectTo(_config: ConfitType) {
		if (!_checkRouter(_config)) return;

		let config: ConfitType;
		if (isFunc(interceptors.entry) && interceptors.entry) config = interceptors.entry(_config);
		else config = _config;

		const options = generateOpt(RouterFuncType.RedirectTo, config);
		uni.redirectTo(options);
	}

	function reLaunch(_config: ConfitType) {
		if (!_checkRouter(_config)) return;

		let config: ConfitType;
		if (isFunc(interceptors.entry) && interceptors.entry) config = interceptors.entry(_config);
		else config = _config;

		const options = generateOpt(RouterFuncType.ReLaunch, config);
		uni.reLaunch(options);
	}

	function switchTab(_config: ConfitType) {
		if (!_checkRouter(_config)) return;

		let config: ConfitType;
		if (isFunc(interceptors.entry) && interceptors.entry) config = interceptors.entry(_config);
		else config = _config;

		const options = generateOpt(RouterFuncType.SwitchTab, config);
		uni.switchTab(options);
	}

	function navigateBack(delta = 1) {
		uni.navigateBack({ delta });
	}

	/**
	 * 校验路由是否存在
	 */
	function _hasRoute(_config: ConfitType) {
		if (_config.path === undefined) {
			uni.showToast({ title: '页面不存在', icon: 'none' });
			return false;
		}

		return true;
	}

	/**
	 * 校验路由
	 * @param {Object} _config
	 */
	function _checkRouter(_config: ConfitType): boolean {
		if (!_hasRoute(_config)) return false;
		// 避免同一路由重复点击
		// if(_pathIsEq(_config && _config.path ? _config.path.path : '')) return false;
		// 校验路由是否需要授权
		if (_config.path.auth_with) {
			// TODO 检测是否有权限进去该路由
		}

		return true;
	}

	/**
	 * 与当前路由是否相等
	 * @param {Object} url
	 */
	function _pathIsEq(url: string) {
		const route = getCurrentRoute().route;
		if (!route) return true;
		return url.indexOf(route) !== -1;
	}

	/**
	 * JSON转queryString
	 * @param {Object}
	 * 	@property {object} path
	 * 	@property {object} query
	 */
	function _queryString(config: ConfitType) {
		const { path, query } = config;
		if ((!path && isEmptyObj(path || {})) || (!query && isEmptyObj(query || {}))) {
			console.error('router->queryString->path或query参数错误');
			return path ? path.path : '';
		}

		const checkVal = (val: any) => {
			if (isFunc(val)) return null;

			if (isBoolean(val)) return +val;

			if (isObject(val) || isArray(val)) {
				return encodeURIComponent(JSON.stringify(val));
			}

			return val;
		};

		let str: Array<string> = [];

		if (query) {
			str = Object.keys(query).map((key: string) => {
				let val = (query as any)[key];
				val = checkVal(val);
				return key + '=' + val;
			});
		}

		return path ? path.path + '?' + str.join('&') : '';
	}

	return Object.freeze({
		getRoutes,
		getCurrentRoute,
		navigateTo,
		redirectTo,
		reLaunch,
		switchTab,
		navigateBack
	});
}

const router = Router((_config: ConfitType) => {
	_config.query = _config.query || {};

	return _config;
}, null);

export default router;

export function createRouter(vm: any) {
	vm.prototype.$Router = router;
}
