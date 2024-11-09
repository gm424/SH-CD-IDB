<template>
	<view class="container">
		<!-- // 隐藏消息通知 -->
		<view class="notice shadow" v-if="!$u.test.isEmpty(noticesLast)">
			<view class="notice_l" @click="routerBell(noticesLast.isRead, noticesLast.id)">
				<u-icon v-if="noticesLast.isRead" name="bell" size="44rpx"></u-icon>
				<u-icon v-else name="bell-fill" color="#FF5F00" size="44rpx"></u-icon>
				<view class="text u-line-1">
					{{ noticesLast.title }}
				</view>
			</view>
			<view class="notice_r">
				{{ $u.timeFormat(noticesLast.createTime, 'yyyy-mm-dd')  }}
			</view>
		</view>
		<view class="u-page shadow" v-if="!$u.test.isEmpty(indexList)">
			<u-list :height="height" @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in indexList" :key="index">
					<u-cell :label="item.last_chat" @click="getCell(item.shop_id)">
						<view style="position: relative;margin-right: 16rpx;" slot="icon">
							<u-avatar shape="square" size="96rpx" :src="item.servicer.avatar_url"></u-avatar>
							<view v-if="item.visiter_unread > 0" class="num">
								{{item.visiter_unread}}
							</view>
						</view>
						<view class="u-line-1" style="width: 260rpx;font-size: 32rpx; font-weight: bold;" slot="title">
							{{item.servicer.nickname}}
						</view>
						<view class="u-line-1" style="font-size: 24rpx;color: #999;" slot="value">
							{{item.last_time}}
						</view>
					</u-cell>
				</u-list-item>
			</u-list>
		</view>
		<u-empty :show="$u.test.isEmpty(noticesLast) && $u.test.isEmpty(indexList)" :text="$t('No data')" mode="message" margin-top="300"></u-empty>
	</view>
</template>

<script>
	const ServiceUtil = require('../../common/utils/serviceUtil.js');
	const customService = require('../../common/store/customService.js');
	export default {
		data() {
			return {
				indexList: [],
				options: [{
					text: this.$t('delete'),
					style: {
						backgroundColor: '#f56c6c'
					}
				}],
				show1: true,
				pollingST: null,
				height: 0,
				noticesLast: {}
			}
		},
		mounted() {
			let that = this
			// 隐藏消息通知
			// let windowHeight = uni.getSystemInfoSync().windowHeight
			// let noticeHeight = 0
			// const query = uni.createSelectorQuery().in(this);
			// query.select('.notice').boundingClientRect( ({height})  => {
			//   noticeHeight = height
			// }).exec();
			// that.height = ( windowHeight - noticeHeight -60 ) * 2
			that.height = uni.getSystemInfoSync().windowHeight * 2
		},
		onShow() {
			this.polling()
			this.getNoticesLast()
		},
		methods: {
			getCell(id) {
				let goods = {
					storeId: id,
				};
				console.log(goods, id)
				ServiceUtil.openServiceFromGoodsDetailContact(goods);
			},
			getNoticesLast() {
				let that = this
				customService.getNoticesLast({
					success(res) {
						if (!uni.$u.test.isEmpty(res.data)) {
							that.noticesLast = res.data
						}
					},
					fail(err) {
						console.log('getNoticesLast err', err);
					},
				})
			},
			routerBell(isRead, id) {
				console.log(id);
				if(!isRead){
					customService.getNoticesId(id,{
						success(res) {
							that.getNoticesLast()
							console.log(res);
						},
						fail(err) {}
					})
				}
				uni.$u.route('/pages/bell/bell')
				// uni.$u.route('/pages/bell/bell')
			},
			// click(index) {
			// 	uni.showModal({
			// 		title: '温馨提示',
			// 		content: '确定要删除吗？',
			// 		success: res => {
			// 			if (res.confirm) {
			// 			}
			// 		}
			// 	})
			// },
			scrolltolower() {

			},
			// 轮询方法
			polling() {
				let that = this
				customService.contactSupportList({
					success(res) {
						that.indexList = res.data.lists
						that.pollingST = setTimeout(() => {
							clearTimeout(that.pollingST)
							that.polling()
						}, 10000)
					},
					fail(err) {
						console.log('err列表', err);
					},
				})
			}
		},
		onHide() {
			clearTimeout(this.pollingST)
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 12rpx 24rpx 0 24rpx;

		.notice {
			width: 100%;
			height: 100rpx;
			padding: 28rpx 24rpx;
			@include flex();
			justify-content: space-between;
			align-items: center;
			margin-bottom: 24rpx;
			border-radius: 12rpx;

			&_l {
				@include flex();
				align-items: center;

				.text {
					width: 336rpx;
					color: #333;
					font-size: 28rpx;
					margin-left: 24rpx;
					font-weight: bold;
				}
			}

			&_r {
				color: #999;
				font-size: 24rpx;
			}
		}

		.u-page {
			width: 100%;
			padding: 0 24rpx;
			border-radius: 12rpx;

			/deep/ .u-cell__body {
				padding: 24rpx 0;
			}
			
			.num {
				width: 36rpx;
				height: 36rpx;
				border-radius: 50%;
				background-color: #FF5F00;
				position: absolute;
				right: -12rpx;
				top: -8rpx;
				text-align: center;
				line-height: 100%;
				color: #fff;
			}
		}
	}
</style>