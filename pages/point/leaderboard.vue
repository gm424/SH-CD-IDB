<template>
  <view class="listContainer">
    <u-row style="padding: 80rpx 20rpx">
      <u-col :span="4" v-for="(item, index) in leaderboard" :key="index">
        <view style="display: flex; justify-content: center" class="avatar-container">
          <img :src="item.avatar" alt="User Avatar" class="avatar" />
          <u-image :src="require('@/assets/' + item.crown)" alt="Crown" class="crown" height="45" width="45" />
        </view>
        <view style="display: flex; justify-content: center; color: #fff">{{ item.name }}</view>
        <view style="display: flex; justify-content: center; color: #fff">{{ item.points }}</view>
      </u-col>
    </u-row>

    <view class="list">
      <view v-for="(item, index) in leaderboardfilter" :key="index" style="padding: 20rpx 20rpx">
        <u-row>
          <u-col :span="2">{{ index + 4 }}</u-col>
          <u-col :span="2">
            <img :src="item.avatar" style="height: 80rpx; width: 80rpx; border-radius: 50%" />
          </u-col>
          <u-col :span="6">{{ item.name }}</u-col>
          <u-col :span="2" style="color: #ec9a15">{{ item.points }}</u-col>
        </u-row>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      leaderboard: [
        {
          avatar: 'https://cdn.uviewui.com/uview/album/1.jpg',
          crown: 'second.png',
          name: '海绵宝宝',
          points: '3453',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/2.jpg',
          crown: 'first.png',
          name: 'lwj_5263',
          points: '2534',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/3.jpg',
          crown: 'third.png',
          name: '张博深',
          points: '1453',
        },
      ],
      leaderboardfilter: [
        {
          avatar: 'https://cdn.uviewui.com/uview/album/10.jpg',
          crown: 'second.png',
          name: 'sdg_9892',
          points: '753',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/9.jpg',
          crown: 'first.png',
          name: 'kjahh_9993',
          points: '634',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/8.jpg',
          crown: 'third.png',
          name: 'fasfd_444',
          points: '553',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/4.jpg',
          crown: 'second.png',
          name: 'jsdf_7485',
          points: '453',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/5.jpg',
          crown: 'first.png',
          name: 'kyr_8437',
          points: '314',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/6.jpg',
          crown: 'third.png',
          name: 'sdfg_7823',
          points: '300',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/7.jpg',
          crown: 'second.png',
          name: 'ksgy_8888',
          points: '299',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/8.jpg',
          crown: 'first.png',
          name: 'saihr_2637',
          points: '292',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/9.jpg',
          crown: 'third.png',
          name: 'loihbb_7827',
          points: '235',
        },
        {
          avatar: 'https://cdn.uviewui.com/uview/album/10.jpg',
          crown: 'second.png',
          name: 'jdhd_yyy',
          points: '199',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
page {
  overflow-y: hidden !important;
}
.listContainer {
  background-color: #f9dfb9;
  height: 100vh;
  padding: 20rpx 20rpx;
}
.list {
  background-color: #fff;
  height: 70vh;
  min-height: 70vh;
  border-radius: 10rpx;
  overflow-y: scroll;
}
.pointExchange {
  width: 100%;
  background: linear-gradient(to right, rgba(199, 148, 29, 0.5), #fff); /* 使用线性渐变创建水平渐变 */
  border-radius: 10rpx;
  color: #fff;
  padding: 20rpx 20rpx;
  position: relative;
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
</style>
