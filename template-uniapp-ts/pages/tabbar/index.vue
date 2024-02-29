<template>
	<BasicLayout>
		<text class="text-sm dark:text-16 dark:text-red">Index</text>
		<button @tap="setTheme(THEME_TYPE.Light)">light</button>
		<button @tap="setTheme(THEME_TYPE.Dark)">dark</button>
	</BasicLayout>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores';
import { THEME_TYPE } from '@/constants';
const appStore = useAppStore();
function setTheme(theme: THEME_TYPE) {
	appStore.setTheme(theme);
}
</script>

<style scoped lang="scss"></style>
