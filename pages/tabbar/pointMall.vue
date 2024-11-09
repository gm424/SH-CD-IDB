<template>
  <view>
    <view class="nav">
      {{ $t('tabbar.pointMall') }}
    </view>

    <view class="bg"></view>

    <view class="title">
      <u-row>
        <u-col :span="8">
          <u-row>
            <u-image src="../../assets/pig.png" height="60" width="60" class="img_logo" />
            <view style="font-weight: 600; font-size: 54rpx; color: #ffd100">156</view>
          </u-row>
          <u-row style="font-size: 26rpx; color: #fff; margin-top: 10rpx; margin-left: 10rpx; font-weight: 600">
            <view>我的积分</view>
            <u-row style="margin-left: 10rpx" @click="showDetail"
              ><u-icon name="question-circle" color="#fff"></u-icon>说明</u-row
            >
          </u-row>
          <commonButton text="兑换记录" @click="routerPointList" style="width: 200rpx" height="54rpx"></commonButton
        ></u-col>
      </u-row>
    </view>

    <view>
      <u-image
        :src="require('@/assets/Diamond.png')"
        height="380"
        width="380"
        style="height: 380rpx; width: 380rpx; transform: rotate(-20deg); position: fixed; top: 100rpx; right: -100rpx"
      />
    </view>
    <view class="topic-pl">
      <view class="topic">
        <view class="pointExchange">
          <u-row style="font-size: 26rpx" @click="showUserList">
            <u-col :span="6">
              <view>积分排行榜</view>
            </u-col>
            <u-col :span="6">
              <u-row style="display: flex; justify-content: flex-end">
                <u-avatar-group :urls="urls" size="35" gap="0.4"></u-avatar-group>
                <u-icon name="arrow-right-double" color="#ffd100"></u-icon>
              </u-row>
            </u-col>
          </u-row>

          <u-row style="padding: 40rpx 20rpx">
            <u-col :span="4" v-for="(item, index) in leaderboard" :key="index">
              <view style="display: flex; justify-content: center" class="avatar-container">
                <img :src="item.avatar" alt="User Avatar" class="avatar" />
                <u-image :src="require('@/assets/' + item.crown)" alt="Crown" class="crown" height="45" width="45" />
              </view>
            </u-col>
          </u-row>
        </view>
      </view>
    </view>
    <u-row style="padding: 20rpx 30rpx; font-weight: 600; font-size: 36rpx">
      <u-image
        :src="require('@/assets/hot.png')"
        style="height: 36rpx; width: 36rpx; margin-right: 10rpx"
        height="36"
        width="36"
      />
      <view>热门商品</view>
    </u-row>
    <u-row style="padding: 20rpx 0rpx">
      <u-col :span="12">
        <view style="padding: 10rpx 10rpx 10rpx 30rpx">
          <u-swiper
            :list="list3"
            previousMargin="0"
            nextMargin="0"
            circular
            :autoplay="true"
            radius="20"
            bgColor="#ffffff"
            height="260"
            @change="(e) => (current = e.current)"
          >
            <view slot="indicator" class="indicator">
              <view
                class="indicator__dot"
                v-for="(item, index) in list3"
                :key="index"
                :class="[index === current && 'indicator__dot--active']"
              >
              </view> </view
          ></u-swiper>
        </view>
      </u-col>
      <!-- <u-col :span="4" style="padding: 10rpx 30rpx 10rpx 0rpx">
        <view style="margin-bottom: 10rpx" class="events">
          <u-image :src="require('@/assets/vip.png')" style="width: 40%; margin-right: 10rpx" height="80" width="140" />
        </view>
        <view class="events">
          <u-image :src="require('@/assets/vip.png')" style="width: 40%; margin-right: 10rpx" height="80" width="140" />
        </view>
      </u-col> -->
    </u-row>

    <u-sticky>
      <u-row style="display: flex; justify-content: center; background-color: #f5f5f5; padding: 20rpx 0rpx 20rpx 0rpx">
        <u-image :src="require('@/assets/divide.png')" height="50" width="50" />
        <view style="margin: 0rpx 20rpx; font-weight: 600">积分商城</view>
        <u-image :src="require('@/assets/divide.png')" height="50" width="50" />
      </u-row>
      <!-- <view class="tabs shadow">
        <u-tabs
          :list="listTabs"
          lineColor="radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)"
          lineWidth="58rpx"
          lineHeight="8rpx"
          :activeStyle="{ color: '#2E5BB3', fontFace: '32rpx', fontWeight: 'bold' }"
          @click="click"
        ></u-tabs>
      </view> -->
    </u-sticky>
    <view class="container">
      <view class="sort" v-if="!isShowDefaultPage">
        <view
          class="sort-item shadow"
          v-for="(item, index) in sortListDefault"
          :key="index"
          @click="routerDetails(item.spu)"
        >
          <u-image
            width="100%"
            height="300rpx"
            :src="item.image"
            :fade="true"
            mode="aspectFill"
            duration="450"
            :lazy-load="true"
          >
            <template v-slot:loading>
              <u-loading-icon></u-loading-icon>
            </template>
            <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
          </u-image>
          <view class="name u-line-2">
            {{ item.name }}
          </view>
          <!-- <view class="waterfall-item__ft__price" v-if="item.price <= 0 && item.wholesalePrice <= 0">
            <view class="price">
              {{ $t('Price negotiable') }}
            </view>
          </view> -->
          <view>
            <view class="waterfall-item__ft__price">
              <commonButton
                :text="item.price"
                icon="rmb-circle"
                iconColor="#ed9e0b"
                style="width: 100%"
                height="54rpx"
              ></commonButton>
            </view>
          </view>
        </view>
      </view>
      <u-divider text="上拉加载" textSize="20" v-if="showEmpty === '1' && !isShowDefaultPage"></u-divider>
      <u-loading-icon text="加载中" textSize="20" v-if="showEmpty === '2' && !isShowDefaultPage"></u-loading-icon>
      <u-divider text="到底啦" textSize="20" v-if="showEmpty === '3' && !isShowDefaultPage"></u-divider>
      <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
    </view>

    <u-modal :show="show" :title="title" :content="content" @confirm="confirm"></u-modal>
  </view>
