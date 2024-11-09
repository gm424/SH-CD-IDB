<template>
	<view class="container">
		<view class="search">
			<u-search :placeholder="$t('Please enter a keyword')" :inputStyle="inputStyle" searchIconSize="40rpx"
				v-model="storeName" shape="square" :showAction="false" @search="search"></u-search>
		</view>
		<view class="tabs">
			<u-tabs :list="listTabs" @click="click"
				lineColor="radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)" lineWidth="58rpx"
				lineHeight="8rpx" :activeStyle="{ color: '#2E5BB3', fontFace: '32rpx', fontWeight: 'bold' }"></u-tabs>
		</view>
		<view class="card">
			<view class="card_item" v-if="!isShowDefaultPage" v-for="(item, index) in storeList" :key="index">
				<view class="card_item_info">
					<u-avatar :src="item.storeLogo" size="80rpx"></u-avatar>
					<view class="card_item_info_c">
						<view class="card_item_info_c_name u-line-2">
							{{ item.storeName }}
						</view>
						<view class="tags" v-if="false">
							<view class="tag" v-for="(item, index) in tags" :key="index">
								<u-tag size="mini" :text="item.text" :type="item.type" :icon="item.icon" shape="circle"
									v-if="false"></u-tag>
								{{ item.text }}
							</view>
						</view>
					</view>
					<img :src="enterShop" style="width: 88rpx; height: 50rpx" @click="routerShop(item.storeId)" />
				</view>
				<u-scroll-list :indicator="indicator">
					<view class="list" v-for="(i, ix) in item.goodsSimpleVoList" :key="ix" @click="routerDetails(i.goodsId)">
						<image :src="i.images[0]" class="list_img"></image>
						<view class="list_text u-line-2">
							{{ i.goodsName }}
						</view>
						<block v-if="(i.price <= 0) && (i.wholesalePrice <= 0)">
							<view class="list_price">
								<text>{{ $t('Price negotiable') }}</text>
							</view>
						</block>
						<block v-else>
							<view class="val-retail" v-if="i.price > 0">
								<view class="val">
									<text>{{ $t('Retail price') }}：</text>
									<text>{{ i.currency.symbol }} {{ i.price }}</text>
								</view>
								<view class="num" v-if="false">
									8000+{{ $t('people paid') }}
								</view>
							</view>

							<view class="val val-wholesale" v-if="i.wholesalePrice > 0">
								<view>
									<text>{{ $t('Wholesale price') }}：</text>
									<text>{{ i.currency.symbol }} {{ i.wholesalePrice }}</text>
								</view>
							</view>
						</block>
					</view>
				</u-scroll-list>
			</view>
			<u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
		</view>
	</view>
</template>

