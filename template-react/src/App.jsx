import { Suspense } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import { useShallow } from 'zustand/react/shallow';
import { useThemeStore } from '@/stores/theme';

import './App.scss';
import Loading from '@/pages/Loading';
import { Outlet } from 'react-router-dom';

function App() {
  const colorPrimary = useThemeStore(useShallow((store) => store.colorPrimary));
  return (
    <ConfigProvider
      theme={{
        cssVar: true,
        token: {
          colorPrimary: colorPrimary,
        },
      }}
    >
      <Suspense fallback={<Loading />}>
        <AntdApp className="h-full">
          <Outlet />
        </AntdApp>
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
