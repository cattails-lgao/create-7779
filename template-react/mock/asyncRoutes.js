const localRouter = [
  {
    path: '/home',
    icon: 'SettingOutlined',
    label: '主页',
    // show: true, // 是否显示
  },
  {
    path: '/table',
    icon: 'SettingOutlined',
    label: '表格',
    // show: true, // 是否显示
  },
  {
    path: '/about',
    icon: 'SettingOutlined',
    label: '关于',
    // show: true, // 是否显示
  },
  {
    path: '/error',
    icon: 'SettingOutlined',
    label: '异常页',
    // show: true, // 是否显示
    children: [
      {
        path: '/errorPage',
        icon: 'SettingOutlined',
        label: 'Not Found',
        // show: true, // 是否显示
      },
    ],
  },
];
const permissionRouter = [];

export default [
  {
    url: '/getAsyncRoutes',
    method: 'get',
    response: () => {
      return {
        code: 0,
        data: [...localRouter, ...permissionRouter],
        msg: '失败',
      };
    },
  },
];
