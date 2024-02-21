<template>
	<view></view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { useAppStore } from '@/stores/app';
import _Router from '@/router/index';
import _RouterPath from '@/router/constant';

const appStore = useAppStore();
// #ifdef APP-VUE
appStore.setTheme(plus.navigator.getUIStyle());
// #endif

onLoad(() => {
	// 检查更新
	// #ifdef APP-PLUS
	// #endif
});

//关闭程序启动界面
function closeSplash() {
	setTimeout(() => {
		// #ifdef APP-PLUS
		plus.navigator.closeSplashscreen();
		// #endif
		console.log('Splash关闭成功');
	}, 300);
}

_Router.switchTab({ path: _RouterPath.Home.Index, success: closeSplash });
</script>

<style scoped lang="scss"></style>
