<template>
  <view class="content">
    <!-- 添加顶部装饰 -->
    <view class="header-decoration">
      <view class="decoration-circle"></view>
      <view class="decoration-line"></view>
    </view>

    <view class="form-container">
      <view class="form-header">
        <text class="form-title">申请金融服务</text>
        <text class="form-subtitle">Professional Services</text>
      </view>

      <u--form
        labelPosition="left"
        :errorType="errorType"
        :labelStyle="{
          fontSize: '28rpx',
          color: '#333',
          fontWeight: '500',
          marginRight: '12rpx',
          marginBottom: '12rpx',
        }"
        :rules="rules"
        :model="personInfoForm"
        ref="form1"
      >
        <u-form-item label="公司名称" prop="company_name" labelWidth="130" labelPosition="top">
          <u--input
            fontSize="28rpx"
            color="#333"
            :customStyle="inputStyle"
            v-model="personInfoForm.company_name"
            :placeholder="$t('Please enter a company_name')"
          >
            <template #prefix>
              <u-icon name="home" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
          </u--input>
        </u-form-item>

        <u-form-item label="联系人" prop="contact_person" labelWidth="130" labelPosition="top">
          <u--input
            fontSize="28rpx"
            color="#333"
            :customStyle="inputStyle"
            v-model="personInfoForm.contact_person"
            :placeholder="$t('Please enter your contact_person')"
            :disabled="disabled"
          >
            <template #prefix>
              <u-icon name="account" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
          </u--input>
        </u-form-item>

        <u-form-item label="联系方式" prop="userInfo.contact_info" labelWidth="130" labelPosition="top">
          <u--input
            fontSize="28rpx"
            color="#333"
            :customStyle="inputStyle"
            v-model="personInfoForm.contact_info"
            :placeholder="$t('Please enter your contact_info')"
            :disabled="disabled"
          >
            <template #prefix>
              <u-icon name="phone" size="36rpx" color="#2E5BB3"></u-icon>
            </template>
          </u--input>
        </u-form-item>

        <u-form-item label="备注" prop="remark" labelWidth="130" labelPosition="top">
          <u--textarea
            fontSize="28rpx"
            color="#333"
            :customStyle="inputStyle"
            v-model="personInfoForm.remark"
            :placeholder="$t('Please fill in the remark')"
            :disabled="disabled"
          ></u--textarea>
        </u-form-item>

        <u-form-item label="附件" prop="attachment" labelWidth="130" labelPosition="top">
          <MyUpload v-model="personInfoForm.attachment"></MyUpload>
        </u-form-item>
      </u--form>

      <view class="submit-section">
        <u-button text="提交申请" :customStyle="btnCustomStyle" @click="submit">
          <template #icon>
            <u-icon name="checkmark" color="#fff" size="32rpx"></u-icon>
          </template>
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import MyUploadAvatar from '@/components/myUploadAvatar.vue';
const LoginServer = require('@/common/store/loginServer.js');
const Api = require('@/common/store/api.js');
const IndexServer = require('@/common/store/indexServer.js');
import MyUpload from '@/components/myUpload.vue';
import MyDropdown from '@/components/my-dropdown/my-dropdown.vue';
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
        fontSize: '28rpx',
        color: '#333',
        fontWeight: '500',
        marginRight: '12rpx',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      },
      inputStyle: {
        background: '#f8f9fa',
        border: '2rpx solid #e9ecef',
        borderRadius: '12rpx',
        padding: '24rpx 32rpx',
        height: '88rpx',
      },
      btnCustomStyle: {
        width: '100%',
        height: '94rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #2CD6F9 0%, #1A5Bd3 100%)',
        color: '#FFF',
        marginTop: '28rpx',
        fontWeight: 'Bold',
        borderRadius: '22rpx',
      },
      personInfoForm: {
        attachment: [],
        company_name: '',
        remark: '',
        contact_info: '',
        contact_person: '',
        type: 'jr',
      },
      show: true,

      rules: {
        'userInfo.nickName': [
          {
            type: 'string',
            required: true,
            message: this.$t('Please enter a nickname'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      oldUserInfo: {},
      disabled: false,
      selectedType: '',
      businessTypes: [
        {
          text: '金融',
          value: 'jr',
        },
        {
          text: '物流',
          value: 'wl',
        },
        {
          text: '仓储',
          value: 'cc',
        },
        {
          text: '电商',
          value: 'ds',
        },
      ],
    };
  },
  components: {
    MyUploadAvatar,
    MyUpload,
    MyDropdown,
  },
  computed: {},

  methods: {
    submit() {
      let that = this;

      that.$refs.form1
        .validate()
        .then((res) => {
          uni.$u.toast(that.$t('Verification passed'));

          let params = that.personInfoForm;
          params.attachment = params.attachment.join(',');
          console.log('params', params);
          IndexServer.applySupplier(params, {
            success(res) {
              uni.$u.toast(res.msg);
            },
            fail(error) {
              uni.$u.toast(error);
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
    handleBusinessTypeChange(item) {
      this.selectedType = item.text;
      this.personInfoForm.type = item.value;
      console.log('选择的业务类型:', this.personInfoForm);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  position: relative;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200rpx;
  overflow: hidden;

  .decoration-circle {
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 300rpx;
    height: 300rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(46, 91, 179, 0.1), rgba(46, 91, 179, 0.05));
  }

  .decoration-line {
    position: absolute;
    top: 60rpx;
    left: 40rpx;
    width: 120rpx;
    height: 6rpx;
    background: #2e5bb3;
    border-radius: 3rpx;

    &::before {
      content: '';
      position: absolute;
      left: -20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 12rpx;
      height: 12rpx;
      border-radius: 50%;
      background: #2e5bb3;
    }
  }
}

.form-container {
  padding: 40rpx 32rpx;
  margin: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.05);

  :deep(.u-form-item) {
    .u-form-item__body {
      padding: 0;

      .u-form-item__body__left {
        width: auto !important;
        margin-bottom: 12rpx;

        &__content {
          display: flex;
          align-items: center;
          white-space: nowrap;

          &__label {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
            padding-right: 12rpx;
          }
        }
      }
    }
  }
}

.form-header {
  text-align: center;
  margin-bottom: 48rpx;

  .form-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #2e5bb3;
    margin-bottom: 8rpx;
    display: block;
  }

  .form-subtitle {
    font-size: 24rpx;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 2rpx;
  }
}

.form-group {
  margin-bottom: 32rpx;
  position: relative;

  :deep(.u-input) {
    &__content {
      background: #f8f9fa;
      border: 2rpx solid #e9ecef;
      border-radius: 12rpx;
      padding: 24rpx 32rpx;
      transition: all 0.3s ease;

      &__field-wrapper {
        &__field {
          font-size: 28rpx;
          color: #333;
        }
      }

      &:focus-within {
        border-color: #2e5bb3;
        box-shadow: 0 0 0 2rpx rgba(46, 91, 179, 0.1);
      }
    }
  }

  :deep(.u-textarea) {
    &__content {
      background: #f8f9fa;
      border: 2rpx solid #e9ecef;
      border-radius: 12rpx;
      padding: 24rpx 32rpx;
      min-height: 180rpx;
      transition: all 0.3s ease;

      &__field {
        font-size: 28rpx;
        color: #333;
      }

      &:focus-within {
        border-color: #2e5bb3;
        box-shadow: 0 0 0 2rpx rgba(46, 91, 179, 0.1);
      }
    }
  }
}

.inputStyle {
  background: #f8f9fa;
  border: 2rpx solid #e9ecef;
  border-radius: 12rpx;
  padding: 24rpx 32rpx;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2e5bb3;
    box-shadow: 0 0 0 2rpx rgba(46, 91, 179, 0.1);
  }
}

.textareaStyle {
  @extend .inputStyle;
  min-height: 180rpx;
}

.submit-section {
  margin-top: 48rpx;
  padding: 0 32rpx;
}

.btnCustomStyle {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #4b79e4 0%, #2e5bb3 100%);
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 8rpx 16rpx rgba(46, 91, 179, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;

  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 8rpx rgba(46, 91, 179, 0.15);
  }
}

.footer-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  overflow: hidden;

  .decoration-wave {
    position: absolute;
    bottom: -60rpx;
    left: 0;
    right: 0;
    height: 120rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' style='fill: rgba(46, 91, 179, 0.05)'/%3E%3C/svg%3E")
      repeat-x;
    background-size: 1200px 120px;
    animation: wave 20s linear infinite;
  }
}

@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1200px);
  }
}

:deep(.u-dropdown) {
  .u-dropdown__menu {
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 24rpx 32rpx;
    height: 88rpx;

    &__item {
      &__text {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .u-dropdown__content {
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

    .u-cell {
      padding: 24rpx 32rpx;

      &__title {
        font-size: 28rpx;
        color: #333;
      }

      &--hover {
        background: #f8f9fa;
      }

      &--checked {
        .u-cell__title {
          color: #2e5bb3;
          font-weight: 500;
        }
      }
    }
  }
}

:deep(.u-form-item__message) {
  padding-top: 8rpx;
  font-size: 24rpx;
}
</style>
