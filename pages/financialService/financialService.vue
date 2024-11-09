<template>
  <view style="width: 100%; height: 100vh; background-color: #f5f5f5; display: flex; flex-direction: column">
    <view style="background-color: #fff">
      <u-tabs
        :list="list"
        lineWidth="30"
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
        itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;"
        @click="handleTabClick"
      >
      </u-tabs>
    </view>
    <webview :currentUrl="currentUrl"></webview>
    <!-- <view style="flex: 1; overflow: hidden">
      <web-view :src="currentUrl" style="width: 100%; height: 100%" />
    </view> -->
  </view>
</template>

<script>
import webview from './webview.vue';
export default {
  data() {
    return {
      list: [
        {
          name: '在线汇率换算',
          url: 'https://www.exchange-rates.org/zh/converter',
        },
        // {
        //   name: '供应链金融服务',
        //   url: 'https://uniapp.dcloud.io/static/web-view.html',
        // },
        // {
        //   name: '跨境结算服务',
        //   url: 'https://www.example.com/跨境结算服务',
        // },
        // {
        //   name: '信用卡服务',
        //   url: 'https://www.example.com/信用卡服务',
        // },
      ],
      currentUrl: 'https://www.exchange-rates.org/zh/converter', // 默认显示的URL
    };
  },
  components: {
    webview,
  },
  methods: {
    handleTabClick(obj) {
      console.log('this.list[index].url', obj);
      this.currentUrl = obj.url;
      console.log('currentUrl', this.currentUrl);
    },
  },
};
</script>

<style scoped>
/* 确保 view 标签全屏显示 */
view {
  width: 100%;
  height: 100vh;
}
</style>
