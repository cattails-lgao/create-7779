import {
	defineConfig
} from 'vite';
import uni from "@dcloudio/vite-plugin-uni";
import UnoCSS from 'unocss/vite'

/**
 * @type {import('vite').UserConfig}
 */
process.env
export default defineConfig({
	plugins: [uni(), UnoCSS()],
	build: {
		sourcemap: process.env.NODE_ENV === 'development',
	},
	define: {
		'process.env.DEV_ENV': JSON.stringify('2') // 0 dev 1 pro 2 test
	}
});