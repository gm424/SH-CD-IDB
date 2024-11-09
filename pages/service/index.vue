<template>
  <view style="width: 100%; background-color: #f5f5f5; display: flex; flex-direction: column">
    <view style="background-color: #fff">
      <u-tabs
        :list="list"
        lineWidth="80"
        lineColor="#f56c6c"
        :activeStyle="{
          color: '#303133',
          fontWeight: 'bold',
          transform: 'scale(1.05)',
        }"
        :inactiveStyle="{
          color: '#606266',
          transform: 'scale(1)',
        }"
        itemStyle="padding-left: 10px; padding-right: 15px; height: 34px;"
        @click="handleTabClick"
      >
      </u-tabs>
    </view>
    <view v-if="activeIndex === '金融服务'">
      <FMS></FMS>
    </view>
    <view v-if="activeIndex === '物流服务'">
      <TMS></TMS>
    </view>
    <view v-if="activeIndex === '海外仓'">
      <view>海外仓</view>
    </view>
    <view v-if="activeIndex === '数字化转型'">
      <view>数字化转型</view>
    </view>
  </view>
</template>

<script>
import FMS from './components/fms.vue';
import TMS from './components/tms.vue';

export default {
  data() {
    return {
      list: [
        {
          name: '金融服务',
        },
        {
          name: '物流服务',
        },
        {
          name: '海外仓',
        },
        {
          name: '数字化转型',
        },
      ],
      activeIndex: '金融服务',
    };
  },
  components: {
    FMS,
    TMS,
  },
  methods: {
    handleTabClick(list) {
      this.activeIndex = list.name;
      console.log('list', list, this.activeIndex);
    },
  },
};
</script>

<style scoped>
/* 确保 view 标签全屏显示 */
</style>
