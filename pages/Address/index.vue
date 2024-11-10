<template>
  <view class="address-container">
    <!-- 地址列表 -->

    <view class="address-list" v-if="addressList.length > 0">
      <view
        class="address-item animate__animated animate__fadeIn"
        v-for="(item, index) in addressList"
        :key="index"
        :style="{ animationDelay: index * 0.1 + 's' }"
        @click="chooseAddress(item)"
      >
        <view class="item-main">
          <view class="user-info">
            <text class="name">{{ item.shipping_contactName }}</text>
            <text class="phone">{{ item.shipping_phone }}</text>
            <text class="tag" v-if="item.isDefault">默认</text>
          </view>
          <view class="address-detail"
            >{{ item.shipping_province }}{{ item.shipping_city }}{{ item.shipping_country
            }}{{ item.shipping_address_1 }}</view
          >
        </view>
        <view class="item-action">
          <view class="action-btn edit" @click="editAddress(item)">
            <text class="iconfont icon-edit"></text>
            <text>编辑</text>
          </view>
          <view class="action-btn delete" @click="deleteAddress(item)">
            <text class="iconfont icon-delete"></text>
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else>
      <u-empty mode="address" icon="http://cdn.uviewui.com/uview/empty/address.png" text="暂无收货地址"></u-empty>
    </view>

    <!-- 新增地址按钮 -->
    <view class="add-btn" @click="openAddressForm('add')">
      <text class="iconfont icon-add"></text>
      <text>新增收货地址</text>
    </view>

    <!-- 引入地址表单组件 -->
    <address-form
      ref="addressForm"
      :is-edit="formType === 'edit'"
      :address-data="currentEditAddress"
      @submit="handleFormSubmit"
    />
  </view>
</template>

<script>
import LStorage from '@/store/storageAdapter';
import AddressForm from './components/AddressForm.vue';
const IndexServer = require('@/common/store/indexServer.js');
export default {
  components: {
    AddressForm,
  },
  onLoad(options) {
    this.from = options.from;
    console.log('from', this.from);
  },
  data() {
    return {
      addressList: [],
      showAddressForm: false, // 控制表单弹窗显示
      formType: 'add', // 表单类型：add-新增，edit-编辑
      currentEditAddress: null, // 当前编辑的地址数据
    };
  },

  methods: {
    // 打开地址表单
    openAddressForm(type, address = null) {
      console.log('Opening form:', this.$refs);
      this.formType = type;
      this.currentEditAddress = address;
      this.$refs.addressForm.show = true;
    },
    chooseAddress(item) {
      // if (this.from === 'order') {
      //   uni.$u.route({
      //     url: '/pages/service/tmsDetail',
      //     params: { address: item },
      //   });
      // }

      this.$emit('choose', item);
    },
    getAddressList() {
      let that = this;
      IndexServer.getAddressList(
        { page: 1, page_size: 9999 },
        {
          success(res) {
            that.addressList = res.data.result;
            console.log('this.addressList', this.addressList);
          },
          fail(err) {
            console.log('err', err);
          },
        }
      );
    },
    // 编辑地址
    editAddress(address) {
      console.log('Editing address:', address);
      this.openAddressForm('edit', address);
    },

    // 删除地址
    deleteAddress(formData) {
      uni.showModal({
        title: '提示',
        content: '确定要删除该地址吗？',
        success: (res) => {
          if (res.confirm) {
            let that = this;
            // TODO: 调用删除地址接口
            IndexServer.deleteAddress(formData.id, {
              success(res) {
                console.log('删除成功');
                that.getAddressList();
              },
              fail(err) {
                console.log('err', err);
              },
            });
          }
        },
      });
    },

    // 处理表单提交
    handleFormSubmit(formData) {
      console.log('Form submitted:', formData);
      let that = this;
      if (this.formType === 'add') {
        // 处理新增
        IndexServer.addAddress(formData, {
          success(res) {
            console.log('创建成功');
            that.getAddressList();
          },
          fail(err) {
            console.log('err', err);
          },
        });
      } else {
        IndexServer.updateAddress(formData.id, formData, {
          success(res) {
            console.log('修改成功');
            that.getAddressList();
          },
          fail(err) {
            console.log('err', err);
          },
        });
      }

      // 关闭弹窗并提示
      this.showAddressForm = false;
      uni.showToast({
        title: this.formType === 'add' ? '添加成功' : '修改成功',
        icon: 'success',
      });
    },
  },
  mounted() {
    console.log('用户', LStorage.getItem('userId'));
    this.getAddressList();
  },
};
</script>

<style lang="scss" scoped>
.address-container {
  // min-height: 100vh;
  overflow: scroll;
  background: #f5f7fa;
  padding: 20rpx;

  .address-list {
    padding-bottom: 50px;
    .address-item {
      background: #fff;
      border-radius: 16rpx;
      padding: 24rpx;
      margin-bottom: 20rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

      .item-main {
        .user-info {
          margin-bottom: 12rpx;

          .name {
            font-size: 30rpx;
            font-weight: 600;
            color: #333;
            margin-right: 20rpx;
          }

          .phone {
            font-size: 28rpx;
            color: #666;
          }

          .tag {
            background: #2e5bb3;
            color: #fff;
            font-size: 20rpx;
            padding: 2rpx 12rpx;
            border-radius: 8rpx;
            margin-left: 16rpx;
          }
        }

        .address-detail {
          font-size: 26rpx;
          color: #666;
          line-height: 1.5;
        }
      }

      .item-action {
        display: flex;
        justify-content: flex-end;
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 2rpx solid #f5f5f5;

        .action-btn {
          display: flex;
          align-items: center;
          padding: 8rpx 20rpx;
          margin-left: 24rpx;
          border-radius: 24rpx;
          font-size: 24rpx;

          .iconfont {
            font-size: 24rpx;
          }

          &.edit {
            background: rgba(46, 91, 179, 0.1);
            color: #2e5bb3;
          }

          &.delete {
            background: rgba(245, 34, 45, 0.1);
            color: #f5222d;
          }
        }
      }
    }
  }

  .add-btn {
    position: fixed;
    left: 20rpx;
    right: 20rpx;
    bottom: 40rpx;
    height: 88rpx;
    background: linear-gradient(135deg, #4b79e4 0%, #2e5bb3 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(46, 91, 179, 0.3);
    max-width: 430px;
    margin: 0 auto;
    .iconfont {
      margin-right: 12rpx;
      font-size: 32rpx;
    }
  }
}

.address-form {
  z-index: 999;
}
</style>
