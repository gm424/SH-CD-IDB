import Validate from '@/common/utils/validate';
export default {
  // 通用跳转
  generalNavigateTo: {
    methods: {
      navigateTo(item, title) {
        console.log('urls', item, title);
        if (Validate.isPages(item)) {
          console.log('url', item, title);
          uni.navigateTo({
            url: item,
          });
        } else {
          console.log('url', item, title);
          uni.navigateTo({
            url: `/pages/webview/webview?path=${encodeURIComponent(item)}&title=${title}`,
          });
        }
      },
    },
  },
};
