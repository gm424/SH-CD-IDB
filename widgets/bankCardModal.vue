<template>
  <u-popup
    :show="show"
    @open="open"
    :round="10"
    mode="bottom"
    :closeable="true"
    :closeOnClickOverlay="false"
    @close="close"
    :customStyle="{
      backgroundColor: '#fff',
      padding: '40rpx 10rpx',
      margin: '0 auto',
      width: '100%',
      maxWidth: '430px',
    }"
    :safeAreaInsetBottom="true"
    :overlay="true"
    :overlayStyle="{ background: 'rgba(0, 0, 0, 0.2)', zIndex: '19975' }"
    zIndex="29975"
  >
    <view class="container">
      <view class="">
        <text>￥</text><text style="font-size: 60rpx; font-weight: 600">{{ totalPrice }}</text>
      </view>
      <!-- 支付方式 -->

      <u-row class="uRow">
        <u-col :span="4">付款方式</u-col>
        <u-col :span="8" style="text-align: right">{{ xenum.PAY_METHODS.toText(payMethod) }}</u-col>
      </u-row>
      <view class="detailCard">
        <u-collapse @change="change" @close="closeCollapse" @open="openCollapse">
          <u-collapse-item
            :title="xenum.PAY_TYPE.toText(item.pay_type)"
            v-for="(item, index) in payList"
            :key="index"
            :name="item.pay_type"
          >
            <u-radio-group v-model="pay_model" iconPlacement="right">
              <u-radio
                activeColor="#f7ae64"
                :customStyle="{ marginBottom: '28rpx', fontSize: '20rpx' }"
                v-for="(it, idx) in item.items"
                :key="idx"
                :name="it.value"
                @change="radioChange"
              >
                <view style="font-size: 26rpx; font-weight: 600">
                  <!-- <u-image :src="require('@/static/payment/' + item.img)" width="30rpx" height="30rpx" /> -->
                  {{ it.name }}
                </view>
              </u-radio>
            </u-radio-group>
          </u-collapse-item>
        </u-collapse>

        <view> </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view
      style="
        position: fixed;
        bottom: 0rpx;
        
        width: 100%;
        margin: 0 auto;
        max-width: 430px;
        padding: 30rpx 10rpx;
      "
    >
      <commonButton :text="$t('Immediate payment')" @click="pay"></commonButton>
    </view>
  </u-popup>
</template>

<script>
import mixin from '@/mixins/index';

import commonButton from '@/components/myButton/commonButton.vue';
import Payment from '@/widgets/payment/payment.vue';
import xenum from '@/common/utils/XEnum.js';
const orderServer = require('@/common/store/orderServer.js');
export default {
  mixins: [mixin.generalNavigateTo],

  data() {
    return {
      pay_type: 'INDONESIA_PAY',
      pay_model: 'DANA',
      xenum: xenum,
      payList: [],
    };
  },
  components: {
    commonButton,
    Payment,
  },
  props: {
    totalPrice: {
      type: Number | String,
    },
    payMethod: {
      type: String,
      default: 'YIYUNHUI',
    },
    sn: {
      type: String,
    },
    show: {
      type: Boolean,
    },
  },
  mounted() {
    console.log('挂载!!');
    this.getConstatnts();
  },

  methods: {
    open() {},
    close() {
      this.$emit('close', false);
    },
    change(e) {
      console.log('change', e);
    },
    closeCollapse(e) {
      console.log('closeCollapse', e);
    },
    openCollapse(e) {
      this.pay_type = e;
      console.log('openCollapse', e);
    },
    pay() {
      let data = {
        payment_method_code: this.payMethod,
        pay_type: this.pay_type,
        pay_model: this.pay_model,
        terminal_type: 'APP',
      };
      let that = this;
      uni.showToast({
        title: '正在支付',
        icon: 'loading',
        duration: 2500,
      });
      orderServer.payOrder(this.sn, data, {
        success(res) {
          if (res.success) {
            console.log('success', res);
            that.navigateTo(res.data.pay_url ? res.data.pay_url : res.data.result.payUrl, '支付');
            that.show = false;
            console.log('跳转');
          }
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    radioChange(e) {
      this.pay_model = e;
      console.log('选择方式', e);
    },
    getConstatnts() {
      let that = this;

      orderServer.getPaymentConstants({
        success(res) {
          console.log('獲取參數');
          if (res.success) {
            that.payList = Object.keys(res.data[that.payMethod]).map((item) => {
              return {
                pay_type: item,
                items: Object.keys(res.data[that.payMethod][item]).map((it) => {
                  return {
                    name: it,
                    value: res.data[that.payMethod][item][it],
                  };
                }),
              };
            });
            console.log('獲取參數后', that.payList);
          }
        },
        fail(err) {
          console.log(err);
        },
      });
    },
    addBankCard() {
      uni.$u.route({
        url: 'pages/bankCard/bankCard',
        params: {},
      });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
.detailCard {
  background-color: #f5f5f5;
  border-radius: 20rpx;
  padding: 20rpx 20rpx;
  margin-bottom: 120rpx;
  width: 100%;
}
.u-radio-group--row {
  flex-direction: column !important;
}
.u-radio__text {
  font-size: 36rpx !important;
  line-height: 36rpx !important;
  font-weight: 600 !important;
}
.uRow {
  width: 100%;
  padding: 20rpx 10rpx;
  font-size: 28rpx;
}
</style>
