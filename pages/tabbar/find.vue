<template>
  <view>
    <!-- <view class="nav">
      {{ $t('tabbar.classify') }}
    </view> -->
    <view class="bg">
      <!-- 添加浮动装饰元素 -->
      <view class="floating-elements">
        <view class="element"></view>
        <view class="element"></view>
        <view class="element"></view>
      </view>
      <!-- 添加光效 -->
      <view class="light-effect"></view>
    </view>
    <view class="topic-pl">
      <view class="topic" style="margin-top: 30rpx">
        <swiper
          class="topic-swiper"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          :circular="true"
          @change="handleSwiperChange"
        >
          <swiper-item v-for="(item, index) in topicList" :key="index" @click="routerTopic(item.catId)">
            <view class="topic-slide">
              <u-image
                width="100%"
                height="290rpx"
                radius="12rpx"
                :src="item.icon"
                :fade="true"
                mode="aspectFill"
                duration="450"
              >
                <template v-slot:loading>
                  <u-loading-icon></u-loading-icon>
                </template>
              </u-image>
              <!-- 添加渐变遮罩 -->
              <view class="slide-overlay"></view>
              <!-- 内容区域 -->
              <view class="slide-content">
                <view class="slide-header">
                  <text class="slide-title">{{ item.catName }}</text>
                  <view class="slide-tag">{{ item.type || '热门' }}</view>
                </view>
                <view class="slide-footer">
                  <text class="slide-date">{{ $u.timeFormat(item.updateTime, 'yyyy/mm/dd') }}{{ $t('release') }}</text>
                  <view class="slide-indicator">{{ currentIndex + 1 }}/{{ topicList.length }}</view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <view class="tabs shadow">
      <u-tabs
        :list="listTabs"
        lineColor="radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)"
        lineWidth="58rpx"
        lineHeight="8rpx"
        :activeStyle="{ color: '#2E5BB3', fontFace: '32rpx', fontWeight: 'bold' }"
        @click="click"
      ></u-tabs>
    </view>
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
          <view class="name-wrapper">
            <view class="name u-line-2">{{ item.name }}</view>
            <view class="name-tags">
              <text
                v-for="(tag, tagIndex) in getRandomNameTags(item)"
                :key="tagIndex"
                class="name-tag"
                :class="'name-tag-type-' + tag.type"
                >{{ tag.text }}</text
              >
            </view>
          </view>
          <!-- <view class="waterfall-item__ft__price" v-if="item.price <= 0 && item.wholesalePrice <= 0">
            <view class="price">
              {{ $t('Price negotiable') }}
            </view>
          </view> -->
          <view>
            <view class="waterfall-item__ft__price">
              <view class="val-retail">
                <view class="val">
                  <text>{{ $t('Retail price') }}：</text>
                  <!-- <text>{{ item.currency.symbol }} {{ item.price }}</text> -->
                  <text> {{ item.price }}</text>
                </view>
                <!-- <view class="num" v-if="false"> 8000+{{ $t('people paid') }} </view> -->
              </view>
            </view>
            <!-- <view class="val val-wholesale" v-if="item.wholesalePrice > 0">
              <view>
                <text>{{ $t('Wholesale price') }}：</text>
                <text>{{ item.currency.symbol }} {{ item.wholesalePrice }}</text>
              </view>
            </view> -->
          </view>
        </view>
      </view>

      <u-divider text="上拉加载" textSize="20" v-if="showEmpty === '1' && !isShowDefaultPage"></u-divider>
      <u-loading-icon text="加载中" textSize="20" v-if="showEmpty === '2' && !isShowDefaultPage"></u-loading-icon>
      <u-divider text="到底啦" textSize="20" v-if="showEmpty === '3' && !isShowDefaultPage"></u-divider>
      <u-empty :show="isShowDefaultPage" :text="$t('No data')" margin-top="300"></u-empty>
    </view>
  </view>
</template>

