import { useState } from 'react';
import { Button, Form, Input, Layout } from 'antd';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user';
import { useShallow } from 'zustand/react/shallow';

const LoginRule = {
  username: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }],
};

export default function Login() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  const login = useUserStore(useShallow((store) => store.login));
  async function onFinish() {
    setSubmitLoading(true);
    const rsp = await login();
    setTimeout(() => {
      setSubmitLoading(false);
      if (!rsp) return;
      navigate('/');
    }, 1000);
  }
  return (
    <Layout className="w-full h-full flex items-center justify-center">
      <div className="login-container shadow rounded-md py-10 px-20 bg-white">
        <div className="login-header mb-10 text-center">Login</div>

        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="账号" name="username" rules={LoginRule.username}>
            <Input />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={LoginRule.password}>
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={submitLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}
