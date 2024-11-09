<template>
  <view style="container">
    <view style="text-align: center; font-size: 20px; font-weight: 600; margin-top: 20px">交易成功</view>
    <commonButton text="返回首页" style="margin: 20rpx 0rpx" width="100px" @click="routeBack"></commonButton>
  </view>
</template>

<script>
import commonButton from '@/components/myButton/commonButton.vue';
export default {
  components: {
    commonButton,
  },
  methods: {
    routeBack() {
      uni.switchTab({
        url: '/pages/tabbar/home',
      });
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
