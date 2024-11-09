<template>
	<view class="container">
		<view class="form">
			<u-avatar class="logo" :src="src" size="120"></u-avatar>
			<u-button color="#2E5BB3" :customStyle="btnCustomStyle" :icon="email_icon" loadingSize="32" shape="circle"
				class="btn" @click="routerForget('email')">{{$t('Email verification and retrieval')}}</u-button>
			<!-- <u-button color="#2E5BB3" :customStyle="btnCustomStyle" :icon="phone_icon" shape="circle"
				class="btn register-btn" @click="routerForget('phone')">手机验证找回</u-button> -->
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	const Api = require('../../common/store/api.js');

	const host = Api.host
	export default {
		data() {
			return {
				src: `${host}/public/login/logo.png`,
				btnCustomStyle: {
					background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
					color: '#FFF',
					fontSize: '32rpx'
				},
				email_icon: `${host}/public/login/email_icon.png`,
				phone_icon: `${host}/public/login/phone_icon.png`,
			}
		},
		onLoad() {},
		methods: {
			routerForget(value) {
				uni.$u.route({
					url: 'pages/forget/forget',
					params: {
						value: value
					}
				})
			},
			submit() {
				uni.$u.route({
					url: '/pages/tabbar/home',
					type: 'tab'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #FBFBFD;
	}

	.container {
		padding: 0 40rpx;
		height: 100vh;
		position: relative;

		.form {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			::v-deep .u-form-item__body {
				padding: 0;
			}

			.logo {
				margin: 48rpx 0 48rpx 0;
			}


			.btn {
				width: 600rpx;
				height: 80rpx;
				margin-top: 48rpx;
				margin-bottom: 48rpx;
			}

			/deep/ .u-icon__img {
				width: 32rpx !important;
				height: 32rpx !important;
				margin-right: 12rpx !important;
			}

			.register-btn {
				margin-top: 0;
				margin-bottom: 48rpx;
			}
		}
	}
</style>