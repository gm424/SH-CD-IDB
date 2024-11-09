<template>
  <u-popup
    :show="show"
    @open="open"
    :round="10"
    mode="bottom"
    :closeable="true"
    :closeOnClickOverlay="false"
    @close="close"
    :customStyle="{ backgroundColor: '#f5f5f5', padding: '40rpx 10rpx' }"
    :safeAreaInsetBottom="true"
    :overlay="true"
    :overlayStyle="{ background: 'rgba(0, 0, 0, 0.2)', zIndex: '19975' }"
    zIndex="29975"
  >
    <view class="addressContainer">
      <u--form labelPosition="left" :model="model" :rules="rules" ref="uForm" style="margin-bottom: 80rpx">
        <u-form-item
          label="联系人"
          prop="shipping_contactName"
          labelWidth="200"
          :borderBottom="false"
          :labelStyle="{ fontSize: '10rpx' }"
        >
          <u--input v-model="model.shipping_contactName"></u--input>
        </u-form-item>
        <u-form-item label="电话" prop="shipping_phone" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_phone"></u--input>
        </u-form-item>
        <u-form-item label="邮箱" prop="shipping_email" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_email"></u--input>
        </u-form-item>

        <!-- <u-form-item
          :label="$t('Country')"
          prop="shipping_Country"
          @click="hideKeyboard()"
          :borderBottom="false"
          labelWidth="200"
        >
          <u--input v-model="model.shipping_Country" :placeholder="$t('Please select your country')"></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item> -->
        <!-- <u-form-item label="洲" prop="shipping_State" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_State"></u--input>
        </u-form-item> -->
        <u-form-item label="洲代码" prop="shipping_zipcode" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_zipcode"></u--input>
        </u-form-item>
        <!-- <u-form-item label="邮编" prop="shipping_Postcode" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_Postcode"></u--input>
        </u-form-item> -->
        <u-form-item label="国家" prop="shipping_country" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_country"></u--input>
        </u-form-item>
        <u-form-item label="省份" prop="shipping_province" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_province"></u--input>
        </u-form-item>
        <u-form-item label="城市" prop="shipping_city" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_city"></u--input>
        </u-form-item>
        <u-form-item label="详细地址1" prop="shipping_address_1" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_address_1"></u--input>
        </u-form-item>
        <u-form-item label="详细地址2" prop="shipping_address_2" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_address_2"></u--input>
        </u-form-item>
        <!-- <u-form-item label="门牌号" prop="shipping_StreetNum" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_StreetNum"></u--input>
        </u-form-item>
        <u-form-item label="身份证号" prop="shipping_IdentityCardNo" :borderBottom="false" labelWidth="200">
          <u--input v-model="model.shipping_IdentityCardNo"></u--input>
        </u-form-item> -->
      </u--form>
      <view style="position: fixed; bottom: 0; left: 0; width: 100%; padding: 20rpx 10rpx; background-color: #f7f7f7">
        <commonButton :text="$t('Confirm')" @click="addAddress"></commonButton>
      </view>
    </view>
    <u-picker
      :cancelText="cancelText"
      :confirmText="confirmText"
      :show="showSategory"
      @confirm="categoryIdSelect"
      :columns="actions"
      @cancel="showSategory = false"
      keyName="name"
    ></u-picker>
  </u-popup>
</template>

<script>
import commonButton from '@/components/myButton/commonButton.vue';
const MineServre = require('@/common/store/mineServer.js');
export default {
  data() {
    return {
      cancelText: this.$t('cancelText'),
      confirmText: this.$t('confirmText'),
      actions: [],
      showSategory: false,
      show: false,
      showSex: false,
      model: {
        shipping_contactName: '',
        // shipping_ContactTel: '',
        shipping_phone: '',
        shipping_email: '',
        shipping_country: '',
        // shipping_State: '',
        shipping_zipcode: '',
        // shipping_Postcode: '',
        shipping_city: '',
        shipping_address_1: '',
        shipping_address_2: '',
        // shipping_StreetNum: '',
        // shipping_IdentityCardNo: '',
      },

      rules: {
        shipping_contactName: {
          type: 'string',
          required: true,
          message: '请填写联系人',
          trigger: ['blur', 'change'],
        },
        shipping_phone: {
          type: 'string',
          required: true,
          message: '请填写电话',
          trigger: ['blur', 'change'],
        },
        shipping_email: {
          type: 'string',
          required: true,
          message: '请填写邮箱',
          trigger: ['blur', 'change'],
        },
        shipping_country: {
          type: 'string',
          required: true,
          message: '请填写国家',
          trigger: ['blur', 'change'],
        },

        shipping_city: {
          type: 'string',
          required: true,
          message: '请填写城市',
          trigger: ['blur', 'change'],
        },
        shipping_address_1: {
          type: 'string',
          required: true,
          message: '请填写详细地址',
          trigger: ['blur', 'change'],
        },
      },
      radio: '',
      switchVal: false,
    };
  },
  components: {
    commonButton,
  },
  mounted() {
    // this.getClientCountry();
  },
  methods: {
    open() {},
    close() {
      this.show = false;
    },
    addAddress() {
      this.$refs.uForm.validate().then((res) => {
        this.$emit('getAddress', this.model);
        this.show = false;
      });
    },
    hideKeyboard() {
      this.showSategory = true;
      uni.hideKeyboard();
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
    categoryIdSelect(e) {
      this.model.shipping_Country = e.value[0].name;
      this.$refs.uForm.validateField('shipping_Country');
      this.showSategory = false;
    },
  },
};
</script>

<style scoped>
.addressContainer {
  height: 70vh;
  overflow-y: scroll;
  padding: 20rpx 20rpx;
}
.u-line {
  border-bottom: none !important;
}
.u-form-item__body__left__content__label {
  font-size: 20rpx !important;
}
</style>
