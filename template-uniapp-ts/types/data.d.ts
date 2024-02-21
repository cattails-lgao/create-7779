declare module 'pinia' {
	void defineStore();
}

declare namespace RequestNameSpace {
	// 请求地址配置
	interface UrlPathType {
		url: string; // 请求地址
		method: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'; // 请求方式
		isRecord: boolean; // 是否记录
	}
}

declare namespace ResponseNameSpace {
	// 请求返回值
	interface ResponsDataType<T> {
		code: number;
		msg: string;
		data: T;
	}
}

declare namespace RouterNameSpace {
	interface RouterPathType {
		name: string; // 路由名称
		path: string; // 路由地址
		auth_with: boolean; // 是否有权限
		isRecord: boolean; // 是否记录
	}
}
