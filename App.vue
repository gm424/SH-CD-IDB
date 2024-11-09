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
}

view {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
<style>
page {
  background-color: #fff;
}

.shadow {
  box-shadow: 0 4rpx 14rpx rgba(218, 218, 218, 0.5);
}
</style>
