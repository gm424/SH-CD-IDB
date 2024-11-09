<template>
  <view class="my-dropdown">
    <!-- 选择框 -->
    <view class="dropdown-input" @click="toggleDropdown">
      <view class="selected-text">{{ selectedText }}</view>
      <view class="dropdown-icon" :class="{ 'is-active': isOpen }">
        <u-icon name="arrow-down" size="24rpx" color="#666"></u-icon>
      </view>
    </view>

    <!-- 下拉选项列表 -->
    <view v-if="isOpen" class="dropdown-options" :style="optionsStyle">
      <view
        v-for="(item, index) in options"
        :key="index"
        class="option-item"
        :class="{ 'is-active': modelValue === item.value }"
        @click="selectOption(item)"
      >
        {{ item.text }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MyDropdown',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    selectedText() {
      const selected = this.options.find((item) => item.value === this.modelValue);
      return selected ? selected.text : this.placeholder;
    },
    optionsStyle() {
      return {
        maxHeight: this.isOpen ? '400rpx' : '0',
      };
    },
  },
  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectOption(item) {
      this.$emit('update:modelValue', item.value);
      this.$emit('change', item);
      this.isOpen = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.my-dropdown {
  position: relative;
  width: 100%;

  .dropdown-input {
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 12rpx;
    padding: 24rpx 32rpx;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;

    &:active {
      background: #f1f3f5;
    }

    .selected-text {
      font-size: 28rpx;
      color: #333;
    }

    .dropdown-icon {
      transition: transform 0.3s ease;

      &.is-active {
        transform: rotate(180deg);
      }
    }
  }

  .dropdown-options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 12rpx;
    margin-top: 8rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 100;
    transition: all 0.3s ease;

    .option-item {
      padding: 24rpx 32rpx;
      font-size: 28rpx;
      color: #333;
      transition: all 0.3s ease;

      &:active {
        background: #f8f9fa;
      }

      &.is-active {
        color: #2e5bb3;
        font-weight: 500;
        background: rgba(46, 91, 179, 0.05);
      }

      &:not(:last-child) {
        border-bottom: 1px solid #f1f3f5;
      }
    }
  }
}
</style>
