import { useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import SideBar from './components/SideBar';
import './index.scss';
import { useMenuStore } from '@/stores/menu';
import { getMenu } from '@/api/menu';
import Loading from '@/pages/Loading';
import { App } from 'antd';

export default function Layout() {
  const { setMenu } = useMenuStore();

  // 页面挂载后, 路由请求
  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      getMenuFn();
    }

    return () => (ignore = true);
  }, []);

  async function getMenuFn() {
    try {
      const rsp = await getMenu();
      setMenu(rsp.data);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <App className="flex flex-col h-full">
      <Header />
      <div className="layout-bot flex-1 flex">
        <SideBar />
        <div className="layout-side-seat" />
        <main className="layout-right flex-1 flex flex-col">
          {/* 路由出口 */}
          <div className="p-5 flex-1">
            <Suspense fallback={<Loading />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </App>
  );
}
