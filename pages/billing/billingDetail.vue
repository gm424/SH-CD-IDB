<template>
  <view>
    <view>
      <u-datetime-picker :show="show" v-model="date" mode="date" :formatter="formatter"></u-datetime-picker>
      <div @click="show = true">{{ date }}</div>
    </view>
    <u-cell-group>
      <u-cell
        size="large"
        :title="item.title"
        :value="item.price"
        :label="item.time"
        v-for="(item, index) in billingList"
        :key="index"
      >
        <u-avatar slot="icon" shape="circle" size="85" :src="item.img" customStyle="margin: -3px 5px -3px 0"></u-avatar>
        <div slot="value" style="text-align: right">
          <div>{{ item.price }}</div>
          <div style="font-size: 26rpx">剩余余额{{ item.balance }}</div>
        </div>
      </u-cell>
    </u-cell-group>
  </view>
</template>

<script>
export default {
  data() {
    return {
      date: Number(new Date()),
      show: false,
      billingList: [
        {
          img: 'https://cdn.uviewui.com/uview/album/1.jpg',
          title: '潘多拉美食广场',
          time: '5月30日',
          price: '-23874',
          balance: '4.0',
        },
        {
          img: 'https://cdn.uviewui.com/uview/album/1.jpg',
          title: '潘多拉美食广场',
          time: '5月30日',
          price: -'2.0',
          balance: '4.0',
        },
        {
          img: 'https://cdn.uviewui.com/uview/album/1.jpg',
          title: '潘多拉美食广场',
          time: '5月30日',
          price: '-2.0',
          balance: '4.0',
        },
        {
          img: 'https://cdn.uviewui.com/uview/album/1.jpg',
          title: '潘多拉美食广场',
          time: '5月30日',
          price: '-2.0',
          balance: '4.0',
        },
        {
          img: 'https://cdn.uviewui.com/uview/album/1.jpg',
          title: '潘多拉美食广场',
          time: '5月30日',
          price: '-2.0',
          balance: '4.0',
        },
      ],
    };
  },
  methods: {
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
  },
};
</script>

<style></style>
