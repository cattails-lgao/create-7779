import _permission, { RESULT_STATUS } from './permission.js';
const authFailCode = 0;
const authSuccessCode = 1;

type ResolveType = (value: UniApp.GetLocationSuccess | PromiseLike<UniApp.GetLocationSuccess>) => void;
type RejectType = (reason?: any) => void;
function doGet(resolve: ResolveType, reject: RejectType) {
	uni.getLocation({
		type: 'gcj02',
		success(data) {
			console.log('获取位置', data);
			resolve(data);
		},
		fail() {
			reject(authFailCode);
		}
	});
}

/**
 * 获取位置
 */
export function getLocation() {
	return new Promise<UniNamespace.GetLocationSuccess>((resolve, reject) => {
		// #ifdef H5
		doGet(resolve, reject);
		// #endif

		// #ifdef APP
		appGetLocation(resolve, reject);
		// #endif

		// #ifdef MP
		mpGetLoction(resolve, reject);
		// #endif
	});
}

// 校验权限
async function checkLocationPermission() {
	let result = 0;
	if (_permission.isIOS) {
		result = await _permission.requestIOS('location');
		return result !== RESULT_STATUS.ALLOWED;
	} else {
		result = await _permission.requestAndroid(['android.permission.ACCESS_COARSE_LOCATION', 'android.permission.ACCESS_FINE_LOCATION']);
		return result !== RESULT_STATUS.ALLOWED;
	}
}

// APP检验权限
async function check() {
	try {
		if (!_permission.checkOpenGPSService(false)) {
			uni.showToast({
				title: '请打开定位服务',
				icon: 'none'
			});
			return false;
		}
		if (await checkLocationPermission()) {
			uni.showToast({
				title: '位置权限不足',
				icon: 'none'
			});
			return false;
		}

		return true;
	} catch (err) {
		console.error(err);
	}
}

async function appGetLocation(resolve: ResolveType, reject: RejectType) {
	try {
		if (!(await check())) return;

		doGet(resolve, reject);
	} catch (err) {
		console.error(err);
	}
}

// 获取设置
function getSetting(key: string) {
	return new Promise<boolean | 0 | 1>(resolve => {
		uni.getSetting({
			success(res) {
				const authKey = 'scope.' + key;
				resolve(res.authSetting[authKey as keyof UniNamespace.AuthSetting]);
			},
			fail() {
				resolve(authFailCode);
			}
		});
	});
}

// 打开设置
function openSetting(key: string) {
	return new Promise((resolve, reject) => {
		uni.openSetting({
			success(res) {
				resolve(res.authSetting['scope.' + key]);
			},
			fail() {
				reject(authFailCode);
			}
		});
	});
}

// 请求位置授权
function authorize(key: string) {
	return new Promise(resolve => {
		uni.authorize({
			scope: 'scope.' + key,
			success: res => {
				resolve(authSuccessCode);
			},
			fail() {
				resolve(authFailCode);
			}
		});
	});
}

/**
 * 小程序获取位置流程
 * @param {Object} resolve
 * @param {Object} reject
 */
async function mpGetLoction(resolve: ResolveType, reject: RejectType) {
	try {
		/**
		 * 1.获取设置是否授权
		 * 	1.1 是 如果授权直接请求获取位置
		 *  1.2 否 调用用授权api是否同意
		 * 	 1.2.1 是 直接请求获取位置
		 *   1.2.2 否 打开设置获取设置结果 是否同意
		 * 		1.2.2.1 是 直接请求获取位置
		 * 		1.2.2.1 否 提示为获取到位置信息
		 */
		const settingRet = await getSetting('userLocation');

		if (!settingRet) {
			const authRet = await authorize('userLocation');
			if (authRet === authSuccessCode) {
				doGet(resolve, reject);
			} else {
				uni.showModal({
					title: '是否授权当前位置',
					content: '需要获取您的地理位置，请确认授权，否则打卡功能将无法使用',
					confirmText: '去授权',
					success: async modal => {
						if (!modal.confirm) {
							reject(authFailCode);
							return;
						}

						const changeRes = await openSetting('userLocation');
						if (!changeRes) {
							uni.showToast({
								title: '未获取到位置授权',
								icon: 'none'
							});

							reject(authFailCode);
							return;
						}

						doGet(resolve, reject);
					}
				});
			}
		} else {
			doGet(resolve, reject);
		}
	} catch (err) {
		uni.showToast({
			title: '未获取到位置授权',
			icon: 'none'
		});
	}
}
