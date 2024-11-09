<template>
  <view class="container">
    <view class="u-demo-block">
      <view class="u-demo-block__content">
        <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
        <u--form
          :errorType="errorType"
          labelPosition="top"
          labelWidth="auto"
          :labelStyle="labelStyle"
          :model="enterprise"
          ref="form"
        >
          <u-form-item labelPosition="top" :label="$t('Company Name')" prop="tenantName">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.tenantName"
              :placeholder="$t('Please enter company name')"
              :disabled="disabled"
            ></u--input>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('company address')" prop="address">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.address"
              :disabled="disabled"
              :placeholder="$t('Please enter your business address')"
            ></u--input>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('credit code')" prop="companyCertNo">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.companyCertNo"
              :placeholder="$t('please.enter.credit.code')"
              :disabled="disabled"
            ></u--input>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('legal person')" prop="companyManName">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.companyManName"
              :placeholder="$t('Please enter legal person')"
              :disabled="disabled"
            ></u--input>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('Contact email')" prop="userEmail">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              :disabled="disabled"
              v-model="enterprise.userEmail"
              :placeholder="$t('Please enter your contact email')"
            ></u--input>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('contact number')" prop="userPhone">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              :disabled="disabled"
              v-model="enterprise.userPhone"
              :placeholder="$t('Please fill in the contact number')"
            >
            </u--input>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('Country')" prop="country" @click="hideKeyboard()">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.country"
              :disabled="disabled"
              :placeholder="$t('Please select your country')"
            ></u--input>
            <u-icon v-if="!disabled" slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('Industry')" prop="tradeName" @click="hideKeyboardIndustry()">
            <u--input
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.tradeName"
              :disabled="disabled"
              :placeholder="$t('Please select your industry')"
            ></u--input>
            <u-icon v-if="!disabled" slot="right" name="arrow-right"></u-icon>
          </u-form-item>
          <u-form-item labelPosition="top" :label="$t('Procurement budget')" prop="budget">
            <u--input
              type="number"
              fontSize="24rpx"
              color="#666"
              :customStyle="inputStyle"
              v-model="enterprise.budget"
              :disabled="disabled"
              :placeholder="$t('Please enter your purchasing budget')"
            ></u--input>
          </u-form-item>
        </u--form>
        <block v-if="applyStatusCode === 0">
          <u-button :text="$t('under review')" :customStyle="btnCustomStyle" disabled></u-button>
        </block>
        <block v-else-if="applyStatusCode === 1">
          <u-button :text="$t('verified')" :customStyle="btnCustomStyle" disabled></u-button>
        </block>
        <block v-else-if="applyStatusCode === 2">
          <u-button
            :text="$t('Modify Submit')"
            :customStyle="btnCustomStyle"
            @click="submitTenantapplyCurrent"
          ></u-button>
        </block>
        <block v-else>
          <commonButton :text="$t('Apply for certification')" @click="submit" style="margin: 20rpx 0rpx"></commonButton>
        </block>
        <u-picker
          :cancelText="cancelText"
          :confirmText="confirmText"
          :show="showSategory"
          @confirm="categoryIdSelect"
          :columns="actions"
          @cancel="showSategory = false"
          keyName="name"
        ></u-picker>
        <u-picker
          :cancelText="cancelText"
          :confirmText="confirmText"
          :show="showIndustry"
          @confirm="industrySelect"
          :columns="industryList"
          @cancel="showIndustry = false"
          keyName="name"
        ></u-picker>
        <!-- <u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button> -->
      </view>
    </view>
  </view>
</template>

