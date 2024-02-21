import { DEV_ENV } from '@/constants';

const domainDev = '';
const domainPro = '';
const domainTest = '';

const urlConfig = {
	mock: 'https://console-mock.apipost.cn/app/mock/project/7da35ba1-ffbb-433c-8ef5-5e771bd2d2c4/',
	dev: `http://${domainDev}:9999/`,
	test: `http://${domainTest}:20011/`,
	pro: `http://${domainPro}/ryl-api/`,
	socketDev: `ws://${domainDev}:4081/`,
	socketTest: `ws://${domainTest}:24081/`,
	socketPro: `ws://${domainPro}:24081/`,
	other: `http://42.193.9.199:8080/`
};

function getUrl() {
	switch (process.env.DEV_ENV) {
		case DEV_ENV.DEV:
			return urlConfig.dev;
		case DEV_ENV.PRO:
			return urlConfig.pro;
		case DEV_ENV.TEST:
			return urlConfig.test;
		default:
			return urlConfig.dev;
	}
}

// 默认url
export const HTTP_REQUEST_URL = getUrl();
// mock地址
export const HTTP_REQUEST_MOCK_URL = urlConfig.mock;
// 第三方
export const HTTP_REQUEST_OTHER_URL = urlConfig.other;
