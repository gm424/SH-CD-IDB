<template>
  <view class="container">
    <view class="animated-background">
      <view class="floating-circle"></view>
      <view class="floating-square"></view>
      <view class="floating-dots"></view>
    </view>

    <view class="form">
      <u-avatar
        class="logo"
        :src="'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/极网LOGO_1731065287394.png'"
        size="160"
        shape="square"
      ></u-avatar>

      <view class="welcome-text">
        <text class="title">欢迎回来</text>
        <text class="subtitle">登录您的账户以继续</text>
      </view>

      <u--form :errorType="errorType" class="login-form" :model="loginFrom" :rules="rules" ref="uForm">
        <block v-if="login_method_email">
          <u-form-item prop="userInfo.username">
            <u--input
              :customStyle="inputCustomStyle"
              :placeholder="$t('email address')"
              v-model="loginFrom.userInfo.username"
              border="none"
            >
              <template #prefix>
                <u-icon name="email" size="36rpx" color="#2E5BB3"></u-icon>
              </template>
            </u--input>
          </u-form-item>
        </block>

        <u-form-item prop="userInfo.password">
          <u--input
            :customStyle="inputCustomStyle"
            :placeholder="$t('login.password')"
            password
            v-model="loginFrom.userInfo.password"
            border="none"
          >
            <template #prefix>
              <u-icon name="lock" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
            <template #suffix>
              <view class="forget-password" @click="goForgetPassword">
                <u--text size="24rpx" color="#2E5BB3" :text="$t('forget.forget')"></u--text>
              </view>
            </template>
          </u--input>
        </u-form-item>
      </u--form>

      <view class="button-group">
        <u-button :customStyle="btnCustomStyle" class="login-btn" @click="submit">{{ $t('Log in') }}</u-button>

        <u-button :customStyle="registerBtnStyle" class="register-btn" @click="routerSign">{{
          $t('register')
        }}</u-button>
      </view>

      <view class="back-home" @click="navHome">
        <u-icon name="home" size="32rpx" color="#999"></u-icon>
        <text>{{ $t('back home') }}</text>
      </view>

      <view class="checkbox">
        <u-checkbox-group v-model="checkboxValue" @change="checkboxChange" size="26rpx" label-size="24rpx">
          <u-checkbox v-for="(item, index) in checkboxList" :key="index" :name="item.name"></u-checkbox>
          <u--text
            @click="routerProtocol"
            :text="$t('I have read and accepted the Membership Agreement and Privacy Policy')"
            color="#999"
            size="24rpx"
          ></u--text>
        </u-checkbox-group>
      </view>
    </view>

    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
