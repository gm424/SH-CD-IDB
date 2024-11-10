<template>
  <view class="orderListContainer">
    <u-navbar :placeholder="true" :bgColor="bgColor">
      <view class="u-nav-slot" slot="left">
        <u-icon name="arrow-left" size="40" style="margin-right: 10rpx" @click="routeBack"></u-icon>
        <view class="">
          <u--input
            :placeholder="$t('search.searchSn')"
            placeholderStyle="color: #C0C4CC"
            prefixIcon="search"
            prefixIconStyle="font-size: 28rpx;line-height:28rpx;color: #C0C4CC"
            shape="circle"
            fontSize="24rpx"
            :customStyle="inputCustom"
          ></u--input>
        </view>
      </view>
    </u-navbar>
    <view class="tabs shadow">
      <u-tabs
        :list="listTabs"
        lineColor="radial-gradient(45.61% 102.44% at 49.78% 125.61%, #fceddc 0%, #f7ae64 100%)"
        lineWidth="58rpx"
        lineHeight="8rpx"
        :activeStyle="{ color: '#f7ae64', fontFace: '32rpx', fontWeight: 'bold' }"
        @click="click"
      ></u-tabs>
    </view>
    <view class="orderCard" v-for="(item, index) in orderList" :key="index">
      <view @click="routeOrderDetail(item)">
        <u-row gutter="20" class="uRow">
          <u-col :span="6">
            <u-row>
              <u-icon name="home" size="38"></u-icon>
              <text style="font-weight: 600">{{ item.store.name }}</text>
            </u-row>
          </u-col>
          <u-col :span="6" style="text-align: right; color: #f7ae64; font-size: 28rpx">{{
            xenum.ORDER_STATUS.toText(item.status)
          }}</u-col>
        </u-row>
        <u-row gutter="20" class="uRow" v-for="(it, idx) in item.items" :key="idx">
          <u-col :span="2"
            ><img :src="it.sku ? it.sku.images[0] : ''" style="width: 100rpx; height: 100rpx; border-radius: 10rpx"
          /></u-col>
          <u-col :span="10">
            <u-row style="font-weight: 600; font-size: 28rpx; padding: 10rpx 0rpx">
              <u-col :span="9">
                {{ it.name }}
              </u-col>
              <u-col :span="3" style="text-align: right"> ￥{{ it.sale_price }} </u-col>
            </u-row>
            <u-row style="color: #b1b1b4; font-size: 26rpx; padding: 10rpx 0rpx">
              <u-col :span="8">
                {{ it.variantsChange.join(';') }}
              </u-col>
              <u-col :span="4" style="text-align: right"> x {{ it.quantity }} </u-col>
            </u-row>
          </u-col>
        </u-row>

        <view class="uCol">
          <text style="font-size: 26rpx">运费￥</text><text style="font-weight: 600">{{ item.freight_amount }}</text>
        </view>
        <view class="uCol">
          <text style="font-size: 26rpx">实付款￥</text
          ><text style="font-weight: 600">{{ item.goods_amount + item.freight_amount }}</text>
        </view>
      </view>
      <u-row gutter="10" style="margin-top: 20rpx; justify-content: end">
        <u-col :span="4"></u-col>
        <u-col :span="4" v-if="selectedStatus === '2'">
          <u-button :customStyle="customPayBtn" @click="payNow(item)">立即付款</u-button></u-col
        >
        <u-col :span="4" v-if="selectedStatus === '4'">
          <u-button :customStyle="customPayBtn" @click="urgeNow(item)">催发货</u-button></u-col
        >
        <u-col :span="4" v-if="selectedStatus === '5'">
          <u-button :customStyle="customPayBtn" @click="routeOrderDetail(item)">查看物流</u-button>
        </u-col>
        <u-col :span="4" v-if="selectedStatus === '6'">
          <u-button :customStyle="customPayBtn" @click="completeOrder(item)">确认收货</u-button>
        </u-col>
      </u-row>
      <u-row>
        <u-col :span="4"> </u-col>
        <u-col :span="8" style="font-size: 20rpx; text-align: right; color: #b1b1b4">
          {{ handleDate(item.created_time) }}
        </u-col>
      </u-row>
    </view>
    <u-divider text="下拉加载" textSize="20" v-if="showEmpty === '1' && !isShowDefaultPage"></u-divider>
    <u-loading-icon text="加载中" textSize="20" v-if="showEmpty === '2' && !isShowDefaultPage"></u-loading-icon>
    <u-divider text="到底啦" textSize="20" v-if="showEmpty === '3' && !isShowDefaultPage"></u-divider>
    <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
    <bankCardModal
      ref="bankCardModal"
      :totalPrice="totalPrice"
      :sn="sn"
      :show="show"
      v-if="show"
      @close="close"
    ></bankCardModal>
  </view>
</template>