<script>
const IndexServer = require('../../common/store/indexServer.js');
const FindServer = require('../../common/store/findServer.js');
const Api = require('../../common/store/api.js');
const host = Api.host;
export default {
  data() {
    return {
      bgColor: '#3970bf',
      listTabs: [],
      indicator: false,
      // 热门话题
      topicList: [
        {
          catId: 1,
          catName: '行业运营',
          catNameMut: null,
          parentId: 0,
          icon: 'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/右图_1723444405141.jpg',
          sort: 0,
          type: 'topic',
          createTime: 1692667813,
          updateTime: 1698827403,
        },
        {
          catId: 5,
          catName: '发布会',
          catNameMut: null,
          parentId: 0,
          icon: 'http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/右图_1723444560030.jpg',
          sort: 123,
          type: 'topic',
          createTime: 1692958671,
          updateTime: 1698827117,
        },
        {
          catId: 4,
          catName: '人工智能',
          catNameMut: null,
          parentId: 0,
          icon: 'https://img.cifnews.com/dev/20240516/e308a74e5f9e4685b18583cc19f46fb2.png?x-oss-process=style/article-pc-list',
          sort: 234,
          type: 'topic',
          createTime: 1692690817,
          updateTime: 1698827135,
        },
      ],
      sortList: [],
      sortListDefault: [],
      page: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: false,
      categoryId: '',
      showEmpty: '1',
      currentIndex: 0,
    };
  },
  onShow() {
    this.getClientCategory();
    // this.getTopic();
    this.sortList = [];
    this.page = 1;
    this.getClientList();
  },
  methods: {
    getTopic() {
      let that = this;
      let type = 'topic'; // 话题
      let catId = '';
      FindServer.getFindClientCategory(type, catId, {
        success(res) {
          that.topicList = res.data;
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
    // routerTopic(catId) {
    //   uni.$u.route({
    //     url: '/pages/topic/topic',
    //     params: {
    //       catId: catId,
    //     },
    //   });
    // },
    routerDetails(id) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          spuId: id,
          from: 'find',
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
        page_size: that.pageSize,
      };
      if (that.categoryId) {
        params.category = that.categoryId;
      }
      IndexServer.getClientGoods(goodsId, params, {
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
          that.sortListDefault = [];
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
        },
      });
    },
    handleSwiperChange(e) {
      this.currentIndex = e.detail.current;
    },
    // 生成固定标签
    getRandomTags(item) {
      // 使用商品索引作为种子来生成固定的标签组合
      const index = this.sortListDefault.indexOf(item);

      // 定义所有可能的标签
      const allTags = {
        hot: { type: 'hot', text: '热销' },
        new: { type: 'new', text: '新品' },
        limited: { type: 'limited', text: '限时' },
        recommend: { type: 'recommend', text: '推荐' },
        discount: { type: 'discount', text: '特惠' },
        quality: { type: 'quality', text: '优选' },
        popular: { type: 'hot', text: '爆款' },
        fresh: { type: 'new', text: '上新' },
        exclusive: { type: 'limited', text: '限量' },
        selected: { type: 'recommend', text: '精选' },
        sale: { type: 'discount', text: '促销' },
        premium: { type: 'quality', text: '品质' },
      };

      // 根据索引分配固定的标签组合
      const tagCombinations = [
        ['hot', 'quality'], // 组合1: 热销+品质
        ['new', 'recommend'], // 组合2: 新品+推荐
        ['limited', 'discount'], // 组合3: 限时+特惠
        ['popular', 'premium'], // 组合4: 爆款+品质
        ['fresh', 'selected'], // 组合5: 上新+精选
        ['exclusive', 'sale'], // 组合6: 限量+促销
        ['recommend', 'quality'], // 组合7: 推荐+品质
        ['hot', 'discount'], // 组合8: 热销+特惠
        ['new', 'limited'], // 组合9: 新品+限时
        ['popular', 'selected'], // 组合10: 爆款+精选
      ];

      // 使用商品索引来选择固定的标签组合
      const combinationIndex = index % tagCombinations.length;
      const selectedTags = tagCombinations[combinationIndex];

      // 返回选中的标签对象数组
      return selectedTags.map((tagKey) => allTags[tagKey]);
    },

    // 生成固定的名称标签
    getRandomNameTags(item) {
      // 使用商品索引作为种子
      const index = this.sortListDefault.indexOf(item);

      // 定义所有可能的名称标签
      const nameTags = [
        [{ type: 'hot', text: '爆' }], // 单个标签组合1
        [{ type: 'new', text: '新' }], // 单个标签组合2
        [{ type: 'limited', text: '限' }], // 单个标签组合3
        [{ type: 'recommend', text: '荐' }], // 单个标签组合4
        [
          { type: 'hot', text: '爆' },
          { type: 'new', text: '新' },
        ], // 双标签组合1
        [
          { type: 'limited', text: '限' },
          { type: 'hot', text: '爆' },
        ], // 双标签组合2
        [
          { type: 'recommend', text: '荐' },
          { type: 'new', text: '新' },
        ], // 双标签组合3
        [
          { type: 'hot', text: '爆' },
          { type: 'limited', text: '限' },
        ], // 双标签组合4
      ];

      // 使用商品索引来选择固定的标签组合
      const tagIndex = index % nameTags.length;
      return nameTags[tagIndex];
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
    this.showEmpty = '2';
    this.getClientList();
  },
};
</script>

<style lang="scss" scoped>
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
  }

  .bg {
    width: 100%;
    height: 296rpx;
    position: absolute;
    top: 0;
    z-index: 0;
    background: linear-gradient(135deg, #9fcde7 0%, #344f8d 100%);
    overflow: hidden;

    // 添加动态波浪效果
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      background-repeat: repeat-x;
      animation: wave 10s linear infinite;
    }

    &::before {
      bottom: 0;
      height: 50rpx;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' style='fill: rgba(255, 255, 255, 0.1)'/%3E%3C/svg%3E");
      background-size: 1200px 50rpx;
    }

    &::after {
      bottom: 15rpx;
      height: 40rpx;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' style='fill: rgba(255, 255, 255, 0.08)'/%3E%3C/svg%3E");
      background-size: 1200px 40rpx;
      animation-delay: -5s;
    }

    // 添加浮动装饰元素
    .floating-elements {
      position: absolute;
      inset: 0;
      pointer-events: none;

      .element {
        position: absolute;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;

        &:nth-child(1) {
          width: 120rpx;
          height: 120rpx;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        &:nth-child(2) {
          width: 80rpx;
          height: 80rpx;
          top: 40%;
          right: 15%;
          animation-delay: -2s;
        }

        &:nth-child(3) {
          width: 60rpx;
          height: 60rpx;
          bottom: 30%;
          left: 30%;
          animation-delay: -4s;
        }
      }
    }

    // 添加光效
    .light-effect {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
      animation: rotate 20s linear infinite;
    }
  }
}

.tabs {
  position: relative;
  z-index: 0;
}

.topic-pl {
  position: relative;
  z-index: 0;
  width: 100%;

  .topic {
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 4rpx 14rpx rgba(218, 218, 218, 0.5);
    padding: 12rpx;
    overflow: hidden;

    .topic-swiper {
      height: 290rpx;
      border-radius: 12rpx;
      overflow: hidden;

      .topic-slide {
        position: relative;
        width: 100%;
        height: 100%;

        .slide-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 30%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0.7) 100%);
          z-index: 1;
        }

        .slide-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24rpx;
          z-index: 2;

          .slide-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16rpx;

            .slide-title {
              font-size: 32rpx;
              color: #fff;
              font-weight: 600;
              text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
            }

            .slide-tag {
              padding: 4rpx 16rpx;
              background: rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(4px);
              border-radius: 20rpx;
              font-size: 20rpx;
              color: #fff;
            }
          }

          .slide-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .slide-date {
              font-size: 24rpx;
              color: rgba(255, 255, 255, 0.8);
            }

            .slide-indicator {
              padding: 4rpx 12rpx;
              background: rgba(0, 0, 0, 0.3);
              border-radius: 20rpx;
              font-size: 20rpx;
              color: #fff;
            }
          }
        }

        // 添加悬浮效果
        &:active {
          .slide-content {
            transform: scale(0.98);
          }
        }
      }
    }
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

      .item-tags {
        position: absolute;
        top: 12rpx;
        left: 12rpx;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;

        .tag {
          padding: 4rpx 12rpx;
          border-radius: 6rpx;
          font-size: 20rpx;
          color: #fff;
          backdrop-filter: blur(4px);
          box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

          // 热销标签
          &.tag-type-hot {
            background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
          }

          // 新品标签
          &.tag-type-new {
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
          }

          // 限时标签
          &.tag-type-limited {
            background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
          }

          // 推荐标签
          &.tag-type-recommend {
            background: linear-gradient(135deg, #4b79e4 0%, #6c92e7 100%);
          }

          // 折扣标签
          &.tag-type-discount {
            background: linear-gradient(135deg, #722ed1 0%, #9254de 100%);
          }

          // 品质标签
          &.tag-type-quality {
            background: linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%);
          }
        }
      }

      .name-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 8rpx;
        margin: 12rpx 0;

        .name {
          flex: 1;
          color: #333;
          font-size: 28rpx;
          line-height: 36rpx;
        }

        .name-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4rpx;

          .name-tag {
            padding: 2rpx 8rpx;
            border-radius: 4rpx;
            font-size: 18rpx;
            color: #fff;
            white-space: nowrap;

            // 热销标签
            &.name-tag-type-hot {
              background: linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%);
            }

            // 新品标签
            &.name-tag-type-new {
              background: linear-gradient(135deg, #95de64 0%, #52c41a 100%);
            }

            // 限时标签
            &.name-tag-type-limited {
              background: linear-gradient(135deg, #ffc53d 0%, #faad14 100%);
            }

            // 推荐标签
            &.name-tag-type-recommend {
              background: linear-gradient(135deg, #69c0ff 0%, #1890ff 100%);
            }
          }
        }
      }

      .price {
        color: #ff5f00;
        font-size: 24rpx;
        line-height: 36rpx;
      }
    }

    &-item:nth-of-type(2n) {
      margin-right: 0;
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
}

// 动画关键帧
@keyframes wave {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1200px);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10rpx, -10rpx);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
