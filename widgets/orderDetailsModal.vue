<template>
  <view>
    <u-popup
      :show="show"
      @open="open"
      :round="10"
      mode="bottom"
      :closeable="true"
      :closeOnClickOverlay="false"
      @close="close"
      :customStyle="{ backgroundColor: '#f5f5f5', padding: '40rpx 20rpx' }"
      :safeAreaInsetBottom="true"
    >
      <view>
        <view class="detailTitle">
          <img
            :src="chosenSku.skuImg ? chosenSku.skuImg : skuDefaultCover"
            style="width: 120rpx; height: 120rpx; border-radius: 10rpx"
          />
          <!-- <text style="color: red; font-size: 40rpx">￥{{ chosenSku.price }}</text> -->
          <text style="color: red; font-size: 30rpx; margin-left: 10rpx">
            {{ type === 'pointsMall' ? '积分' : '￥' }}
          </text>

          <text v-if="type === 'pointsMall'" style="color: red; font-size: 40rpx">
            {{ chosenSku.point ? chosenSku.point : '' }}
          </text>
          <text style="color: red; font-size: 40rpx" v-else>
            {{ chosenSku.price ? chosenSku.price : '' }}
          </text>
        </view>
        <!-- 地址 -->

        <fillInAddress :address="address" @click="addAddress" v-if="submitType === 'order'"></fillInAddress>

        <!--商品规格  -->
        <view class="detailCard">
          <view v-for="(item, index) in variables" :key="index" style="padding-bottom: 40rpx">
            <view style="padding-bottom: 20rpx; font-size: 24rpx; font-weight: 550">{{ item.name.zh_cn }}</view>
            <view :gutter="20" style="display: flex; flex-wrap: wrap; width: 100%">
              <view v-for="(it, idx) in item.values" :key="idx" style="margin: 8rpx">
                <u-button type="warning" :plain="!it.selected" size="small" @click="selectSku(item, it)">
                  {{ it.name.zh_cn }}
                </u-button>
              </view>
            </view>
          </view>
          <view style="display: flex; flex-direction: row; padding-bottom: 20rpx">
            <text style="flex: 1; font-size: 24rpx; font-weight: 550">数量</text>
            <u-number-box v-model="count">
              <view slot="minus" class="minus">
                <u-icon name="minus" size="12"></u-icon>
              </view>
              <text
                slot="input"
                style="width: 50rpx; text-align: center; font-size: 24rpx; font-weight: 550"
                class="input"
              >
                {{ count }}
              </text>
              <view slot="plus" class="plus">
                <u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
              </view>
            </u-number-box>
          </view>
        </view>
        <commonButton :text="$t('add to cart')" @click="AddToCart" v-if="submitType === 'cart'"></commonButton>
        <commonButton :text="$t('Submit order')" @click="ImmediateBuy" v-else></commonButton>
      </view>
    </u-popup>
    <orderAddressModal ref="orderAddressModal" @getAddress="getAddress"></orderAddressModal>
    <u-toast ref="uToast"></u-toast>
    <AddressModal ref="addressModal" @choose="chooseAddress"></AddressModal>
  </view>
</template>

