import React, { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useMenuStore } from '@/stores/menu';
import App from '@/App';
import Layout from '@/layout';
import Login from '@/pages/User/Login';
import ErrorPage from '@/pages/ErrorPage';
import Welcome from '@/pages/Welcome';

const modules = import.meta.glob('/src/pages/**/*.{jsx,tsx}');

export default function Router() {
  const menu = useMenuStore((store) => store.menu); // 调用 useMenuStore 方法

  // TODO 动态路由
  function generatorMenu(data) {
    return data.map((item) => {
      const path = item.path.toLowerCase();

      const index = Object.keys(modules).find((key) =>
        key.toLowerCase().includes(path)
      );
      if (!index) {
        return null;
      }

      return (
        <Route
          key={item.path}
          path={item.path}
          Component={lazy(modules[index])}
        >
          {item.children && item.children.length
            ? generatorMenu(item.children)
            : ''}
        </Route>
      );
    });
  }
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Layout />}>
              <Route errorElement={<ErrorPage />}>
                <Route index element={<Welcome />} />
                {generatorMenu(menu)}
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div>not found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
