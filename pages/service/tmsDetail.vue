<template>
  <view class="page">
    <fillInAddress :address="address" @click="addAddress"></fillInAddress>

    <view class="service-card animate__animated animate__fadeInUp" :style="{ animationDelay: 1 * 0.1 + 's' }">
      <view class="card-content">
        <view class="card-header">
          <view class="title-area">
            <text class="card-title">{{ sku }}</text>
            <view class="status-tag" :class="getRandomStatus().class">
              {{ getRandomStatus().text }}
            </view>
          </view>
          <view class="price-area">
            <text class="price-label">{{ $t('Retail price') }}：</text>
            <text class="price-value">{{ price }}</text>
          </view>
        </view>

        <view class="card-body">
          <view class="features">
            <view class="feature-item" v-for="(feature, fIndex) in getRandomFeatures()" :key="fIndex">
              <text class="iconfont" :class="feature.icon"></text>
              <text>{{ feature.text }}</text>
            </view>
          </view>

          <view class="stats-row">
            <view class="stat-item">
              <text class="iconfont icon-eye"></text>
              <text>{{ Math.floor(Math.random() * 1000) + 100 }}次浏览</text>
            </view>
            <view class="stat-item">
              <text class="iconfont icon-star"></text>
              <text>{{ (Math.random() * 2 + 3).toFixed(1) }}分</text>
            </view>
          </view>
        </view>

        <view class="card-footer">
          <view class="tags">
            <text class="tag" v-for="(tag, tIndex) in getRandomTags()" :key="tIndex">{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="tabbar">
      <view class="tabbar_item"> </view>
      <view class="tabbar_item">
        <u-button :customStyle="customBtn" @click="orderNow" :text="$t('Buy now')"></u-button>
      </view>
    </view>
    <AddressModal ref="addressModal" @choose="chooseAddress"></AddressModal>
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>
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
import fillInAddress from '@/widgets/address/fillInAddress.vue';
import AddressModal from './components/addAddress.vue';
export default {
  data() {
    return {
      address: '请选择收货地址',
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
        borderRadius: '28rpx',
      },
      spuId: '',
      sku: '',
      price: '',
      from: '',
      goods: {
        locales: [],
        store: {},
      },
      model: {
        shipping_address_1: '',
        shipping_address_2: '',
        shipping_city: '',
        shipping_contactName: '',
        shipping_country: '',
        shipping_email: '',
        shipping_phone: '',
        shipping_province: '',
        shipping_zipcode: '',
        store_id: 1,
      },
      userStore: {
        storeName: 'Apple',
        storeLogo:
          'https://tec.vlanddigital.com/statics/O1CN01WtWAVt1gJvLUd7ziZ___2258784122-0-cib_20231101162938A204.png',
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
    fillInAddress,
    AddressModal,
  },
  onLoad(options) {
    this.id = options.id;
    this.from = options.from;
    this.sku = options.sku;
    this.price = options.price;
    this.model = options.address;
    this.store_id = options.store_id;
    console.log('地址', this.model);
  },
  methods: {
    // sku发生改变事件, 选择完整的sku则回返回 否则sku的值为{}
    skuChange(e) {
      // console.log('e', e);
      this.skuNums = e.stock;
    },
    addAddress() {
      // uni.$u.route({
      //   url: '/pages/Address/index',
      //   params: {
      //     from: 'order',
      //   },
      // });
      this.$refs.addressModal.show = true;
    },
    chooseAddress(formData) {
      this.model = formData;
      console.log('选择', this.model);
      this.address = this.model.shipping_contactName + ' ' + this.model.shipping_address_1;
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
    getRandomStatus() {
      const statuses = [
        { text: '热销中', class: 'status-hot' },
        { text: '优选', class: 'status-premium' },
        { text: '新品', class: 'status-new' },
        { text: '推荐', class: 'status-recommend' },
      ];
      return statuses[1 % statuses.length];
    },

    getRandomFeatures() {
      const features = [
        { icon: 'icon-shield', text: '正品保障' },
        { icon: 'icon-truck', text: '极速发货' },
        { icon: 'icon-diamond', text: '优质服务' },
        { icon: 'icon-like', text: '好评如潮' },
      ];
      return features.slice(0, 2 + Math.floor(Math.random() * 2));
    },

    getRandomTags() {
      const allTags = ['超值', '品质优选', '热卖', '限时特惠', '明星产品', '口碑好评'];
      const count = 2 + Math.floor(Math.random() * 2);
      const shuffled = [...allTags].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
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
        },
        fail(err) {
          uni.$u.toast(err.msg);
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
      let params = {
        items: [
          {
            items: [
              {
                id: this.id,
                quantity: 1,
                variants: {},
              },
            ],
            store_id: this.store_id,
            address_id: this.model.id,
          },
        ],
      };
      indexServer.orderTms(params, {
        success(res) {
          uni.$u.toast('下单成功！');
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
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
<style lang="scss" scoped>
.page {
  position: relative;
  padding-bottom: 92rpx;
  background-color: #f5f5f5;
  height: 100vh;
  padding: 10px;
  .container {
    padding: 0 24rpx;

    .detail {
      width: 100%;
      max-height: 200rpx;
      border-radius: 12rpx;
      background-color: #fff;
      margin-top: -6px;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      padding: 24rpx 24rpx 10rpx 24rpx;
      flex-direction: column;

      &_l {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &_name {
          color: #333;
          font-size: 36rpx;
        }

        &_sku {
          color: #303133;
          font-size: 28rpx;
        }
      }

      &_r {
        display: flex;

        justify-content: space-between;

        &_price {
          color: #ff5f00;
          font-size: 36rpx;
        }

        &_icons {
          height: 48rpx;

          &_icon {
            width: 48rpx;
            height: 48rpx;
            margin-right: 28rpx;
          }

          &_icon:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .shop {
      width: 100%;
      height: 200rpx;
      border-radius: 12rpx;
      padding: 40rpx 24rpx 40rpx 16rpx;
      margin-top: 24rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &_info {
        width: 414rpx;
        height: 120rpx;
        display: flex;

        &_text {
          width: 314rpx;
          margin-left: 26rpx;

          &_title {
            width: 100%;
            height: 80rpx;
            font-size: 32rpx;
            line-height: 40rpx;
            margin-bottom: 8rpx;
            color: #666;
          }

          &_rate {
            display: flex;
            align-items: center;

            &_text {
              color: #666;
              font-size: 24rpx;
              line-height: 40rpx;
              margin-right: 20rpx;
            }
          }
        }
      }
    }

    .u-content {
      margin-top: 24rpx;
      font-size: 24rpx;
      color: #9e9c9c;
    }
  }

  .tabbar {
    position: fixed;
    bottom: 0rpx;
    left: 0;
    width: 100%;
    height: 166rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 14rpx rgba(218, 218, 218, 0.5);
    padding: 22rpx 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &_item {
      height: 48rpx;
      display: flex;
      align-items: center;
      width: 100%;
      image {
        width: 48rpx;
        height: 48rpx;
      }

      text {
        color: 32rpx;
        line-height: 32rpx;
        margin-left: 12rpx;
      }
    }
  }

  .waterfall-item-price-discuss {
    display: flex;
    justify-content: space-between;
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
  .service-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:active {
      transform: translateX(4rpx);
    }

    // &::before {
    //   content: '';
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   width: 6rpx;
    //   height: 100%;
    //   background: linear-gradient(to bottom, #4b79e4, #2e5bb3);
    //   border-radius: 6rpx;
    // }
  }

  .card-header {
    margin-bottom: 24rpx;

    .title-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .status-tag {
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 22rpx;

        &.status-hot {
          background: rgba(255, 95, 0, 0.1);
          color: #ff5f00;
        }

        &.status-premium {
          background: rgba(75, 121, 228, 0.1);
          color: #4b79e4;
        }

        &.status-new {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }

        &.status-recommend {
          background: rgba(250, 173, 20, 0.1);
          color: #faad14;
        }
      }
    }

    .price-area {
      .price-label {
        font-size: 26rpx;
        color: #999;
      }

      .price-value {
        font-size: 32rpx;
        color: #ff5f00;
        font-weight: bold;
      }
    }
  }

  .card-body {
    margin-bottom: 24rpx;

    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-bottom: 20rpx;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        padding: 6rpx 16rpx;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 20rpx;

        .iconfont {
          font-size: 24rpx;
          color: #666;
        }

        text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }

    .stats-row {
      display: flex;
      gap: 24rpx;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .iconfont {
          font-size: 24rpx;
          color: #999;
        }

        text {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 2rpx solid rgba(0, 0, 0, 0.03);

    .tags {
      display: flex;
      gap: 12rpx;

      .tag {
        padding: 4rpx 12rpx;
        background: #f5f7fa;
        border-radius: 12rpx;
        font-size: 22rpx;
        color: #666;
      }
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #4b79e4 0%, #2e5bb3 100%);
      border-radius: 24rpx;

      text {
        color: #fff;
        font-size: 24rpx;
      }

      .iconfont {
        font-size: 24rpx;
      }
    }
  }
}

// 添加动画
.animate__fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
