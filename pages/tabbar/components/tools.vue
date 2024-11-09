<template>
  <view class="stats-container">
    <view class="stats-row">
      <!-- 左侧大格子 -->
      <view class="stats-item large finance service-1" @click="handleLink('/pages/service/tms')">
        <view class="text-content">
          <text class="title">物流服务</text>
        </view>
        <view class="floating-dots"> </view>
        <view class="ripple-bg"></view>
        <!-- 添加背景图片容器 -->
        <view class="bg-image"></view>
      </view>
      <view class="stats-item large finance service-1" @click="handleLink('/pages/service/wms')">
        <view class="text-content">
          <text class="title">海外仓</text>
        </view>
        <view class="floating-dots"> </view>
        <view class="ripple-bg"></view>
        <!-- 添加背景图片容器 -->
        <view class="bg-image"></view>
      </view>
    </view>

    <view class="stats-row">
      <!-- 左侧大格子 -->
      <view class="stats-item large finance service-1" @click="handleLink('/pages/service/fms')">
        <view class="text-content">
          <text class="title">金融服务</text>
        </view>
        <view class="floating-dots"> </view>
        <view class="ripple-bg"></view>
        <!-- 添加背景图片容器 -->
        <view class="bg-image"></view>
      </view>
      <view class="stats-item large finance service-1" @click="handleLink('/pages/service/dtc')">
        <view class="text-content">
          <text class="title">数字链转型</text>
        </view>
        <view class="floating-dots"> </view>
        <view class="ripple-bg"></view>
        <!-- 添加背景图片容器 -->
        <view class="bg-image"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
export default {
  methods: {
    handleLink(url) {
      uni.navigateTo({
        url: url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.stats-container {
  width: 100%;
  height: 100%;
  padding: 8rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.stats-row {
  display: flex;
  gap: 8rpx;
  height: 50%;
}

.stats-column {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}

.stats-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  backdrop-filter: blur(10px);
  border-radius: 12rpx;
  padding: 12rpx;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  // 玻璃态效果
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(146, 145, 145, 0.2), rgba(255, 255, 255, 0.1));
    border-radius: 12rpx;
  }

  // 动态背景
  .ripple-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.15) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.5s;
  }

  &:active {
    transform: scale(0.98);

    .ripple-bg {
      opacity: 1;
      animation: ripple 0.8s ease-out;
    }
  }

  // 不同卡片的主题色
  &.large:first-child {
    background: linear-gradient(135deg, #fff 0%, #ecdfb9 100%);
  }

  &.small:first-child {
    background: linear-gradient(135deg, #f6ffed 0%, #e6f5da 100%);
  }

  &.small:last-child {
    background: linear-gradient(135deg, #fff 0%, #f0ddc0 100%);
  }

  &.bottom {
    background: linear-gradient(135deg, #fff1f0 0%, #c5e5ec 100%);
  }

  &.large {
    flex: 1;
    height: 100%;
  }

  &.small {
    height: calc(50% - 4rpx);
  }

  &.bottom {
    height: calc(50% - 4rpx);
  }

  // 添加背景图片相关样式
  &.finance {
    position: relative;
    overflow: hidden;

    // 确保内容在图片上层
    .text-content {
      z-index: 2;
    }

    .floating-dots {
      z-index: 2;
    }

    // 调整背景渐变
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 223, 185, 0.9));

    // 玻璃态效果
    backdrop-filter: blur(4px);
  }

  // 为每个服务项设置独特的渐变背景
  &.service-1 {
    background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
    box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.1);

    .floating-dots {
      opacity: 0.12;
    }

    &:hover {
      background: linear-gradient(135deg, #bae7ff 0%, #91d5ff 100%);
      .floating-dots {
        opacity: 0.15;
        transform: scale(1.05);
      }
    }
  }

  &.service-2 {
    background: linear-gradient(135deg, #f6ffed 0%, #b7eb8f 100%);
    box-shadow: 0 4rpx 12rpx rgba(82, 196, 26, 0.1);

    &:hover {
      background: linear-gradient(135deg, #b7eb8f 0%, #95de64 100%);
    }
  }

  &.service-3 {
    background: linear-gradient(135deg, #fff7e6 0%, #ffd591 100%);
    box-shadow: 0 4rpx 12rpx rgba(250, 173, 20, 0.1);

    &:hover {
      background: linear-gradient(135deg, #ffd591 0%, #ffc069 100%);
    }
  }

  &.service-4 {
    background: linear-gradient(135deg, #f0f5ff 0%, #adc6ff 100%);
    box-shadow: 0 4rpx 12rpx rgba(85, 130, 243, 0.1);

    .floating-dots-data {
      opacity: 0.12;
    }

    &:hover {
      background: linear-gradient(135deg, #adc6ff 0%, #85a5ff 100%);
      .floating-dots-data {
        opacity: 0.15;
        transform: scale(1.05);
      }
    }
  }

  // 添加通用的悬浮效果
  &:hover {
    transform: translateY(-2rpx);
    box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98) translateY(0);
  }
}

.text-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.title {
  font-size: 24rpx;
  font-weight: 600;
  color: #8b5105;
  text-shadow: 0 10rpx 10rpx rgba(182, 49, 49, 0.1);
}

// 背景图片容器
.floating-dots {
  width: 100%;

  position: absolute;
  top: 25px;

  right: -30px;
  bottom: 0;
  background: url('../.././../static/zhoubao.png') no-repeat center center;
  background-size: 60% auto; // 调整图片大小
  opacity: 0.1; // 调整透明度

  filter: grayscale(50%); // 轻微灰度处理
  z-index: 1;
  transition: all 0.3s ease;
}
.floating-dots-data {
  width: 80%;

  position: absolute;
  top: 20px;

  right: -40px;
  bottom: 0;
  background: url('../.././../static/zhifu.png') no-repeat center center;
  background-size: 60% auto; // 调整图片大小
  opacity: 0.15; // 调整透明度

  filter: grayscale(10%); // 轻微灰度处理
  z-index: 1;
  transition: all 0.3s ease;
}

// 动画关键帧
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4rpx);
  }
}

// 添加鼠标悬浮跟踪效果
.stats-item:hover .ripple-bg {
  --x: var(--mouse-x);
  --y: var(--mouse-y);
  opacity: 1;
}

// 优化背景图片效果
.floating-dots,
.floating-dots-data {
  transition: all 0.3s ease;
  filter: saturate(1.2) brightness(1.1);
}

// 添加渐变动画
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
