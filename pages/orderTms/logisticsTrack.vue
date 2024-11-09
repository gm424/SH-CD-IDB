<template>
  <view style="padding: 4px; background-color: #f9f9f9; height: 100vh">
    <view class="orderCard">
      <u-steps current="0" direction="column" :dot="true" activeColor="#f59a23" iconSize="55">
        <u-steps-item
          :title="item.title"
          :desc="item.desc"
          v-for="(item, index) in trakingList"
          :key="index"
        ></u-steps-item>
      </u-steps>
    </view>
  </view>
</template>

<script>
const orderServer = require('@/common/store/orderServer.js');
import xenum from '@/common/utils/XEnum.js';
export default {
  data() {
    return {
      sn: null,
      trakingList: [],
    };
  },
  onLoad(options) {
    let { sn } = options;
    this.sn = sn;
  },
  mounted() {
    this.getTracking();
  },
  methods: {
    //获取物流轨迹
    getTracking() {
      let that = this;
      orderServer.getOrderTracking([this.sn], {
        success(res) {
          if (res.success) {
            console.log('物流轨迹', res);
            that.trakingList = res.result[0].routeInfos.map((item) => {
              return {
                title: item.time,
                desc: item.info,
              };
            });
          }
        },
        fail(err) {
          uni.$u.toast(err.msg);
          console.log(err);
        },
      });
    },
  },
};
</script>

<style scoped>
.orderCard {
  border-radius: 20rpx;
  background-color: #fff;
  margin: 20rpx 0rpx;
  padding: 20rpx 20rpx;
}
/deep/.u-text__value--main {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #f59a23 !important;
}
/deep/.u-text__value--content {
  font-size: 14px !important;
  font-weight: 600 !important;
}

/deep/.u-text__value--tips {
  font-size: 12px !important;
}
</style>
