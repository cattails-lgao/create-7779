// uno.config.ts
import { defineConfig } from 'unocss';

export default defineConfig({
	// ...UnoCSS options
	theme: {
		colors: {
			primary: 'var(--color-primary)'
		}
	},
	rules: [
		[
			/^m-([\.\d]+)$/,
			([_, num]) => ({
				'margin-left': `${num}rpx`,
				'margin-right': `${num}rpx`,
				'margin-top': `${num}rpx`,
				'margin-bottom': `${num}rpx`
			})
		],
		[/^ml-([\.\d]+)$/, ([_, num]) => ({ 'margin-left': `${num}rpx` })],
		[/^mr-([\.\d]+)$/, ([_, num]) => ({ 'margin-right': `${num}rpx` })],
		[/^mt-([\.\d]+)$/, ([_, num]) => ({ 'margin-top': `${num}rpx` })],
		[/^mb-([\.\d]+)$/, ([_, num]) => ({ 'margin-bottom': `${num}rpx` })],
		[
			/^p-([\.\d]+)$/,
			([_, num]) => ({
				'padding-top': `${num}rpx`,
				'padding-bottom': `${num}rpx`,
				'padding-left': `${num}rpx`,
				'padding-right': `${num}rpx`
			})
		],
		[/^pl-([\.\d]+)$/, ([_, num]) => ({ 'padding-left': `${num}rpx` })],
		[/^pr-([\.\d]+)$/, ([_, num]) => ({ 'padding-right': `${num}rpx` })],
		[/^pt-([\.\d]+)$/, ([_, num]) => ({ 'padding-top': `${num}rpx` })],
		[/^pb-([\.\d]+)$/, ([_, num]) => ({ 'padding-bottom': `${num}rpx` })],
		[/^text-([\.\d]+)$/, ([_, num]) => ({ 'font-size': `${num}rpx` })]
	]
});
