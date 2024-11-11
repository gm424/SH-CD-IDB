<template>
  <view class="content">
    <view class="avatar">
      <u-avatar :src="userInfo.avatar" size="200rpx" style="margin-top: 20rpx"></u-avatar>
      <view class="name">
        <view class="name_text" @click="routeLogin" style="cursor: pointer">
          {{ userInfo.username ? userInfo.username : '未登录' }}
        </view>
        <image @click="routerInformation" class="name_icon" :src="button"></image>
      </view>
    </view>
    <view class="container">
      <view class="grid-container">
        <view class="grid-item wide">
          <view class="block-title">订单管理</view>
          <view class="order-grid">
            <view class="order-item" @click="routerOrderListManage">
              <u-icon name="shopping-cart" size="44rpx" color="#D4FC79"></u-icon>
              <text>{{ $t('My OrderList') }}</text>
            </view>
            <view class="order-item" @click="routerTmsOrderListManage">
              <u-icon name="car" size="44rpx" color="#FFB199"></u-icon>
              <text>物流订单</text>
            </view>
            <view class="order-item" @click="routerWmsOrderListManage">
              <u-icon name="home" size="44rpx" color="#A1C4FD"></u-icon>
              <text>海外仓订单</text>
            </view>
          </view>
        </view>
        <!-- <view class="grid-item wide">
          <view class="block-title">账户安全</view>
          <view class="block-content" @click="routerCertified">
            <view class="item-icon">
              <u-icon name="lock" size="44rpx" color="#4B79E4"></u-icon>
            </view>
            <text class="item-text">{{ $t('certified.certified') }}</text>
            <u-icon name="arrow-right" color="#999" size="32rpx"></u-icon>
          </view>
        </view> -->
        <view class="grid-item wide">
          <view class="block-title">我的资产</view>
          <view class="block-content" @click="routerPointList">
            <view class="item-icon">
              <u-icon name="integral" size="44rpx" color="#FF9A9E"></u-icon>
            </view>
            <text class="item-text">{{ $t('point.pointList') }}</text>
          </view>
        </view>
        <!-- <view class="grid-item">
          <view class="block-title">账单明细</view>
          <view class="block-content" @click="routerBillingList">
            <view class="item-icon">
              <u-icon name="wallet" size="24rpx" color="#A8EDEA"></u-icon>
            </view>
            <text class="item-text">{{ $t('billing.BillingDetail') }}</text>
          </view>
        </view> -->

        <view class="grid-item service-grid">
          <view class="block-title">其他服务</view>
          <view class="service-list">
            <view class="service-item" @click="routerCollect">
              <u-icon name="heart" size="44rpx" color="#96FBC4"></u-icon>
              <text>{{ $t('My Collection') }}</text>
            </view>
            <view class="service-item" @click="routerAddress">
              <u-icon name="map" size="44rpx" color="#F9D976"></u-icon>
              <text>地址管理</text>
            </view>
            <view class="service-item" @click="routerFeedback">
              <u-icon name="edit-pen" size="44rpx" color="#4B79E4"></u-icon>
              <text>{{ $t('APP Feedback') }}</text>
            </view>
            <view class="service-item" @click="routerSet">
              <u-icon name="setting" size="44rpx" color="#999"></u-icon>
              <text>{{ $t('Set Up') }}</text>
            </view>
          </view>
        </view>
      </view>
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
      avatar: ``,
      button: `${host}/public/tabbar/mine/button.png`,
      shop: `${host}/public/tabbar/mine/shop.png`,
      firm: `${host}/public/tabbar/mine/Firm.png`,
      heart: `${host}/public/tabbar/mine/heart.png`,
      star: `${host}/public/tabbar/mine/star.png`,
      inquiry: `${host}/public/tabbar/mine/inquiry.png`,
      stroe: `${host}/public/tabbar/mine/stroe.png`,
      Frame: `${host}/public/tabbar/mine/Frame.png`,
      hot: `${host}/public/tabbar/mine/hot.png`,
      sortList: [],
      userInfo: {},
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: true,
      categoryId: '',
      btnCustomStyle: {
        width: '100%',
        height: '104rpx',
        background: 'radial-gradient(38.12% 93.75% at 50.00% 95.00%, #FFAC00 0%, #FF5F00 100%)',
        color: '#FFF',
        marginTop: '40rpx',
        fontWeight: 'Bold',
        borderRadius: '16rpx',
      },
    };
  },
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {};
    console.log('this.userInfo', this.userInfo);
    this.sortList = [];
    this.pageNum = 1;
    // this.getClientList();
  },
  methods: {
    routerDetails(goodsId) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          goodsId: goodsId,
        },
      });
    },
    routerCollect() {
      uni.$u.route('/pages/collect/collect');
    },
    routerPointList() {
      uni.$u.route('/pages/point/point');
    },
    routerBillingList() {
      uni.$u.route('/pages/billing/billingDetail');
    },
    routerFous() {
      uni.$u.route('/pages/focus/focus');
    },
    routerOpenShop() {
      uni.$u.route('/pages/open_shop/open_shop');
    },
    routerSet() {
      uni.$u.route('/pages/set/set');
    },
    routerFeedback() {
      uni.$u.route('/pages/feedback/feedback');
    },
    routerAddress() {
      uni.$u.route({
        url: '/pages/Address/index',
        params: {
          from: 'mine',
        },
      });
    },
    routeLogin() {
      console.log('点击', this.userInfo.username);
      if (!this.userInfo.username) {
        uni.$u.route('/pages/login/login');
      }
    },
    routerInquiryManage() {
      uni.$u.route('/pages/inquiry/inquiry_manage');
    },
    routerOrderListManage() {
      uni.$u.route('/pages/order/orderList');
    },
    routerTmsOrderListManage() {
      uni.$u.route('/pages/orderTms/orderList');
    },
    routerWmsOrderListManage() {
      uni.$u.route('/pages/orderWms/orderList');
    },
    routerCertified() {
      uni.$u.route('/pages/certified/certified');
    },
    routerInformation() {
      uni.$u.route('/pages/information/information');
    },
    // 获取商品列表
    getClientList() {
      let that = this;
      let params = {
        pageNum: that.pageNum,
        pageSize: that.pageSize,
      };
      IndexServer.getMarketingRecommend(params, {
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
  // onPullDownRefresh() {
  //   this.sortList = [];
  //   this.pageNum = 1;
  //   this.getClientList();
  // },
  onReachBottom() {
    if (this.sortList.length >= this.total) {
      return;
    }
    this.pageNum = this.sortList.length < this.total ? this.pageNum + 1 : this.pageNum;
    // this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding-top: 20px;
  // 移除原有的蓝色背景
  &::before {
    display: none;
  }

  // 重新设计头像区域
  .avatar {
    position: relative;
    width: 100%;
    padding: 48rpx 32rpx;
    display: flex;
    align-items: center; // 改为横向布局
    gap: 32rpx;
    background: #fff;
    border-radius: 0 0 40rpx 40rpx;
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);

    // 添加装饰背景
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 10% 20%, rgba(75, 121, 228, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(255, 154, 158, 0.05) 0%, transparent 50%);
      border-radius: 0 0 40rpx 40rpx;
      z-index: 1;
      pointer-events: none;
    }

    // 头像样式
    :deep(.u-avatar) {
      width: 140rpx !important;
      height: 140rpx !important;
      border: 4rpx solid #fff;
      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
      position: relative;
      z-index: 2;

      // 添加光晕效果
      &::after {
        content: '';
        position: absolute;
        inset: -8rpx;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(75, 121, 228, 0.1) 0%, transparent 70%);
        animation: pulse 2s ease-in-out infinite;
      }
    }

    // 用户名区域
    .name {
      flex: 1;
      position: relative;
      z-index: 2;

      &_text {
        font-size: 36rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
        display: block;
      }

      // 编辑按钮
      &_icon {
        width: 48rpx;
        height: 48rpx;
        padding: 12rpx;
        background: #f8f9fa;
        border-radius: 50%;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        transition: all 0.3s ease;

        &:active {
          transform: translateY(-50%) scale(0.9);
          background: #f1f3f5;
        }
      }
    }
  }

  // 内容区域样式优化
  .container {
    position: relative;
    z-index: 1;
    padding: 14rpx;

    .cell {
      background: #fff;
      border-radius: 24rpx;
      overflow: hidden;
      box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);
      margin-bottom: 24rpx;

      :deep(.u-cell) {
        &__body {
          padding: 32rpx 24rpx;
        }

        &__left-icon-wrap {
          width: 48rpx;
          height: 48rpx;
          background: #f8f9fa;
          border-radius: 12rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 24rpx;
          transition: all 0.3s ease;
        }

        &__title {
          font-size: 28rpx;
          color: #333;
          font-weight: 500;
        }

        &:active {
          background: #f8f9fa;

          .u-cell__left-icon-wrap {
            transform: scale(0.95);
            background: #fff;
          }
        }
      }
    }
  }
}

// 添加动画
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10rpx;
  padding: 10rpx;
  width: 100%;
  .grid-item {
    background: #fff;
    border-radius: 24rpx;
    padding: 24rpx;
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    &.wide {
      grid-column: span 2;
    }

    &:active {
      transform: scale(0.98);
    }

    .block-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 20rpx;
      padding-left: 16rpx;
    }

    .block-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16rpx;

      .item-icon {
        width: 80rpx;
        height: 80rpx;
        background: #f8f9fa;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .item-text {
        flex: 1;
        margin-left: 16rpx;
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  // 订单管理网格
  .order-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16rpx;

    .order-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12rpx;
      padding: 20rpx;
      border-radius: 16rpx;
      background: #f8f9fa;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.95);
      }

      text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }

  // 其他服务网格
  .service-grid {
    grid-column: span 2;

    .service-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16rpx;

      .service-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        padding: 20rpx;
        border-radius: 16rpx;
        background: #f8f9fa;
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.95);
        }

        text {
          font-size: 26rpx;
          color: #333;
        }
      }
    }
  }
}
</style>
