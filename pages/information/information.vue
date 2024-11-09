<template>
  <view class="content">
    <view class="avatar">
      <MyUploadAvatar v-model="personInfoForm.userInfo.avatar"></MyUploadAvatar>
    </view>
    <view class="container">
      <view class="u-demo-block">
        <view class="u-demo-block__content">
          <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
          <u--form
            labelPosition="top"
            labelWidth="auto"
            :errorType="errorType"
            :labelStyle="labelStyle"
            :rules="rules"
            :model="personInfoForm"
            ref="form1"
          >
            <u-form-item labelPosition="top" :label="$t('nickName')" prop="userInfo.nickName">
              <u--input
                fontSize="24rpx"
                color="#333"
                :customStyle="inputStyle"
                v-model="personInfoForm.userInfo.nickName"
                :placeholder="$t('Please enter a nickname')"
              ></u--input>
            </u-form-item>
            <u-form-item labelPosition="top" :label="$t('Company Name')" prop="userInfo.company">
              <u--input
                fontSize="24rpx"
                color="#666"
                :customStyle="inputStyle"
                v-model="personInfoForm.userInfo.company"
                :placeholder="$t('Please enter your business address')"
                :disabled="disabled"
              ></u--input>
            </u-form-item>
            <u-form-item labelPosition="top" :label="$t('Contact email')" prop="userInfo.email">
              <u--input
                fontSize="24rpx"
                color="#666"
                :customStyle="inputStyle"
                v-model="personInfoForm.userInfo.email"
                :placeholder="$t('Please enter your contact email')"
                :disabled="disabled"
              ></u--input>
            </u-form-item>
            <u-form-item labelPosition="top" :label="$t('contact number')" prop="userInfo.phonenumber">
              <u--input
                fontSize="24rpx"
                color="#666"
                :customStyle="inputStyle"
                v-model="personInfoForm.userInfo.phonenumber"
                :placeholder="$t('Please fill in the contact number')"
                :disabled="disabled"
              ></u--input>
            </u-form-item>
          </u--form>
          <u-button :text="$t('Save Changes')" :customStyle="btnCustomStyle" @click="submit"></u-button>
          <!-- <u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import MyUploadAvatar from '@/components/myUploadAvatar.vue';
