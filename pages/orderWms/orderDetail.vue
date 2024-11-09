<template>
  <view class="orderDetailContainer">
    <!-- 状态 -->
    <view class="statusContainer">
      {{ orderDetailList[0] ? xenum.ORDER_STATUS.toText(orderDetailList[0].status) : '' }}
    </view>
    <!-- 物流轨迹 -->
    <view class="orderCard" v-if="orderDetails.status === 5 || orderDetails.status === 6 || orderDetails.status === 7">
      <view
        v-if="trakingList.length !== 0"
        style="display: flex; justify-content: flex-end; align-items: center"
        @click="queryLogisticsTrack(orderDetails.shipment.sn)"
      >
        <span style="color: #f59a23">详细信息</span>
        <u-icon name="arrow-right" size="38" color="#f59a23"></u-icon>
      </view>

      <u-empty
        mode="data"
        icon="http://cdn.uviewui.com/uview/empty/data.png"
        text="暂无物流信息"
        v-if="trakingList.length === 0"
      >
      </u-empty>
      <u-steps current="0" direction="column" :dot="true" activeColor="#f59a23" iconSize="55" v-else>
        <u-steps-item
          :title="item.title"
          :desc="item.desc"
          v-for="(item, index) in trakingList"
          :key="index"
        ></u-steps-item>
      </u-steps>
    </view>
    <view v-for="(orderDetails, index) in orderDetailList" :key="index">
      <!-- 详情 -->
      <view class="orderCard" @click="routeOrderDetail(orderDetails)">
        <u-row gutter="20" class="uRow">
          <u-col :span="12">
            <u-row>
              <u-icon name="home" size="38"></u-icon>
              <text style="font-weight: 600">{{ orderDetails.store.name }}</text>
            </u-row>
          </u-col>
        </u-row>
        <!-- 地址 -->
        <view class="addressCard">
          <view class="address">
            <u-icon name="map-fill" color="#f7ae64"></u-icon>
            <view
              style="
                font-size: 26rpx;
                font-weight: 600;
                display: flex;

                margin: 0rpx 10rpx;
                flex-direction: column;
              "
            >
              <view>{{ orderDetails.address.shipping_contactName }} {{ orderDetails.address.shipping_address_1 }}</view>
              <view>{{ orderDetails.address.shipping_phone }}</view>
            </view>
          </view>
        </view>
        <u-row gutter="20" class="uRow" v-for="(item, index) in orderDetails.items" :key="index">
          <u-col :span="2"><img :src="item.sku ? item.sku.images[0] : ''" style="width: 100%" /></u-col>
          <u-col :span="10">
            <u-row style="font-weight: 600; font-size: 28rpx; padding: 10rpx 0rpx">
              <u-col :span="9">
                {{ item.name }}
              </u-col>
              <u-col :span="3" style="text-align: right"> ￥{{ item.sale_price }} </u-col>
            </u-row>
            <u-row style="color: #b1b1b4; font-size: 26rpx; padding: 10rpx 0rpx">
              <u-col :span="8">
                {{ item.variantsChange.join(';') }}
              </u-col>
              <u-col :span="4" style="text-align: right"> x {{ item.quantity }} </u-col>
            </u-row>
          </u-col>
        </u-row>
        <u-row class="uRow uRowItem">
          <u-col :span="4"> 商品总价： </u-col>
          <u-col :span="8" style="text-align: right"> ￥{{ orderDetails.goods_amount }} </u-col>
        </u-row>
        <u-row class="uRow uRowItem">
          <u-col :span="4"> 运费： </u-col>
          <u-col :span="8" style="text-align: right">
            ￥{{ orderDetails.freight_amount ? orderDetails.freight_amount : 0 }}
          </u-col>
        </u-row>
        <u-row class="uRow uRowItem">
          <u-col :span="4"> 实付款： </u-col>
          <u-col :span="8" style="text-align: right; color: #f7ae64; font-weight: 600">
            ￥{{ orderDetails.goods_amount + orderDetails.freight_amount }}
          </u-col>
        </u-row>
        <u-row class="uRow uRowItem">
          <u-col :span="4"> 订单编号： </u-col>
          <u-col :span="8" style="text-align: right; color: #b1b1b4"> {{ orderDetails.sn }} </u-col>
        </u-row>
        <u-row class="uRow uRowItem">
          <u-col :span="4"> 创建时间： </u-col>
          <u-col :span="8" style="text-align: right; color: #b1b1b4; font-size: 20rpx">
            {{ handleDate(orderDetails.created_time) }}
          </u-col>
        </u-row>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="detailCard" v-if="orderDetails.status === 2">
      <view style="color: #a2a2a2; font-size: 26rpx; padding-bottom: 10rpx">支付工具</view>
      <u-radio-group v-model="radiovalue" iconPlacement="right" style="padding: 20rpx 0rpx">
        <u-radio
          activeColor="#f7ae64"
          :customStyle="{ marginBottom: '28rpx', fontSize: '20rpx' }"
          v-for="(item, index) in paymentList"
          :key="index"
          :name="item.value"
          @change="radioChange"
        >
          <view style="font-size: 26rpx; font-weight: 600; display: flex; flex-direction: row">
            <!-- <u-image width="30rpx" height="30rpx" :src="require('@/static/payment/' + item.img)" /> -->
            <view style="margin-left: 10rpx">{{ item.name }}</view>
          </view>
        </u-radio>
      </u-radio-group>
    </view>

    <!-- 线下支付上传凭证 -->
    <view class="detailCard" v-if="orderDetails.status === 2 && radiovalue === 'offLine'">
      <view style="color: #a2a2a2; font-size: 26rpx; padding-bottom: 10rpx">上传支付凭证</view>
      <MyUpload v-model="attachment"></MyUpload>
    </view>

    <!-- 操作按钮 -->
    <!-- 待付款 选择 线下支付 -->
    <view
      style="position: fixed; bottom: 0rpx; left: 0; width: 100%; padding: 30rpx 10rpx; background-color: #fff"
      v-show="orderDetails.status === 2 && radiovalue === 'offLine'"
    >
      <u-row>
        <u-col :span="8"> </u-col>
        <u-col :span="4">
          <commonButton text="提交审核" @click="submitAudit" width="100px"></commonButton>
        </u-col>
      </u-row>
    </view>

    <!-- 待付款 选择 线上支付 -->
    <view
      style="position: fixed; bottom: 0rpx; left: 0; width: 100%; padding: 30rpx 10rpx; background-color: #fff"
      v-show="orderDetails.status === 2 && radiovalue !== 'offLine'"
    >
      <u-row>
        <u-col :span="8">
          <u-row style="justify-content: flex-end; margin-right: 12rpx">
            <text style="font-size: 28rpx">合计：</text>
            <text style="font-size: 40rpx; color: red; font-weight: 600">￥{{ totalPrice }}</text>
          </u-row>
        </u-col>
        <u-col :span="4">
          <commonButton :text="$t('Immediate payment')" @click="pay" width="100px"></commonButton>
        </u-col>
      </u-row>
    </view>
    <!-- 待发货 -->
    <view
      style="position: fixed; bottom: 0rpx; left: 0; width: 100%; padding: 30rpx 10rpx; background-color: #fff"
      v-show="orderDetails.status === 4"
    >
      <u-row>
        <u-col :span="8"></u-col>
        <u-col :span="4">
          <commonButton :text="$t('Urge delivery')" width="100px" @click="urgeNow"></commonButton>
        </u-col>
      </u-row>
    </view>

    <!-- 待审核 -->
    <view
      style="position: fixed; bottom: 0rpx; left: 0; width: 100%; padding: 30rpx 10rpx; background-color: #fff"
      v-show="orderDetails.status === 3"
    >
      <u-row>
        <u-col :span="8"></u-col>
        <u-col :span="4">
          <commonButton text="提醒审核" width="100px"></commonButton>
        </u-col>
      </u-row>
    </view>

    <!-- 已签收 -->
    <view
      style="position: fixed; bottom: 0rpx; left: 0; width: 100%; padding: 30rpx 10rpx; background-color: #fff"
      v-show="orderDetails.status === 6"
    >
      <u-row>
        <u-col :span="8"></u-col>
        <u-col :span="4">
          <commonButton text="确认收货" width="100px" @click="completeOrder(orderDetails.id)"></commonButton>
        </u-col>
      </u-row>
    </view>
    <bankCardModal
      ref="bankCardModal"
      v-if="show"
      :totalPrice="totalPrice"
      :payMethod="radiovalue"
      :sn="orderDetailList[0] ? orderDetailList[0].sn : ''"
      :show="show"
      @close="close"
    ></bankCardModal>
  </view>
