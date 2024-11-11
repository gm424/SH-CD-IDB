<template>
  <view class="page">
    <!-- 顶部轮播图优化 -->
    <view class="swiper-section">
      <u-swiper
        width="750rpx"
        height="560rpx"
        imgMode="aspectFill"
        :list="goods.images"
        indicator
        indicatorMode="dot"
        circular
        class="custom-swiper"
      >
        <view class="swiper-overlay"></view>
      </u-swiper>
      <!-- 添加页码指示器 -->
    </view>

    <view class="content-wrapper">
      <!-- 商品信息卡片 -->
      <view class="detail-card">
        <!-- 价格区域 -->
        <view class="price-section">
          <view class="price-main">
            <text class="currency">{{ symbol }}</text>
            <text class="price">{{ goods.price }}</text>
            <view class="price-tags">
              <view class="price-tag" v-if="goods.isPromotion">限时特惠</view>
              <view class="price-tag original" v-if="goods.originalPrice">原价:￥{{ goods.originalPrice }}</view>
            </view>
          </view>
          <view class="price-extra">
            <view class="sales-count">
              <text class="label">月销量</text>
              <text class="value">{{ goods.salesCount || '1.2k' }}</text>
            </view>
            <view class="rating">
              <text class="label">好评率</text>
              <text class="value">{{ goods.rating || '98%' }}</text>
            </view>
          </view>
        </view>

        <!-- 标题区域 -->
        <view class="title-section">
          <view class="title-main">
            <view class="title-tags">
              <text class="tag" v-if="goods.isNew">新品</text>
              <text class="tag" v-if="goods.isHot">热销</text>
            </view>
            <text class="title">{{ goods.name }}</text>
          </view>
          <view class="subtitle" v-if="goods.subtitle">{{ goods.subtitle }}</view>
          <view class="action-buttons">
            <view class="action-btn share" @click="handleShare">
              <u-icon name="share" color="#999" size="40rpx"></u-icon>
              <text>分享</text>
            </view>
            <view class="action-btn" @click="userCollection(goods.id)" v-if="!goods.collects">
              <u-icon name="heart" :color="goods.collects ? '#ff5f00' : '#999'" size="40rpx"></u-icon>
              <text>收藏</text>
            </view>
            <view class="action-btn" @click="userCollectionDel(goods.id)" v-else>
              <u-icon name="heart-fill" color="#ff5f00" size="40rpx"></u-icon>
              <text>已收藏</text>
            </view>
          </view>
        </view>

        <!-- 优惠信息 -->
        <view class="promotion-section" v-if="goods.promotions && goods.promotions.length">
          <view class="section-title">优惠</view>
          <view class="promotion-list">
            <view class="promotion-item" v-for="(promo, index) in goods.promotions" :key="index">
              <text class="promo-tag">{{ promo.type }}</text>
              <text class="promo-text">{{ promo.desc }}</text>
            </view>
          </view>
        </view>

        <!-- 规格选择 -->
        <view class="spec-section" v-if="goods.specification">
          <view class="section-title">规格</view>
          <view class="spec-content">
            <view class="spec-item">
              <text class="spec-label">规格类型</text>
              <text class="spec-value">{{ goods.specification }}</text>
            </view>
            <view class="spec-item" v-if="goods.weight">
              <text class="spec-label">商品重量</text>
              <text class="spec-value">{{ goods.weight }}kg</text>
            </view>
            <view class="spec-item" v-if="goods.size">
              <text class="spec-label">商品尺寸</text>
              <text class="spec-value">{{ goods.size }}</text>
            </view>
          </view>
        </view>

        <!-- 服务保障 -->
        <view class="service-section">
          <view class="section-title">服务</view>
          <view class="service-list">
            <view class="service-item">
              <u-icon name="checkmark-circle" color="#52c41a" size="28rpx"></u-icon>
              <text>正品保障</text>
            </view>
            <view class="service-item">
              <u-icon name="checkmark-circle" color="#52c41a" size="28rpx"></u-icon>
              <text>极速发货</text>
            </view>
            <view class="service-item">
              <u-icon name="checkmark-circle" color="#52c41a" size="28rpx"></u-icon>
              <text>售后无忧</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 店铺信息卡片 -->
      <view class="shop-card" v-if="userStore" @click="routerShop">
        <view class="shop-info">
          <u-image width="120rpx" height="120rpx" :src="userStore.storeLogo" radius="12rpx" mode="aspectFill"></u-image>
          <view class="shop-detail">
            <text class="shop-name">{{ goods.store.name }}</text>
            <view class="shop-stats">
              <view class="stat-item">
                <text class="label">商品</text>
                <text class="value">2000+</text>
              </view>
              <view class="stat-item">
                <text class="label">好评</text>
                <text class="value">98%</text>
              </view>
              <view class="stat-item">
                <text class="label">关注</text>
                <text class="value">5.2w</text>
              </view>
            </view>
          </view>
          <view class="enter-shop">
            <u-icon name="arrow-right" color="#999" size="32rpx"></u-icon>
          </view>
        </view>
      </view>

      <!-- 商品详情区域 -->
      <view class="detail-section">
        <view class="section-header">
          <text class="section-title">商品详情</text>
          <view class="divider"></view>
        </view>
        <view class="detail-content">
          <u-parse :content="goods.locales[0] ? goods.locales[0].description : ''"></u-parse>
          <u-parse :content="goods.detailMobileHtml"></u-parse>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="footer-action">
      <view class="action-group">
        <view class="action-item shop" @click="routerShop">
          <u-icon name="home" size="40rpx" color="#666"></u-icon>
          <text>店铺</text>
        </view>
        <view class="action-item cart" @click="routeToCart()">
          <u-icon name="shopping-cart" size="40rpx" color="#666"></u-icon>
          <text>购物车</text>
        </view>
      </view>
      <view class="button-group">
        <u-button class="buyBtnStyle" @click="AddToCart" text="加入购物车" style="margin-right: 10px"></u-button>

        <u-button class="buyBtnStyle" @click="orderNow" text="立即购买"></u-button>
      </view>
    </view>

    <!-- 订单详情弹窗 -->
    <orderDetailsModal
      ref="orderDetailsModal"
      :submitType="submitType"
      :goods="goods"
      :skuDefaultCover="skuDefaultCover"
      :type="from"
    ></orderDetailsModal>

    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<style lang="scss" scoped>
