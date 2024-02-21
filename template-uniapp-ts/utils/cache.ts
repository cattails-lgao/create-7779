import { EXPIRE } from '@/constants';

//  发生的房间里
function cache() {
	const expireName = 'expire_key';

	/**
	 * 获取当前时间戳
	 */
	function time() {
		return Math.round(new Date().getTime() / 1000);
	}

	/**
	 * @description:  设置缓存
	 * @param {string} key
	 * @param {any} val
	 * @param {number} expire
	 * @return {*}
	 */
	function set(key: string, val: any, expire: number = EXPIRE): boolean {
		try {
			console.log('设置缓存Key：' + key + '，过期时间：' + expire + '，data:' + JSON.stringify(val));
			setKeyExpired(key, expire);
			uni.setStorageSync(key, val);
			return true;
		} catch (err) {
			return false;
		}
	}

	function getKeyExpired(): boolean | any {
		try {
			return uni.getStorageSync(expireName);
		} catch (err) {
			return false;
		}
	}

	function setKeyExpired(key: string, expire: number = EXPIRE): boolean {
		try {
			const expireData = getKeyExpired() || {};
			expireData[key] = expire;
			uni.setStorageSync(expireName, expireData);
			return true;
		} catch (err) {
			return false;
		}
	}

	// 检查key是否过期
	function isExpire(key: string) {
		try {
			const expireData = uni.getStorageSync(expireName);
			if (expireData[key] === undefined) return true;
			if (expireData[key] === 0) return false;

			console.log(`检查${key}是否过期`, expireData[key], time());
			return expireData[key] < time();
		} catch (err) {
			return false;
		}
	}

	// 获取指定的缓存
	function get(key: string) {
		try {
			if (isExpire(key)) clear(key);

			return uni.getStorageSync(key);
		} catch (err) {
			return false;
		}
	}

	// 判断是否有缓存
	function has(key: string) {
		try {
			return !!get(key);
		} catch (err) {
			return false;
		}
	}

	// 清除指定缓存
	function clear(key: string) {
		try {
			uni.removeStorageSync(key);
			const expireData = getKeyExpired();
			delete expireData[key];
			uni.setStorageSync(expireName, expireData);
		} catch (err) {
			return false;
		}
	}

	return {
		get,
		set,
		has,
		clear,
		time
	};
}

export default cache();
