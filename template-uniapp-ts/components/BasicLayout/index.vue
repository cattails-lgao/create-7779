<template>
	<view :class="[appStore.theme, enabledOverflow ? 'page-overflow' : '']">
		<!-- 导航栏 -->
		<uni-nav-bar
			v-if="showNav"
			class="nav-bar"
			:title="navTitle"
			left-icon="back"
			:color="navColor"
			:background-color="navBackgroundColor"
			:border="navBorder"
			:fixed="navFixed"
			:status-bar="true"
			:showPlaceholder="navShowPlaceholder"
			:dark="appStore.theme === THEME_TYPE.Dark"
			@clickLeft="_Router.navigateBack()"
		>
			<template #left>
				<text class="iconfont">&#xe607;</text>
			</template>

			<template #right>
				<slot name="nav-right"></slot>
			</template>
		</uni-nav-bar>
		<slot :theme="appStore.theme"></slot>
	</view>
</template>

<script lang="ts">
export default {
	name: 'layoutCompenent'
};
</script>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import _Router from '@/router/index';
import { THEME_TYPE } from '@/constants';
/**
 * nav开头的属性同 uni-nav-bar组件
 */
withDefaults(
	defineProps<{
		/**
		 * 加载
		 */
		loading?: boolean;
		/**
		 * 是否显示导航栏
		 */
		showNav?: boolean;
		/**
		 * 导航栏title
		 */
		navTitle?: string;
		/**
		 * 导航栏字体颜色
		 */
		navColor?: string;
		/**
		 * 导航栏背景颜色
		 */
		navBackgroundColor?: string;
		/**
		 * 是否显示导航栏边框
		 */
		navBorder?: boolean;
		/**
		 * 是否固定在头部
		 */
		navFixed?: boolean;
		/**
		 * 是否显示导航栏阴影
		 */
		navShadow?: boolean;
		/**
		 * 是否显示导航栏占位
		 */
		navShowPlaceholder?: boolean;
		/**
		 * 控制是否超出隐藏
		 */
		enabledOverflow?: boolean;
	}>(),
	{
		loading: true,
		navTitle: '',
		navColor: '#000',
		navBackgroundColor: '#F7FAFA',
		navBorder: false,
		navFixed: true,
		navShadow: false,
		navShowPlaceholder: true,
		enabledOverflow: false
	}
);

const appStore = useAppStore();
</script>

<style scoped lang="scss">
.nav-bar {
	position: relative;
	z-index: 999;

	/* #ifndef APP-NVUE */
	:deep(.uni-navbar__header) {
		padding-left: 26rpx !important;
		padding-right: 26rpx !important;
	}
	/* #endif */
}

.page-overflow {
	height: 100vh;
	overflow: hidden;
}

.loading-container {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 997;

	.loading-img {
		width: 68rpx;
		height: 68rpx;
	}
}
</style>
