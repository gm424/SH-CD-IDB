<template>
	<view class="container">
		<image class="banner" :src="banner"></image>
		<view class="u-page">
			<text class="u-demo-block__title">{{$t('Activation process')}}</text>
			<view class="" style="height: 516rpx;">
				<u-steps :current="current" direction="column" activeColor="#2E5BB3">
					<u-steps-item :error="applyStatusError" :title="$t('certified.certified')" :desc="$t('User center for enterprise authentication')"></u-steps-item>
					<u-steps-item :title="$t('submit application')" :desc="$t('Submit store opening application (1-3 working days)')"></u-steps-item>
					<u-steps-item :error="storeError" :title="$t('Certification passed')" :desc="$t('Pay immediately after certification')"></u-steps-item>
					<u-steps-item v-if="false" :title="$t('Activation successful')" :desc="$t('Successful activation upon payment')"></u-steps-item>
				</u-steps>
			</view>
		</view>
		<block v-if="current === 0 && applyStatusError">
			<u-button :text="$t('certified.certified')" @click="routerCertified" :customStyle="btnCustomStyle"></u-button>
		</block>
		<block v-else-if="current === 1">
			<u-button :text="$t('under review')" disabled :customStyle="btnCustomStyle"></u-button>
		</block>
		<block v-else-if="current === 2 && !storeError">
			<view></view>
		</block>
		<block v-else>
			<u-button :text="text" @click="storeAdd" :customStyle="btnCustomStyle"></u-button>
		</block>
		<block></block>
		<block></block>
		
		
	</view>
</template>

<script>
	const MineServre = require('../../common/store/mineServer.js')
	export default {
		data() {
			return {
				banner: '/static/inquiry/inquiryBanner.png',
				btnCustomStyle: {
					width: '100%',
					height: '104rpx',
					background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
					color:'#FFF',
					marginTop: '220rpx',
					fontWeight: 'Bold',
					borderRadius: '12rpx'
				},
				current: 0,
				applyStatusError: false, //企业认证状态
				storeError: false,
				text: this.$t('submit')
			}
		},
		onReady() {
			
		},
		onLoad() {
			this.getTenantapplyInfo()
		},
		methods: {
			routerCertified() {
				uni.$u.route('/pages/certified/certified')
			},
			getTenantapplyInfo() {
				let that = this
				MineServre.getTenantapplyInfo({
					success(res) {
						that.current = 0
						if (!uni.$u.test.object(res.data)) {
							that.applyStatusError = true;
							return;
						}
						that.applyStatusCode = res.data.applyStatusCode
						switch (that.applyStatusCode) {
							case 1:
								that.applyStatusError = false;
								that.getStoreStatus()
								break;
							default:
								that.applyStatusError = true;
								break;
						}
					},
					fail(err) {
						console.log(err);
						uni.$u.toast(that.$t('Enterprise authentication exception'))
					}
				})
			},
			getStoreStatus() {
				let that = this
				MineServre.getStoreStatus({
					success(res) {
						if (!uni.$u.test.object(res.data)) {
							return;
						}
						switch (res.data.storeAuditStatus){
							case 0:
								that.current = 1
								that.storeError = false
								break;
							case 2:
								that.current = 2
								that.storeError = true
								that.text = that.$t('Resubmit')
								break;
							case 1:
								that.current = 2
								that.storeError = false
								break;
							default:
								break;
						}
					},
					fail(err) {
						console.log(err);
						// uni.$u.toast(err.msg)
					}
				})
			},
			storeAdd() {
				let that = this
				MineServre.storeAdd({
					success(res) {
						uni.$u.toast(res.msg)
						that.getStoreStatus()
					},
					fail(err) {
						uni.$u.toast(err.msg)
					}
				})
			},
		},

	}
</script>

<style lang="scss" scoped>
	/deep/ .u-button__text {
		font-size: 32rpx !important;
	}
	.container {
		padding: 0 48rpx;

		.banner {
			width: 100%;
			height: 208rpx;
			border-radius: 12rpx;
			margin: 40rpx 0 48rpx 0;
		}

		.u-page {
			width: 100%;

			.u-demo-block__title {
				width: 100% !important;
				display: flex;
				color: #333;
				font-size: 36rpx;
				font-weight: bold;
				line-height: 150%;
				margin-bottom: 48rpx;
			}
			
			/deep/ .u-steps--column {
				height: 516rpx;
			}
			
			/deep/ .u-steps-item__line--column {
				height: 120rpx;
			}
			
			/deep/ .u-text__value--content {
				font-size: 32rpx !important;
				font-weight: bold !important;
				color: #333;
			}
			
			/deep/ .u-text__value--main {
				font-size: 32rpx !important;
				font-weight: bold !important;
				color: #333;
			}
			
			/deep/ .u-text {
				flex: initial !important;
			}
			
			/deep/ .u-text__value {
				font-size: 28rpx !important;
			}

		}
	}
</style>