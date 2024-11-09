<template>
  <u-popup :show="show" mode="bottom" :safeAreaInsetBottom="true" borderRadius="24">
    <!-- 表单头部 -->
    <view class="form-header">
      <text class="title">{{ '编辑地址' }}</text>
      <view
        class="close-btn"
        @click="
          () => {
            show = false;
          }
        "
      >
        <u-icon name="close" color="#999" size="32"></u-icon>
      </view>
    </view>
    <view style="height: 70vh; overflow-y: scroll">
      <AddressList @choose="choose"></AddressList>
    </view>
  </u-popup>
</template>

<script>
import AddressList from '../../Address/index.vue';
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
  components: {
    AddressList,
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
    choose(formdata) {
      this.$emit('choose', formdata);
      this.show = false;
    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
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
.address-form {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;

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
