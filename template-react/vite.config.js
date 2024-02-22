import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// 引入vite-plugin-mock
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig((config) => {
  const { VITE_PORT } = loadEnv(config, process.cwd());
  const isDev = config.mode === 'development';
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: VITE_PORT,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variable.scss";`,
          javascriptEnabled: true,
        },
      },
    },
    plugins: [
      react(), // mock配置
      viteMockServe({
        mockPath: 'mock', // mock目录地址 demo中创建的是mock
        localEnabled: isDev, // 是否在开发环境中启用
        prodEnabled: !isDev, // 是否在生产环境中启用
        supportTs: false, // 是否支持TS
        watchFiles: true, // 监听文件
        // 添加处理生产环境文件
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        // 添加到`src/main.jsx`文件中，比较重要的一步，不然在生产环境不生效
        injectFile: path.resolve(process.cwd(), 'src/main.jsx'),
      }),
    ],
  };
});
