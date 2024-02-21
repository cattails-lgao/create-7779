import { GET } from '@/constants';

export const APP_VERSION: RequestNameSpace.UrlPathType = {
	url: '/app/version',
	method: GET,
	isRecord: false
};
