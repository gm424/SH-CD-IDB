<template>
  <view>
    <!-- #ifndef APP-NVUE || MP-TOUTIAO -->
    <view class="u-demo-block">
      <u-swiper
        :list="swiperList"
        @click="getSwiper"
        keyName="icon"
        height="100%"
        previousMargin="96rpx"
        nextMargin="96rpx"
        circular
        :autoplay="false"
        radius="5"
        bgColor="#ffffff"
      ></u-swiper>
    </view>
    <!-- #endif -->
    <view class="tabs shadow">
      <u-tabs
        :list="listTabs"
        lineColor="radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)"
        lineWidth="58rpx"
        lineHeight="8rpx"
        :activeStyle="{ color: '#2E5BB3', fontFace: '32rpx', fontWeight: 'bold' }"
        @click="click"
      ></u-tabs>
    </view>
    <view class="container">
      <view class="sort shadow" v-if="!isShowDefaultPage">
        <view class="sort-item" v-for="(item, index) in sortList" :key="index" @click="routerDetails(item.goodsId)">
          <u-image
            width="100%"
            height="300rpx"
            :src="item.images[0]"
            :fade="true"
            mode="aspectFill"
            duration="850"
            :lazy-load="true"
          >
            <template v-slot:loading>
              <u-loading-icon></u-loading-icon>
            </template>
            <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
          </u-image>
          <view class="name u-line-2">
            {{ item.goodsName }}
          </view>
          <view class="waterfall-item-price-discuss" v-if="item.price <= 0 && item.wholesalePrice <= 0">
            <view class="val">
              <text></text>
              <text>{{ $t('Price negotiable') }}</text>
            </view>
          </view>
          <view class="waterfall-item-price" v-else>
            <view class="val-retail" v-if="item.price > 0">
              <view class="val">
                <text>{{ $t('Retail price') }}：</text>
                <text>{{ item.currency.symbol }} {{ item.price }}</text>
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
  </view>
</template>
<script>
import mixin from '@/mixins/index';
const IndexServer = require('../../common/store/indexServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
  mixins: [mixin.generalNavigateTo],
  data() {
    return {
      swiperList: [],
      listTabs: [],
      sortList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: true,
      categoryId: '',
      local: '',
    };
  },
  onLoad(options) {
    let { local } = options;
    this.local = local;
    console.log('local', local);
    this.getSpecial();
    this.getClientCategory();
    this.getClientList();
  },
  methods: {
    getSwiper(i) {
      console.log(i);
      let target = this.swiperList[i].target;
      let title = this.swiperList[i].title;
      this.navigateTo(target, title);
    },
    routerDetails(goodsId) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          goodsId: goodsId,
        },
      });
    },
    click(item) {
      let that = this;
      that.categoryId = item.catId;
      that.pageNum = 1;
      that.sortList = [];
      that.getClientList();
    },
    // 轮播图
    getSpecial() {
      let that = this;
      let type = 'banner_boutique'; // 轮播图
      let param = {};
      IndexServer.getHomeContent(param, type, {
        success(res) {
          that.swiperList = res.data;
          console.log('that.swiperList', that.swiperList);
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
    // 获取分类详情
    getClientCategory() {
      let that = this;
      IndexServer.getClientCategory({
        success(res) {
          if (!uni.$u.test.array(res.data)) {
            uni.$u.toast(that.$t('Product category loading failed'));
            return;
          }
          res.data.map((i) => {
            i.name = i.catName;
            i.value = i.catId;
          });
          let all = { name: that.$t('all'), value: 0 };
          res.data.unshift(all);
          that.listTabs = res.data;
        },
      });
    },
    // 获取商品列表
    getClientList() {
      let that = this;
      let goodsId = '';
      let params = {
        categoryId: that.categoryId,
        page: that.pageNum,
        page_size: that.pageSize,
        local: this.local,
      };
      IndexServer.getClientGoods(goodsId, params, {
        success(res) {
          let sortList = res.data;
          if (sortList == null || sortList.length <= 0) {
            that.sortList = [];
            that.pageNum = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.sortList = that.sortList.concat(sortList);
          that.total = res.total;
          // that.pageNum = res.pageNum;
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
    this.pageNum = 1;
    this.getClientList();
  },
  onReachBottom() {
    if (this.sortList.length >= this.total) {
      return;
    }
    this.pageNum = this.sortList.length < this.total ? this.pageNum + 1 : this.pageNum;
    this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
.u-demo-block {
  height: 328rpx;
  margin: 24rpx 0;
}

.container {
  padding: 24rpx;

  .sort {
    padding: 24rpx;
    background-color: #fff;
    border-radius: 12rpx;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 316rpx;
      min-height: 404rpx;
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
      @include flex();
      justify-content: space-between;
      align-items: center;

      &_text {
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

      &_num {
        color: #999;
        font-size: 12px;
      }
    }

    .waterfall-item-price {
      width: 100%;
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
