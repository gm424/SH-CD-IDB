<template>
	<view class="container">
		<view class="shadow" style="width: 100%;">
			<u-swipe-action>
				<u-swipe-action-item :options="options" class="item" @click="swipeDel" :name="item.objId"
					v-for="(item,index) in collecList" :key="item.objId">
					<view class="swipe-action" @click="routerDetails(item.id)">
						<view class="swipe-action_content">
							<u-image width="240rpx" height="140rpx" :src="item.images[0]" :fade="true" mode="aspectFill"
								duration="450" :lazy-load="true">
								<template v-slot:loading>
									<u-loading-icon></u-loading-icon>
								</template>
								<view slot="error" style="font-size: 24rpx;">{{$t('failedToLoad')}}</view>
							</u-image>
							<view class="info">
								<view class="info_name">
									{{item.name}}
								</view>
								<view class="info_des u-line-1" >
									￥{{ item.skus[0].price }}
								</view>
							</view>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
		<u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
	</view>

	</view>
</template>

<script>
	const MineServre = require('../../common/store/mineServer.js')
	const indexServer = require('../../common/store/indexServer.js');
	const Api = require('../../common/store/api.js');
	const host = Api.host
	export default {
		data() {
			return {
				buyer: `${host}/public/tabbar/home/buyer.png`,
				options: [{
					text: this.$t('delete'),
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
				status: 'loadmore',
				page: 1,
				pageSize: 20,
				total: 0,
				collecList: [],
				isShowDefaultPage: true,
				loadmoreText: ''
			};
		},
		onLoad() {
			this.getUserCollection()
		},
		methods: {
			routerDetails(id) {
				uni.$u.route({
					url: 'pages/details/details',
					params: {
						spuId: id
					}
				})
			},
			swipeDel(obj) {
				this.userCollectionDel(obj.name)
			},
			userCollectionDel(objId) {
				let that = this
				let params = {
					objId: objId,
					category: 'goods'
				}
				indexServer.userCollectionDel(params, {
					success(res) {
						uni.$u.toast(res.msg)
						that.collecList = []
						that.page = 1;
						that.isShowDefaultPage = true;
						that.status = 'loadmore';
						that.getUserCollection()
					},
					fail(err) {}
				})
			},
			getUserCollection() {
				let that = this
				that.status = 'loading';
				let params = {
					page: that.page,
					pageSize: that.pageSize,
			
				}
				indexServer.getUserCollection(params, {
					success(res) {
						console.log('res======>', res);
						let collecList = [...res.data.result];
						if (collecList == null || collecList.length <= 0) {
							that.collecList = []
							that.page = 1;
							that.isShowDefaultPage = true;
							that.status = 'loadmore';
							uni.stopPullDownRefresh();
							return;
						}
						that.collecList = that.collecList.concat(collecList);
						that.total = res.data.total;
						that.isShowDefaultPage = false;
						uni.stopPullDownRefresh();
						console.log(that.collecList);
					},
					fail(err) {
						console.log('err======>', err);
						uni.stopPullDownRefresh();
					},
				})
			},
		},
		onPullDownRefresh() {
			this.collecList = [];
			this.page = 1;
			this.getUserCollection();
			this.status = 'loadmore';
		},
		onReachBottom() {
			if (this.collecList.length >= this.total) {
				this.status = 'nomore';
				return;
			}
			this.status = 'loading';
			this.page = this.collecList.length < this.total ? this.page + 1 : this.page;
			this.getUserCollection();
		},
	};
</script>

<style lang="scss" scoped>
	.u-page {
		padding: 0;
	}

	.container {
		width: 100%;
		padding: 24rpx;

		.item {
			margin: 24rpx;
		}

		.swipe-action {
			height: 164rpx;
			// 
			border-bottom: 2rpx solid #ebebeb;

			&_content {
				@include flex();

				.info {
					width: 100%;
					@include flex(column);
					margin-left: 12rpx;

					&_name {
						color: #333;
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 24rpx;
					}

					&_des {
						color: #FF5F00;
						font-size: 28rpx;
						line-height: 40rpx;
					}
				}
			}
		}
	}
</style>