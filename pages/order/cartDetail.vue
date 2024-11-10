<template>
  <view class="cartDeatilContainer">
    <!-- 地址 -->
    <fillInAddress :address="address" @click="addAddress"></fillInAddress>
    <!-- 订单列表 -->
    <view class="orderCard" v-for="(item, index) in cartList" :key="index">
      <view>
        <u-row gutter="20" class="uRow">
          <u-col :span="12">
            <u-row>
              <u-icon name="home" size="38"></u-icon>
              <text style="font-weight: 800; font-size: 28rpx; margin-left: 20rpx">{{ item.store.name }}</text>
            </u-row>
          </u-col>
        </u-row>
        <u-row gutter="20" class="uRow" v-for="(it, idx) in item.items" :key="idx">
          <u-col :span="3">
            <img :src="it.skuImg" style="width: 130rpx" />
          </u-col>
          <u-col :span="9">
            <u-row style="font-weight: 600; font-size: 26rpx; padding: 10rpx 0rpx">
              <u-col :span="8">
                {{ it.name }}
              </u-col>
              <u-col :span="4">
                <view class="uCol">
                  <text style="font-size: 20rpx">￥</text><text style="font-size: 30rpx">{{ it.price }}</text>
                </view>
              </u-col>
            </u-row>
            <u-row style="color: #b1b1b4; font-size: 26rpx; padding: 10rpx 0rpx">
              <u-col :span="8">
                {{ it.variantsChange.join(';') }}
              </u-col>
              <u-col :span="4" style="justify-content: end">
                <u-number-box v-model="it.quantity">
                  <view slot="minus" class="minus">
                    <u-icon name="minus" size="12"></u-icon>
                  </view>
                  <text slot="input" style="width: 50rpx; text-align: center; font-size: 20rpx" class="input">{{
                    it.quantity
                  }}</text>
                  <view slot="plus" class="plus">
                    <u-icon name="plus" color="#FFFFFF" size="12"></u-icon>
                  </view>
                </u-number-box>
              </u-col>
            </u-row>
          </u-col>
        </u-row>
      </view>
    </view>
    <!-- <view class="orderCard">
      <payment></payment>
    </view> -->

    <!-- 按钮操作区域 -->
    <view
      style="
        position: fixed;
        bottom: 0rpx;
        max-width: 430px;
        margin: 0 auto;
        width: 100%;
        padding: 30rpx 10rpx;
        background-color: #fff;
      "
    >
      <u-row>
        <u-col :span="8">
          <u-row style="justify-content: flex-end; margin-right: 12rpx">
            <text style="font-size: 28rpx">合计：</text>
            <text style="font-size: 40rpx; color: red; font-weight: 600">￥{{ totalPrice }}</text>
          </u-row>
        </u-col>
        <u-col :span="4">
          <commonButton :text="$t('Buy now')" width="100px" @click="submitOrder"></commonButton>
        </u-col>
      </u-row>
    </view>

    <AddressModal ref="addressModal" @choose="chooseAddress"></AddressModal>
    <bankCardModal ref="bankCardModal" :totalPrice="totalPrice"></bankCardModal>
  </view>
</template>

<script>
import fillInAddress from '@/widgets/address/fillInAddress.vue';
import orderAddressModal from '@/widgets/orderAddressModal';
import commonButton from '@/components/myButton/commonButton.vue';
import bankCardModal from '../../widgets/bankCardModal.vue';
import payment from '../../widgets/payment/payment.vue';
import AddressModal from '@/pages/service/components/addAddress.vue';
const orderServer = require('@/common/store/orderServer.js');
export default {
  data() {
    return {
      address: '请填写收货地址',
      addressModel: {},
      cartList: [],
      seleted: [
        {
          items: [
            {
              id: '54',
            },
          ],
          store: {
            id: '1',
          },
        },
        {
          items: [
            {
              id: '71',
            },
          ],
          store: {
            id: '2',
          },
        },
      ],
      list: [
        {
          id: '54',
          store: {
            id: '1',
          },
        },
        {
          id: '69',
          store: {
            id: '2',
          },
        },
        {
          id: '71',
          store: {
            id: '2',
          },
        },
      ],
    };
  },
  components: { fillInAddress, orderAddressModal, commonButton, bankCardModal, payment, AddressModal },

  computed: {
    // cartList() {
    //   return this.$store.state.cartStore.selectedCartList;
    // },
    totalPrice() {
      let sum = 0;
      this.$store.state.cartStore.selectedCartList.forEach((element) => {
        console.log('element', element);
        element.items.forEach((cart) => {
          sum = sum + cart.price * cart.quantity;
        });
      });
      return sum;
    },
  },
  mounted() {
    this.cartList = this.$store.state.cartStore.selectedCartList;

    console.log('购物车详情', this.cartList);
  },
  methods: {
    //添加地址
    addAddress() {
      this.$refs.addressModal.show = true;
    },
    chooseAddress(formData) {
      this.addressModel = formData;
      console.log('选择', this.addressModel);
      this.address = this.addressModel.shipping_contactName + ' ' + this.addressModel.shipping_address_1;
    },
    getAddress(model) {
      this.addressModel = model;
      this.address = model.shipping_contactName + ' ' + model.shipping_address_1;
      console.log('地址信息', model);
    },
    submitOrder() {
      if (this.address === '请填写收货地址') {
        uni.$u.toast('请填写收货地址');
      } else {
        let that = this;
        let data = {
          items: this.cartList.map((item) => {
            return {
              items: item.items.map((it) => {
                return {
                  store_id: it.store.id,
                  id: it.id,
                  sku: it.sku,
                  quantity: it.quantity,
                  variants: it.variants,
                  variables: it.variables,
                };
              }),
              store_id: item.store.id,
              address_id: this.addressModel.id,
            };
          }),
          currency: 'CNY',
        };
        console.log('参数', data);
        orderServer.postMyOrder(data, {
          success(res) {
            uni.showToast({
              title: '下单成功',
              icon: 'none',
              duration: 2500,
            });

            that.$store.dispatch(
              'updateGoods',
              that.$store.state.cartStore.cartList.filter((listItem) => {
                return !that.$store.state.cartStore.selectedCartList.some((seletedItem) => {
                  return seletedItem.items.some((item) => item.id === listItem.id);
                });
              })
            );
            console.log('购物车详情', that.$store.state.cartStore.selectedCartList);
            console.log('购物车下单成功', that.$store.state.cartStore.cartList);

            uni.switchTab({
              url: '/pages/tabbar/cart',
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
      }
    },
  },
};
</script>

<style scoped>
.cartDeatilContainer {
  background-color: #f7f7f7;
  height: 100vh;
  padding: 20rpx 20rpx;
}
.orderCard {
  border-radius: 20rpx;
  background-color: #fff;
  margin: 20rpx 0rpx;
  padding: 20rpx 20rpx;
}
.uRow {
  margin: 20rpx 10rpx;
}
.uRowItem {
  font-size: 28rpx;
}
.uCol {
  text-align: right;
  margin-top: 20rpx;
}
.minus {
  width: 15px;
  height: 15px;
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
  width: 15px;
  height: 15px;
  background-color: #f7ae64;
  border-radius: 50%;
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}
.u-number-box {
  justify-content: flex-end !important;
}
</style>
