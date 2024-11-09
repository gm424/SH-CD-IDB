<template>
  <view class="container">
    <view class="search">
      <u-search
        :placeholder="$t('Please enter a keyword')"
        :inputStyle="inputStyle"
        searchIconSize="40rpx"
        v-model="searchData"
        shape="square"
        :showAction="false"
        @search="search"
      ></u-search>
    </view>
    <view class="sort shadow" v-if="!isShowDefaultPage">
      <view class="sort-item" v-for="(item, index) in sortList" :key="index" @click="routerDetails(item.id)">
        <u-image
          width="100%"
          height="300rpx"
          :src="item.images[0]"
          :fade="true"
          mode="aspectFill"
          duration="450"
          :lazy-load="true"
        >
          <template v-slot:loading>
            <u-loading-icon></u-loading-icon>
          </template>
          <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
        </u-image>
        <view class="name u-line-2">
          {{ item.name }}
        </view>

        <view class="waterfall-item-price">
          <view class="val-retail">
            <view class="val">
              <text>{{ $t('Retail price') }}：</text>
              <text>￥{{ item.skus[0].price }}</text>
            </view>
            <view class="num" v-if="false"> 8000+{{ $t('people paid') }} </view>
          </view>

          <view class="val val-wholesale" v-if="item.wholesalePrice > 0">
            <view>
              <text>{{ $t('Wholesale price') }}：</text>
              <text>{{ item.currency.symbol }} {{ item.wholesalePrice }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
  </view>
</template>

<script>
const IndexServer = require('../../common/store/indexServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
  data() {
    return {
      inputStyle: {
        height: '88rpx',
      },
      btnCustomStyle: {
        width: '88rpx',
        height: '50rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
        color: '#FFF',
        fontSize: '24rpx',
        margin: 0,
      },
      sortList: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: true,
      searchData: '',
    };
  },
  onLoad() {
    this.getClientList();
  },
  methods: {
    routerDetails(id) {
      uni.$u.route({
        url: 'pages/details/details',
        params: {
          spuId: id,
        },
      });
    },
    search(val) {
      let that = this;
      that.searchData = val;
      that.page = 1;
      that.sortList = [];
      that.isShowDefaultPage = false;
      that.getClientList();
    },
    routerShop(storeId) {
      uni.$u.route({
        url: '/pages/shop/shop',
        params: {
          storeId: storeId,
        },
      });
    },

    // 获取商品列表
    getClientList() {
      let that = this;
      let goodsId = '';
      let params = {
        page: that.page,
        pageSize: that.pageSize,
        name: that.searchData,
      };
      IndexServer.getClientGoods(goodsId, params, {
        success(res) {
          let sortList = res.data.result;
          if (sortList == null || sortList.length <= 0) {
            that.sortList = [];
            that.page = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.sortList = that.sortList.concat(sortList);
          that.total = res.data.total;
          // that.page = res.page;
          that.isShowDefaultPage = false;
          uni.stopPullDownRefresh();
        },
        fail(err) {
          console.log(err);
          uni.stopPullDownRefresh();
        },
      });
    },
  },
  onPullDownRefresh() {
    this.sortList = [];
    this.page = 1;
    this.searchData = '';
    this.getClientList();
  },
  onReachBottom() {
    if (this.sortList.length >= this.total) {
      return;
    }
    this.page = this.sortList.length < this.total ? this.page + 1 : this.page;
    this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 40rpx 24rpx 0 24rpx;

  .search {
    width: 100%;
    margin-bottom: 24rpx;
  }

  .sort {
    padding: 24rpx;
    background-color: #fff;
    border-radius: 12rpx;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 316rpx;
      max-height: 472rpx;
      border-radius: 16rpx;
      background-color: #fff;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
    }

    &-item:nth-of-type(2n) {
      margin-right: 0;
    }

    .name {
      color: #333;
      font-size: 28rpx;
      margin: 12rpx 0;
      line-height: 36rpx;
    }

    .price {
      color: #d30019;
      font-size: 28rpx;
      line-height: 36rpx;
    }

    .waterfall-item-price-discuss {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .val {
      color: #ff5f00;
      font-size: 24rpx;
    }

    .val-retail {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .num {
        color: #aaa;
        font-size: 20rpx;
      }
    }

    .val-wholesale {
      display: flex;
      justify-content: space-between;
      color: #ff5f00;
      font-size: 24rpx;
    }
  }
}
</style>