.page {
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 180rpx;
}

.swiper-section {
  position: relative;

  .custom-swiper {
    border-radius: 0 0 32rpx 32rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .swiper-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 160rpx;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
  }

  .custom-indicator {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    padding: 8rpx 24rpx;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 24rpx;
    backdrop-filter: blur(4px);

    text {
      color: #fff;
      font-size: 24rpx;
    }
  }
}

.content-wrapper {
  padding: 24rpx;
}

.detail-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .price-section {
    margin-bottom: 24rpx;

    .price-main {
      display: flex;
      align-items: baseline;
      margin-bottom: 16rpx;

      .currency {
        color: #ff5f00;
        font-size: 32rpx;
        margin-right: 4rpx;
      }

      .price {
        color: #ff5f00;
        font-size: 48rpx;
        font-weight: 600;
      }

      .price-tags {
        display: flex;
        align-items: center;
        margin-left: 16rpx;
        gap: 8rpx;

        .price-tag {
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
          font-size: 24rpx;

          &:not(.original) {
            background: rgba(255, 95, 0, 0.1);
            color: #ff5f00;
          }

          &.original {
            background: #f5f5f5;
            color: #999;
            text-decoration: line-through;
          }
        }
      }
    }

    .price-extra {
      display: flex;
      gap: 32rpx;

      .sales-count,
      .rating {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .label {
          font-size: 24rpx;
          color: #999;
        }

        .value {
          font-size: 24rpx;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }

  .title-section {
    margin-bottom: 24rpx;
    display: flex;

    flex-direction: row;
    justify-content: space-between;

    .title-main {
      display: flex;
      align-items: flex-start;
      gap: 12rpx;
      margin-bottom: 8rpx;

      .title-tags {
        display: flex;
        gap: 8rpx;

        .tag {
          padding: 4rpx 8rpx;
          background: #fff2e8;
          color: #ff5f00;
          font-size: 20rpx;
          border-radius: 4rpx;
        }
      }

      .title {
        flex: 1;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        line-height: 1.5;
      }
    }

    .subtitle {
      font-size: 26rpx;
      color: #666;
      margin-bottom: 16rpx;
    }

    .action-buttons {
      display: flex;
      gap: 32rpx;
      justify-content: flex-end;

      .action-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4rpx;

        text {
          font-size: 20rpx;
          color: #999;
        }

        &.share {
          position: relative;

          &::after {
            content: '';
            position: absolute;
            right: -16rpx;
            top: 4rpx;
            bottom: 4rpx;
            width: 1px;
            background: #eee;
          }
        }
      }
    }
  }

  .promotion-section,
  .spec-section,
  .service-section {
    padding: 24rpx 0;
    border-top: 1px solid #f5f5f5;

    .section-title {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 16rpx;
    }
  }

  .promotion-section {
    .promotion-list {
      display: flex;
      flex-direction: column;
      gap: 12rpx;

      .promotion-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .promo-tag {
          padding: 2rpx 8rpx;
          background: #fff2e8;
          color: #ff5f00;
          font-size: 20rpx;
          border-radius: 4rpx;
        }

        .promo-text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }

  .spec-section {
    .spec-content {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;

      .spec-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .spec-label {
          font-size: 24rpx;
          color: #999;
        }

        .spec-value {
          font-size: 24rpx;
          color: #333;
        }
      }
    }
  }

  .service-section {
    .service-list {
      display: flex;
      gap: 32rpx;

      .service-item {
        display: flex;
        align-items: center;
        gap: 4rpx;

        text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.shop-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .shop-info {
    display: flex;
    align-items: center;

    .shop-detail {
      flex: 1;
      margin-left: 24rpx;

      .shop-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
      }

      .shop-stats {
        display: flex;
        gap: 32rpx;

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;

          .label {
            font-size: 24rpx;
            color: #999;
          }

          .value {
            font-size: 24rpx;
            color: #333;
            font-weight: 500;
          }
        }
      }
    }

    .enter-shop {
      padding: 16rpx;
    }
  }
}

.detail-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-right: 16rpx;
    }

    .divider {
      flex: 1;
      height: 1px;
      background: #eee;
    }
  }

  .detail-content {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.footer-action {
  max-width: 430px;
  margin: 0 auto;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16rpx 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

  .action-group {
    display: flex;
    gap: 48rpx;
    margin-right: 24rpx;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4rpx;
      position: relative;
      padding: 8rpx 16rpx;
      transition: all 0.3s ease;

      // 添加点击效果
      &:active {
        transform: scale(0.95);
      }

      text {
        font-size: 20rpx;
        color: #666;
      }

      // 添加图标动效
      .u-icon {
        transition: all 0.3s ease;
      }

      &:hover {
        .u-icon {
          transform: translateY(-2rpx);
        }
      }
    }
  }

  .button-group {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
  .buyBtnStyle {
    width: 90%; // 调整宽度
    height: 70rpx;
    background: linear-gradient(135deg, #ecd29a 0%, #e09641 100%) !important;
    border: none !important;
    color: #fff !important;
    border-radius: 40rpx !important;
    font-weight: 600;
    box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.2);
    transition: all 0.3s ease;

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 2rpx 6rpx rgba(255, 77, 79, 0.15);
    }
  }
}

