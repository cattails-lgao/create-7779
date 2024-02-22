const accessTokens = {
  admin: 'admin-accessToken',
  editor: 'editor-accessToken',
  test: 'test-accessToken',
};

export default [
  {
    url: '/login',
    method: 'post',
    response: (config) => {
      const { username } = config.body;
      const accessToken = accessTokens[username];
      if (!accessToken) {
        return {
          code: 500,
          msg: '帐户或密码不正确。',
        };
      }
      return {
        code: 200,
        msg: 'success',
        data: {
          accessToken,
        },
      };
    },
  },
  {
    url: '/logout',
    type: 'post',
    response() {
      return {
        code: 200,
        msg: 'success',
      };
    },
  },
];
