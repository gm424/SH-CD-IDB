<template>
	<view class="container">
		<view class="waterfall">
			<view v-for="(item, index) in topicList" :key="item.id" @click="routerTopicDetails(item.cid)" class="waterfall-item">
				<view class="waterfall-item__image">
					<u-image width="340rpx" radius="12rpx" :src="item.icon" :fade="true"
						mode="widthFix" duration="450" :lazy-load="true">
						<template v-slot:loading>
							<u-loading-icon></u-loading-icon>
						</template>
						<view slot="error" style="font-size: 24rpx;">{{$t('failedToLoad')}}</view>
					</u-image>
				</view>
				<view class="waterfall-item__ft">
					<view class="waterfall-item__ft__title">
						<text class="value">{{item.title}}</text>
					</view>
				</view>
			</view>
			<view style="width: 100%;">
				<u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
			</view>
		</view>
	</view>

</template>
<script>
	const indexServer = require('../../common/store/indexServer.js');
	const Api = require('../../common/store/api.js');
	const host = Api.host
	export default {
		data() {
			return {
				topicList: [], // 瀑布流全部数据
				catId: '',
				pageNum: 1,
				pageSize: 10,
				total: 0,
				isShowDefaultPage: true,
			}
		},
		onLoad(options) {
			this.catId = options.catId
			this.getTopic()
		},
		methods: {
			routerTopicDetails(cid) {
				uni.$u.route({
					url: '/pages/topic/topic_details',
					params: {
						cid: cid
					}
				})
			},
			getTopic() {
				let that = this
				let type = 'topic'
				let param = {
					category: that.catId,
					pageNum: that.pageNum,
					pageSize: that.pageSize,
				}
				indexServer.getHomeContent(param, type, {
					success(res) {
						let topicList = res.data;
						if (topicList == null || topicList.length <= 0) {
							that.topicList = []
							that.pageNum = 1;
							that.isShowDefaultPage = true;
							uni.stopPullDownRefresh();
							return;
						}
						that.topicList = that.topicList.concat(topicList);
						that.total = res.total;
						// that.pageNum = res.pageNum;
						that.isShowDefaultPage = false;
						uni.stopPullDownRefresh();
					},
					fail(err) {
						uni.stopPullDownRefresh();
					}
				})
			},
		},
		onPullDownRefresh() {
			this.topicList = [];
			this.pageNum = 1;
			this.getTopic();
		
		},
		onReachBottom() {
			if (this.topicList.length >= this.total) {
				return;
			}
			this.pageNum = this.topicList.length < this.total ? this.pageNum + 1 : this.pageNum;
			this.getTopic();
		},
	}
</script>
<style>
	page {
		background: #f1f1f1;
	}
</style>
<style scoped lang="scss">

	.container {
		width: 100%;
		height: 100%;
		padding: 22rpx 24rpx;

		.waterfall {
			@include flex();
			width: 100%;
			flex-wrap: wrap;
			justify-content: space-between;

			.waterfall-item {
				width: 340rpx;
				margin-top: 10px;
			}

			.waterfall-item__ft {
				padding: 0 20rpx 20rpx 0;

				&__image {
					border-radius: 6px;
				}

				&__title {
					margin-bottom: 10rpx;
					font-weight: 700;

					.value {
						font-size: 28rpx;
						color: #333;
					}
				}

				&__btn {
					padding: 10px 0;
				}
			}
		}
	}
</style>