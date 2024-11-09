<template>
	<view class="container">
		<view class="name u-line-1">
			{{inquiryDetails.goodsName}}
		</view>
		<view class="status u-line-1">
			<text>{{$t('Current order status')}}:</text>
			<block v-if="inquiryDetails.effect && inquiryDetails.status === 0">
				<text>{{$t('To be quoted')}}</text>
			</block>
			<block v-else-if="inquiryDetails.effect && inquiryDetails.status === 1">
				<text style="color: #219241;">{{$t('Quoted')}}</text>
			</block>
			<block v-else-if="!inquiryDetails.effect">
				<text style="color: #A3A3A3;">{{$t('expired')}}</text>
			</block>
		</view>
		<view class="name m u-line-1">
			{{$t('Quotation deadline')}}:{{$u.timeFormat(inquiryDetails.effectTime, 'yyyy/mm/dd')}}
		</view>

		<view class="steps m" v-if="false">
			<u-steps current="stepsCurrent" activeColor="#2e5bb3">
				<u-steps-item :title="$t('Order placed')">
					<u-icon v-if="inquiryDetails.status === 0 || inquiryDetails.status === 1 || inquiryDetails.status === 2 "
						name="checkmark-circle-fill" color="#2e5bb3" size="48" slot="icon"></u-icon>
					<u-icon v-else name="more-circle" color="#EEE" size="48" slot="icon"></u-icon>
				</u-steps-item>
				<u-steps-item :title="$t('Out of stock')">
					<u-icon v-if="inquiryDetails.status === 1 || inquiryDetails.status === 2 " name="checkmark-circle-fill" color="#2e5bb3"
						size="48" slot="icon"></u-icon>
					<u-icon v-else name="more-circle" color="#EEE" size="48" slot="icon"></u-icon>
				</u-steps-item>
				<u-steps-item :title="$t('in transit')">
					<u-icon v-if="inquiryDetails.status === 2 " name="checkmark-circle-fill" color="#2e5bb3" size="48"
						slot="icon"></u-icon>
					<u-icon v-else name="more-circle" color="#EEE" size="48" slot="icon"></u-icon>
				</u-steps-item>
			</u-steps>
		</view>
		<view class="form">
			<view class="form_tit">
				{{$t('EOI information')}}
			</view>
			<view class="form_content">
				<view class="form_content_top">
					<view class="form_content_top_row">
						<text v-for="(item,index) in list" :key="index">{{item.name}}</text>
					</view>
					<view class="form_content_top_row">
						<!-- <text v-for="(item,index) in detailsList" :key="index">{{item.name}}</text> -->
						<text>{{inquiryDetails.goodsName}}</text>
						<text>{{inquiryDetails.unit}}</text>
						<text>{{inquiryDetails.specification}}</text>
						<text v-if="false">***</text>
						<text>{{inquiryDetails.price}}</text>
					</view>
				</view>
			</view>
			<view class="status u-line-1">
				<text>{{$t('Current order status')}}:</text>
				<block v-if="inquiryDetails.effect && inquiryDetails.status === 0">
					<text>{{$t('To be quoted')}}</text>
				</block>
				<block v-else-if="inquiryDetails.effect && inquiryDetails.status === 1">
					<text style="color: #219241;">{{$t('Quoted')}}</text>
				</block>
				<block v-else-if="!inquiryDetails.effect">
					<text style="color: #A3A3A3;">{{$t('expired')}}</text>
				</block>
			</view>
			<view class="name">
				<text>{{$t('Remark')}}:</text>
				<text v-if="!inquiryDetails.description">{{$t('None yet')}}</text>
				<text v-else>{{inquiryDetails.description}}</text>
			</view>
		</view>
		<view class="u-info" v-if="userStore.storeName">
			{{$t('seller')}}:{{userStore.storeName}}
		</view>
		<view class="u-info" v-if="userStore.storeName">
			{{$t('Contact person')}}:{{userStore.storeUserName}}
		</view>
		<view class="u-info" v-if="userStore.storeName">
			{{$t('contact number')}}:{{userStore.storePhone}}
		</view>
		<view class="u-info" v-if="userStore.storeName">
			{{$t('Seller address')}}:{{userStore.storeAddress}}
		</view>
		<view class="btns">
			<u-button :text="$t('cancel order')" v-if="false" :customStyle="btnCancelCustomStyle"></u-button>
			<u-button :text="$t('back')" @click="back" :customStyle="btnCustomStyle"></u-button>
		</view>
	</view>
