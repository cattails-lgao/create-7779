import LunarCalendar from '@/utils/LunarCalendar.js';

export function handlerDate(date: string | number) {
	let dateObj: Date;
	try {
		if (typeof date === 'string' || typeof date === 'number') {
			dateObj = new Date(date);
		} else {
			dateObj = new Date();
		}
	} catch (e) {
		dateObj = new Date();
	}

	const Year = dateObj.getFullYear(); // 年份
	const Month = dateObj.getMonth() + 1; // 月份
	const Dates = dateObj.getDate(); // 日期
	const Hours = dateObj.getHours(); // 小时
	const Minutes = dateObj.getMinutes(); // 分钟
	const Seconds = dateObj.getSeconds(); // 秒
	const Day = dateObj.getDay(); // 周几
	const timespace = dateObj.getTime(); // 时间戳

	return Object.freeze({
		Year,
		Month,
		Dates,
		Hours,
		Minutes,
		Seconds,
		Day,
		timespace
	});
}

/**
 * 通过月份和年份获取月份总天数
 * @param year 年
 * @param month 月
 */
export function totalDaysByMonth(year: number, month: number): Number {
	return new Date(year, month, 0).getDate();
}

/**
 * 获取农历时间
 * @param date 时间
 */
export function lunar(date: string | number) {
	const { Year, Month, Dates } = handlerDate(date);
	return LunarCalendar.solarToLunar(Year, Month, Dates);
}

/**
 * 格式化时间
 * @param date 时间
 * @param fmt 格式
 */
export function format(date: string | number, fmt: string = 'yyyy-MM-dd HH:mm:ss'): string {
	const { Year, Month, Dates, Hours, Minutes, Seconds } = handlerDate(date);

	const o: Record<string, number> = Object.freeze({
		'y+': Year, // 年
		'M+': Month, //月份
		'd+': Dates, //日
		'H+': Hours, //小时
		'm+': Minutes, //分
		's+': Seconds //秒
	});

	for (var k in o) {
		const reg = new RegExp('(' + k + ')');
		if (reg.test(fmt)) {
			fmt = fmt.replace(reg, _ => (o[k] < 10 ? '0' + o[k] : String(o[k])));
		}
	}
	return fmt;
}

/**
 * 过去了多久
 * @param {Date} timestamp 时间戳
 */
export function leaveDateFormat(timestamp: number | string): string {
	// 强转
	try {
		timestamp = new Date(timestamp).getTime();
	} catch {
		timestamp = Date.now();
	}

	const second = 1000; // 秒
	const minute = 60 * second; // 分
	const hour = 60 * minute; // 时
	const day = 24 * hour; // 天
	const oneWeek = 7;

	const nowTimestamp = new Date().getTime();
	const parameterDate = new Date(timestamp);
	const diffTimestamp = Math.abs(nowTimestamp - timestamp);
	if (diffTimestamp >= day) {
		const dayNumber = Math.floor(diffTimestamp / day);
		// if (dayNumber >= oneMonth)
		if (parameterDate.getFullYear() < new Date().getFullYear())
			return parameterDate.getFullYear() + '年' + (parameterDate.getMonth() + 1) + '月' + parameterDate.getDate() + '日';
		if (dayNumber >= oneWeek) return parameterDate.getMonth() + 1 + '月' + parameterDate.getDate() + '日';

		return dayNumber + '天前';
	}

	if (diffTimestamp >= hour) return Math.floor(diffTimestamp / hour) + '小时前';

	if (diffTimestamp >= minute) return Math.floor(diffTimestamp / minute) + '分钟前';

	if (diffTimestamp >= second) return Math.floor(diffTimestamp / second) + '秒前';

	return '刚刚';
}
