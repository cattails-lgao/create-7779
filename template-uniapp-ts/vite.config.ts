import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
	plugins: [uni()],
	build: {
		sourcemap: process.env.NODE_ENV === 'development'
	},
	define: {
		'process.env.DEV_ENV': JSON.stringify('2') // 0 dev 1 pro 2 test
	}
});