</template>

<script>
import commonButton from '@/components/myButton/commonButton.vue';
import bankCardModal from '@/widgets/bankCardModal.vue';
import MyUpload from '@/components/myUpload.vue';
import Vue from 'vue';
import xenum from '@/common/utils/XEnum.js';
const orderServer = require('@/common/store/orderServer.js');
export default {
  data() {
    return {
      ids: [],
      xenum: xenum,
      show: false,
      orderDetails: { store: {}, items: [] },
      orderDetailList: [],
      attachment: [],
      radiovalue: 'YIYUNHUI',
      paymentList: [{ value: 'offLine', name: '线下支付' }],
      trakingList: [],
    };
  },
  components: {
    commonButton,
    bankCardModal,
    MyUpload,
  },
  onLoad(options) {
    let { orderId } = options;
    this.ids = orderId.split(',');
    console.log('ids', options);
    this.getOrderDetails();
    this.getPayConstatnts();
  },
  onShow() {
    console.log('刷新');
    this.getOrderDetails();
    this.getPayConstatnts();
    this.show = false;
  },
  methods: {
    radioChange(e) {
      console.log('选择方式', e);
      this.getPayConstatnts();
    },
    pay() {
      this.show = true;
    },
    close(e) {
      this.show = false;
    },
    //查看物流轨迹
    queryLogisticsTrack(sn) {
      uni.$u.route({
        url: '/pages/order/logisticsTrack',
        params: {
          sn: sn,
        },
      });
    },
    getPayConstatnts() {
      let that = this;
      // orderServer.getPaymentConstants({
      //   success(res) {
      //     if (res.success) {
      //       that.paymentList = Object.keys(res.data).map((item) => {
      //         return {
      //           value: item,
      //           name: xenum.PAY_METHODS.toText(item),
      //         };
      //       });
      //       that.paymentList.push({ value: 'offLine', name: '线下支付' });
      //       console.log('payment', that.paymentList);
      //     }
      //   },
      //   fail(err) {
      //     console.log(err);
      //     uni.$u.toast(err.msg);
      //   },
      // });
    },
    submitAudit() {
      orderServer.offLinePayment(this.orderDetailList[0].sn, this.attachment, {
        success(res) {
          if (res.success) {
            uni.showToast({
              title: '提交审核成功！',
              icon: 'none',
              duration: 2500,
            });
            console.log('失败', res);
            setTimeout(() => {
              uni.$u.route({
                url: '/pages/order/orderList',
              });
            }, 1000);
          } else {
            console.log('失败', res.msg);
            uni.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2500,
            });
          }
        },
        fail(err) {
          console.log('err', err);
          uni.showToast({
            title: err.msg,
            icon: 'none',
            duration: 2500,
          });
        },
      });
    },
    handleDate(d) {
      const date = new Date(d);

      // 格式化日期成 "YYYY-MM-DD HH:mm:ss" 格式
      const formattedDate =
        date.getFullYear() +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(date.getDate()).padStart(2, '0') +
        ' ' +
        String(date.getHours()).padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0') +
        ':' +
        String(date.getSeconds()).padStart(2, '0');

      console.log(formattedDate);
      return formattedDate;
    },
    //订单已完成
    completeOrder(id) {
      orderServer.completeOrder(id, {
        success(res) {
          if (res.success) {
            uni.showToast({
              title: '交易成功',
              icon: 'none',
              duration: 2500,
            });

            uni.$u.route({
              url: '/pages/order/complete',
            });
          }
        },
        fail(err) {
          uni.$u.toast(err.msg);
          console.log(err);
        },
      });
    },
    //获取物流轨迹
    getTracking(detail) {
      let that = this;
      orderServer.getOrderTracking([detail.shipment.sn], {
        success(res) {
          if (res.success && res.result.length !== 0) {
            console.log('物流轨迹', res);
            that.trakingList.push(
              {
                title: res.result[0].routeInfos[0].time,
                desc: res.result[0].routeInfos[0].info,
              },
              {
                title: '送至 ' + detail.shipping_address_1,
                desc: detail.shipping_contactName + ' ' + detail.shipping_phone,
              }
            );
          }
        },
        fail(err) {
          uni.$u.toast(err.msg);
          console.log(err);
        },
      });
    },
    urgeNow() {
      uni.showToast({
        title: '已提醒商家发货',
        icon: 'none',
        duration: 2500,
      });
    },
    getOrderDetails() {
      let that = this;
      that.orderDetailList = [];
      this.ids.forEach((id) => {
        orderServer.getOrderDetails(id, {
          success(res) {
            that.orderDetails = res.data;
            that.orderDetails.items = that.orderDetails.items.map((cart) => {
              return {
                ...cart,
                variantsChange: cart.variants.map((item, index) => {
                  return cart.variables[index].values[item].name.zh_cn;
                }),
              };
            });
            console.log('that.orderDetails', that.orderDetails);
            that.orderDetailList.push(that.orderDetails);
            if (that.orderDetails.status === 5 || that.orderDetails.status === 6) {
              that.getTracking(that.orderDetails);
            }
          },
          fail(err) {
            uni.$u.toast(err.msg);
            console.log(err);
          },
        });
      });
    },
  },
  computed: {
    totalPrice() {
      return Number(this.orderDetails.goods_amount + this.orderDetails.freight_amount);
    },
  },
};
</script>

