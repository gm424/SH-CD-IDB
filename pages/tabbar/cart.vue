<template>
  <view>
    <view class="content">
      <view class="orderCard" v-for="(item, index) in cartList" :key="index">
        <view>
          <u-row gutter="20" class="uRow">
            <u-col :span="12">
              <u-row>
                <u-checkbox-group @change="checkStoreGroupChange(item)" style="width: 20px" v-model="selectStoreValues">
                  <u-checkbox :name="item.store.id" shape="square" size="30" :checked="item.isChecked"> </u-checkbox>
                </u-checkbox-group>
                <u-icon name="home" size="38"></u-icon>
                <text style="font-weight: 600; font-size: 26rpx; margin-left: 20rpx">{{ item.store.name }}</text>
              </u-row>
            </u-col>
          </u-row>
          <u-row gutter="20" class="uRow" v-for="(it, idx) in item.products" :key="idx" style="margin-left: 10px">
            <u-col :span="4">
              <u-row>
                <view style="display: flex; align-items: center; margin-left: -6px">
                  <u-checkbox-group
                    @change="checkboxGroupChange(it, item)"
                    style="width: 20px"
                    v-model="item.selectGoodsValues"
                  >
                    <u-checkbox :name="it.sku" shape="square" size="30" :checked="it.isChecked"> </u-checkbox>
                  </u-checkbox-group>
                </view>
                <img :src="it.skuImg" style="width: 130rpx" />
              </u-row>
            </u-col>
            <u-col :span="8">
              <u-row style="font-weight: 600; font-size: 26rpx; padding: 10rpx 0rpx">
                <u-col :span="10">
                  {{ it.name }}
                </u-col>
              </u-row>
              <u-row style="color: #b1b1b4; font-size: 26rpx; padding: 10rpx 0rpx">
                <u-col :span="8">
                  {{ it.variantsChange.join(';') }}
                </u-col>
                <u-col :span="4" style="text-align: right">
                  <u-number-box v-model="it.quantity" @change="valChange(it)">
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
              <u-row>
                <view class="uCol">
                  <text style="font-size: 26rpx; color: #f4891e">￥</text>
                  <text style="font-weight: 600; color: #f4891e">{{ it.price }}</text>
                </view>
                <view @click="deleteCart(it)" style="margin-top: 0px; position: absolute; right: 30px">删除</view>
              </u-row>
            </u-col>
          </u-row>
        </view>
      </view>
      <u-empty
        mode="car"
        icon="http://cdn.uviewui.com/uview/empty/car.png"
        width="400"
        textSize="20"
        marginTop="400"
        v-if="cartList.length === 0"
      >
      </u-empty>
    </view>
    <!-- 底部导航栏 -->
    <view class="tabbar" :style="{ marginBottom: '100rpx' }">
      <view class="totalPrice"> 合计:￥{{ totalPrice }}元 </view>
      <commonButton :text="$t('Submit order')" @click="submitOrder" style="width: 120px"></commonButton>
    </view>
  </view>
</template>

