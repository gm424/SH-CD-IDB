<template>
  <!-- 支付方式 -->
  <view style="width: 100%">
    <u-row class="uRow">
      <u-col :span="4">付款方式</u-col>
      <u-col :span="8" style="text-align: right">{{ radiovalue }}</u-col>
    </u-row>
    <view class="detailCard">
      <view style="color: #a2a2a2; font-size: 26rpx; padding-bottom: 10rpx">支付工具</view>
      <u-radio-group v-model="radiovalue" iconPlacement="right">
        <u-radio
          activeColor="#f7ae64"
          :customStyle="{ marginBottom: '28rpx', fontSize: '20rpx' }"
          v-for="(item, index) in radiolist"
          :key="index"
          :name="item.name"
          @change="radioChange"
        >
          <view style="font-size: 26rpx; font-weight: 600">
            <img :src="require('@/static/catalog/' + item.img)" style="width: 22rpx; margin-right: 8rpx" />{{
              item.name
            }}</view
          >
        </u-radio>
      </u-radio-group>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      radiovalue: 'PingPong支付',
      radiolist: [
        {
          name: 'PingPong支付',
          value: '1',
          img: 'zhongjin.png',
        },
        {
          name: '支付宝支付',
          value: '2',
          img: 'zhifubao.png',
        },
        {
          name: '微信支付',
          value: '3',
          img: 'weixin.png',
        },
        {
          name: '线下支付',
          value: '4',
          img: 'weixin.png',
        },
      ],
    };
  },
  methods: {
    radioChange(e) {
      console.log('选择方式', e);
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
