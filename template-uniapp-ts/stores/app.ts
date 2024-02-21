import { defineStore } from 'pinia';
import { ref } from 'vue';
import { THEME_TYPE } from '@/constants';

export const useAppStore = defineStore('app', () => {
	const theme = ref(THEME_TYPE.Light);

	function setTheme(value: THEME_TYPE) {
		theme.value = value;
	}

	return {
		theme,
		setTheme
	};
});