</template>

<script>
const IndexServer = require('../../common/store/indexServer.js');
const RewardServer = require('@/common/store/rewardServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
import commonButton from '@/components/myButton/commonButton.vue';
export default {
  data() {
    return {
      current: 0,
      show: false,
      title: '积分兑换规则',
      content: '80积分兑换抵扣1元，可换购门店服务护理以及次卡套餐，如积分不够，可使用现金或者其它支付方式。',
      bg: `${host}/public/tabbar/find/findbg.png`,
      bgColor: '#dbe9f6',
      listTabs: [],
      urls: [
        'https://cdn.uviewui.com/uview/album/1.jpg',
        'https://cdn.uviewui.com/uview/album/2.jpg',
        'https://cdn.uviewui.com/uview/album/3.jpg',
        'https://cdn.uviewui.com/uview/album/4.jpg',
        'https://cdn.uviewui.com/uview/album/7.jpg',
        'https://cdn.uviewui.com/uview/album/6.jpg',
        'https://cdn.uviewui.com/uview/album/5.jpg',
      ],
      leaderboard: [
        {
          avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
          crown: 'first.png',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
          crown: 'second.png',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/3.jpg',
          crown: 'third.png',
        },
      ],

      inputCustom: {
        marginTop: '10rpx',
        width: '532rpx',
        height: '58rpx',
        padding: '6rpx 12rpx',
        background: '#fff',
        borderColor: '#F0F0F0 !important',
      },
      indicator: false,
      list3: [
        'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/hot1_1726827782367.png',
        'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/hot3_1726827799363.jpg',
        'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/hot2_1726827870425.jpg',
      ],

      sortList: [],
      sortListDefault: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: false,
      categoryId: '',
      showEmpty: '1',
      logoUrl: `${host}/public/logoHome.png`,
    };
  },
  components: {
    commonButton,
  },
  onShow() {
    this.getClientCategory();

    this.sortList = [];
    this.page = 1;
    this.getClientList();
  },
  methods: {
    routerTopic(catId) {
      uni.$u.route({
        url: '/pages/topic/topic',
        params: {
          catId: catId,
        },
      });
    },
    routerDetails(id) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          spuId: id,
          from: 'pointsMall',
        },
      });
    },
    getNavRight() {
      uni.$u.route('/pages/search/search');
    },
    click(item) {
      let that = this;
      // console.log('item', item);
      that.categoryId = item.category;
      that.page = 1;
      that.sortList = [];
      that.getClientList();
    },
    routerPointList() {
      uni.$u.route({
        url: '/pages/point/point',
      });
    },
    showDetail() {
      this.show = true;
    },
    confirm() {
      this.show = false;
    },
    showUserList() {
      uni.$u.route({
        url: '/pages/point/leaderboard',
      });
    },
    // 获取分类详情
    getClientCategory() {
      let that = this;
      let params = {
        pageNum: 1,
        pageSize: 999,
      };
      IndexServer.getClientCategory(params, {
        success(res) {
          if (!uni.$u.test.array(res.data.result)) {
            uni.$u.toast(that.$t('Product category loading failed'));
            return;
          }

          res.data.result.map((i) => {
            i.name = i.name;
            i.value = i.category;
          });
          let all = { name: that.$t('all'), value: 0 };
          res.data.result.unshift(all);
          that.listTabs = res.data.result;
        },
        fail(res) {},
      });
    },
    // 获取商品列表
    getClientList() {
      let that = this;
      that.sortListDefault = [];
      let params = {
        page: that.page,
        pageSize: that.pageSize,
      };
      if (that.categoryId) {
        params.category = that.categoryId;
      }

      RewardServer.getPointsMallList(params, {
        success(res) {
          let sortList = res.data.result;

          if (sortList == null || sortList.length <= 0) {
            that.showEmpty = '3';

            that.sortList = [];
            that.page = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.sortList = that.sortList.concat(sortList);
          that.sortList.forEach((item) => {
            item.skus.forEach((element) => {
              if (element.is_default) {
                element.name = item.name;
                element.image = item.images[0];
                that.sortListDefault.push(element);
              }
            });
          });
          console.log('sortListDefault', that.sortListDefault);
          that.total = res.data.total;

          // that.page = res.page;
          if (that.sortList.length > 0) {
            that.isShowDefaultPage = false;
          } else {
            that.isShowDefaultPage = true;
          }

          uni.stopPullDownRefresh();
        },
        fail(err) {
          console.log(err);
          uni.stopPullDownRefresh();
          uni.$u.toast(err.msg);
        },
      });
    },

    //获取我的积分值
    getMyPoints() {
      RewardServer.getMyPoints({
        success(res) {
          if (res.data) {
            this.point = res.data.point;
          }
        },
        fail(err) {
          console.log(err);
          uni.$u.toast(err.msg);
        },
      });
    },
  },

  onPullDownRefresh() {
    this.sortList = [];
    this.page = 1;
    this.showEmpty = '1';
    this.getMyPoints();
    this.getClientList();
  },
  onReachBottom() {
    console.log('onReachBottom', this.sortList.length, this.total);
    if (this.sortList.length >= this.total) {
      this.showEmpty = '3';
      return;
    }
    this.page = this.sortList.length < this.total ? this.page + 1 : this.page;
    this.showEmpty = '2';
    this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
@keyframes swing {
  0% {
    transform: rotateZ(0deg);
  }
  25% {
    transform: rotateZ(-20deg);
  }
  50% {
    transform: rotateZ(20deg);
  }
  75% {
    transform: rotateZ(-20deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
.events {
  background: linear-gradient(to bottom, #faecd2, #f0eee7);
  height: 124rpx;
  width: 100%;
  border-radius: 20rpx;
  padding: 10rpx;
  z-index: 9999;
}
.avatar-container {
  position: relative;
  margin: 0 20px;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 5rpx solid transparent;
  animation: pulseBorder 2s infinite;
}

.crown {
  position: absolute;
  top: -7px;
  right: -2px;
  width: 45rpx;
  height: 45rpx;
  transform: rotate(20deg);
  animation: swing 2s ease-in-out infinite;
}

@keyframes pulseBorder {
  0% {
    border-color: transparent;
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
  50% {
    border-color: rgba(255, 215, 0, 0.7);
    box-shadow: 0 0 16rpx 16rpx rgba(255, 215, 0, 0.5);
  }
  100% {
    border-color: transparent;
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
}

.image {
  // animation: swing 2s ease-in-out infinite;
}
.img_logo {
  height: 60rpx;
  width: 60rpx;
  z-index: 9;
  animation: swing 2s ease-in-out infinite;
}
.u-demo-block {
  height: 328rpx;
  margin: 24rpx 0;
}

page {
  position: relative;

  .nav {
    width: 100%;
    height: 108rpx;
    text-align: center;
    line-height: 108rpx;
    color: #fff;
    font-size: 36rpx;
    position: relative;
    z-index: 1;
    font-weight: bold;
    margin-top: 70rpx;
  }

  .bg {
    width: 100%;
    background-size: 100% 100% !important;
    height: 496rpx;
    position: absolute;
    top: 0;
    z-index: 0;
    background: linear-gradient(to bottom, rgb(129, 117, 95), #fff);
  }
}
.title {
  position: relative;

  padding: 30rpx 20rpx;
}
.tabs {
  position: relative;
  z-index: 0;
}

.topic-pl {
  padding: 12rpx 24rpx 24rpx 24rpx;
  position: relative;
  z-index: 0;
  width: 100%;

  .topic {
    border-radius: 12rpx;
    width: 100%;
    height: auto;
    background-color: #fff;
    box-shadow: 0px 4rpx 14rpx rgba(218, 218, 218, 0.5);

    margin-top: 10rpx;
    &_tit {
      display: flex;
      align-items: baseline;

      &_text {
        color: #333;
        font-size: 36rpx;
        margin-right: 16rpx;
        font-weight: bold;
      }
    }

    &_des {
      color: #666;
      font-size: 28rpx;
    }

    .list {
      height: 324rpx;
      background-color: #fff;
      margin-right: 14rpx;
      padding-top: 32rpx;
      @include flex(column);
      position: relative;

      &_item {
        position: absolute;
        bottom: 20rpx;
        left: 20rpx;
        width: 412rpx;

        &_tit {
          color: #fff;
          font-size: 36rpx;
          margin-bottom: 20rpx;
        }

        &_des {
          @include flex();
          justify-content: space-between;

          text {
            color: #fff;
            font-size: 24rpx;
          }
        }
      }
    }

    .list:last-child {
      margin-right: 0;
    }
  }
  .pointExchange {
    width: 100%;
    background: linear-gradient(to right, rgba(199, 148, 29, 0.5), #fff); /* 使用线性渐变创建水平渐变 */
    border-radius: 10rpx;
    color: #fff;
    padding: 20rpx 20rpx;
    position: relative;
  }
}

.container {
  padding: 14rpx;
  position: relative;
  z-index: 1;
  min-height: 60vh;
  background-color: #f5f5f5;
  .sort {
    padding: 14rpx;
    background-color: #f5f5f5;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    &-item {
      width: 48%;
      min-height: 404rpx;
      border-radius: 16rpx;
      background-color: #fff;
      margin-right: 16rpx;
      margin-bottom: 16rpx;
      padding: 12rpx;
    }

    &-item:nth-of-type(2n) {
      margin-right: 0;
    }

    .name {
      color: #333;
      font-size: 28rpx;
      margin: 12rpx 0;
      line-height: 36rpx;
    }

    .price {
      color: #ff5f00;
      font-size: 24rpx;
      line-height: 36rpx;
    }
  }

  .val-retail {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .num {
      color: #aaa;
      font-size: 20rpx;
    }
  }

  .waterfall-item__ft__price,
  .val-wholesale {
    display: flex;
    justify-content: space-between;
    color: #ff5f00;
    font-size: 24rpx;
  }
}
/deep/ .u-tabs__wrapper__nav {
  background-color: #f5f5f5;
}
.indicator {
  @include flex(row);
  justify-content: center;

  &__dot {
    height: 6px;
    width: 6px;
    border-radius: 100px;
    background-color: rgba(255, 255, 255, 0.35);
    margin: 0 5px;
    transition: background-color 0.3s;

    &--active {
      background-color: #ffffff;
    }
  }
}

.indicator-num {
  padding: 2px 0;
  background-color: rgba(0, 0, 0, 0.35);
  border-radius: 100px;

  width: 35px;
  @include flex;
  justify-content: center;

  &__text {
    color: #ffffff;
    font-size: 12px;
  }
}
</style>
