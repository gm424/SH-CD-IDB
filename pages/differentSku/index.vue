<template>
  <view>
    <view class="container">
      <view class="sort" v-if="!isShowDefaultPage">
        <view
          class="sort-item shadow"
          v-for="(item, index) in sortListDefault"
          :key="index"
          @click="routerDetails(item.spu)"
        >
          <u-image
            width="100%"
            height="300rpx"
            :src="item.image"
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

          <view>
            <view class="waterfall-item__ft__price">
              <view class="val-retail">
                <view class="val">
                  <text>{{ $t('Retail price') }}：</text>
                  <!-- <text>{{ item.currency.symbol }} {{ item.price }}</text> -->
                  <text> {{ item.price }}</text>
                </view>
                <!-- <view class="num" v-if="false"> 8000+{{ $t('people paid') }} </view> -->
              </view>
            </view>
          </view>
        </view>
      </view>

      <u-divider text="上拉加载" textSize="20" v-if="showEmpty === '1' && !isShowDefaultPage"></u-divider>
      <u-loading-icon text="加载中" textSize="20" v-if="showEmpty === '2' && !isShowDefaultPage"></u-loading-icon>
      <u-divider text="到底啦" textSize="20" v-if="showEmpty === '3' && !isShowDefaultPage"></u-divider>
      <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
    </view>
  </view>
</template>

<script>
const IndexServer = require('../../common/store/indexServer.js');
const FindServer = require('../../common/store/findServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
  data() {
    return {
      bg: `${host}/public/tabbar/find/findbg.png`,
      bgColor: '#3970bf',
      listTabs: [],
      indicator: false,
      // 热门话题

      sortList: [],
      tag: null,
      warehouse_id: null,
      sortListDefault: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: false,
      categoryId: '',
      showEmpty: '1',
    };
  },

  onLoad(options) {
    this.tag = options.tag;
    this.warehouse_id = options.warehouse_id;
    console.log('options', this.tag, this.warehouse_id);
    this.getClientCategory();
    this.sortList = [];
    this.page = 1;
    this.getClientList();
  },
  methods: {
    getTopic() {
      let that = this;
      let type = 'topic'; // 话题
      let catId = '';
      FindServer.getFindClientCategory(type, catId, {
        success(res) {
          that.topicList = res.data;
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
    routerTopic(catId) {
      uni.$u.route({
        url: '/pages/topic/topic',
        params: {
          catId: catId,
        },
      });
    },
    routerDetails(id) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          spuId: id,
          from: 'find',
        },
      });
    },
    click(item) {
      let that = this;
      // console.log('item', item);
      that.categoryId = item.category;
      that.page = 1;
      that.sortList = [];
      that.getClientList();
    },
    // 获取分类详情
    getClientCategory() {
      let that = this;
      let params = {
        pageNum: 1,
        pageSize: 999,
      };
      IndexServer.getClientCategory(params, {
        success(res) {
          if (!uni.$u.test.array(res.data.result)) {
            uni.$u.toast(that.$t('Product category loading failed'));
            return;
          }

          res.data.result.map((i) => {
            i.name = i.name;
            i.value = i.category;
          });
          let all = { name: that.$t('all'), value: 0 };
          res.data.result.unshift(all);
          that.listTabs = res.data.result;
        },
        fail(res) {},
      });
    },
    // 获取商品列表
    getClientList() {
      let that = this;
      let goodsId = '';

      let params = {
        page: that.page,
        page_size: that.pageSize,
      };
      Object.assign(
        params,
        this.tag ? { tag: this.tag } : {},
        this.warehouse_id ? { warehouse_id: this.warehouse_id } : {}
      );
      if (that.categoryId) {
        params.category = that.categoryId;
      }
      IndexServer.getClientGoods(goodsId, params, {
        success(res) {
          let sortList = res.data.result;

          if (sortList == null || sortList.length <= 0) {
            that.showEmpty = '3';

            that.sortList = [];
            that.page = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.sortListDefault = [];
          that.sortList = that.sortList.concat(sortList);
          that.sortList.forEach((item) => {
            item.skus.forEach((element) => {
              if (element.is_default) {
                element.name = item.name;
                element.image = item.images[0];
                that.sortListDefault.push(element);
              }
            });
          });

          that.total = res.data.total;

          // that.page = res.page;
          if (that.sortList.length > 0) {
            that.isShowDefaultPage = false;
          } else {
            that.isShowDefaultPage = true;
          }

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
    this.showEmpty = '1';
    this.getClientList();
  },
  onReachBottom() {
    console.log('onReachBottom', this.sortList.length, this.total);
    if (this.sortList.length >= this.total) {
      this.showEmpty = '3';
      return;
    }
    this.page = this.sortList.length < this.total ? this.page + 1 : this.page;
    this.showEmpty = '2';
    this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
.u-demo-block {
  height: 328rpx;
  margin: 24rpx 0;
}

page {
  position: relative;

  .nav {
    width: 100%;
    height: 108rpx;
    text-align: center;
    line-height: 108rpx;
    color: #fff;
    font-size: 36rpx;
    position: relative;
    z-index: 1;
    font-weight: bold;
  }

  .bg {
    width: 100%;
    background-size: 100% 100% !important;
    height: 296rpx;
    position: absolute;
    top: 0;
    z-index: 0;
  }
}

.tabs {
  position: relative;
  z-index: 0;
}

.topic-pl {
  padding: 12rpx 24rpx 24rpx 24rpx;
  position: relative;
  z-index: 0;
  width: 100%;

  .topic {
    border-radius: 12rpx;
    width: 100%;
    height: auto;
    background-color: #fff;
    box-shadow: 0px 4rpx 14rpx rgba(218, 218, 218, 0.5);
    padding: 32rpx 32rpx 12rpx 24rpx;

    &_tit {
      display: flex;
      align-items: baseline;

      &_text {
        color: #333;
        font-size: 36rpx;
        margin-right: 16rpx;
        font-weight: bold;
      }
    }

    &_des {
      color: #666;
      font-size: 28rpx;
    }

    .list {
      height: 324rpx;
      background-color: #fff;
      margin-right: 14rpx;
      padding-top: 32rpx;
      @include flex(column);
      position: relative;

      &_item {
        position: absolute;
        bottom: 20rpx;
        left: 20rpx;
        width: 412rpx;

        &_tit {
          color: #fff;
          font-size: 36rpx;
          margin-bottom: 20rpx;
        }

        &_des {
          @include flex();
          justify-content: space-between;

          text {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }
    }

    .list:last-child {
      margin-right: 0;
    }
  }
}

.container {
  padding: 14rpx;
  position: relative;
  z-index: 1;
  height: 100vh;
  background-color: #f5f5f5;
  .sort {
    padding: 14rpx;
    background-color: #f5f5f5;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 48%;
      min-height: 404rpx;
      border-radius: 16rpx;
      background-color: #fff;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
      padding: 12rpx;
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
      color: #ff5f00;
      font-size: 24rpx;
      line-height: 36rpx;
    }
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

  .waterfall-item__ft__price,
  .val-wholesale {
    display: flex;
    justify-content: space-between;
    color: #ff5f00;
    font-size: 24rpx;
  }
}
</style>
