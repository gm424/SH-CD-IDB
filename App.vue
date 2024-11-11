<script>
const AppUtil = require('common/utils/appUtil.js');
const LoginServer = require('common/store/loginServer.js');
const MineServer = require('common/store/mineServer.js');
import { getAppLanguage } from 'common/utils/validate.js';

export default {
  globalData: {
    // 是否登录
    isLogin: false,
    // 是否开启 debug 模式
    isDebugModel: false,
    // 网络是否正常
    isNetConnected: true,
    // 是否全面屏
    isFullScreen: false,
  },
  onLaunch: function () {
    AppUtil.checkNetwork();
    AppUtil.checkNetworkStatus();
    AppUtil.init(this);

    uni.getNetworkType({
      success(res) {
        console.log('初始网络状态：', res);
      },
    });

    uni.onNetworkStatusChange(function (res) {
      console.log('网络状态变化前：', res.isConnected, res.networkType);
      if (res.isConnected) {
        // 网络连接恢复，刷新当前页面
        uni.reLaunch({
          url: '/' + getCurrentPages()[0].route, // 获取当前页面路径
          success: () => {
            console.log('页面跳转成功');
          },
          fail: (err) => {
            console.log('页面跳转失败', err);
          },
          complete: () => {
            console.log('页面跳转完成');
          },
        });

        console.log('网络状态变化：', res.isConnected, res.networkType, getCurrentPages()[0].route);
      }
    });
  },
  onShow: function () {
    LoginServer.init(this);
    MineServer.init(this);
    let applicationLocale = getAppLanguage();
    uni.onLocaleChange((e) => {
      applicationLocale = e.locale;
    });
  },
};
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import '@/uni_modules/uview-ui/index.scss';

uni-page-body,
html,
body {
  min-height: 100%;
  width: 100%;
}

view {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 添加uni-app根节点样式 */
uni-app {
  max-width: 430px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  display: block;
  background: #fff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 确保页面容器也遵循最大宽度 */
uni-page-wrapper,
uni-page-body,
uni-page {
  max-width: 430px !important;
  margin: 0 auto;
}

/* 确保导航栏和tabbar遵循最大宽度 */
.uni-page-head {
  max-width: 430px !important;
  width: 100% !important;
  z-index: 9 !important;
  margin: 0 auto !important ;
}
uni-page-head {
  max-width: 430px !important;
  width: 100% !important;
  z-index: 9 !important;
  margin: 0 auto !important ;
}
uni-tabbar {
  bottom: 0;

  max-width: 430px !important;
  left: 50% !important;
  transform: translateX(-50%);
  position: fixed !important;
  // top: 0;
  width: 100%;
  z-index: 9;
}
/* 修改body样式以使内容居中 */
body {
  display: flex;
  justify-content: center;
  background: #f5f7fa;
}
</style>
<style>
page {
  background-color: #fff;
  min-width: 230px;
}

.shadow {
  box-shadow: 0 4rpx 14rpx rgba(218, 218, 218, 0.5);
}
</style>