<style lang="scss" scoped>
.statusContainer {
  color: #f7ae64;
  font-weight: 600;
  padding: 10rpx 10rpx;
}
.orderDetailContainer {
  background-color: #f7f7f7;
  height: 100vh;
  padding: 10rpx 10rpx 50rpx 10rpx;
}
.detailCard {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 20rpx 20rpx;
  margin: 10rpx 0rpx;
}
.addressCard {
  background-color: rgba(243, 215, 173, 0.2);
  border-radius: 20rpx;
  padding: 20rpx 20rpx;
  margin: 10rpx 0rpx;
  height: 100rpx;
}
.orderCard {
  border-radius: 20rpx;
  background-color: #fff;
  margin: 20rpx 0rpx;
  padding: 20rpx 20rpx;
}
.uRow {
  margin: 20rpx 10rpx;
}
.uRowItem {
  font-size: 28rpx;
}
.uCol {
  text-align: right;
  margin-top: 20rpx;
}
.u-radio-group--row {
  flex-direction: column !important;
}
.u-radio__text {
  font-size: 36rpx !important;
  line-height: 36rpx !important;
  font-weight: 600 !important;
}
.address {
  display: flex;
  flex-direction: row;
}
.avatar {
  width: 108rpx;
  height: 108rpx;
  background-color: #f4f5f7;
  margin: 48rpx 0 30rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
  @include flex(column);
  align-items: center;
  position: relative;

  .btnChange {
    position: absolute;
    bottom: 0;
  }
}
/deep/.u-text__value--main {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #f59a23 !important;
}
/deep/.u-text__value--content {
  font-size: 14px !important;
  font-weight: 600 !important;
}

/deep/.u-text__value--tips {
  font-size: 12px !important;
}
</style>
