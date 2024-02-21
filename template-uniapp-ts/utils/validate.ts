/**
 * 是否为数字
 * @param {Object} num
 */
export function isNumber(num: any): boolean {
	// return Object.prototype.toString.call(num) === "[object Number]";
	return typeof num === 'number';
}
/**
 * 是否为字符串
 * @param {Object} str
 */
export function isString(str: any): boolean {
	// return Object.prototype.toString.call(str) === "[object String]";
	return typeof str === 'string';
}
/**
 * 是否为函数
 * @param {Object} func
 */
export function isFunc(func: any): boolean {
	return Object.prototype.toString.call(func) === '[object Function]';
}
/**
 * 是否为数组
 * @param {Object} arr
 */
export function isArray(arr: any): boolean {
	return Object.prototype.toString.call(arr) === '[object Array]';
}
/**
 * 是否是对象
 * @param {Object} obj
 */
export function isObject(obj: any): boolean {
	return Object.prototype.toString.call(obj) === '[object Object]';
}
/**
 * 是否为布尔值
 * @param {Object} bool
 */
export function isBoolean(bool: any): boolean {
	return typeof bool === 'boolean';
}
/**
 * 是否为时间对象
 * @param {Object} date
 */
export function isDate(date: any): boolean {
	return Object.prototype.toString.call(date) === '[object Date]';
}
/**
 * 判断对象是否为空
 * @param {Object} obj
 */
export function isEmptyObj(obj: {}, mode = 'for'): boolean {
	if (mode === 'for') {
		for (let attr in obj) {
			return false;
		}
		return true;
	}

	if (mode === 'keys') {
		return !Boolean(Object.keys(obj).length);
	}

	return false;
}

/**
 * 验证电子邮箱格式
 */
export function isEmail(value: string): boolean {
	return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(value);
}

/**
 * 验证手机格式
 */
export function isMobile(value: string): boolean {
	return /^1[3456789]\d{9}$/.test(value);
}

/**
 * 验证URL格式
 */
export function isUrl(value: string): boolean {
	return /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/.test(
		value
	);
}

/**
 * 验证身份证号码
 */
export function isIdCard(value: string): boolean {
	return /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value);
}

/**
 * 是否车牌号
 */
export function isCarNo(value: string): boolean {
	// 新能源车牌
	const xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
	// 旧车牌
	const creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
	if (value.length === 7) {
		return creg.test(value);
	}
	if (value.length === 8) {
		return xreg.test(value);
	}
	return false;
}

/**
 * 金额,只允许2位小数
 */
export function amountHasTwoPoint(value: string): boolean {
	// 金额，只允许保留两位小数
	return /^[1-9]\d*(,\d{3})*(\.\d{1,2})?$|^0\.\d{1,2}$/.test(value);
}

/**
 * 中文
 */
export function isChinese(value: string): boolean {
	const reg = /^[\u4e00-\u9fa5]+$/gi;
	return reg.test(value);
}

/**
 * 只能输入字母
 */
export function isLetter(value: string): boolean {
	return /^[a-zA-Z]*$/.test(value);
}

/**
 * 只能是字母或者数字
 */
export function isEnOrNum(value: string): boolean {
	// 英文或者数字
	const reg = /^[0-9a-zA-Z]*$/g;
	return reg.test(value);
}

// 解决 元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "typeof
export function isValidkey(key: string | number | symbol, object: object): key is keyof typeof object {
	return key in object;
}