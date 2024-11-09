<template>
  <!-- 地址 -->
  <view class="detailCard" @click="click">
    <view class="address">
      <u-icon name="map-fill" color="#f7ae64"></u-icon>
      <view style="font-size: 26rpx; font-weight: 600; display: flex; align-items: center; margin: 0rpx 10rpx">
        {{ address }}
      </view>
      <u-icon name="arrow-right" style="flex: 1; justify-content: flex-end"></u-icon>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },

  props: {
    address: {
      type: String,
    },
  },
  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
.detailCard {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 20rpx;
  margin: 10rpx 0rpx;
}
.address {
  display: flex;
  flex-direction: row;
}
</style>
