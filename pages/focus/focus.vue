<template>
	<view class="container">
		<view class="" style="width: 100%">
			<u-swipe-action>
				<u-swipe-action-item :options="options" @click="swipeDel" v-for="(item, index) in collecList" :key="item.objId" :name="item.objId" class="shadow">
					<view class="swipe-action" @click="routerShop(item.objId)">
						<view class="swipe-action_content">
							<u-avatar :src="item.icon" size="96rpx" shape="square"></u-avatar>
							<view class="info">
								<view class="info_name">
									{{ item.title }}
								</view>
								<view class="info_des u-line-1" v-if="false">简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
		<u-empty :show="isShowDefaultPage" text="没有数据哟" margin-top="300"></u-empty>
	</view>
</template>

<script>
	const MineServre = require('../../common/store/mineServer.js');
	const indexServer = require('../../common/store/indexServer.js');
	export default {
		data() {
			return {
				options: [
					{
						text: this.$t('delete'),
						style: {
							backgroundColor: '#f56c6c'
						}
					}
				],
				banner: '/static/inquiry/inquiryBanner.png',
				pageNum: 1,
				pageSize: 20,
				total: 0,
				collecList: [],
				isShowDefaultPage: true,
				loadmoreText: ''
			};
		},
		onLoad() {
			this.getUserCollection();
		},
		methods: {
			routerShop(storeId) {
				uni.$u.route({
					url: '/pages/shop/shop',
					params: {
						storeId: storeId
					}
				});
			},
			swipeDel(obj) {
				this.userCollectionDel(obj.name);
			},
			userCollectionDel(objId) {
				let that = this;
				let params = {
					objId: objId,
					category: 'store'
				};
				indexServer.userCollectionDel(params, {
					success(res) {
						uni.$u.toast(res.msg);
						that.collecList = [];
						that.pageNum = 1;
						that.isShowDefaultPage = true;
						that.status = 'loadmore';
						that.getUserCollection();
					},
					fail(err) {}
				});
			},
			getUserCollection() {
				let that = this;
				that.status = 'loading';
				let params = {
					pageNum: that.pageNum,
					pageSize: that.pageSize,
					category: 'store'
				};
				indexServer.getUserCollection(params, {
					success(res) {
						console.log('res======>', res);
						let collecList = [...res.data];
						if (collecList == null || collecList.length <= 0) {
							that.collecList = [];
							that.pageNum = 1;
							that.isShowDefaultPage = true;
							that.status = 'loadmore';
							uni.stopPullDownRefresh();
							return;
						}
						that.collecList = that.collecList.concat(collecList);
						that.total = res.total;
						that.isShowDefaultPage = false;
						uni.stopPullDownRefresh();
						console.log(that.collecList);
					},
					fail(err) {
						console.log('err======>', err);
						uni.stopPullDownRefresh();
					}
				});
			},
			onPullDownRefresh() {
				this.collecList = [];
				this.pageNum = 1;
				this.getUserCollection();
				this.status = 'loadmore';
			},
			onReachBottom() {
				if (this.collecList.length >= this.total) {
					this.status = 'nomore';
					return;
				}
				this.status = 'loading';
				this.pageNum = this.collecList.length < this.total ? this.pageNum + 1 : this.pageNum;
				this.getUserCollection();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;
	}

	.container {
		width: 100%;
		padding: 24rpx;

		.shadow {
			box-shadow: 0px 4rpx 14rpx rgba(218, 218, 218, 0.5);
			border-radius: 12rpx;
			margin-bottom: 12rpx;
		}

		.swipe-action {
			width: 100%;
			height: 144rpx;
			padding: 24rpx;

			border: 0;

			&_content {
				@include flex();

				.info {
					width: 100%;
					height: 96rpx;
					@include flex(column);
					margin-left: 12rpx;

					&_name {
						color: #333;
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 10rpx;
					}

					&_des {
						color: #666;
						font-size: 24rpx;
						line-height: 40rpx;
					}
				}
			}
		}
	}
</style>
