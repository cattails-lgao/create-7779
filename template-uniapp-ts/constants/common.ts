// 开发环境
export const DEV_ENV = {
	DEV: '0',
	PRO: '1',
	TEST: '2'
};
// 下拉更多
export const LOAD_STATUS_MORE: string = 'more';
// 加载中
export const LOAD_STATUS_LOADING: string = 'loading';
// 没有了
export const LOAD_STATUS_NOMORE: string = 'noMore';

// 短信
export enum SMS_CODE_TMPL {
	Login = 0, // 登录验证码
	CheckCode = 1, // 校验身份验证码
	BindPhone = 2, // 绑定手机验证码
	Register = 3 // 账号注册
}

export enum THEME_TYPE {
	Dark = 'dark',
	Light = 'light'
}