const LoginServer = require('../../common/store/loginServer.js');
const Api = require('../../common/store/api.js');
const MineServer = require('../../common/store/mineServer.js');
const host = Api.host;
export default {
  data() {
    return {
      // 文字提示
      link: 'https://jwecshop.oss-cn-shenzhen.aliyuncs.com/upload/20240606/userAvatar_723330.png',
      errorType: 'toast',
      avatar: '',
      btnChange: `${host}/public/tabbar/mine/buttonChange.png`,
      fileList6: [],
      labelStyle: {
        fontSize: '36rpx',
        color: '#333',
        lineHeight: '150%',
        fontWeight: 'Bold',
        marginBottom: '14rpx',
        padding: 0,
      },
      inputStyle: {
        padding: '0 40rpx',
        height: '104rpx',
      },
      btnCustomStyle: {
        width: '100%',
        height: '104rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
        color: '#FFF',
        marginTop: '28rpx',
        fontWeight: 'Bold',
        borderRadius: '12rpx',
      },
      personInfoForm: {
        userInfo: {
          avatar: 'https://jwecshop.oss-cn-shenzhen.aliyuncs.com/upload/20240606/userAvatar_723330.png',
          nickName: '',
          company: '',
          email: '',
          phonenumber: '',
        },
      },
      rules: {
        'userInfo.nickName': [
          {
            type: 'string',
            required: true,
            message: this.$t('Please enter a nickname'),
            trigger: ['blur', 'change'],
          },
        ],
        // 'userInfo.company': [{
        // 	type: 'string',
        // 	required: true,
        // 	message: '请填写公司',
        // 	trigger: ['blur', 'change']
        // }],
        // "userInfo.email": [
        // 	// 必填规则
        // 	{
        // 		required: true,
        // 		message: '请输入邮箱',
        // 		// blur和change事件触发检验
        // 		trigger: ['blur', 'change'],
        // 	},
        // 	// 邮箱校验
        // 	{
        // 		trigger: ['blur', 'change'],
        // 		validator: (rule, value, callback) => {
        // 			return uni.$u.test.email(value)
        // 		},
        // 		message: '邮箱格式不正确'
        // 	},
        // ],
        // "userInfo.phonenumber": [
        // 	{
        // 		required: true,
        // 		message: '请输入手机号',
        // 		// blur和change事件触发检验
        // 		trigger: ['blur', 'change'],
        // 	}
        // ],
      },
      oldUserInfo: {},
      disabled: false,
    };
  },
  components: {
    MyUploadAvatar,
  },
  onReady() {
    // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
    // this.$refs.form1.setRules(this.rules)
    this.getUserProfile();
    this.getTenantapplyInfo();
  },
  methods: {
    submit() {
      let that = this;
      console.log('头像', this.link);
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
      that.$refs.form1
        .validate()
        .then((res) => {
          uni.$u.toast(that.$t('Verification passed'));
          console.log(that.personInfoForm);
          let params = that.personInfoForm.userInfo;
          LoginServer.putUserProfile(params, {
            success(res) {
              uni.$u.toast(res.msg);
              that.getUserProfile();
            },
            fail(error) {
              uni.$u.toast(error);
              console.log('修改用户信息err', error);
            },
          });
        })
        .catch((errors) => {
          console.log(errors);
          uni.$u.toast(errors[0].message);
        });
    },
    reset() {
      const validateList = ['userInfo.name'];
      this.$refs.form1.resetFields();
      this.$refs.form1.clearValidate();
      setTimeout(() => {
        this.$refs.form1.clearValidate(validateList);
        // 或者使用 this.$refs.form1.clearValidate()
      }, 10);
    },
    hideKeyboard() {
      uni.hideKeyboard();
    },
    // 选择头像
    // onChooseAvatorEvent() {
    //   let that = this;
    //   uni.chooseImage({
    //     count: 1,
    //     sizeType: 'compressed',
    //     sourceType: ['album', 'camera'],
    //     success(res) {
    //       that.userProfileAvatar(res.tempFilePaths[0]);
    //     },
    //   });
    // },

    // 定义方法来处理图片选择
    onChooseAvatorEvent() {
      // 弹出提示框，告知用户请求权限的目的
      let that = this;
      console.log('打开弹窗');
      uni.showModal({
        title: '权限请求',
        content: '我们需要访问您的相机或相册来选择头像。',
        success: (res) => {
          if (res.confirm) {
            // 用户点击确认后，调用选择图片功能
            // uni.chooseImage({
            //   count: 1, // 选择一张图片
            //   sizeType: ['compressed'], // 压缩图片
            //   sourceType: ['album', 'camera'], // 可选择相册或拍摄
            //   success: (chooseRes) => {
            //     // 图片选择成功后，传入相应方法
            //     that.userProfileAvatar(chooseRes.tempFilePaths[0]);
            //   },
            //   fail: (err) => {
            //     console.log('选择图片失败:', err);
            //   },
            // });
          } else if (res.cancel) {
            // 用户点击取消，提示用户权限未授予
            uni.showToast({
              title: '您未授权权限，无法选择图片',
              icon: 'none',
            });
          }
        },
      });
    },

    /**
     * 上传头像
     */
    userProfileAvatar(filePath) {
      let that = this;

      uni.showLoading({
        title: that.$t('uploading'),
      });

      MineServer.userProfileAvatar(filePath, {
        success(res) {
          uni.hideLoading();
          uni.showToast({
            title: that.$t('Upload successful'),
            icon: 'none',
          });
          that.personInfoForm.userInfo.avatar = res.imgUrl;
        },
        fail(error) {
          uni.hideLoading();
          uni.showToast({
            title: that.$t('Upload failed'),
            icon: 'none',
          });
        },
      });
    },
    // 获取用户信息
    getUserProfile() {
      let that = this;
      LoginServer.getUserProfile({
        success(res) {
          console.log('获取用户信息', res);
          that.oldUserInfo = res;
          that.personInfoForm.userInfo.avatar = that.oldUserInfo.avatar
            ? that.oldUserInfo.avatar
            : that.personInfoForm.userInfo.avatar;
          that.personInfoForm.userInfo.nickName = that.oldUserInfo.nickName;

          // that.personInfoForm.userInfo.phonenumber = that.oldUserInfo.phonenumber
          // that.personInfoForm.userInfo.email = that.oldUserInfo.email
          // that.personInfoForm.userInfo.nickName = that.oldUserInfo.nickName
        },
        fail(error) {
          console.log('获取用户信息err', error);
        },
      });
    },
    getTenantapplyInfo() {
      let that = this;
      MineServer.getTenantapplyInfo({
        success(res) {
          console.log('企业认证状态', res.data);
          if (!uni.$u.test.object(res.data)) {
            return;
          }

          if (res.data.applyStatusCode === '1') {
            that.disabled = true;
          }
        },
        fail(err) {},
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .u-button__text {
  font-size: 32rpx !important;
}

.content {
  width: 100%;
  @include flex(column);
  align-items: center;
  justify-content: center;

  .avatar {
    width: 428rpx;
    height: 236rpx;
    margin: 48rpx 0 30rpx 0;
    @include flex(column);
    align-items: center;
    position: relative;

    .btnChange {
      position: absolute;
      bottom: 0;
    }
  }

  .container {
    width: 100%;
    padding: 0 24rpx;

    .u-demo-block {
      width: 100%;
    }
  }
}
</style>