<script>
import payModal from '../../widgets/payModal.vue';
import bankCardModal from '@/widgets/bankCardModal.vue';
const orderServer = require('../../common/store/orderServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
import xenum from '@/common/utils/XEnum.js';
import URow from '../../uni_modules/uview-ui/components/u-row/u-row.vue';
export default {
  data() {
    return {
      totalPrice: 0,
      xenum: xenum,
      show: false,
      bgColor: '#f5f5f5',
      logoUrl: `${host}/public/logoHome.png`,
      page: 1,
      pageSize: 10,
      total: 0,
      selectedStatus: 0,
      isShowDefaultPage: false,
      showEmpty: '1',
      sn: null,
      inputCustom: {
        width: '342rpx',
        height: '58rpx',
        padding: '6rpx 12rpx',
        borderColor: '#a2a2a2 !important',
      },
      listTabs: [
        {
          name: '全部',
          status: '0',
        },
        {
          name: '待报价',
          status: '1',
        },
        {
          name: '待支付',
          status: '2',
        },
        {
          name: '待审核',
          status: '3',
        },
        {
          name: '待发货',
          status: '4',
        },
        {
          name: '待签收',
          status: '5',
        },
        {
          name: '已签收',
          status: '6',
        },
        {
          name: '已完成',
          status: '7',
        },
        {
          name: '已关闭',
          status: '8',
        },
        {
          name: '已退款',
          status: '9',
        },
      ],
      orderList: [],
      customCancelBtn: {
        width: '100%',
        height: '64rpx',
        marginTop: '10rpx',
        fontWeight: 'Bold',
        borderRadius: '30rpx',
        marginRight: '10rpx',
      },
      customPayBtn: {
        width: '100%',
        height: '64rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #fceddc 0%,  #f7ae64 100%)',
        color: '#FFF',
        marginTop: '10rpx',
        fontWeight: 'Bold',
        borderRadius: '30rpx',
        marginRight: '10rpx',
      },
    };
  },
  components: {
    payModal,
    bankCardModal,
    URow,
  },
  onShow() {
    this.orderList = [];
    this.page = 1;
    this.getSubOrderList();
    this.show = false;
  },
  onPullDownRefresh() {
    this.orderList = [];
    this.page = 1;
    this.showEmpty = '1';
    this.getSubOrderList();
  },
  onReachBottom() {
    if (this.orderList.length >= this.total) {
      this.showEmpty = '3';
      return;
    }
    this.page = this.orderList.length < this.total ? this.page + 1 : this.page;
    this.showEmpty = '2';
    this.getSubOrderList();
  },
  methods: {
    click(item) {
      this.selectedStatus = item.status;
      this.orderList = [];
      this.page = 1;
      this.getSubOrderList();
    },
    close(e) {
      this.show = false;
    },
    routeBack() {
      uni.switchTab({
        url: '/pages/tabbar/mine',
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
    completeOrder(item) {
      orderServer.completeOrder(item.id, {
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
    urgeNow(item) {
      uni.showToast({
        title: '已提醒商家发货',
        icon: 'none',
        duration: 2500,
      });
    },
    //获取子订单列表
    getSubOrderList() {
      let that = this;
      let params = {
        status: this.selectedStatus,
        page: this.page,
        pageSize: this.pageSize,
        biz_type: '0',
      };

      orderServer.getOrderList(params, {
        success(res) {
          uni.stopPullDownRefresh();
          let orderList = res.data.result;
          if (orderList == null || orderList.length <= 0) {
            that.orderList = [];
            that.page = 1;
            that.isShowDefaultPage = true;
            that.showEmpty = '3';

            return;
          }

          orderList.forEach((item) => {
            item.items = item.items.map((cart) => {
              return {
                ...cart,
                variantsChange: cart.variants.map((item, index) => {
                  return cart.variables[index].values[item].name.zh_cn;
                }),
              };
            });
          });
          that.orderList = that.orderList.concat(orderList);
          console.log('请求的orderList', that.orderList, orderList);
          that.total = res.data.total;
          // that.page = res.page;
          that.isShowDefaultPage = false;
          uni.stopPullDownRefresh();
        },
        fail(err) {
          console.log(err);
          uni.stopPullDownRefresh();
          uni.$u.toast(err.msg);
        },
      });
    },
    //进入详情页面
    routeOrderDetail(item) {
      console.log('下单成功子单id', [item.id].join(','));
      uni.$u.route({
        url: '/pages/order/orderDetail',
        params: {
          orderId: [item.id].join(','),
        },
      });
    },
    //立即付款
    payNow(item) {
      this.sn = item.sn;
      this.totalPrice = (item.goods_amount + item.freight_amount).toFixed(2);
      this.show = true;
    },
  },
};
</script>

<style scoped lang="scss">
.orderListContainer {
  background-color: #f2f2f2;
  min-height: 100vh;
  padding: 20rpx 10rpx;
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
.uCol {
  text-align: right;
  margin-top: 20rpx;
}
.u-nav-slot {
  display: flex;
  align-items: center;

  .tit {
    color: #fff;
    font-size: 36rpx;
    margin-left: 8rpx;
  }
}

.u-nav-slot-right {
}
</style>
