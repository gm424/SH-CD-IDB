<template>
  <view class="bgContainer">
    <view class="orderCard">
      <view style="margin: 20rpx 0rpx">{{ $t('Enter the card number to add') }}</view>
      <u--input
        placeholder="请输入内容"
        border="surround"
        v-model="value"
        @change="change"
        style="margin: 20rpx 0rpx"
      ></u--input>
      <commonButton :text="$t('Submit card number')" @click="submitOrder" style="margin: 20rpx 0rpx"></commonButton>
    </view>
  </view>
</template>

<script>
import commonButton from '@/components/myButton/commonButton.vue';
export default {
  data() {
    return {
      value: '',
    };
  },
  components: {
    commonButton,
  },
};
</script>

<style scoped>
.bgContainer {
  background-color: #f7f7f7;
  height: 100vh;
  padding: 10rpx 10rpx;
}
.orderCard {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
}
</style>