<script>
import _ from 'lodash-es';
import uButton from '../uni_modules/uview-ui/components/u-button/u-button.vue';
import URow from '../uni_modules/uview-ui/components/u-row/u-row.vue';
import orderAddressModal from '@/widgets/orderAddressModal';
import commonButton from '@/components/myButton/commonButton.vue';
import fillInAddress from './address/fillInAddress.vue';
const orderServer = require('@/common/store/orderServer.js');
import AddressModal from '@/pages/service/components/addAddress.vue';
export default {
  components: { uButton, URow, orderAddressModal, commonButton, fillInAddress, AddressModal },
  props: {
    submitType: {
      type: String,
      default: 'order',
    },
    goods: {
      type: Object,
    },
    skuDefaultCover: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      show: false,
      showAddress: false,
      count: 1,
      selectedSpec: [],
      message: '',
      variables: [],
      addressModel: {},
      chosenSku: {
        skuImg: null,
        store: {},
      },
      address: '请选择收货地址',
      verifySuccess: false,
      defaultSku: [],
    };
  },
  mounted() {
    console.log('默认的图片', this.skuDefaultCover);
  },

  watch: {
    'goods.skus': {
      handler(newVal) {
        if (newVal) {
          console.log('newVal', newVal, this.goods);

          this.variables = this.goods.variables;
          this.variables.forEach((item) => {
            item.values.forEach((element) => {
              element.selected = false;
            });
          });

          this.defaultSku = this.goods.skus.filter((item) => item.is_default);
          console.log('默认的SKU', this.defaultSku);
          this.defaultSku[0].variants.forEach((item, index) => {
            this.variables[index].values[item].selected = true;
          });
          this.chosenSku = this.defaultSku[0];
          this.chosenSku.skuImg = this.defaultSku[0] ? this.defaultSku[0].images[0] : this.chosenSku.skuImg;
          this.chosenSku.store = this.goods.store;
          this.chosenSku.variables = this.goods.variables;
          this.chosenSku.name = this.goods.name;
          console.log('加载处理后goods.variables', this.variables);
        }
      },
      immediate: true,
    },
  },
  methods: {
    open() {},
    close() {
      this.show = false;
    },
    chooseAddress(formData) {
      this.addressModel = formData;
      console.log('选择', this.addressModel);
      this.address = this.addressModel.shipping_contactName + ' ' + this.addressModel.shipping_address_1;
    },
    // 选择规格颜色或者型号...
    selectSku(item, it) {
      item.values.forEach((element) => {
        element.selected = false;
      });
      it.selected = true;
      this.$forceUpdate();
      console.log('选择sku规格', this.variables);

      this.fillSelectedSpec();
    },
    //选择的属性合集[0，0]
    fillSelectedSpec() {
      this.selectedSpec = [];
      this.variables.forEach((item, index) => {
        item.values.forEach((it, idx) => {
          if (it.selected) {
            this.selectedSpec.push(idx);
          }
        });
      });
      console.log('selectedSpec', this.selectedSpec);
      this.handlechosenSku();
    },
    //选择出相对应的sku
    handlechosenSku() {
      console.log('选中的goods skus', this.goods.skus);
      let result = this.goods.skus
        .filter((item) => {
          let zhCnValues = item.variants;

          return _.isEqual(zhCnValues, this.selectedSpec);
        })
        .map((item) => item);

      console.log('选中的sku1', result);
      this.chosenSku = result[0] ? result[0] : this.chosenSku;
      this.chosenSku.skuImg = result[0] ? result[0].images[0] : this.chosenSku.skuImg;
      this.chosenSku.store = this.goods.store;
      this.chosenSku.name = this.goods.name;
      this.chosenSku.variables = this.goods.variables;
      console.log('选中的sku', result[0]);
    },
    //立即购买
    ImmediateBuy() {
      this.verifySelected();
      if (this.verifySuccess) {
        let params = {
          currency: 'CNY',
          items: [
            {
              items: [
                {
                  quantity: this.count,
                  sku: this.chosenSku.sku,
                  variants: this.chosenSku.variants,
                  store_id: this.goods.store.id,
                  id: this.chosenSku.id,
                },
              ],
              total: this.count * this.chosenSku.sale_price,
              goods_amount: this.count * this.chosenSku.sale_price,
              store_id: this.goods.store.id,
              address_id: this.addressModel.id,
            },
          ],
        };
        console.log('参数', params);
        //请求接口下单
        this.submitOrder(params);
      }
    },
    //立即下单
    submitOrder(data) {
      orderServer.postMyOrder(data, {
        success(res) {
          uni.showToast({
            title: '下单成功',
            icon: 'none',
            duration: '1500',
          });
          uni.$u.route({
            url: '/pages/order/orderList',
          });
          uni.$u.route({
            url: '/pages/order/orderDetail',
            params: {
              orderId: res.data.sub_orders
                .map((item, index) => {
                  return item.id;
                })
                .join(','),
            },
          });
        },
        fail(err) {
          uni.showToast({
            title: err.msg,
            icon: 'none',
            duration: 2500,
          });
        },
      });
    },
    // 添加到购物车
    AddToCart() {
      this.verifySelected();
      if (this.verifySuccess) {
        this.chosenSku.quantity = this.count;
        console.log('加入购物车', this.chosenSku);
        this.$store.dispatch('addToCart', this.chosenSku);
        uni.$u.toast('已添加购物车');
        this.show = false;
      }
    },
    //校验
    verifySelected() {
      this.verifySuccess = false;
      this.message = '';
      this.variables.forEach((spec) => {
        const allUnselected = spec.values.every((value) => !value.selected);
        if (allUnselected) {
          if (this.message !== '') {
            this.message += '，';
          }
          this.message += `请选择${spec.name.zh_cn}`;
        }
      });
      if (this.message === '' && this.submitType === 'order') {
        if (this.address === '请选择收货地址') {
          this.message = '请选择收货地址';
        }
      }
      console.log(this.message);
      if (this.message !== '') {
        this.verifySuccess = false;
        this.$refs.uToast.show({
          message: this.message,
        });
      } else {
        this.verifySuccess = true;
      }
    },

    //添加地址
    addAddress() {
      this.$refs.addressModal.show = true;
    },
    getAddress(model) {
      this.addressModel = model;
      this.address = model.shipping_contactName + ' ' + model.shipping_address_1;
      console.log('地址信息', model);
    },
    valChange() {},
  },
};
</script>

<style scoped>
.detailTitle {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 20rpx;
}
.detailCard {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 40rpx;
  margin: 10rpx 0rpx;
}
.address {
  display: flex;
  flex-direction: row;
}
.minus {
  width: 17px;
  height: 17px;
  border-width: 1px;
  border-color: #f7ae64;
  border-style: solid;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  border-bottom-left-radius: 100px;
  border-bottom-right-radius: 100px;
  justify-content: center;
  align-items: center;
  display: flex;
}

.input {
  padding: 0 10rpx;
}

.plus {
  width: 17px;
  height: 17px;
  background-color: #f7ae64;
  border-radius: 50%;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}

.u-toast {
  z-index: 99999 !important;
  position: relative !important;
}
</style>
