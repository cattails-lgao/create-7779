import axios from '@/utils/request';
import * as ApiConstant from './constants/app';
import { HTTP_REQUEST_URL } from '@/config/url';

// 获取字典分组
export function dictByType(type: string) {
	return axios.request<any>({
		rootUrl: HTTP_REQUEST_URL,
		urlPath: ApiConstant.APP_VERSION,
		routeParams: {
			type
		}
	});
}
