<template>
  <view>
    <u-button :customStyle="customBtn" @click="click" :icon="icon" :iconColor="iconColor" :disabled="disabled">{{
      text
    }}</u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    text: {
      default: null,
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '74rpx',
    },
    icon: {
      type: String,
    },
    iconColor: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    customBtn() {
      return {
        width: this.width,
        height: this.height,
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #fceddc 0%,  #f7ae64 100%)',
        color: '#FFF',
        marginTop: '10rpx',
        fontWeight: 'Bold',
        borderRadius: '28rpx',
      };
    },
  },
  methods: {
    click() {
      this.$emit('click');
    },
  },
};
</script>

<style scoped>
/deep/ .u-icon__icon {
  font-size: 15px !important;
}
</style>
