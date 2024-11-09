<template>
  <view class="container">
    <!-- 添加动态背景 -->
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
        <text class="title">欢迎注册</text>
        <text class="subtitle">创建您的账户</text>
      </view>

      <u--form :errorType="errorType" class="login-form" :model="loginFrom" :rules="rules" ref="uForm">
        <u-form-item prop="userInfo.username">
          <u--input
            :customStyle="inputCustomStyle"
            :placeholder="$t('nickName')"
            v-model="loginFrom.userInfo.username"
            border="none"
          >
            <template #prefix>
              <u-icon name="account" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
          </u--input>
        </u-form-item>

        <block v-if="login_method_email">
          <u-form-item prop="userInfo.email">
            <u--input
              :customStyle="inputCustomStyle"
              :placeholder="$t('email address')"
              v-model="loginFrom.userInfo.email"
              border="none"
            >
              <template #prefix>
                <u-icon name="email" size="36rpx" color="#2E5BB3"></u-icon>
              </template>
            </u--input>
          </u-form-item>
        </block>

        <u-form-item prop="userInfo.captcha">
          <u--input
            :customStyle="inputCustomStyle"
            :placeholder="$t('enter confirmation code')"
            v-model="loginFrom.userInfo.captcha"
            border="none"
          >
            <template #prefix>
              <u-icon name="hourglass" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
            <template #suffix>
              <view class="verify-code">
                <u--text
                  size="24rpx"
                  color="#2E5BB3"
                  @click="getCode"
                  :disabled="disabled"
                  :text="tips || '获取验证码'"
                ></u--text>
              </view>
            </template>
          </u--input>
        </u-form-item>

        <u-form-item prop="userInfo.password">
          <u--input
            :customStyle="inputCustomStyle"
            :placeholder="$t('set password')"
            password
            v-model="loginFrom.userInfo.password"
            border="none"
          >
            <template #prefix>
              <u-icon name="lock" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
          </u--input>
        </u-form-item>

        <u-form-item prop="userInfo.confirm_password">
          <u--input
            :customStyle="inputCustomStyle"
            :placeholder="$t('confirm password')"
            password
            v-model="loginFrom.userInfo.confirm_password"
            border="none"
          >
            <template #prefix>
              <u-icon name="lock-fill" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
          </u--input>
        </u-form-item>
      </u--form>

      <view class="button-group">
        <u-button :customStyle="btnCustomStyle" class="register-btn" @click="submit">
          {{ $t('register account') }}
        </u-button>

        <view class="back-home" @click="navHome">
          <u-icon name="home" size="32rpx" color="#999"></u-icon>
          <text>{{ $t('back home') }}</text>
        </view>
      </view>

      <view class="checkbox">
        <u-checkbox-group v-model="checkboxValue" @change="checkboxChange" size="26rpx" label-size="24rpx">
          <u-checkbox :label-disabled="true" v-for="(item, index) in checkboxList" :key="index" :name="item.name">
          </u-checkbox>
          <u--text
            @click="routerProtocol"
            :text="$t('I have read and accepted the Membership Agreement and Privacy Policy')"
            color="#999"
            size="24rpx"
          ></u--text>
        </u-checkbox-group>
      </view>
    </view>

    <u-code
      ref="uCode"
      :startText="startText"
      :changeText="changeText"
      :endText="endText"
      @change="codeChange"
      seconds="60"
      @start="disabled = true"
      @end="disabled = false"
    ></u-code>

    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
