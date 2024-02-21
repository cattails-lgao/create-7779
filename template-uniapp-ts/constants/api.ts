// token名称
export const TOKENNAME: string = 'Authorization';
export const CLIENTID: string = 'app:app';

// 请求方式
export const GET: 'GET' = 'GET';
export const POST: 'POST' = 'POST';
export const OPTIONS: 'OPTIONS' = 'OPTIONS';
export const PUT: 'PUT' = 'PUT';
export const HEAD: 'HEAD' = 'HEAD';
export const DELETE: 'DELETE' = 'DELETE';
export const TRACE: 'TRACE' = 'TRACE';
export const CONNECT: 'CONNECT' = 'CONNECT';
// 请求状态码
export const SUCCESS_CODE: number = 0;
export const ERROR_CODE: number = 1;

export enum ERROR_TYPE {
	ERR_NORMAL,
	ERR_NETWORK,
	ERR_REFRESH,
	ERR_CODE_NEQ_200, // 不等于200
	ERR_CODE_EQ_200 = 200, // 等于200
	ERR_CODE_401 = 401,
	ERR_CODE_424 = 424,
	ERR_CODE_500 = 500,
	ERR_CODE_400 = 400,
	ERR_CODE_404 = 404,
	ERR_CODE_403 = 403
}

// 424 access_token 过期
// 401 refresh_token 过期
