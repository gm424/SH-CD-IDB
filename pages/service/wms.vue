<template>
  <view class="container">
    <view class="service-list" v-if="!isShowDefaultPage">
      <view
        v-for="(item, index) in sortListDefault"
        :key="index"
        class="service-card animate__animated animate__fadeInUp"
        :style="{ animationDelay: index * 0.1 + 's' }"
        @click="routerDetails(item)"
      >
        <view class="card-content">
          <view class="card-header">
            <view class="title-area">
              <text class="card-title">{{ item.sku }}</text>
              <view class="status-tag" :class="getRandomStatus(index).class">
                {{ getRandomStatus(index).text }}
              </view>
            </view>
            <view class="price-area">
              <text class="price-label">{{ $t('Retail price') }}：</text>
              <text class="price-value">{{ item.price }}</text>
            </view>
          </view>

          <view class="card-body">
            <view class="features">
              <view class="feature-item" v-for="(feature, fIndex) in getRandomFeatures()" :key="fIndex">
                <text class="iconfont" :class="feature.icon"></text>
                <text>{{ feature.text }}</text>
              </view>
            </view>

            <view class="stats-row">
              <view class="stat-item">
                <text class="iconfont icon-eye"></text>
                <text>{{ Math.floor(Math.random() * 1000) + 100 }}次浏览</text>
              </view>
              <view class="stat-item">
                <text class="iconfont icon-star"></text>
                <text>{{ (Math.random() * 2 + 3).toFixed(1) }}分</text>
              </view>
            </view>
          </view>

          <view class="card-footer">
            <view class="tags">
              <text class="tag" v-for="(tag, tIndex) in getRandomTags()" :key="tIndex">{{ tag }}</text>
            </view>
            <view class="action-button">
              <text>下单</text>
              <text class="iconfont icon-arrow-right"></text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <u-divider text="下拉加载" textSize="20" v-if="showEmpty === '1' && !isShowDefaultPage"></u-divider>
    <u-loading-icon text="加载中" textSize="20" v-if="showEmpty === '2' && !isShowDefaultPage"></u-loading-icon>
    <u-divider text="到底啦" textSize="20" v-if="showEmpty === '3' && !isShowDefaultPage"></u-divider>
    <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
  </view>
</template>