const LoginServer = require('../../common/store/loginServer.js');
const validate = require('../../common/utils/validate.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
  data() {
    return {
      disabled: false,
      tips: '',
      errorType: 'toast',
      src: `${host}/public/login/logo.png`,
      email: `${host}/public/login/email.png`,
      password: `${host}/public/login/password.png`,
      name: `${host}/public/login/name.png`,
      phone: `${host}/public/login/phone.png`,
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
      login_method_email: true, // 是否邮箱登录
      inputCustom: {
        height: '114rpx',
      },
      inputCustoms: {
        height: '114rpx',
        marginTop: '24rpx',
      },
      loginFrom: {
        userInfo: {
          username: '',
          email: '',
          // phone: '',
          password: '',
          captcha: '',
          confirm_password: '',
        },
      },
      rules: {
        'userInfo.username': [
          {
            required: true,
            message: this.$t('Please enter a username'),
            trigger: ['blur', 'change'],
          },
        ],
        // 邮箱校验
        'userInfo.email': [
          {
            required: true,
            message: this.$t('please input your email'),
            trigger: ['blur', 'change'],
          },
          {
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              return uni.$u.test.email(value);
            },
            message: this.$t('E-mail format is incorrect'),
          },
        ],
        'userInfo.captcha': {
          type: 'string',
          required: true,
          len: 6,
          message: this.$t('Please fill in the verification code'),
          trigger: ['blur'],
        },
        'userInfo.password': [
          {
            required: true,
            message: this.$t('Please enter password'),
            trigger: ['blur', 'change'],
          },
        ],
        'userInfo.confirm_password': [
          { required: true, message: this.$t('Please enter confirm password'), trigger: 'blur' },
          { validator: this.checkConfirmPassword, trigger: 'blur' },
        ],
      },
      checkboxValue: [],
      // 基本案列数据
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
      isProtocol: false,
      startText: this.$t('startText'),
      changeText: this.$t('changeText'),
      endText: this.$t('endText'),
    };
  },
  methods: {
    // loginMethod() {
    // 	this.login_method_email = !this.login_method_email
    // },
    navHome() {
      uni.switchTab({ url: '/pages/tabbar/home' });
    },
    checkConfirmPassword(rule, value, callback) {
      console.log('确认密码', value);
      if (value !== this.loginFrom.userInfo.password) {
        uni.showToast({
          title: this.$t('The two password entries are inconsistent'),
          icon: 'none',
          duration: 2500,
        });
        return;
      } else {
        callback();
      }
    },
    routerProtocol() {
      uni.$u.route('/pages/protocol/protocol');
    },
    checkboxChange(n) {
      this.isProtocol = !validate.isEmply(n[0]);
    },
    click(name) {
      uni.$u.toast(this.$t('Not open yet'));
    },
    goForgetPassword() {
      uni.$u.route('/pages/forget/forget');
    },
    codeChange(text) {
      this.tips = text;
    },
    getCode() {
      let that = this;
      let email = this.loginFrom.userInfo.email;
      if (!that.isProtocol) {
        uni.$u.toast(this.$t('Please first'));
        return;
      }
      if (validate.isEmply(email)) {
        uni.showToast({
          title: this.$t('please input your email'),
          icon: 'none',
          duration: 2500,
        });
        return;
      }
      if (!uni.$u.test.email(email)) {
        uni.showToast({
          title: this.$t('Email format error'),
          icon: 'none',
          duration: 2500,
        });
        return;
      }
      let params = {
        email: email,
        type: 'register',
      };
      if (this.$refs.uCode.canGetCode) {
        uni.showLoading({
          title: that.$t('Getting verification code'),
        });
        LoginServer.smsCode(params, {
          success(res) {
            // 这里此提示会被this.start()方法中的提示覆盖
            uni.$u.toast(that.$t('Verification code sent'));
            // 通知验证码组件内部开始倒计时
            that.$refs.uCode.start();
          },
          fail(err) {
            uni.showToast({
              title: err.msg,
              icon: 'none',
              duration: 2500,
            });
          },
        });
      } else {
        uni.$u.toast(that.$t('Send after countdown ends'));
      }
    },
    submit() {
      let that = this;
      if (!that.isProtocol) {
        uni.$u.toast(this.$t('Please first'));
        return;
      }
      that.$refs.uForm.validate().then((res) => {
        let loginFrom = that.loginFrom.userInfo;
        loginFrom.role = 'customer';
        LoginServer.registerUser(loginFrom, {
          success(res) {
            console.log('success', res);
            if (res.success) {
              uni.showToast({
                title: '注册成功',
                icon: 'none',
                duration: 2500,
              });

              setTimeout(function () {
                uni.$u.route({
                  type: 'back',
                });
              }, 1500);
            }
          },
          fail(err) {
            console.log('fail', err);
            uni.showToast({
              title: err,
              icon: 'none',
              duration: 2500,
            });
          },
        });
      });
    },
    reset() {
      const validateList = ['userInfo.username', 'userInfo.email', 'userInfo.captcha', 'userInfo.password'];
      this.$refs.uForm.resetFields();
      this.$refs.uForm.clearValidate();
      setTimeout(() => {
        this.$refs.uForm.clearValidate(validateList);
        // 或者使用 this.$refs.form1.clearValidate()
      }, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  // 修改背景渐变
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  position: relative;
  overflow: hidden;
}

// 优化动态背景
.animated-background {
  position: fixed;
  inset: 0;
  pointer-events: none;

  // 修改浮动圆形
  .floating-circle {
    position: absolute;
    width: 600rpx;
    height: 600rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(75, 121, 228, 0.1), rgba(46, 91, 179, 0.05));
    top: -200rpx;
    right: -200rpx;
    animation: float 15s ease-in-out infinite;

    // 添加内部装饰
    &::after {
      content: '';
      position: absolute;
      inset: 40rpx;
      border: 4rpx dashed rgba(75, 121, 228, 0.1);
      border-radius: 50%;
      animation: rotate 30s linear infinite;
    }
  }

  // 修改浮动方块
  .floating-square {
    position: absolute;
    width: 400rpx;
    height: 400rpx;
    background: linear-gradient(135deg, rgba(75, 121, 228, 0.08), rgba(46, 91, 179, 0.03));
    bottom: -100rpx;
    left: -100rpx;
    transform: rotate(45deg);
    animation: float 20s ease-in-out infinite reverse;

    // 添加内部装饰
    &::before {
      content: '';
      position: absolute;
      inset: 40rpx;
      border: 4rpx dashed rgba(75, 121, 228, 0.1);
      animation: rotate 20s linear infinite reverse;
    }
  }

  // 修改点阵背景
  .floating-dots {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-image: radial-gradient(circle at 50% 50%, rgba(75, 121, 228, 0.1) 1px, transparent 1px),
      radial-gradient(circle at 0% 0%, rgba(75, 121, 228, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
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
    position: relative;
    z-index: 1;

    // 添加光晕效果
    &::before {
      content: '';
      position: absolute;
      inset: -20rpx;
      background: radial-gradient(circle, rgba(75, 121, 228, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    // 添加投影
    &::after {
      content: '';
      position: absolute;
      bottom: -20rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 160rpx;
      height: 20rpx;
      background: radial-gradient(ellipse, rgba(0, 0, 0, 0.1), transparent 70%);
      border-radius: 50%;
    }

    // 悬浮效果
    &:hover {
      transform: translateY(-8rpx);

      &::after {
        transform: translateX(-50%) scaleX(0.9);
        opacity: 0.5;
      }
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

// 验证码按钮样式
.verify-code {
  padding: 8rpx 24rpx;
  background: rgba(46, 91, 179, 0.1);
  border-radius: 24rpx;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
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

.back-home {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  text {
    font-size: 28rpx;
    color: #999;
  }
}

.checkbox {
  margin-top: 24rpx;
  padding: 0 24rpx;
}

// 添加新动画
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 优化原有动画
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(30rpx, -30rpx) rotate(5deg);
  }
}

@keyframes moveBackground {
  from {
    background-position: 0 0, 0 0;
  }
  to {
    background-position: 40px 40px, 40px 40px;
  }
}
</style>
