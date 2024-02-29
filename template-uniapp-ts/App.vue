<script>
import { useAppStore } from '@/stores';
export default {
	onLaunch: function() {
		console.log('App Launch');

		const appStore = useAppStore();
		uni.onThemeChange(data => {
			appStore.setTheme(data.theme);
		});
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
</style>