<script>
const IndexServer = require('@/common/store/indexServer.js');
const FindServer = require('@/common/store/findServer.js');
const Api = require('@/common/store/api.js');
const host = Api.host;
export default {
  data() {
    return {
      bg: `${host}/public/tabbar/find/findbg.png`,
      bgColor: '#3970bf',
      listTabs: [],
      indicator: false,
      sortList: [],
      sortListDefault: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: false,
      categoryId: '',
      showEmpty: '1',
    };
  },
  mounted() {
    this.getClientCategory();
    this.sortList = [];
    this.page = 1;
    this.getClientList();
  },
  methods: {
    routerDetails(item) {
      uni.$u.route({
        url: '/pages/service/tmsDetail',
        params: {
          id: item.id,
          price: item.price,
          sku: item.sku,
          store_id: item.store_id,
        },
      });
    },
    click(item) {
      let that = this;
      // console.log('item', item);
      that.categoryId = item.category;
      that.page = 1;
      that.sortList = [];
      that.getClientList();
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
      let goodsId = '';
      let params = {
        page: that.page,
        pageSize: 999,
        biz_type: 2,
      };
      if (that.categoryId) {
        params.category = that.categoryId;
      }
      IndexServer.getTmsService(params, {
        success(res) {
          that.sortListDefault = res.data.skus;
          if (that.sortListDefault.length === 0) {
            that.isShowDefaultPage = true;
          }
          console.log('sortListDefault', that.sortListDefault);
          that.total = res.data.total;
          uni.stopPullDownRefresh();
        },
        fail(err) {
          console.log(err);
          uni.stopPullDownRefresh();
        },
      });
    },
    getRandomStatus(index) {
      const statuses = [
        { text: '热销中', class: 'status-hot' },
        { text: '优选', class: 'status-premium' },
        { text: '新品', class: 'status-new' },
        { text: '推荐', class: 'status-recommend' },
      ];
      return statuses[index % statuses.length];
    },

    getRandomFeatures() {
      const features = [
        { icon: 'icon-shield', text: '正品保障' },
        { icon: 'icon-truck', text: '极速发货' },
        { icon: 'icon-diamond', text: '优质服务' },
        { icon: 'icon-like', text: '好评如潮' },
      ];
      return features.slice(0, 2 + Math.floor(Math.random() * 2));
    },

    getRandomTags() {
      const allTags = ['超值', '品质优选', '热卖', '限时特惠', '明星产品', '口碑好评'];
      const count = 2 + Math.floor(Math.random() * 2);
      const shuffled = [...allTags].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
  },
  onPullDownRefresh() {
    this.sortList = [];
    this.page = 1;
    this.showEmpty = '1';
    this.getClientList();
  },
  onReachBottom() {
    console.log('onReachBottom', this.sortList.length, this.total);
    if (this.sortList.length >= this.total) {
      this.showEmpty = '3';
      return;
    }
    this.page = this.sortList.length < this.total ? this.page + 1 : this.page;
    this.showEmpty = '3';
    // this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
  background-color: #f5f7fa;
  min-height: 100vh;

  .service-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    width: 100%;
  }

  .service-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;

    &:active {
      transform: translateX(4rpx);
    }

    // &::before {
    //   content: '';
    //   position: absolute;
    //   left: 0;
    //   top: 0;
    //   width: 6rpx;
    //   height: 100%;
    //   background: linear-gradient(to bottom, #4b79e4, #2e5bb3);
    //   border-radius: 6rpx;
    // }
  }

  .card-header {
    margin-bottom: 24rpx;

    .title-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;

      .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .status-tag {
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 22rpx;

        &.status-hot {
          background: rgba(255, 95, 0, 0.1);
          color: #ff5f00;
        }

        &.status-premium {
          background: rgba(75, 121, 228, 0.1);
          color: #4b79e4;
        }

        &.status-new {
          background: rgba(82, 196, 26, 0.1);
          color: #52c41a;
        }

        &.status-recommend {
          background: rgba(250, 173, 20, 0.1);
          color: #faad14;
        }
      }
    }

    .price-area {
      .price-label {
        font-size: 26rpx;
        color: #999;
      }

      .price-value {
        font-size: 32rpx;
        color: #ff5f00;
        font-weight: bold;
      }
    }
  }

  .card-body {
    margin-bottom: 24rpx;

    .features {
      display: flex;
      flex-wrap: wrap;
      gap: 16rpx;
      margin-bottom: 20rpx;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 8rpx;
        padding: 6rpx 16rpx;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 20rpx;

        .iconfont {
          font-size: 24rpx;
          color: #666;
        }

        text {
          font-size: 24rpx;
          color: #666;
        }
      }
    }

    .stats-row {
      display: flex;
      gap: 24rpx;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8rpx;

        .iconfont {
          font-size: 24rpx;
          color: #999;
        }

        text {
          font-size: 24rpx;
          color: #999;
        }
      }
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;
    border-top: 2rpx solid rgba(0, 0, 0, 0.03);

    .tags {
      display: flex;
      gap: 12rpx;

      .tag {
        padding: 4rpx 12rpx;
        background: #f5f7fa;
        border-radius: 12rpx;
        font-size: 22rpx;
        color: #666;
      }
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 8rpx 20rpx;
      background: linear-gradient(135deg, #4b79e4 0%, #2e5bb3 100%);
      border-radius: 24rpx;

      text {
        color: #fff;
        font-size: 24rpx;
      }

      .iconfont {
        font-size: 24rpx;
      }
    }
  }
}

// 添加动画
.animate__fadeInUp {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