const Api = require('../../common/store/api.js');
const LoginServer = require('../../common/store/loginServer.js');
const validate = require('../../common/utils/validate.js');
const host = Api.host;
export default {
  data() {
    return {
      // 文字提示
      errorType: 'toast',
      src: `${host}/public/login/logo.png`,
      email: `${host}/public/login/email.png`,
      password: `${host}/public/login/password.png`,
      // phone: `${host}/public/login/phone.png`,
      baseList: [
        {
          src: `${host}/public/login/f.png`,
        },
        {
          src: `${host}/public/login/g.png`,
        },
        {
          src: `${host}/public/login/i.png`,
        },
      ],
      inputCustom: {
        height: '114rpx',
      },
      inputCustoms: {
        height: '114rpx',
        marginTop: '48rpx',
      },
      loginFrom: {
        userInfo: {
          username: '',
          // phone: '',
          password: '',
        },
      },
      login_method_email: true, // 是否邮箱登录
      rules: {
        'userInfo.username': [
          // 必填规则
          {
            required: true,
            message: this.$t('please input your email'),
            // blur和change事件触发检验
            trigger: ['blur', 'change'],
          },
          // 邮箱校验
          // {
          // 	trigger: ['blur', 'change'],
          // 	validator: (rule, value, callback) => {
          // 		return uni.$u.test.email(value)
          // 	},
          // 	message: '邮箱格式不正确'
          // },
        ],
        'userInfo.password': [
          // 必填规则
          {
            required: true,
            message: this.$t('Please enter password'),
            // blur和change事件触发检验
            trigger: ['blur', 'change'],
          },
        ],
      },
      checkboxValue: [],
      checkboxList: [
        {
          name: this.$t('I have read and accepted the Membership Agreement and Privacy Policy'),
          disabled: false,
        },
      ],
      btnCustomStyle: {
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
        color: '#FFF',
        fontSize: '32rpx',
      },
      isProtocol: false, // 是否同意用户协议
      // systemLocale: '',
      // applicationLocale: ''
    };
  },
  // computed: {
  // 	locales() {
  // 		return [{
  // 				text: this.$t('locale.en'),
  // 				code: 'en'
  // 			},
  // 			{
  // 				text: this.$t('locale.zh-hans'),
  // 				code: 'zh-Hans'
  // 			}
  // 		]
  // 	}
  // },

  onLoad() {
    // let systemInfo = uni.getSystemInfoSync();
    // this.systemLocale = systemInfo.language;
    // this.applicationLocale = uni.getLocale();
    // this.isAndroid = systemInfo.platform.toLowerCase() === 'android';
    // uni.onLocaleChange((e) => {
    // 	this.applicationLocale = e.locale;
    // })
  },
  methods: {
    click(name) {
      uni.$u.toast(this.$t('Not open yet'));
    },
    // loginMethod() {
    // 	this.login_method_email = !this.login_method_email
    // },
    navHome() {
      uni.switchTab({ url: '/pages/tabbar/home' });
    },
    routerProtocol() {
      uni.$u.route('/pages/protocol/protocol');
    },
    routerSign() {
      uni.$u.route('/pages/sign/sign');
    },
    checkboxChange(n) {
      this.isProtocol = !validate.isEmply(n[0]);
    },
    // click(name) {
    // 	this.$refs.uToast.success(`点击了第${name}个`)
    // },
    goForgetPassword() {
      uni.$u.route('/pages/forget/forget_entrance');
    },
    submit() {
      let that = this;
      if (!that.isProtocol) {
        uni.$u.toast(that.$t('Please first'));
        return;
      }
      that.$refs.uForm
        .validate()
        .then((res) => {
          let loginFrom = that.loginFrom.userInfo;
          LoginServer.login(loginFrom, {
            success(res) {
              // 获取用户信息
              LoginServer.getUserProfile({
                success(res) {
                  console.log(res);
                  that.reset();
                  setTimeout(() => {
                    console.log('跳转');
                    uni.$u.route({
                      url: 'pages/tabbar/home',
                      type: 'switchTab',
                    });
                  }, 300);
                },
                fail(error) {
                  that.reset();
                },
              });
            },
            fail(err) {
              that.reset();
            },
          });
        })
        .catch((errors) => {
          console.log(errors);
          // uni.$u.toast(errors[0].message)
          that.reset();
        });
    },
    reset() {
      const validateList = ['userInfo.username', 'userInfo.password'];
      this.$refs.uForm.resetFields();
      this.$refs.uForm.clearValidate();
      setTimeout(() => {
        this.$refs.uForm.clearValidate(validateList);
        // 或者使用 this.$refs.form1.clearValidate()
      }, 10);
    },
    // onLocaleChange(e) {
    // 	if (this.isAndroid) {
    // 		uni.showModal({
    // 			content: this.$t('index.language-change-confirm'),
    // 			success: (res) => {
    // 				if (res.confirm) {
    // 					uni.setLocale(e.code);
    // 				}
    // 			}
    // 		})
    // 	} else {
    // 		uni.setLocale(e.code);
    // 		this.$i18n.locale = e.code;
    // 	}
    // }
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
}

// 动态背景
.animated-background {
  position: fixed;
  inset: 0;
  pointer-events: none;

  .floating-circle {
    position: absolute;
    width: 400rpx;
    height: 400rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(46, 91, 179, 0.1), rgba(46, 91, 179, 0.05));
    top: -100rpx;
    right: -100rpx;
    animation: float 15s ease-in-out infinite;
  }

  .floating-square {
    position: absolute;
    width: 200rpx;
    height: 200rpx;
    background: linear-gradient(135deg, rgba(46, 91, 179, 0.08), rgba(46, 91, 179, 0.03));
    bottom: 10%;
    left: -50rpx;
    transform: rotate(45deg);
    animation: float 20s ease-in-out infinite reverse;
  }

  .floating-dots {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(rgba(46, 91, 179, 0.2) 1px, transparent 1px);
    background-size: 30px 30px;
    animation: moveBackground 50s linear infinite;
  }
}

.form {
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    margin: 48rpx 0;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4rpx);
      box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.15);
    }
  }

  .welcome-text {
    text-align: center;
    margin-bottom: 48rpx;

    .title {
      font-size: 48rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
    }

    .subtitle {
      font-size: 28rpx;
      color: #999;
    }
  }

  .login-form {
    width: 100%;
    margin-bottom: 48rpx;
  }
}

// 输入框样式
.inputCustomStyle {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx 32rpx;
  height: 96rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  &:focus-within {
    box-shadow: 0 4rpx 16rpx rgba(46, 91, 179, 0.15);
  }
}

// 按钮样式
.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  margin-bottom: 48rpx;
}

.btnCustomStyle {
  height: 96rpx;
  background: linear-gradient(135deg, #4b79e4 0%, #2e5bb3 100%);
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 16rpx rgba(46, 91, 179, 0.2);

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 8rpx rgba(46, 91, 179, 0.15);
  }
}

.registerBtnStyle {
  height: 96rpx;
  background: #fff;
  border: 2rpx solid #e9ecef;
  border-radius: 48rpx;
  font-size: 32rpx;
  color: #666;
}

.back-home {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  background: #fff;
  border-radius: 32rpx;
  margin-bottom: 48rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  text {
    font-size: 28rpx;
    color: #999;
  }
}

// 动画
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20rpx, -20rpx);
  }
}

@keyframes moveBackground {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 100%;
  }
}
</style>
