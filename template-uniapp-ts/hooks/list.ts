import { isRef, nextTick, ref } from 'vue';
import { LOAD_STATUS_MORE, LOAD_STATUS_LOADING, LOAD_STATUS_NOMORE } from '@/constants';

/**
 * 分页列表
 * @param {any} params 请求参数
 * @param {function} fn 请求方法
 * @param {function} beforeFn 处理data的函数
 * @param {any} opt 配置参数
 * @param {any} opt.currentSizeKey 参数中分页页数的key
 * @param {any} opt.sizeKey 参数中分页大小的size
 */
export default function useList<T>(
	params: any,
	fn: (value?: any) => any,
	beforeFn?: (value?: any) => any,
	// @ts-ignore
	{
		currentKey = 'current',
		sizeKey = 'size',
		totalPath = 'data.total',
		dataPath = 'data.records'
	}: {
		currentKey?: string;
		sizeKey?: string;
		totalPath?: string;
		dataPath?: string;
	}
) {
	/**
	 * 解析地址
	 */
	function analysisPath(path: string, data: Record<string, any>) {
		const paths = path.split('.');
		let iData = JSON.parse(JSON.stringify(data));
		for (let i = 0; i < paths.length; i++) {
			const key = paths[i];
			if (iData[key]) iData = iData[key];
		}

		return iData;
	}

	/**
	 * 生成请求参数
	 */
	function generateParams() {
		let current = 0;
		let size = 10;

		if (isRef<any>(params)) {
			current = params.value[currentKey];
			size = params.value[sizeKey];
			return {
				[`${currentKey}`]: current,
				[`${sizeKey}`]: size,
				...params.value
			};
		} else {
			current = params[currentKey];
			size = params[sizeKey];
			return {
				[`${currentKey}`]: current,
				[`${sizeKey}`]: size,
				...params
			};
		}
	}

	/**
	 * 设置请求参数
	 */
	function setParams(key: string, value: any) {
		if (isRef<any>(params)) {
			params.value[key] = value;
		} else {
			params[key] = value;
		}
	}

	/**
	 * 获取请求参数
	 */
	function getParams(key: string) {
		if (isRef<any>(params)) {
			return params.value[key];
		} else {
			return params[key];
		}
	}

	const dataList = ref<T[]>([]);
	const total = ref(0);
	const loadMoreState = ref(LOAD_STATUS_NOMORE);
	async function getDataList() {
		try {
			loadMoreState.value = LOAD_STATUS_LOADING;
			const iParams = generateParams();
			const rsp = await fn(iParams);

			if (!rsp.data) {
				loadMoreState.value = LOAD_STATUS_NOMORE;
				return;
			}

			if (typeof beforeFn === 'function') {
				rsp.data = beforeFn(rsp.data);
			}

			const data = analysisPath(dataPath, rsp.data);

			total.value = Number(analysisPath(totalPath, rsp.data));

			if (iParams[currentKey] === 1) {
				dataList.value = data;
			} else {
				dataList.value = [...dataList.value, ...data];
			}

			if (dataList.value.length >= total.value) {
				loadMoreState.value = LOAD_STATUS_NOMORE;
			} else {
				loadMoreState.value = LOAD_STATUS_MORE;
			}
		} catch (e) {
			console.error(e);
			loadMoreState.value = LOAD_STATUS_NOMORE;
		}
	}

	function pullRefresh() {
		setParams(currentKey, 1);
		dataList.value = [];
		nextTick(() => {
			getDataList();
		});
	}

	function loadMore() {
		if (loadMoreState.value === LOAD_STATUS_NOMORE) return;

		setParams(currentKey, getParams(currentKey) + 1);
		getDataList();
	}

	return {
		dataList,
		total,
		loadMoreState,
		pullRefresh,
		loadMore
	};
}
