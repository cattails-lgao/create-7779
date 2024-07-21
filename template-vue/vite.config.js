import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isDev = mode === 'development'
  const isProduction = mode === 'production'
  return {
    base: env.VITE_PUBLIC_PATH,
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT,
      hmr: true,
      proxy: {
        '^api': {
          target: env.VITE_ADMIN_PROXY_PATH,
          ws: true, // 是否启用 WebSocket
          changeOrigin: true, // 是否修改请求头中的 Origin 字段
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      outDir: env.VITE_OUT_DIR,
      chunkSizeWarningLimit: 1500, // 代码分包阈值
      // 开发使用 esbuild 更快，生产环境打包使用 terser 可以删除更多注释
      minify: isDev ? 'esbuild' : 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction, // 删除 console
          drop_debugger: isProduction // 删除 debugger
        },
        format: {
          comments: isProduction // 删除所有注释
        }
      },
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          compact: true,
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
            echarts: ['echarts']
          }
        }
      }
    }
  }
})