<script>
const IndexServer = require('../../common/store/indexServer.js');
const MineServre = require('../../common/store/mineServer.js');
const Validate = require('../../common/utils/validate.js');
import commonButton from '@/components/myButton/commonButton.vue';
export default {
  data() {
    return {
      cancelText: this.$t('cancelText'),
      confirmText: this.$t('confirmText'),
      errorType: 'toast',
      labelStyle: {
        fontSize: '28rpx',
        color: '#333',
        lineHeight: '150%',
        fontWeight: 'Bold',
        marginBottom: '14rpx',
        padding: 0,
      },
      disabled: false,
      inputStyle: {
        padding: '0 40rpx',
        height: '80rpx',
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
      codeCustomStyle: {
        background: '#fff',
        color: '#1989FA',
        border: 0,
        textDecoration: 'underline',
      },
      enterprise: {
        tenantName: '',
        address: '',
        companyCertNo: '',
        companyManName: '',
        userEmail: '',
        userPhone: '',
        tradeName: '',
        budget: '',
        country: '',
      },
      rules: {
        tenantName: [
          {
            type: 'string',
            required: true,
            message: this.$t('Please enter company name'),
            trigger: ['blur', 'change'],
          },
        ],
        address: {
          type: 'string',
          required: true,
          message: this.$t('Please enter your business address'),
          trigger: ['blur', 'change'],
        },
        companyCertNo: {
          type: 'string',
          required: true,
          message: this.$t('please.enter.credit.code'),
          trigger: ['blur', 'change'],
        },
        companyManName: {
          type: 'string',
          required: true,
          message: this.$t('Please enter legal person'),
          trigger: ['blur', 'change'],
        },
        userEmail: [
          {
            type: 'string',
            required: true,
            message: this.$t('Please enter your contact email'),
            trigger: ['blur', 'change'],
          },
          // 邮箱校验
          {
            trigger: ['blur', 'change'],
            validator: (rule, value, callback) => {
              return uni.$u.test.email(value);
            },
            message: this.$t('E-mail format is incorrect'),
          },
        ],
        userPhone: {
          type: 'string',
          required: true,
          message: this.$t('Please fill in the contact number'),
          trigger: ['blur', 'change'],
        },
        tradeName: {
          type: 'string',
          required: true,
          message: this.$t('Please select your industry'),
          trigger: ['blur', 'change'],
        },
        budget: {
          type: 'number',
          required: true,
          message: this.$t('Please enter your purchasing budget'),
          trigger: ['blur', 'change'],
        },
        country: {
          type: 'string',
          required: true,
          message: this.$t('Please select your country'),
          trigger: ['blur', 'change'],
        },
      },
      applyStatusCode: '', // 审核状态
      placeholder: this.$t('Please select your country'),
      actions: [],
      industryList: [],
      showSategory: false,
      showIndustry: false,
    };
  },
  components: {
    commonButton,
  },
  onReady() {
    //onReady 为uni-app支持的生命周期之一
    this.$refs.form.setRules(this.rules);
  },
  onLoad() {
    // this.getTenantapplyInfo();
    // this.getClientCountry();
    // this.getClientIndustry();
  },
  methods: {
    categoryIdSelect(e) {
      this.enterprise.country = e.value[0].name;
      this.$refs.form.validateField('country');
      this.showSategory = false;
    },
    industrySelect(e) {
      this.enterprise.tradeName = e.value[0].name;
      this.$refs.form.validateField('tradeName');
      this.showIndustry = false;
    },
    submit() {
      let that = this;
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
      that.$refs.form
        .validate()
        .then((res) => {
          let params = that.enterprise;
          let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
          params.userId = userInfo.userId;

          uni.$u.toast('提交成功！');
          // console.log(params.userId)
          // MineServre.tenantapplyInsert(params, {
          //   success(res) {
          //     // console.log('企业认证提交', res)
          //     uni.$u.toast(res.msg);
          //     // that.reset()
          //     that.getTenantapplyInfo();
          //   },
          //   fail(error) {
          //     uni.$u.toast(error);
          //     // that.reset()
          //   },
          // });
        })
        .catch((errors) => {
          uni.$u.toast(errors[0].message);
          // uni.$u.toast('校验失败')
        });
    },
    submitTenantapplyCurrent() {
      let that = this;
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
      that.$refs.form
        .validate()
        .then((res) => {
          let params = that.enterprise;
          let userInfo = JSON.parse(uni.getStorageSync('userInfo'));
          params.userId = userInfo.userId;
          // console.log(params.userId)
          MineServre.tenantapplyCurrent(params, {
            success(res) {
              // console.log('企业认证提交', res)
              uni.$u.toast(res.msg);
              // that.reset()
              that.getTenantapplyInfo();
            },
            fail(error) {
              uni.$u.toast(error);
              that.reset();
            },
          });
        })
        .catch((errors) => {
          uni.$u.toast(errors[0].message);
          // uni.$u.toast('校验失败')
        });
    },
    reset() {
      const validateList = [
        'enterprise.tenantName',
        'enterprise.address',
        'enterprise.companyCertNo',
        'enterprise.companyManName',
        'enterprise.userEmail',
        'enterprise.userPhone',
        'enterprise.tradeName',
        'enterprise.budget',
      ];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      setTimeout(() => {
        this.$refs.form.clearValidate(validateList);
        // 或者使用 this.$refs.form.clearValidate()
      }, 10);
    },
    hideKeyboard() {
      if (!this.disabled) {
        this.showSategory = true;
      }
      uni.hideKeyboard();
    },
    hideKeyboardIndustry() {
      if (!this.disabled) {
        this.showIndustry = true;
      }
      uni.hideKeyboard();
    },
    getTenantapplyInfo() {
      let that = this;
      MineServre.getTenantapplyInfo({
        success(res) {
          if (!uni.$u.test.object(res.data)) {
            return;
          }
          that.applyStatusCode = res.data.applyStatusCode;
          switch (that.applyStatusCode) {
            case 0:
              that.disabled = true;
              break;
            case 1:
              that.disabled = true;
              break;
            case 2:
              that.disabled = false;
              break;
            default:
              that.disabled = false;
              break;
          }
          console.log('that.applyStatusCode', that.applyStatusCode);
          let { tenantName, address, companyCertNo, companyManName, userEmail, userPhone, tradeName, budget, country } =
            res.data;
          that.enterprise = {
            tenantName: tenantName,
            address: address,
            companyCertNo: companyCertNo,
            companyManName: companyManName,
            userEmail: userEmail,
            userPhone: userPhone,
            tradeName: tradeName,
            budget: budget,
            country: country,
          };
        },
        fail() {},
      });
    },
    // 获取国家
    getClientCountry() {
      let that = this;
      MineServre.getClientCountry({
        success(res) {
          if (!uni.$u.test.array(res.data)) {
            uni.$u.toast(that.$t('Country loading failed'));
            return;
          }
          that.actions.push(res.data);
          console.log('that.actions', that.actions);
        },
        fail(err) {
          uni.$u.toast(that.$t('Country loading failed'));
        },
      });
    },
    // 获取行业分类
    getClientIndustry() {
      let that = this;
      IndexServer.getClientIndustry({
        success(res) {
          if (!uni.$u.test.array(res.data)) {
            uni.$u.toast(that.$t('Product category loading failed'));
            return;
          }
          that.industryList.push(res.data);
        },
        fail(err) {
          uni.$u.toast(that.$t('Product category loading failed'));
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .u-button__text {
  font-size: 32rpx !important;
}

.container {
  width: 100%;
  padding: 20rpx 24rpx 0 24rpx;

  .u-demo-block {
    width: 100%;

    /deep/ .u-form-item__body__right__content {
      position: relative;
    }

    /deep/ .item__body__right__content__icon {
      position: absolute;
      top: 50%;
      right: 40rpx;
      transform: translateY(-50%);
    }
  }
}
</style>
