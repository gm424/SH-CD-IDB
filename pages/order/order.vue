<template>
	<view class="content">
		<!-- #ifndef APP-NVUE || MP-TOUTIAO -->
		<view class="u-demo-block">
			<u-swiper :list="swiperList" @click="getSwiper" keyName="icon" height="100%" previousMargin="96rpx" nextMargin="96rpx" circular :autoplay="false"
				radius="5" bgColor="#ffffff" ></u-swiper>
		</view>
		<!-- #endif -->
		<view class="container">
			 <!-- @click="routerDetails(item.inquiryId)" -->
			<view class="order"  v-for="(item,index) in inquiryList" :key="index">
				<view class="order_item" >
					<view class="order_item_title">
						<text>{{item.goodsName}}</text>
						<text>{{item.specification}}</text>
					</view>
					<view class="order_item_content">
						<view class="order_item_content_text">
							<text>{{$t('quantity')}}</text>
							<text>{{item.num}}{{item.unit}}</text>
						</view>
						<view class="order_item_content_divider"></view>
						<view class="order_item_content_text">
							<text>{{$t('Quotation as of')}}</text>
							<text>{{$u.timeFormat(item.effectTime, 'yyyy/mm/dd')}}</text>
						</view>
						<view class="order_item_content_divider"></view>
						<view class="order_item_content_text">
							<text>{{$t('Quotation request')}}</text>
							<text>{{item.taxIncluded ? $t('tax included') : $t('Excluding tax')}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<image :src="service" class="service" @click="contactService()"></image>
	</view>
</template>

<script>
	import mixin from '@/mixins/index'
	const Api = require('../../common/store/api.js');
	const host = Api.host
	const MineServer = require('../../common/store/mineServer.js');
	const ServiceUtil = require('../../common/utils/serviceUtil.js');
	const IndexServer = require('../../common/store/indexServer.js');
	export default {
		mixins: [mixin.generalNavigateTo],
		data() {
			return {
				status: 'loadmore',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				inquiryList: [],
				isShowDefaultPage: true,
				loadmoreText: '',
				swiperList: [],
				service: `${host}/public/order/service.png`,
			}
		},
		onLoad() {
			this.getClientInquiry()
			this.getSpecial()
		},
		
		methods: {
			getSwiper(i) {
				console.log(i);
				let target = this.swiperList[i].target
				let title = this.swiperList[i].title
				this.navigateTo(target, title)
			},
			// routerDetails(inquiryId) {
			// 	uni.$u.route('/pages/inquiry/inquiry_manage_details?inquiry_id=' + inquiryId)
			// },
			contactService() {
				let goods = {
					storeId: 0,
				};
				ServiceUtil.openServiceFromGoodsDetailContact(goods);
			},
			getClientInquiry() {
				let that = this
				that.status = 'loading';
				let params = {
					pageNum: that.pageNum,
					pageSize: that.pageSize
				}
				MineServer.getClientInquiry(params, {
					success(res) {
						let inquiryList = [...res.data];
						if (inquiryList == null || inquiryList.length <= 0) {
							that.inquiryList = []
							that.pageNum = 1;
							that.isShowDefaultPage = true;
							that.status = 'loadmore';
							uni.stopPullDownRefresh();
							return;
						}
						that.inquiryList = that.inquiryList.concat(inquiryList);
						that.total = res.total;
						// that.pageNum = res.pageNum;
						that.isShowDefaultPage = false;
						that.status = 'nomore';
						uni.stopPullDownRefresh();
					},
					fail(err) {
						uni.stopPullDownRefresh();
						uni.$u.toast(err.msg);
					},
				})
			},
			// 轮播图
			getSpecial() {
				let that = this
				let type = 'banner_order' // 轮播图
				let param = {}
				IndexServer.getHomeContent(param,type,{
					success(res){
						that.swiperList = res.data
						console.log('that.swiperList', that.swiperList)
					},
					fail(err){
						console.log('err', err)
						uni.$u.toast(err.msg);
					}
				})
			},
		},
		onPullDownRefresh() {
			this.inquiryList = [];
			this.pageNum = 1;
			this.getClientInquiry();
			this.status = 'loadmore';
		},
		onReachBottom() {
			if (this.inquiryList.length >= this.total) {
				this.status = 'nomore';
				return;
			}
			this.status = 'loading';
			this.pageNum = this.inquiryList.length < this.total ? this.pageNum + 1 : this.pageNum;
			this.getClientInquiry();
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		position: relative;

		.service {
			width: 128rpx;
			height: 128rpx;
			position: fixed;
			bottom: 10%;
			right: 0;
		}

		.u-demo-block {
			width: 100%;
			height: 328rpx;
			margin: 24rpx 0;
		}

		.container {
			padding: 24rpx;

			.order {
				width: 100%;
				height: 234rpx;
				@include flex(column);

				&_item {
					width: 100%;

					padding: 24rpx;
					@include flex(column);

					&_title {
						@include flex();
						justify-content: space-between;
						width: 100%;
						align-items: flex-start;
						margin-bottom: 24rpx;

						text:first-child {
							color: #333;
							font-size: 32rpx;
							font-weight: bold;
						}

						text:last-child {
							color: #31B32E;
							font-size: 24rpx;
						}
					}

					&_content {
						width: 100%;
						height: 124rpx;
						@include flex();
						justify-content: space-between;
						align-items: center;
						border-radius: 4rpx;
						background: #F4F6F8;
						padding: 24rpx;

						&_text {
							@include flex(column);
							justify-content: space-between;
							align-items: center;
							text-align: center;

							text {
								color: #666;
								font-size: 28rpx;
							}

							text:last-child {
								margin-top: 12rpx;
								font-weight: bold;
							}
						}


						&_divider {
							width: 2rpx;
							height: 38rpx;
							background: #D9D9D9;
							margin: 0 24rpx;

						}
					}
				}
			}

		}
	}
</style>