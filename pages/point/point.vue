<template>
  <view class="containerPoint">
    <!-- 添加统计卡片 -->
    <view class="stats-cards">
      <view class="stat-card">
        <view class="stat-value" style="display: flex; flex-direction: row"
          ><u-icon name="rmb-circle" size="48rpx" color="#4B79E4"></u-icon>{{ totalPoints || 0 }}</view
        >
        <view class="stat-label">总收益(元)</view>
      </view>
      <view class="stat-card">
        <view class="stat-value" style="display: flex; flex-direction: row"
          ><u-icon name="folder" size="48rpx" color="#FF9A9E"></u-icon>{{ pointsList.length || 0 }}</view
        >
        <view class="stat-label">总项目数</view>
      </view>
    </view>

    <!-- 交易记录列表 -->
    <view class="records-section">
      <view class="section-title">
        <text>交易记录</text>
        <view class="title-line"></view>
      </view>

      <view class="records-list">
        <view v-for="(item, index) in pointsList" :key="index" class="record-item">
          <view class="record-date">{{ handleDate(item.created_time) }}</view>
          <view class="record-content">
            <view class="record-left">
              <image :src="img" class="record-icon"></image>
              <view class="record-info">
                <text class="record-title">{{ item.title }}</text>
                <text class="record-desc">{{ item.description }}</text>
              </view>
            </view>
            <view class="record-amount" :class="{ income: item.total_revenue_amount > 0 }">
              {{ item.total_revenue_amount > 0 ? '+' : '' }}{{ item.total_revenue_amount }}
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 加载状态 -->
    <view class="loading-status">
      <u-divider text="下拉加载" textSize="20" v-if="showEmpty === '1' && !isShowDefaultPage"></u-divider>
      <u-loading-icon text="加载中" textSize="20" v-if="showEmpty === '2' && !isShowDefaultPage"></u-loading-icon>
      <u-divider text="到底啦" textSize="20" v-if="showEmpty === '3' && !isShowDefaultPage"></u-divider>
      <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.containerPoint {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 24rpx;
}

// 统计卡片样式
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
  margin-bottom: 32rpx;

  .stat-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);

    &::before {
      content: '';
      position: absolute;
      right: -20%;
      top: -20%;
      width: 200rpx;
      height: 200rpx;
      background: radial-gradient(circle, rgba(75, 121, 228, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .stat-value {
      font-size: 48rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 8rpx;
    }

    .stat-label {
      font-size: 24rpx;
      color: #999;
    }

    .stat-icon {
      // position: absolute;
      // right: 24rpx;
      // top: 24rpx;
      padding: 16rpx;
      background: rgba(75, 121, 228, 0.1);
      border-radius: 16rpx;
    }
  }
}

// 记录列表样式
.records-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.05);

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 24rpx;

    text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-right: 16rpx;
    }

    .title-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, #eee, transparent);
    }
  }

  .records-list {
    .record-item {
      margin-bottom: 24rpx;

      .record-date {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 12rpx;
      }

      .record-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        padding: 20rpx;
        border-radius: 16rpx;
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.98);
        }

        .record-left {
          display: flex;
          align-items: center;
          gap: 16rpx;

          .record-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 16rpx;
          }

          .record-info {
            display: flex;
            flex-direction: column;
            gap: 8rpx;

            .record-title {
              font-size: 28rpx;
              color: #333;
              font-weight: 500;
            }

            .record-desc {
              font-size: 24rpx;
              color: #999;
            }
          }
        }

        .record-amount {
          font-size: 32rpx;
          font-weight: 600;
          color: #333;

          &.income {
            color: #52c41a;
          }
        }
      }
    }
  }
}

// 加载状态样式
.loading-status {
  padding: 24rpx 0;
  text-align: center;
}
</style>

<script>
const IndexServer = require('@/common/store/indexServer.js');
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: false,
      showEmpty: '1',
      img: 'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/极网LOGO_1731065287394.png',
      pointsList: [],
      totalPoints: 0,
    };
  },
  onShow() {
    this.getPointList();
  },
  onPullDownRefresh() {
    this.pointsList = [];
    this.page = 1;
    this.showEmpty = '1';
    this.getPointList();
  },
  onReachBottom() {
    if (this.pointsList.length >= this.total) {
      this.showEmpty = '3';
      return;
    }
    this.page = this.pointsList.length < this.total ? this.page + 1 : this.page;
    this.showEmpty = '2';
    this.getPointList();
  },
  methods: {
    //获取列表
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
    getPointList() {
      let that = this;

      let params = {
        page: 1,
        pageSize: 9999,
      };

      IndexServer.getRecordsList(params, {
        success(res) {
          let sortList = res.data.result;
          if (sortList == null || sortList.length <= 0) {
            that.showEmpty = '3';
            that.pointsList = [];
            that.page = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.pointsList = that.pointsList.concat(sortList);
          that.total = res.data.total;

          // 计算总收益
          that.totalPoints = that.pointsList.reduce((sum, item) => {
            return sum + (Number(item.total_revenue_amount) || 0);
          }, 0);
          if (that.totalPoints > 10000 && that.totalPoints < 100000000) {
            that.totalPoints = (that.totalPoints / 10000).toFixed(2) + '万';
          } else if (that.totalPoints > 100000000) {
            that.totalPoints = (that.totalPoints / 100000000).toFixed(2) + '亿';
          }
          if (that.pointsList.length > 0) {
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
  },
};
</script>
