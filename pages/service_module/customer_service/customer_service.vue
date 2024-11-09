<template>
	<view>
		<web-view :src="contactUrl"></web-view>
	</view>
</template>

<script>
	
	const customService = require('../../../common/store/customService.js');
	const AppUtil = require('../../../common/utils/appUtil.js');

	export default {
		data() {
			return {
				contactUrl: '',
			}
		},
		onLoad() {
			let initData = uni.getStorageSync('vkefuInit');
			// let pageData = uni.getStorageSync('vkefuPage');

			// initData.page = pageData;
			let that = this;
			uni.showLoading({
				title: that.$t('Connect to customer service center') + '....'
			});
			customService.contactSupport(initData, {
				success(res) {
					if (res.ok != 1) {
						return false;
					}
					that.contactUrl = res.data.url;
					uni.hideLoading();
				},
				fail(err) {
					uni.hideLoading();
				}
			})
		},
	}
</script>

<style lang="scss">

</style>