</template>

<script>
	const MineServer = require('../../common/store/mineServer.js');
	export default {
		data() {
			return {
				list: [{
					name: this.$t('Product')
				}, {
					name: this.$t('Specification')
				}, {
					name: this.$t('weight')
				},
				// {
				// 	name: '税率'
				// },
				{
					name: this.$t('unit price')
				}],
				detailsList: [],
				btnCustomStyle: {
					height: '96rpx',
					margin: 0,
					width: '100%',
					background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
					color: '#FFF',
					marginTop: '28rpx',
					fontWeight: 'Bold',
					borderRadius: '12rpx'
				},
				btnCancelCustomStyle: {
					width: '340rpx',
					height: '96rpx',
					background: '#fff',
					color: '#999',
					fontSize: '36rpx',
					margin: 0,
					border: 0
				},
				inquiry_id: '',
				inquiryDetails: {},
				userStore:{}
			}
		},
		onLoad(options) {
			console.log(options);
			this.inquiry_id = options.inquiry_id
			this.getClientInquiryDetails()
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			getClientInquiryDetails(inquiry_id) {
				let that = this
				MineServer.getClientInquiryDetails(that.inquiry_id, {
					success(res) {
						that.inquiryDetails = res.data;
						if(!uni.$u.test.isEmpty(that.inquiryDetails.userStore)){
							that.userStore = that.inquiryDetails.userStore
						}
					},
					fail(err) {
						uni.stopPullDownRefresh();
					},
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	$m: 48rpx 14rpx 0 14rpx;
	$w: 100%;
	
	/deep/ .u-button__text {
		font-size: 32rpx !important;
	}
	

	page {
		position: relative;
	}

	.container {
		padding: 40rpx 24rpx;

		.name {
			color: #333;
			font-size: 32rpx;
			width: 100%;
			font-weight: bold;
			padding: 0 24rpx;
		}

		.status {
			color: #333;
			font-size: 32rpx;
			width: 100%;
			font-weight: bold;
			padding: 0 24rpx;
			margin: $m;

			text:last-child {
				color: #F5BC13;
			}
		}

		.m {
			margin: $m;
		}

		.steps {
			width: 328rpx;
		}

		.form {
			@include flex(column);
			width: 100%;
			box-shadow: 0px 2px 7px 0px rgba(218, 218, 218, 0.50);
			padding: 24rpx;
			margin-top: 54rpx;
			margin-bottom: 48rpx;

			&_tit {
				width: $w;
				height: 58rpx;
				color: #333;
				font-family: PingFang SC;
				font-size: 32rpx;
				font-weight: bold;
				border-bottom: 2rpx dashed #eee;
			}

			&_content {
				@include flex(column);

				&_top {
					@include flex(column);
					justify-content: space-between;


					&_row {
						@include flex();
						justify-content: space-between;
						padding: 18rpx 0 24rpx 0;
						width: $w;
						border-bottom: 2rpx dashed #eee;

						text {
							width: 100rpx;
							text-align: center;
							color: #333;
							font-weight: bold;
							font-size: 24rpx;
						}
					}


				}
			}

			.status {
				color: #333;
				font-size: 24rpx;
				width: 100%;
				font-weight: bold;
				margin: 22rpx 0 36rpx 16rpx;
				padding: 0;

				text:last-child {
					color: #F5BC13;
					margin-left: 22rpx;
				}
			}


			.name {
				color: #333;
				font-size: 24rpx;
				width: 100%;
				font-weight: bold;
				padding-left: 16rpx;

				text:last-child {
					margin-left: 22rpx;
				}
			}
		}

		.u-info {
			margin-left: 24rpx;
			width: 100%;
			color: #333;
			font-size: 24rpx;
			line-height: 32rpx;
			letter-spacing: 0.4rpx;
			font-weight: bold;
			margin-bottom: 24rpx;
			text-align: left;
		}

		.btns {
			width: $w;
			position: absolute;
			height: 128rpx;
			padding: 16rpx 24rpx;
			@include flex();
			justify-content: space-between;
			bottom: 0rpx;
			left: 0;
			align-items: center;

		}
	}
</style>