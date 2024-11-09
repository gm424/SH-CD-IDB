<template>
  <view class="content"> </view>
</template>

<script>
var wv;
export default {
  data() {
    return {};
  },
  props: {
    currentUrl: {
      type: String,
    },
  },
  mounted() {
    this.createView();
  },
  watch: {
    currentUrl: {
      handler(n) {
        this.createView();
      },
      deep: true,
      immediate: true,
    },
  },
  beforeDestroy() {
    wv.close();
    //wv.hide()
  },
  methods: {
    createView() {
      // 检查 plus 是否定义
      if (typeof plus !== 'undefined') {
        wv = plus.webview.create('', 'webview', {
          plusrequire: 'none',
          top: uni.getSystemInfoSync().statusBarHeight + 93,
        });
        wv.loadURL(this.currentUrl);

        const currentWebview = this.$parent.$scope.$getAppWebview();
        currentWebview.append(wv);

        setTimeout(() => {
          console.log(wv.getStyle());
        }, 1000);
      } else {
        console.warn('plus is not defined. This code only works on a real device or HBuilderX simulator.');
      }
    },
  },
};
</script>

<style></style>
