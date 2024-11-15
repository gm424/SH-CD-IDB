<template>
  <view class="content">
    <view class="container">
      <view class="cell">
        <u-cell-group :border="false" :customStyle="{ fontSize: '12px' }">
          <u-cell size="large" :title="$t('Language')" :isLink="true" @click="showColumns">
            <text slot="value" class="u-slot-value">{{ language }}</text>
          </u-cell>
          <u-cell size="large" :title="$t('Currency')" :isLink="true" @click="showColumnsCurrency">
            <text slot="value" class="u-slot-value">{{ currencyText }}</text>
          </u-cell>
          <u-cell size="large" :title="$t('Legal Policy')" @click="routerProtocol" :isLink="true"></u-cell>
          <!-- <u-cell size="large" :title="$t('Clear Cache')" :isLink="true"></u-cell> -->
        </u-cell-group>
      </view>
      <view style="width: 100%">
        <commonButton
          :text="$t('Sign Out')"
          @click="quit"
          style="margin: 40rpx 10rpx 20rpx 10rpx"
          :width="`100%`"
        ></commonButton>
      </view>
      <!-- <view style="width: 100%">
        <commonButton :text="$t('注销用户')" @click="quit" style="margin: 10rpx 10rpx" :width="`100%`"></commonButton>
      </view> -->
      <u-picker :show="show" :columns="locales" @confirm="confirmColumns" @cancel="cancelColumns"></u-picker>
      <u-picker
        :show="showCurrency"
        :columns="columnsCurrency"
        @confirm="confirmColumnsCurrency"
        @cancel="cancelColumnsCurrency"
      ></u-picker>
    </view>
  </view>
</template>

<script>
import commonButton from '@/components/myButton/commonButton.vue';
export default {
  components: {
    commonButton,
  },

  data() {
    return {
      btnCustomStyle: {
        width: '100%',
        height: '104rpx',
        background: 'radial-gradient(38.12% 93.75% at 50.00% 95.00%, #FFAC00 0%, #FF5F00 100%)',
        color: '#FFF',
        marginTop: '70rpx',
        fontWeight: 'Bold',
        borderRadius: '12rpx',
      },
      show: false,
      showCurrency: false,
      language: this.$t('locale.zh-hans'),
      currencyText: '',
      currency: '',
      systemLocale: '',
      applicationLocale: '',
    };
  },
  computed: {
    locales() {
      return [
        [
          {
            text: this.$t('locale.zh-hans'),
            code: 'zh-Hans',
          },
          {
            text: this.$t('locale.en'),
            code: 'en',
          },
          {
            text: this.$t('locale.ru-RU'),
            code: 'ru-RU',
          },
        ],
      ];
    },
    columnsCurrency() {
      return [
        [
          {
            text: this.$t('CNY'),
            code: 'CNY',
          },
          {
            text: this.$t('USD'),
            code: 'USD',
          },
          {
            text: this.$t('RUB'),
            code: 'RUB',
          },
          {
            text: this.$t('EUR'),
            code: 'EUR',
          },
          {
            text: this.$t('KRW'),
            code: 'KRW',
          },
          {
            text: this.$t('AED'),
            code: 'AED',
          },
          {
            text: this.$t('JPY'),
            code: 'JPY',
          },
          {
            text: this.$t('HKD'),
            code: 'HKD',
          },
        ],
      ];
    },
  },
  watch: {
    columnsCurrency(newval, val) {
      let that = this;
      val.map((item) => {
        item.map((i, index) => {
          if (i.text == that.currencyText) {
            that.currencyText = newval[0][index].text;
            that.currency = newval[0][index].code;
          }
        });
      });
    },
  },
  onLoad() {
    let applicationLocale = uni.getLocale();

    this.language =
      applicationLocale === 'zh-Hans'
        ? this.$t('locale.zh-hans')
        : applicationLocale === 'ru-RU'
        ? this.$t('locale.ru-RU')
        : this.$t('locale.en');
    if (!uni.$u.test.isEmpty(uni.getStorageSync('currency'))) {
      this.currencyText = this.$t(uni.getStorageSync('currency'));
      this.currency = uni.getStorageSync('currency');
    } else {
      this.currencyText = this.$t(this.columnsCurrency[0][0].code);
      this.currency = this.columnsCurrency[0][0].code;
    }
  },
  methods: {
    confirmColumnsCurrency(e) {
      this.showCurrency = false;
      this.currency = e.value[0].code;
      this.currencyText = this.$t(e.value[0].code);
      uni.setStorageSync('currencyText', this.currencyText);
      uni.setStorageSync('currency', this.currency);
    },
    showColumnsCurrency() {
      this.showCurrency = true;
    },
    confirmColumns(e) {
      this.show = false;
      uni.setLocale(e.value[0].code);
      this.$i18n.locale = e.value[0].code;
      this.language = e.value[0].text;
      uni.setStorageSync('applicationLocale', this.$i18n.locale);
    },
    showColumns() {
      this.show = true;
    },
    cancelColumns() {
      this.show = false;
    },
    cancelColumnsCurrency() {
      this.showCurrency = false;
    },
    routerProtocol() {
      uni.$u.route('/pages/protocol/protocol');
    },
    quit() {
      uni.clearStorage();
      uni.showToast({
        title: '操作成功！',
        icon: 'none',
        duration: 2500,
      });

      uni.$u.route({
        url: 'pages/login/login',
        type: {
          name: 'redirectTo',
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .u-button__text {
  font-size: 32rpx !important;
}

.content {
  width: 100%;
  @include flex(column);
  align-items: center;
  justify-content: center;

  .container {
    width: 100%;
    padding: 0 24rpx;

    .cell {
      width: 100%;

      .u-slot-value {
        color: #333;
        font-size: 32rpx;
        font-weight: bold;
      }

      /deep/ .u-cell__body {
        padding: 40rpx 0;
      }

      /deep/ .u-cell__left-icon-wrap {
        margin-right: 24rpx;
      }

      /deep/ .u-cell__title-text--large {
        color: #333;
        line-height: 150%;
        font-weight: bold;
      }

      /deep/ .u-icon__img {
        width: 32rpx !important;
        height: 32rpx !important;
      }
    }
  }
}
</style>