<script>
const IndexServer = require('../../common/store/indexServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
	data() {
		return {
			keyword: '',
			enterShop: `${host}/public/enterShop.png`,
			inputStyle: {
				height: '88rpx'
			},
			listTabs: [{ name: '全部', value: 0 }],
			tags: [
				{
					type: 'warning',
					text: '经验4',
					icon: 'account'
				},
				{
					type: 'success ',
					text: '生产线14',
					icon: ''
				},
				{
					type: 'info ',
					text: '设备6'
				},
				{
					type: 'error',
					text: '已认证'
				}
			],
			indicator: false,
			storeList: [],
			storeName: '',
			pageNum: 1,
			pageSize: 10,
			total: 0,
			isShowDefaultPage: true,
			tradeName: ''
		};
	},
	onLoad() {
		this.storeLists();
		this.getClientIndustry();
	},
	methods: {
		routerDetails(goodsId) {
			uni.$u.route({
				url: 'pages/details/details',
				params: {
					goodsId: goodsId
				}
			});
		},
		click(item) {
			let that = this;
			console.log('item', item);
			switch (item.code) {
				case '0':
					that.tradeName = '';
					break;
				default:
					that.tradeName = item.code;
					break;
			}
			that.pageNum = 1;
			that.storeList = [];
			that.storeLists();
		},
		search(val) {
			let that = this;
			that.storeName = val;
			that.pageNum = 1;
			that.storeList = [];
			that.storeLists();
		},
		routerShop(storeId) {
			uni.$u.route({
				url: '/pages/shop/shop',
				params: {
					storeId: storeId
				}
			});
		},

		// 获取行业分类
		getClientIndustry() {
			let that = this;
			IndexServer.getClientIndustry({
				success(res) {
					if (!uni.$u.test.array(res.data)) {
						uni.$u.toast(that.$t('Product category loading failed'));
						return;
					}
					let all = { name: that.$t('all'), code: '0' };
					res.data.unshift(all);
					that.listTabs = res.data;
				},
				fail(err) {
					uni.$u.toast(that.$t('Product category loading failed'));
				}
			});
		},

		// 获取店铺列表
		storeLists() {
			let that = this;
			let params = {
				storeName: that.storeName,
				pageNum: that.pageNum,
				pageSize: that.pageSize,
				tradeName: that.tradeName
			};
			IndexServer.storeList(params, {
				success(res) {
					let storeList = res.data;
					if (storeList == null || storeList.length <= 0) {
						that.storeList = [];
						that.pageNum = 1;
						that.isShowDefaultPage = true;
						uni.stopPullDownRefresh();
						return;
					}
					that.storeList = that.storeList.concat(storeList);
					that.total = res.total;
					// that.pageNum = res.pageNum;
					that.isShowDefaultPage = false;
					console.log(that.storeList);
					uni.stopPullDownRefresh();
				},
				fail(err) {
					uni.stopPullDownRefresh();
				}
			});
		}
	},
	onPullDownRefresh() {
		this.storeList = [];
		this.pageNum = 1;
		this.storeLists();
	},
	onReachBottom() {
		if (this.storeList.length >= this.total) {
			return;
		}
		this.pageNum = this.storeList.length < this.total ? this.pageNum + 1 : this.pageNum;
		this.storeLists();
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding: 40rpx 24rpx 0 24rpx;

	.search {
		width: 100%;
	}

	.tabs {
		width: 100%;
		margin-bottom: 24rpx;
	}

	.card {
		width: 100%;
		@include flex(column);
		// @include flex(row);

		&_item {
			width: 100%;
			height: auto;
			background-color: #f4f6f8;
			border-radius: 12rpx;
			padding: 24rpx 32rpx 24rpx 24rpx;
			margin-bottom: 24rpx;

			&_info {
				height: 98rpx;
				@include flex();
				justify-content: space-between;
				margin-bottom: 24rpx;

				&_c {
					width: 454rpx;
					height: 100%;
					@include flex(column);
					justify-content: space-between;

					&_name {
						width: 100%;
						color: #000;
						font-size: 24rpx;
					}

					.tags {
						@include flex();

						.tag {
							height: 24rpx;
							min-width: 42rpx;
							border-radius: 12rpx;
							background: #ff5f00;
							text-align: center;
							line-height: 24rpx;
							font-size: 16rpx;
							color: #fff;
							margin-right: 12rpx;
						}
					}
				}
			}

			.list {
				height: 336rpx;
				background-color: #fff;
				margin-right: 24rpx;
				padding: 12rpx;
				@include flex(column);

				&_img {
					width: 258rpx;
					height: 192rpx;
					border-radius: 12rpx;
				}

				&_text {
					width: 244rpx;
					height: 64rpx;
					margin: 12rpx 0;
					color: #333;
					font-size: 24rpx;
					font-weight: bold;
				}

				&_price {
					text {
						color: #ff5f00;
					}

					text:first-child {
						font-size: 16rpx;
					}

					text:nth-of-type(2) {
						font-size: 24rpx;
						margin-right: 6rpx;
						display: inline-block;
					}

					text:last-child {
						font-size: 20rpx;
					}
				}
			}

			.list:last-child {
				margin-right: 0;
			}

			.val-retail {
				display: flex;
				justify-content: space-between;
				color: #FF5F00;
				font-size: 20rpx;

				.num {
					color: #aaa;
				}
			}

			.val-wholesale {
				display: flex;
				justify-content: space-between;
				color: #FF5F00;
				font-size: 20rpx;
			}
		}
	}
}
</style>
