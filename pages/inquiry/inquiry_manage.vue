<template>
	<view class="container">
		<view class="manage" v-for="(item,index) in inquiryList" :key="index">
			<view class="manage_item" @click="routerManageDetails(item.inquiryId)">
				<view class="manage_item_tit">
					<view class="manage_item_tit_l u-line-2">
						{{item.goodsName}}
					</view>
					<view class="manage_item_tit_r">
						<block v-if="item.effect && item.status === 0">
							<view class="manage_item_tit_r_status">
								{{$t('To be quoted')}}
							</view>
							<view class="manage_item_tit_r_icon"></view>
						</block>
						<block v-else-if="item.effect && item.status === 1">
							<view class="manage_item_tit_r_status" style="color: #219241;">
								{{$t('Quoted')}}
							</view>
							<view class="manage_item_tit_r_icon" style="background-color: #219241;"></view>
						</block>
						<block v-else-if="!item.effect">
							<view class="manage_item_tit_r_status" style="color: #A3A3A3;">
								{{$t('expired')}}
							</view>
							<view class="manage_item_tit_r_icon" style="background-color: #A3A3A3;"></view>
						</block>
					</view>
				</view>
				<view class="manage_item_content">
					<view class="manage_item_content_date">
						{{$t('Quotation as of')}}{{$u.timeFormat(item.effectTime, 'yyyy/mm/dd')}}
					</view>
					<view class="manage_item_content_text">
						{{$t('details')}}
					</view>
				</view>

			</view>
			<u-divider line-color="#eee"></u-divider>
		</view>
		<!-- <u-loadmore :loadmoreText="loadmoreText" fontSize="28" :status="status" /> -->
		<u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
	</view>
</template>

<script>
	const MineServer = require('../../common/store/mineServer.js');
	const Api = require('../../common/store/api.js');
	const host = Api.host

	export default {
		data() {
			return {
				// status: 'loadmore',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				inquiryList: [],
				isShowDefaultPage: true,
				loadmoreText: ''
			}
		},
		onLoad() {
			this.getClientInquiry()
		},

		methods: {
			getClientInquiry() {
				let that = this
				// that.status = 'loading';
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
							// that.status = 'loadmore';
							uni.stopPullDownRefresh();
							return;
						}
						that.inquiryList = that.inquiryList.concat(inquiryList);
						that.total = res.total;
						// that.pageNum = res.pageNum;
						that.isShowDefaultPage = false;
						// that.status = 'nomore';
						uni.stopPullDownRefresh();
					},
					fail(err) {
						that.inquiryList = []
						that.status = 'nomore';
						uni.stopPullDownRefresh();
					},
				})
			},
			routerManageDetails(value) {
				uni.$u.route({
					url: '/pages/inquiry/inquiry_manage_details',
					params: {
						inquiry_id: value
					}
				})
			}
		},
		onPullDownRefresh() {
			this.inquiryList = [];
			this.pageNum = 1;
			this.getClientInquiry();
			// this.status = 'loadmore';
		},
		onReachBottom() {
			if (this.inquiryList.length >= this.total) {
				// this.status = 'nomore';
				return;
			}
			// this.status = 'loading';
			this.pageNum = this.inquiryList.length < this.total ? this.pageNum + 1 : this.pageNum;
			this.getClientInquiry();
		},
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 30rpx 24rpx;

		.wrap {
			padding: 24rpx;
		}

		.item {
			padding: 24rpx 0;
			color: $u-content-color;
			font-size: 28rpx;
		}

		.manage {
			@include flex(column);
			width: 100%;

			&_item {
				width: 100%;
				margin-top: 10rpx;

				&_tit {
					@include flex();
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 48rpx;

					&_l {
						width: 498rpx;
						height: 70rpx;
						color: #333;
						font-size: 28rpx;
						line-height: 37rpx;
					}

					&_r {
						@include flex();
						align-items: flex-start;

						&_status {
							color: #F5BC13;
							font-size: 24rpx;
							margin-right: 12rpx;
						}

						&_icon {
							background-color: #F5BC13;
							;
							width: 8rpx;
							height: 8rpx;
							border-radius: 50%;
						}
					}
				}

				&_content {
					@include flex();
					justify-content: space-between;
					line-height: 26rpx;
					font-size: 20rpx;
					margin-bottom: 18rpx;

					&_date {
						color: #999;
					}

					&_text {
						color: #1989FA;
					}
				}
			}
		}
	}
</style>