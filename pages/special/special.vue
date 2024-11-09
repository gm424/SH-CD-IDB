<template>
  <view>
    <!-- #ifndef APP-NVUE || MP-TOUTIAO -->
    <view class="u-demo-block">
      <u-swiper
        :list="swiperList"
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
    <view class="container">
      <view class="sort shadow">
        <view class="sort-item" v-for="(item, index) in specialList" :key="index" @click="routerDetails(item.goodsId)">
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
            {{ item.goodsName }}
          </view>
          <view class="price">
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
      </view>
      <u-empty :show="isShowDefaultPage" text="没有数据哟" margin-top="300"></u-empty>
    </view>
  </view>
</template>

<script>
const indexServer = require('../../common/store/indexServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
  data() {
    return {
      swiperList: [],
      specialList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: true,
    };
  },
  onLoad() {
    this.getClientMarketingSpecial();
    this.getSpecial();
  },
  methods: {
    routerDetails(goodsId) {
      uni.$u.route({
        url: 'pages/details/details',
        params: {
          goodsId: goodsId,
        },
      });
    },
    click(item) {
      console.log('item', item);
    },
    getClientMarketingSpecial() {
      let that = this;
      let params = {
        pageNum: that.pageNum,
        pageSize: that.pageSize,
      };
      indexServer.getClientMarketingSpecial(params, {
        success(res) {
          let specialList = res.data;
          if (specialList == null || specialList.length <= 0) {
            that.specialList = [];
            that.pageNum = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.specialList = that.specialList.concat(specialList);
          that.total = res.total;
          // that.pageNum = res.pageNum;
          that.isShowDefaultPage = false;
          uni.stopPullDownRefresh();
        },
        fail(err) {
          uni.stopPullDownRefresh();
        },
      });
    },
    // 轮播图
    getSpecial() {
      let that = this;
      let type = 'banner_special'; // 轮播图
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.swiperList = res.data;
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
  },
  onPullDownRefresh() {
    this.specialList = [];
    this.pageNum = 1;
    this.getClientMarketingSpecial();
  },
  onReachBottom() {
    if (this.specialList.length >= this.total) {
      return;
    }
    this.pageNum = this.specialList.length < this.total ? this.pageNum + 1 : this.pageNum;
    this.getClientMarketingSpecial();
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
      height: 404rpx;
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
          font-size: 24rpx;
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
}
</style>