// 按钮样式
.cartBtnStyle {
  flex: 1;
  height: 80rpx;
  background: #fff !important;
  border: 2rpx solid #ff5f00 !important;
  color: #ff5f00 !important;
  border-radius: 40rpx !important;
  font-weight: 600;
}

// 添加动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-card,
.shop-card,
.detail-section {
  animation: fadeIn 0.6s ease-out;
}
</style>

<script>
import { currencyTpyes } from '../../common/utils/constant.js';
const ServiceUtil = require('../../common/utils/serviceUtil.js');
const indexServer = require('../../common/store/indexServer.js');
const Validate = require('../../common/utils/validate.js');
const Api = require('../../common/store/api.js');
import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
const uniShare = new UniShare();
const host = Api.host;
import orderDetailsModal from '../../widgets/orderDetailsModal.vue';
import commonButton from '@/components/myButton/commonButton.vue';

export default {
  data() {
    return {
      share: `${host}/public/details/share.png`,
      collect: `${host}/public/details/collect.png`,
      collect1: `${host}/public/details/collect1.png`,
      inquiry: `${host}/public/details/inquiry.png`,
      consult: `${host}/public/details/consult.png`,
      src: `${host}/public/login/logo.png`,
      show: false,
      submitType: '',
      safeArea: '',
      customCartBtn: {
        width: '100%',
        height: '74rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #fceddc 0%,  #f7ae64 100%)',
        color: '#FFF',
        marginTop: '10rpx',
        fontWeight: 'Bold',
        borderTopLeftRadius: '28rpx',
        borderBottomLeftRadius: '28rpx',
      },
      customBtn: {
        width: '100%',
        height: '74rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #fceddc 0%,  #f7ae64 100%)',
        color: '#FFF',
        marginTop: '10rpx',
        fontWeight: 'Bold',
        borderTopRightRadius: '28rpx',
        borderBottomRightRadius: '28rpx',
      },
      spuId: '',
      from: '',
      goods: {
        locales: [],
        store: {},
      },
      userStore: {
        storeName: 'Apple',
        storeLogo: 'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/极网LOGO_1731065287394.png',
      },
      storeId: '',
      symbol: '',
      // 是否显示组件
      skuShow: false,
      // isShowSkuLogo: true, // 普通sku or 带图sku
      skuNums: null, // 所选产品的库存数量
      skuDefaultCover: '', // sku默认图片
    };
  },
  components: {
    orderDetailsModal,
    commonButton,
  },
  onLoad(options) {
    this.spuId = options.spuId;
    this.from = options.from;
    const systemInfo = uni.getSystemInfoSync();
    this.safeArea = systemInfo.screenHeight - systemInfo.safeArea.bottom;
    console.log('安全距离', this.safeArea);
    this.getClientGoodsDetail();
  },
  methods: {
    // sku发生改变事件, 选择完整的sku则回返回 否则sku的值为{}
    skuChange(e) {
      // console.log('e', e);
      this.skuNums = e.stock;
    },
    // 输入框内数量发生改变时触发事件
    numChange(e) {
      // console.log('e', e);
      if (this.skuNums && this.skuNums == e) {
        uni.showToast({
          title: this.$t('Insufficient inventory'),
          duration: 2500,
          icon: 'none',
        });
      }
    },
    routeToCart() {
      uni.switchTab({
        url: '/pages/tabbar/cart',
      });
    },
    // sku确认事件
    skuConfirm(e) {
      // console.log('e', e);
      this.skuShow = false;
      uni.$u.route({
        url: 'pages/inquiry/inquiry',
        params: {
          goodsName: this.goods.goodsName,
          categoryId: this.goods.categoryId,
          goodsId: this.goods.goodsId,
          num: e.num,
          specification: e.skuText.toString(),
          skuId: e.sku.id,
        },
      });
    },
    contactService(storeId) {
      if (Validate.isEmply(storeId)) {
        uni.showToast({
          title: this.$t('The store is abnormal and cannot contact customer service'),
          duration: 2500,
          icon: 'none',
        });
        return;
      }
      let goods = {
        storeId: storeId,
      };
      ServiceUtil.openServiceFromGoodsDetailContact(goods);
    },
    uniShare() {
      let that = this;
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: 'https://www.ccmg.cn/',
            title: '数城科技',
            summary: that.goods.goodsName,
            imageUrl: that.src,
          },
          menus: [
            {
              img: '/static/app-plus/sharemenu/wechatfriend.png',
              text: '微信好友',
              share: {
                //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
                provider: 'weixin',
                scene: 'WXSceneSession',
              },
            },
            {
              img: '/static/app-plus/sharemenu/wechatmoments.png',
              text: '微信朋友圈',
              share: {
                provider: 'weixin',
                scene: 'WXSceneTimeline',
              },
            },
          ],
          cancelText: '取消分享',
        },
        (e) => {
          //callback
          console.log(uniShare.isShow);
          console.log(e);
        }
      );
    },
    userCollection(spu_id) {
      let that = this;
      indexServer.userCollection(spu_id, {
        success(res) {
          uni.$u.toast('收藏成功！');
          that.getClientGoodsDetail();
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    userCollectionDel(objId) {
      let that = this;

      indexServer.userCollection(objId, {
        success(res) {
          uni.$u.toast('取消收藏成功！');
          that.getClientGoodsDetail();
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    getClientGoodsDetail() {
      let that = this;
      let spuId = that.spuId;
      // let goodsId = 7
      let params = {
        spu_id: spuId,
      };
      indexServer.getClientGoodsDetail(spuId, params, {
        success(res) {
          let data = res?.data;
          console.log('详情页', data);
          // uni.setStorageSync(currencyTpyes, data.currency.symbol);
          uni.setStorageSync(currencyTpyes, '￥');
          that.goods = data;
          // that.skuDefaultCover = data.images[0];
          let skuDefaultCover = data.skus.filter((item) => item.is_default).map((item) => item.images[0]);

          that.skuDefaultCover = skuDefaultCover[0];
          console.log('默认sku图片', that.skuDefaultCover);
          that.storeId = that.goods.store.id;
          if (!uni.$u.test.isEmpty(that.goods.currency)) {
            // that.symbol = that.goods.currency.symbol;
            that.symbol = '￥';
          }
          if (!uni.$u.test.isEmpty(res.data.userStore)) {
            that.userStore = that.goods.userStore;
          }
        },
        fail(err) {
          uni.$u.toast(err.msg);
          setTimeout(() => {
            uni.navigateBack(1);
          }, 1000);
        },
      });
    },
    routerShop() {
      uni.$u.route({
        url: '/pages/shop/shop',
        params: {
          storeId: this.storeId,
          store: JSON.stringify(this.goods.store),
        },
      });
    },
    AddToCart() {
      // 根据seller
      this.submitType = 'cart';
      this.$refs.orderDetailsModal.show = true;
      // 根据goodsId
      // this.submitType = 'cart';
      // let chosenSku = {
      //   count: 1,
      //   imgUrl: this.goods.images[0],
      //   shopName: this.goods.userStore.storeName,
      //   price: this.goods.price,
      //   name: this.goods.goodsName,
      //   jsin: this.goods.goodsId,
      // };
      // this.$store.dispatch('addToCart', chosenSku);
      // uni.$u.toast('已添加购物车');
    },
    orderNow() {
      this.submitType = 'order';
      this.$refs.orderDetailsModal.show = true;
      this.$refs.orderDetailsModal.goods = this.goods;
    },
    BuyNow() {
      // this.submitType = 'order';
      // this.$refs.orderDetailsModal.show = true;
      // this.$refs.orderDetailsModal.goods = this.goods;
      uni.showToast({
        title: '活动还未开始，请耐心等待~',
        duration: 2500,
        icon: 'none',
      });
    },
    // routerInquiry(goodsName, categoryId, goodsId) {
    // 	uni.$u.route({
    // 		url: 'pages/inquiry/inquiry',
    // 		params: {
    // 			goodsName: goodsName,
    // 			categoryId: categoryId,
    // 			goodsId: goodsId
    // 		}
    // 	});
    // }
  },

  onBackPress({ from }) {
    if (from == 'backbutton') {
      this.$nextTick(function () {
        uniShare.hide();
      });
      return uniShare.isShow;
    }
  },
};
</script>
