<template>
  <view class="container">
    <view class="card">
      <view class="card_item">
        <view class="card_item_info">
          <u-avatar src="https://i01.appmifile.com/webfile/globalimg/ruonan/PCmijia.jpg" size="80rpx"></u-avatar>
          <view class="card_item_info_c">
            <view class="card_item_info_c_name u-line-2" style="margin-left: 20rpx; font-size: 26rpx; font-weight: 600">
              {{ storeInfo.name }}
            </view>
            <view class="tags" v-if="false">
              <view class="tag" v-for="(item, index) in tags" :key="index">
                <!-- <u-tag size="mini" :text="item.text" :type="item.type" :icon="item.icon" shape="circle"></u-tag> -->
                {{ item.text }}
              </view>
            </view>
          </view>
          <block v-if="storeInfo.isCollect">
            <u-button
              :text="$t('Already following')"
              @click="userCollectionDel(storeInfo.id, storeInfo.storeName)"
              :customStyle="btnCustomStyleSel"
              shape="circle"
            ></u-button>
          </block>
          <block v-else>
            <u-button
              :text="$t('focus on')"
              @click="userCollection(storeInfo.id, storeInfo.storeName, storeInfo.storeLogo)"
              :customStyle="btnCustomStyle"
              shape="circle"
            ></u-button>
          </block>
        </view>
      </view>
      <u-divider lineColor="#F5F5F5"></u-divider>
    </view>
    <view class="introduce" v-if="storeInfo.description">
      <view class="introduce_tit">
        {{ $t('Company Introduction') }}
      </view>
      <view class="introduce_textarea">
        {{ storeInfo.description }}
      </view>
    </view>
    <view class="tabs" v-if="!isShowDefaultPage">
      <u-tabs
        :list="listTabs"
        @click="click"
        lineColor="radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)"
        lineWidth="58rpx"
        lineHeight="8rpx"
        :activeStyle="{ color: '#2E5BB3', fontFace: '32rpx' }"
      ></u-tabs>
    </view>

    <view class="sort">
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

        <block>
          <view class="price">
            <view class="price_text">
              <text>{{ $t('Retail price') }}：</text>
              <text>￥ {{ item.skus[0].price }}</text>
            </view>
            <view class="price_num" v-if="false">8000+{{ $t('people paid') }}</view>
          </view>
          <view class="val val-wholesale" v-if="item.wholesalePrice > 0">
            <view>
              <text>{{ $t('Wholesale price') }}：</text>
              <text>{{ item.currency.symbol }} {{ item.wholesalePrice }}</text>
            </view>
          </view>
        </block>
      </view>
    </view>
    <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
  </view>
</template>

<script>
const Api = require('../../common/store/api.js');
const indexServer = require('../../common/store/indexServer.js');
const host = Api.host;
export default {
  data() {
    return {
      tags: [],
      btnCustomStyle: {
        width: '160rpx',
        height: '50rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
        color: '#FFF',
        fontSize: '24rpx',
        margin: 0,
      },
      btnCustomStyleSel: {
        width: '180rpx',
        height: '50rpx',
        background: '#999',
        color: '#FFF',
        fontSize: '24rpx',
        margin: 0,
      },
      listTabs: [{ name: this.$t('all'), value: 0 }],
      sortList: [],
      storeInfo: {},
      categoryId: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: true,
    };
  },
  onLoad(options) {
    this.storeId = options.storeId;
    this.storeInfo = JSON.parse(options.store);
    console.log('店铺信息', JSON.parse(options.store));
    // this.getStoreInfo();
    // this.getClientCategory();
    this.getClientList();
  },
  methods: {
    userCollection(objId, title, icon) {
      // let that = this;
      // let params = {
      //   objId: objId,
      //   title: title,
      //   icon: icon,
      //   category: 'store',
      // };
      // indexServer.userCollection(params, {
      //   success(res) {
      //     uni.$u.toast(res.msg);
      //     that.getStoreInfo();
      //   },
      //   fail(err) {
      //     uni.$u.toast(err);
      //   },
      // });
      uni.showToast({
        title: '关注成功',
        icon: 'none',
        duration: 2500,
      });
    },
    userCollectionDel(objId) {
      let that = this;
      let params = {
        objId: objId,
        category: 'store',
      };
      indexServer.userCollectionDel(params, {
        success(res) {
          uni.$u.toast(res.msg);
          that.getStoreInfo();
        },
        fail(err) {
          uni.$u.toast(err);
        },
      });
    },
    click(item) {
      let that = this;
      that.categoryId = item.catId;
      that.pageNum = 1;
      that.sortList = [];
      that.getStoreInfo();
    },
    routerDetails(id) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          spuId: id,
        },
      });
    },
    // 店铺详情
    getStoreInfo() {
      let that = this;
      let param = {
        storeId: that.storeId,
      };
      indexServer.getStoreInfo(param, {
        success(res) {
          that.storeInfo = res.data;
        },
        fail(err) {},
      });
    },

    // 获取指定店铺下分类列表
    getClientCategory() {
      let that = this;
      let type = that.storeId;
      indexServer.getStoreCategory(type, {
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
        page: that.pageNum,
        page_size: that.pageSize,
        store_id: that.storeId,
      };
      indexServer.getClientGoods(goodsId, params, {
        success(res) {
          let sortList = res.data.result;
          if (sortList == null || sortList.length <= 0) {
            that.sortList = [];
            that.pageNum = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.sortList = that.sortList.concat(sortList);
          that.total = res.data.total;
          // that.pageNum = res.pageNum;
          that.isShowDefaultPage = false;
          uni.stopPullDownRefresh();
        },
        fail(err) {
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
.container {
  padding: 40rpx 24rpx 0 24rpx;

  .card {
    width: 100%;
    @include flex(column);
    // @include flex(row);

    &_item {
      width: 100%;
      background-color: #fbfbfd;
      border-radius: 12rpx;
      padding: 24rpx 32rpx 0 24rpx;

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

      .list:last-child {
        margin-right: 0;
      }
    }

    /deep/ .u-divider {
      margin: 24rpx 0;
    }
  }

  .introduce {
    width: 100%;

    // @include flex();

    &_tit {
      width: 100%;
      color: #333;
      font-size: 36rpx;
      margin-bottom: 24rpx;
    }

    &_textarea {
      width: 100%;
      color: #999;
      font-size: 28rpx;
      line-height: 30rpx;
      min-height: 192rpx;
      background: #f4f6f8;
      border-radius: 12rpx;
      padding: 24rpx;
      letter-spacing: 2rpx;
    }
  }

  .tabs {
    width: 100%;
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

        text {
          font-size: 24rpx;
        }

        // text:first-child {
        // 	font-size: 16rpx;
        // }

        text:nth-of-type(2) {
          font-size: 24rpx;
          // margin-right: 6rpx;
          display: inline-block;
        }

        // text:last-child {
        // 	font-size: 20rpx;
        // }
      }

      &_num {
        color: #999;
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
