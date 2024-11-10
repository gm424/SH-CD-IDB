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
      <Payment></Payment>
    </view>

    <!-- 操作按钮 -->
    <view
      style="
        position: fixed;
        bottom: 0rpx;

        width: 100%;
        padding: 30rpx 10rpx;
        margin: 0 auto;
        max-width: 430px;
      "
    >
      <commonButton :text="$t('Immediate payment')" @click="pay"></commonButton>
    </view>
  </u-popup>
</template>

<script>
import commonButton from '@/components/myButton/commonButton.vue';
import Payment from '@/widgets/payment/payment.vue';
export default {
  data() {
    return {
      show: false,
    };
  },
  components: {
    commonButton,
    Payment,
  },
  props: {
    totalPrice: {
      type: Number,
    },
  },
  methods: {
    open() {},
    close() {
      this.show = false;
    },
    pay() {},
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
