<template>
  <view class="u-demo-block">
    <view style="margin-top: 60rpx; width: 80%">
      <u-input
        placeholder="查询物流单号"
        prefixIcon="search"
        prefixIconStyle="font-size: 22px;color: #fff"
        shape="circle"
        color="#fff"
        v-model="trackingNumber"
      >
        <template slot="suffix">
          <u-button
            type="primary"
            icon="arrow-rightward"
            text="查询"
            shape="circle"
            size="small"
            color="linear-gradient(to right, #fceddc 0%, #f7ae64 100%)"
            @click="getTracking"
          ></u-button>
        </template>
      </u-input>
    </view>
    <view class="popup">
      <view v-if="stepList.length === 0">
        <u-empty
          mode="search"
          icon="http://cdn.uviewui.com/uview/empty/search.png"
          width="450"
          textSize="30"
          height="450"
        />
      </view>

      <!-- <view class="header_info">
        <view class="header_top">
          <view class="top_left">
            <view class="left_content">赤道:SCZ68(O_O)?2374t82</view>
          </view>
          <view class="top_right">
            <view class="right_content"></view>
          </view>
        </view>
        <view class="header_body">
          <view class="body_left">
            <view class="left_title">操作中</view>

            <view class="left_time">
              下单时间:
              <br />
              2023-34-454 34:34
            </view>
          </view>
          <view class="body_right">
            <view class="right_country">起始国</view>
            <image
              src="https://jwcg-admin-prod.oss-cn-shenzhen.aliyuncs.com/mp_img/temp/send.png"
              style="height: 30px; width: 30px"
            ></image>
            <view class="right_country">中国</view>
          </view>
        </view>
      </view> -->

      <view class="container" v-else>
        <u-steps dot direction="column" current="0" class="stepbox">
          <u-steps-item v-for="(item, index) in stepList" :key="index">
            <view class="topbox" slot="desc">
              <view class="stepTitle">
                <view :class="index === 0 ? 'textColor' : 'textColore'">{{ item.time }}</view>
              </view>
              <view class="itembox">
                <view class="font-size-sm text-color-assist item">
                  <view>地点：{{ item.location }}</view>
                  <view>
                    <text>{{ item.content }}</text>
                  </view>
                </view>
              </view>
            </view>
          </u-steps-item>
        </u-steps>
      </view>
    </view>
  </view>
</template>

<script>
const IndexServer = require('@/common/store/indexServer.js');
export default {
  data() {
    return {
      trackingNumber: null,
      tips: '',
      value: '',
      stepList: [],
    };
  },
  watch: {
    value(newValue, oldValue) {
      // console.log('v-model', newValue);
    },
  },
  methods: {
    getTracking() {
      let that = this;
      let param = {
        key: 'MKDQ-MP5B-a04e714',
        number: that.trackingNumber,
      };
      IndexServer.getWLTracking(param, {
        success(res) {
          console.log('res', res, res && res[0].code === 200);
          if (res && res[0].code === 200) {
            that.stepList = res[0].events;
            console.log('stepList', that.stepList);
          } else {
            that.stepList = [];
          }
        },
        fail(err) {},
      });
    },
  },
};
</script>
<style scoped lang="less">
.u-demo-block {
  padding: 10rpx 20rpx;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 90vh;
  background-image: url('@/assets/wlbg.jpg');
  background-color: #f2f2f2;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center top;
}
.u-border {
  border-color: #fff !important;
  border-width: 0.5px !important;
  border-bottom-color: #f59a23 !important;
  border-right-color: #f59a23 !important;
  border-left-color: #f59a23 !important;
  border-top-color: #e2e2e2 !important;
  box-shadow: 10rpx 10rpx 5rpx rgba(239, 174, 24, 0.2) !important;
}
.popup {
  z-index: 9;
  position: fixed;
  height: 68vh;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow-y: scroll;
  background-color: #f9f9f9;
  border-top-right-radius: 20rpx;
  border-top-left-radius: 20rpx;
  padding-bottom: 80rpx;
}
.header_info {
  background-color: rgba(255, 255, 255, 0.8);
  top: 34vh;
  z-index: 99;
  left: 5%;
  height: 90px;
  position: fixed;
  width: 90%;
  border-radius: 10px;
  .header_top {
    background-color: red;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    height: 25%;
    color: black;
    font-size: 12px;
    display: flex;
    flex-direction: row;
    .top_left {
      background-color: #dbfa83;
      flex: 2;
      border-top-left-radius: 10px;
      .left_content {
        background-color: #f59a23;
        height: 100%;
        border-top-right-radius: 14px;
        border-top-left-radius: 10px;
        padding: 0px 10px;
        align-items: center;
        display: flex;
      }
    }
    .top_right {
      background-color: #f59a23;
      flex: 1;
      border-top-right-radius: 12px;
      .right_content {
        background-color: #dbfa83;
        height: 100%;
        border-bottom-left-radius: 14px;
        border-top-right-radius: 10px;
        padding: 0px 15px;
        color: black;
        font-size: 10px;
        text-align: right;
      }
    }
  }
  .header_body {
    display: flex;
    flex-direction: row;
    text-align: center;
    height: 75%;
    .body_left {
      display: flex;
      flex-direction: column;
      flex: 2;
      justify-content: center;
      align-items: center;
      border: 1px solid #e2e2e2;
      border-bottom-left-radius: 10px;
      .left_title {
        font-size: 14px;
        font-weight: 600;
      }
      .left_time {
        font-size: 9px;
        color: #616161;
        margin-top: 2px;
      }
    }
    .body_right {
      flex: 3;
      height: 100%;
      border-bottom-right-radius: 10px;
      background-color: #e5e5e5;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: row;
      .right_country {
        font-size: 13px;
        margin: 0px 5px;
      }
    }
  }
}
.container {
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  margin-top: 10px;
  .title {
    background: #fff;
    line-height: 80rpx;
    padding-left: 20rpx;
  }
  .stepbox {
    padding: 40rpx;
    .topbox {
      width: 100%;
      .stepTitle {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 26rpx;

        .textColor {
          color: #307af0;
        }
        .textColore {
          color: #333333;
        }
      }

      .itembox {
        width: 550rpx;
        background: #fff;
        margin: 20rpx;
        display: flex;
        flex-direction: column;
        border-radius: 20rpx;
        padding: 30rpx 70rpx 30rpx 30rpx;

        .item {
          margin-top: 20rpx;
          line-height: 50rpx;

          text {
            color: blue;
            margin-right: 6rpx;
          }
        }
      }
    }
  }
}

::v-deep .u-steps-item__wrapper {
  background: #e2e7f5;
  border-radius: 30rpx;
}
</style>
