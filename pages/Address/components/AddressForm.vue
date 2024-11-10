<template>
  <u-popup
    :show="show"
    mode="bottom"
    :safeAreaInsetBottom="true"
    borderRadius="24"
    :customStyle="{
      margin: '0 auto',
      width: '100%',
      maxWidth: '430px',
    }"
  >
    <view class="address-form">
      <!-- 表单头部 -->
      <view class="form-header">
        <text class="title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
        <view class="close-btn" @click="handleClose">
          <u-icon name="close" color="#999" size="32"></u-icon>
        </view>
      </view>

      <!-- 表单内容 -->
      <view class="form-content">
        <u-form :model="formData" ref="addressForm" :rules="rules" labelPosition="left" labelWidth="160">
          <!-- 联系人 -->
          <u-form-item label="联系人" prop="shipping_contactName" borderBottom>
            <u-input
              v-model="formData.shipping_contactName"
              placeholder="请输入联系人姓名"
              border="none"
              clearable
            ></u-input>
          </u-form-item>

          <!-- 手机号码 -->
          <u-form-item label="手机号码" prop="shipping_phone" borderBottom>
            <u-input
              v-model="formData.shipping_phone"
              placeholder="请输入手机号码"
              type="number"
              border="none"
              clearable
            ></u-input>
          </u-form-item>

          <u-form-item label="联系人邮箱" prop="shipping_email" borderBottom>
            <u-input v-model="formData.shipping_email" placeholder="请输入联系人邮箱" border="none" clearable></u-input>
          </u-form-item>

          <u-form-item label="联系人国家" prop="shipping_country" borderBottom>
            <u-input
              v-model="formData.shipping_country"
              placeholder="请输入国家二字码"
              border="none"
              clearable
            ></u-input>
          </u-form-item>
          <u-form-item label="联系人州代码" prop="shipping_zipcode" borderBottom>
            <u-input v-model="formData.shipping_zipcode" placeholder="联系人州代码" border="none" clearable></u-input>
          </u-form-item>
          <u-form-item label="联系人省" prop="shipping_province" borderBottom>
            <u-input
              v-model="formData.shipping_province"
              placeholder="请输入联系人省"
              border="none"
              clearable
            ></u-input>
          </u-form-item>
          <u-form-item label="联系人城市" prop="shipping_city" borderBottom>
            <u-input v-model="formData.shipping_city" placeholder="请输入联系人城市" border="none" clearable></u-input>
          </u-form-item>

          <!-- 详细地址 -->
          <u-form-item label="详细地址1" prop="shipping_address_1" borderBottom>
            <u-input
              v-model="formData.shipping_address_1"
              type="textarea"
              placeholder="请输入详细地址，如街道、门牌号等"
              border="none"
              height="100"
            ></u-input>
          </u-form-item>
          <!-- 详细地址 -->
          <u-form-item label="详细地址2" prop="shipping_address_2" borderBottom>
            <u-input
              v-model="formData.shipping_address_2"
              type="textarea"
              placeholder="请输入详细地址，如街道、门牌号等"
              border="none"
              height="100"
            ></u-input>
          </u-form-item>

          <!-- 设为默认地址 -->
          <u-form-item label="设为默认地址">
            <u-switch v-model="formData.isDefault" activeColor="#2E5BB3" size="48"></u-switch>
          </u-form-item>
        </u-form>
      </view>

      <!-- 表单底部 -->
      <view class="form-footer">
        <u-button
          text="保存"
          type="primary"
          @click="handleSubmit"
          :customStyle="{
            width: '100%',
            height: '88rpx',
            background: 'linear-gradient(135deg, #4B79E4 0%, #2E5BB3 100%)',
            borderRadius: '44rpx',
          }"
        ></u-button>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: 'AddressForm',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    addressData: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      showRegionPicker: false,
      show: false,
      formData: {
        shipping_contactName: '',
        shipping_phone: '',
        shipping_province: '',
        shipping_city: '',
        shipping_zipcode: '',
        shipping_country: '',

        shipping_address_1: '',
        shipping_address_2: '',
        isDefault: false,
      },
      rules: {
        shipping_contactName: [
          {
            required: true,
            message: '请输入联系人姓名',
            trigger: ['blur', 'change'],
          },
        ],
        shipping_phone: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change'],
          },
        ],
        shipping_country: [
          {
            required: true,
            message: '请输入国家二字码，长度为2',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '请输入正确的国家二字码，长度为2',
            trigger: ['blur', 'change'],
          },
        ],
        shipping_address_1: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: ['blur', 'change'],
          },
        ],
      },
    };
  },
  watch: {
    show(newVal) {
      if (newVal && this.isEdit) {
        this.formData = { ...this.addressData };
      }
    },
  },
  methods: {
    // 打开地区选择器
    openRegionPicker() {
      this.showRegionPicker = true;
    },

    // 关闭弹窗
    handleClose() {
      this.show = false;
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.formData = {
        name: '',
        phone: '',

        province: '',
        city: '',
        district: '',
        address: '',
        isDefault: false,
      };
      this.$refs.addressForm.resetFields();
    },

    // 提交表单
    handleSubmit() {
      // this.$refs.addressForm.validate((valid) => {
      //   if (valid) {

      //   }
      // });
      console.log('保存');
      this.$emit('submit', this.formData);
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.address-form {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 2rpx solid #f5f5f5;

    .title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }

    .close-btn {
      padding: 12rpx;
    }
  }

  .form-content {
    padding: 24rpx 32rpx;
    max-height: 60vh;
    overflow-y: auto;

    .region-input {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 48rpx;

      .region-text {
        font-size: 28rpx;
        color: #333;
      }

      .placeholder {
        font-size: 28rpx;
        color: #999;
      }
    }

    :deep(.u-form-item) {
      padding: 20rpx 0;

      .u-form-item__body__right {
        flex: 1;
      }
    }
  }

  .form-footer {
    padding: 24rpx 32rpx;
    background: #fff;
    border-top: 2rpx solid #f5f5f5;
  }
}
</style>