<script>
import _ from 'lodash-es';
import commonButton from '@/components/myButton/commonButton.vue';
const indexServer = require('../../common/store/indexServer.js');
export default {
  data() {
    return {
      totalPrice: 0,
      selectedCartList: [],
      selectedGoods: false,
      selectStoreValues: [],
      bottomSafeAreaHeight: '',
      cartList: [],
    };
  },
  components: {
    commonButton,
  },
  onShow() {
    this.getCartList();
    this.cartTotalPrice();
  },
  created() {},
  computed: {},
  methods: {
    getCartList() {
      console.log('获取原始购物车', this.$store.state.cartStore.cartList);
      this.cartList = this.$store.state.cartStore.cartList.map((item) => ({
        ...item,
        variantsChange: [],
        isChecked: false,
      }));

      this.cartList.forEach((cart) => {
        cart.variants.forEach((item, index) => {
          cart.variantsChange.push(cart.variables[index].values[item].name.zh_cn);
        });
      });

      // 用于存储分类结果的对象
      const storeProductsMap = {};

      // 遍历数组，将数据分类到对应的店铺
      this.cartList.forEach((item) => {
        const storeId = item.store.id;
        // 如果storeProductsMap中没有该店铺的id，则初始化
        if (!storeProductsMap[storeId]) {
          storeProductsMap[storeId] = {
            store: item.store,
            isChecked: false,
            products: [],
            selectGoodsValues: [],
          };
        }

        // 将当前产品信息添加到对应店铺的products数组中
        storeProductsMap[storeId].products.push(item);
      });

      // 将结果转化为数组形式
      this.cartList = Object.values(storeProductsMap);
      console.log('获取购物车列表', this.cartList);
    },

    valChange(item) {
      this.$set(this, 'cartList', this.cartList);
      this.cartTotalPrice();
      console.log('加减', item);
      setTimeout(() => {
        this.$store.dispatch('updateCount', item);
      }, 300);
    },

    // 提交购物车订单
    submitOrder() {
      this.$nextTick(() => {
        console.log('cartList', this.cartList);
        this.selectedCartList = [];
        this.cartList.forEach((item) => {
          let list = item.products.filter((it, idx) => {
            if (it.isChecked) {
              return it;
            }
          });
          if (list.length !== 0) {
            this.selectedCartList.push({ items: list, store: item.store });
          }
        });
        console.log('this.selectedCartList', this.selectedCartList);
        if (this.selectedCartList.length === 0) {
          uni.$u.toast('请先勾选商品!');
        } else {
          console.log('this.selectedCartList', this.selectedCartList);
          //进入详情页面
          this.$store.dispatch('getCartGoodsList', this.selectedCartList);
          uni.$u.route({
            url: '/pages/order/cartDetail',
          });
        }
      });
    },

    // 选中任一checkbox时，由checkbox-group触发
    checkboxGroupChange(it, item) {
      it.isChecked = !it.isChecked;
      this.cartTotalPrice();
      item.isChecked = item.products.every((obj) => obj.isChecked);
    },
    checkStoreGroupChange(item) {
      console.log('选择', item);
      item.isChecked = !item.isChecked;
      item.products.forEach((it, idx) => {
        if (item.isChecked) {
          it.isChecked = true;
        } else {
          it.isChecked = false;
        }
      });
      console.log('cartList', this.cartList);
      this.cartTotalPrice();
    },
    deleteCart(it) {
      console.log('删除', it);
      this.$store.dispatch('deleteCartGoodsList', it.sku);
      this.getCartList();
    },
    // 购物车商品总价
    cartTotalPrice() {
      // 计算list列表中所有选中商品的价格
      console.log('this.cartList', this.cartList);
      this.totalPrice = 0;
      this.$nextTick(() => {
        this.cartList.forEach((cart) => {
          cart.products.forEach((el, index) => {
            if (el.isChecked) {
              this.totalPrice = el.price * el.quantity + this.totalPrice;
              console.log('totalPrice', this.totalPrice);
            }
          });
        });
      });
    },
  },
};
</script>

<style>
.content {
  background-color: #f7f7f7;
  text-align: center;
  min-height: 100vh;

  padding: 20rpx 20rpx 200rpx 20rpx;
}

.status {
  font-size: 10px;
  padding: 4px 10px;
  border-radius: 20px;
  margin: -3px 0px 0px 10px;
  background: rgba(8, 162, 201, 0.1);
  text-align: center;
  display: inline-block;
  color: #31a6f5;
  vertical-align: middle;
}
.tabbar {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 156rpx;
  background-color: #fff;
  position: fixed;
  bottom: 0rpx;
  left: 0;
  padding: 0rpx 20rpx;
  align-items: center;
}
.all {
  font-size: 32rpx;
  color: #3e3e3e;
  letter-spacing: 2.29rpx;
  display: flex;
}
.totalPrice {
  font-size: 32rpx;
  color: #3e3e3e;
  letter-spacing: 2.29rpx;
  color: red;
}
.submitOrder {
  width: 208rpx;
  height: 80rpx;
  /*background: #354E44;*/
  background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  border-radius: 14rpx;
  border-radius: 14rpx;
  font-size: 36rpx;
  color: #ffffff;
  letter-spacing: 2.57rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.submitOrder:hover {
  background-image: linear-gradient(to top, #48c6ef 0%, #6f86d6 100%);
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
</style>
