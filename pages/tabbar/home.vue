<template>
  <view class="container">
    <u-navbar :placeholder="true" :bgColor="navBarBgColor" :titleStyle="{ color: '#fff' }" fixed>
      <view class="u-nav-slot" slot="left">
        <!-- <u-image
          width="158rpx"
          height="62rpx"
          radius="12rpx"
          :src="logoUrl"
          :fade="true"
          mode="aspectFill"
          duration="850"
          :lazy-load="true"
        >
          <template v-slot:loading>
            <u-loading-icon></u-loading-icon>
          </template>
          <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
        </u-image> -->
        <view style="color: #fff; font-weight: 600; font-size: 18px">数城科技</view>
      </view>

      <view class="u-nav-slot-right" style="display: flex; flex-direction: row; align-items: center" slot="right">
        <view class="" @tap="getNavRight">
          <u--input
            :placeholder="$t('search.search')"
            placeholderStyle="color: #fff"
            prefixIcon="search"
            prefixIconStyle="font-size: 28rpx;line-height:28rpx;color: #C0C4CC"
            shape="circle"
            fontSize="24rpx"
            :customStyle="inputCustom"
          ></u--input>
        </view>
      </view>
    </u-navbar>
    <!-- 修改背景部分 -->
    <view class="bg" :style="{ background: currentGradient }">
      <swiper
        class="bg-swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        :circular="true"
        @change="handleSwiperChange"
      >
        <swiper-item v-for="(item, index) in promoList" :key="index" @click="handlePromoClick(item)">
          <image :src="item.image" class="bg-image" />
        </swiper-item>
      </swiper>

      <!-- 添加指示点 -->
      <!-- <view class="swiper-dots">
        <view
          v-for="(item, index) in promoList"
          :key="index"
          class="dot"
          :class="{ active: currentSwiperIndex === index }"
        ></view>
      </view> -->
    </view>
    <!-- 精品馆 -->
    <view style="width: 100%; display: flex; justify-content: center">
      <view class="nation-concent">
        <view class="nation_viewes" v-for="(item, index) in boutiqueList" :key="index" @click="routeCoutryList(item)">
          <u-image
            width="60rpx"
            height="60rpx"
            :src="item.icon"
            :fade="true"
            mode="aspectFill"
            duration="450"
            :lazy-load="true"
            shape="circle"
          >
            <template v-slot:loading>
              <u-loading-icon></u-loading-icon>
            </template>
            <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
          </u-image>
          <text class="grid-text u-line-2" style="word-break: inherit; color: #000">{{ item.title }}</text>
        </view>
      </view>
    </view>
    <view class="home">
      <!-- 合作方 -->
      <view class="alliance partner-section">
        <view class="section-header">
          <view class="header-main">
            <view class="header-title">
              <text class="title-text">{{ $t('Business partner') }}</text>
              <view class="title-decoration"></view>
            </view>
            <text class="header-subtitle">{{ $t('Join hands to create a new cross-border future') }}</text>
          </view>
        </view>

        <view class="partner-grid">
          <view v-for="(item, index) in partnerList" :key="index" class="partner-card" @click="routeDetail(item)">
            <view class="partner-icon">
              <u-image width="72rpx" height="72rpx" :src="item.logo" mode="aspectFit" :fade="true" duration="450">
                <template v-slot:loading>
                  <u-loading-icon></u-loading-icon>
                </template>
              </u-image>
            </view>
            <text class="partner-name">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 修改快捷服务部分 -->
      <view class="alliance">
        <!-- 修改常用工具标题部分 -->
        <view class="section-header">
          <view class="header-main">
            <view class="header-title">
              <text class="title-text">{{ $t('One-stop service') }}</text>
              <view class="title-decoration"></view>
            </view>
            <text class="header-subtitle">{{ $t('Convenient tools to help development') }}</text>
          </view>
        </view>
        <view class="grid">
          <!-- 左侧买家入口保持不变 -->
          <view class="grid-l" @click="routerFactory">
            <view class="grid-l-t-text">
              <text class="tit">{{ $t('Supplier placement') }}</text>
            </view>
            <u-button :text="$t('tabbar.button')" type="primary" class="buyer-btn"></u-button>
            <u-image width="80rpx" height="80rpx" :src="buyer" mode="aspectFill" :fade="true" duration="450">
              <template v-slot:loading>
                <u-loading-icon></u-loading-icon>
              </template>
            </u-image>
          </view>
        </view>
        <view class="quick-services">
          <view
            class="service-item"
            v-for="(item, index) in serviceList"
            :key="index"
            @click="handleServiceClick(item)"
          >
            <u-image
              :width="item.size"
              :height="item.size"
              :src="item.logo"
              mode="aspectFit"
              :fade="true"
              duration="450"
              :style="`margin-top:${item.margin}px`"
            >
            </u-image>
            <text class="service-name" :style="`margin-top:${item.marginName}px`">{{ item.title }}</text>
          </view>
        </view>
      </view>

      <!-- 常用工具 -->
      <view class="alliance" v-if="toolsList != null && toolsList.length > 0">
        <!-- 修改常用工具标题部分 -->
        <view class="section-header">
          <view class="header-main">
            <view class="header-title">
              <text class="title-text">{{ $t('Common tool') }}</text>
              <view class="title-decoration"></view>
            </view>
            <text class="header-subtitle">{{ $t('Convenient tools to help development') }}</text>
          </view>
        </view>

        <!-- 修改为横向滚动列表 -->
        <scroll-view scroll-x class="tool-concent" show-scrollbar="false" ref="scrollView">
          <view class="tool-list">
            <view
              v-for="(item, index) in toolsList"
              @click="routerDetails(item.target, item.title)"
              :key="index"
              class="tool-item"
            >
              <view class="tool-concent-l" :style="{ background: item.backgroundColor }">
                <view class="tool-concent-l-r">
                  <text :style="appLanguage === 'en' ? 'margin-bottom: 0rpx' : ''">{{ item.title }}</text>
                  <text v-if="appLanguage !== 'en'" style="width: 60%">{{ item.description }}</text>
                  <text v-else></text>
                </view>
                <view
                  style="
                    position: absolute;
                    right: -10px;
                    top: 25px;
                    border-radius: 32rpx;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    opacity: 0.2;
                  "
                >
                  <u-image
                    width="150rpx"
                    height="150rpx"
                    :src="require('@/static/' + item.icon)"
                    :fade="true"
                    mode="aspectFill"
                    duration="450"
                    :lazy-load="true"
                  >
                    <template v-slot:loading>
                      <u-loading-icon></u-loading-icon>
                    </template>
                    <view #error style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
                  </u-image>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!--  
     
      <view class="order" @click="handleService">
        <div class="order-content">
          <text class="text1" :style="appLanguage === 'en' ? 'margin-bottom: 0rpx' : ''">服务产品</text>
          <text class="text2" v-if="appLanguage !== 'en'">金融、物流、海外仓</text>
        </div>
        <u-image
          width="120rpx"
          height="120rpx"
          radius="12rpx"
          :src="order"
          :fade="true"
          mode="aspectFill"
          duration="850"
          :lazy-load="true"
          style="flex: 1; display: flex; align-items: center"
        >
          <template v-slot:loading>
            <u-loading-icon></u-loading-icon>
          </template>
          <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
        </u-image> </view
      >-->

      <!--<view class="promo-swiper">
        <swiper
          class="swiper-box"
          :indicator-dots="true"
          :autoplay="true"
          :interval="3000"
          :duration="500"
          :circular="true"
          indicator-active-color="#4B79E4"
          indicator-color="rgba(75,121,228,0.3)"
        >
          <swiper-item v-for="(item, index) in promoList" :key="index" @click="handlePromoClick(item)">
            <view class="swiper-item">
              <image :src="item.image" mode="aspectFill" class="promo-image" />
              <view class="promo-content" v-if="item.title || item.desc">
                <text class="promo-title">{{ item.title }}</text>
                <text class="promo-desc">{{ item.desc }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>-->

      <view class="boutique" v-if="boutiqueList != null && boutiqueList.length > 0">
        <!-- <u-image width="100%" height="96rpx" :src="boutique" :fade="true" mode="aspectFill" duration="450"
					<template v-slot:loading>
						<u-loading-icon></u-loading-icon>
					</template>
					<view slot="error" style="font-size: 24rpx;">{{$t('failedToLoad')}}</view>
				</u-image>
				<view class="alliance-tit-l boutique_tit">
					<img :src="alliance_icon">
					<text>{{$t('Boutique Museum')}}</text>
				</view>
				-->
        <!-- <view class="alliance-tit" style="margin-bottom: 0;padding-top: 24rpx;">
					<view class="alliance-tit-l">
						<img :src="alliance_icon">
						<text>{{$t('Boutique Museum')}}</text>
					</view>
				</view> -->
      </view>

      <!-- 供应商 -->
      <!--<view class="alliance" v-if="supplierList != null && supplierList.length > 0">
        <view class="alliance-tit m0" style="padding-top: 24rpx">
          <view class="alliance-tit-l">
            <img :src="alliance_icon" />
            <text>{{ $t('Supplier Alliance') }}</text>
          </view>
        </view>
        <view class="alliance-concent">
          <u-grid col="4" :border="false">
            <u-grid-item v-for="(item, index) in supplierList" :key="index">
              <u-image
                width="132rpx"
                height="60rpx"
                :src="item.icon"
                :fade="true"
                style="margin: 24rpx 0rpx"
                mode="aspectFit"
                duration="450"
                :lazy-load="true"
              >
                <template v-slot:loading>
                  <u-loading-icon></u-loading-icon>
                </template> 
                <view slot="error" style="font-size: 24rpx">{{ $t('failedToLoad') }}</view>
              </u-image>
            </u-grid-item>
          </u-grid>
          <view>
            <u-notice-bar :text="text1" fontSize="15"></u-notice-bar>
          </view>
        </view>
      </view>-->
    </view>
    <!-- 推荐 -->
    <view class="alliance" v-if="recommendList != null && recommendList.length > 0" style="padding: 0px 10px">
      <!-- 修改热门推荐标题部分 -->
      <view class="section-header" style="padding: 0px 15px">
        <view class="header-main">
          <view class="header-title">
            <text class="title-text">{{ $t('for you') }}</text>
            <view class="title-decoration"></view>
          </view>
          <text class="header-subtitle">{{ $t('Select good quality things') }}</text>
        </view>
      </view>

      <view class="waterfall">
        <view
          v-for="(item, index) in recommendList"
          @click="routerGoodsDetails(item.spu)"
          :key="item.id"
          class="waterfall-item"
        >
          <view class="waterfall-item__image">
            <u-image
              width="100%"
              height="354rpx"
              radius="12rpx"
              :src="item.images[0]"
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
            <img :src="hot" class="hot" />
          </view>
          <view class="waterfall-item__ft" style="padding: 5px">
            <view class="waterfall-item__ft__desc uv-line-1" v-if="false">
              <view class="value">{{ item.desc }}</view>
            </view>
            <view class="waterfall-item__ft__title">
              <view class="value u-line-2">{{ item.name }}</view>
            </view>
            <view class="waterfall-item__ft__price">
              <view class="waterfall-item-price-discuss" v-if="item.price <= 0 && item.wholesalePrice <= 0">
                <view class="val">
                  <text></text>
                  <text>{{ $t('Price negotiable') }}</text>
                </view>
              </view>
              <view class="waterfall-item-price" v-else>
                <view class="val-retail" v-if="item.price > 0">
                  <view class="val">
                    <text>{{ $t('Retail price') }}：</text>
                    <text>￥ {{ item.price }}</text>
                  </view>
                  <view class="num" v-if="false"> 8000+{{ $t('people paid') }} </view>
                </view>

                <view class="val val-wholesale" v-if="item.wholesalePrice > 0">
                  <view>
                    <text>{{ $t('Wholesale price') }}：</text>
                    <text>￥ {{ item.wholesalePrice }}</text>
                  </view>
                </view>
              </view>
            </view>
            <view class="waterfall-item__ft__price" v-if="false">
              <view class="val">
                <text>￥</text>
                <text>.1.299.999</text>
              </view>
              <view class="num"> 8000+{{ $t('Personal paymentPersonal payment') }} </view>
            </view>
          </view>
        </view></view
      >
    </view>
  </view>
</template>

<script>
import mixin from '@/mixins/index';
import Tools from './components/tools.vue';
const Api = require('../../common/store/api.js');
const indexServer = require('../../common/store/indexServer.js');
const validate = require('../../common/utils/validate.js');
const host = Api.host;
const IndexServer = require('../../common/store/indexServer.js');
export default {
  mixins: [mixin.generalNavigateTo],
  data() {
    return {
      bgColor: 'transparent', // 修改为透明背景
      sortList: [],
      inputCustom: {
        width: '332rpx',
        height: '48rpx',
        padding: '6rpx 12rpx',
        background: 'rgba(255, 255, 255, 0.2)', // 修改搜索框背景为半透
        borderColor: 'transparent !important',
        backdropFilter: 'blur(10px)', // 添加毛玻璃效果
      },
      bg: `${host}/public/tabbar/home/bg.png`,
      text1: this.$t('Industry domestic information content playback'),
      //轮播图
      swiperList: [
        {
          cid: 19,
          authorId: 1,
          type: 'banner_index',
          category: 'index',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/idb_buy.png',
          title: '商品',
          description: null,
          target: '/pages/details/details?goodsId=21',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692849682,
          updateTime: 1698830537,
        },
      ],
      // 精品馆
      boutiqueList: [
        {
          cid: 33,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'https://flagcdn.com/w320/eu.png',
          title: this.$t('European station'),
          warehouse_id: '6',
          description: 'European Sector',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 2,
          local: 'zh',
          createTime: 1692944986,
          updateTime: 1698287735,
        },
        {
          cid: 32,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'data:image/png;base64,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',
          title: this.$t('The Middle East'),
          description: 'Korean Sector',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 1,
          warehouse_id: '14',
          local: 'zh',
          createTime: 1692944972,
          updateTime: 1698287728,
        },

        {
          cid: 34,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'data:image/png;base64,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',
          title: this.$t('Russia'),
          warehouse_id: '13',
          description: 'US Sector',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 3,
          local: 'zh',
          createTime: 1692944995,
          updateTime: 1698287744,
        },
        {
          cid: 35,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'data:image/png;base64,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',
          title: this.$t('Mexico'),
          warehouse_id: '12',
          description: 'Spanish Sector',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 4,
          local: 'zh',
          createTime: 1692945007,
          updateTime: 1698287748,
        },
      ],

      // 供应商
      supplierList: [
        {
          cid: 5,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/zhaoshang.jpg',
          title: '大宗跨境电商',
          description: '',
          target: '/pages/shop/shop?storeId=17',
          content: null,
          images: null,
          sort: 1,
          local: 'zh',
          createTime: 1692263197,
          updateTime: 1698306799,
        },
        {
          cid: 6,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/Yong_Hui,_Group.jpg',
          title: '供应商2',
          description: null,
          target: '/pages/shop/shop?storeId=15',
          content: null,
          images: null,
          sort: 2,
          local: 'zh',
          createTime: 1692263513,
          updateTime: 1698306905,
        },
        {
          cid: 7,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/xiamenxinda.jpg',
          title: '供应商3',
          description: null,
          target: '/pages/shop/shop?storeId=17',
          content: null,
          images: null,
          sort: 3,
          local: 'zh',
          createTime: 1692263527,
          updateTime: 1698306914,
        },
        {
          cid: 8,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/zhuoerkonggu.png',
          title: '供应商4',
          description: null,
          target: '/pages/shop/shop?storeId=30',
          content: null,
          images: null,
          sort: 4,
          local: 'zh',
          createTime: 1692263538,
          updateTime: 1698304121,
        },
        {
          cid: 9,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/xugong_jituan.png',
          title: '供应商5',
          description: '',
          target: '/pages/shop/shop?storeId=15',
          content: null,
          images: null,
          sort: 5,
          local: 'zh',
          createTime: 1692263545,
          updateTime: 1698307021,
        },
        {
          cid: 10,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/weishi_jiajie.png',
          title: '供应商6',
          description: null,
          target: '/pages/shop/shop?storeId=23',
          content: null,
          images: null,
          sort: 6,
          local: 'zh',
          createTime: 1692263564,
          updateTime: 1698307063,
        },
        {
          cid: 5,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/zejiangnengyuan.png',
          title: '大宗跨境电商',
          description: '',
          target: '/pages/shop/shop?storeId=17',
          content: null,
          images: null,
          sort: 1,
          local: 'zh',
          createTime: 1692263197,
          updateTime: 1698306799,
        },
        {
          cid: 6,
          authorId: 1,
          type: 'supplier',
          category: '0',
          icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/tianyintongxin.jpeg',
          title: '供应商2',
          description: null,
          target: '/pages/shop/shop?storeId=15',
          content: null,
          images: null,
          sort: 2,
          local: 'zh',
          createTime: 1692263513,
          updateTime: 1698306905,
        },
        // {
        //   cid: 7,
        //   authorId: 1,
        //   type: 'supplier',
        //   category: '0',
        //   icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/xinchengkonggu.png',
        //   title: '供应商3',
        //   description: null,
        //   target: '/pages/shop/shop?storeId=17',
        //   content: null,
        //   images: null,
        //   sort: 3,
        //   local: 'zh',
        //   createTime: 1692263527,
        //   updateTime: 1698306914,
        // },
        // {
        //   cid: 8,
        //   authorId: 1,
        //   type: 'supplier',
        //   category: '0',
        //   icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/hainanhangkong.png',
        //   title: '供应商4',
        //   description: null,
        //   target: '/pages/shop/shop?storeId=30',
        //   content: null,
        //   images: null,
        //   sort: 4,
        //   local: 'zh',
        //   createTime: 1692263538,
        //   updateTime: 1698304121,
        // },
        // {
        //   cid: 9,
        //   authorId: 1,
        //   type: 'supplier',
        //   category: '0',
        //   icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/yiyatong.svg',
        //   title: '供应商5',
        //   description: '',
        //   target: '/pages/shop/shop?storeId=15',
        //   content: null,
        //   images: null,
        //   sort: 5,
        //   local: 'zh',
        //   createTime: 1692263545,
        //   updateTime: 1698307021,
        // },
        // {
        //   cid: 10,
        //   authorId: 1,
        //   type: 'supplier',
        //   category: '0',
        //   icon: 'http://jwecshop.oss-cn-shenzhen.aliyuncs.com/resource/datangguoji.jpg',
        //   title: '供应商6',
        //   description: null,
        //   target: '/pages/shop/shop?storeId=23',
        //   content: null,
        //   images: null,
        //   sort: 6,
        //   local: 'zh',
        //   createTime: 1692263564,
        //   updateTime: 1698307063,
        // },
      ],
      // 常用工具
      // 常用工具
      toolsList: [
        {
          cid: 11,
          authorId: 1,
          type: 'tools',
          category: null,
          icon: 'huilv.png',
          title: this.$t('Customs declaration'),
          backgroundColor: `linear-gradient(to bottom, rgba(192, 232, 255, 1), rgba(192, 232, 255, 0.3))`,
          description: 'Online exchange rate conversion',
          target: 'https://www.singlewindow.cn/#/',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692263622,
          updateTime: 1698222479,
        },
        {
          cid: 14,
          authorId: 1,
          type: 'tools',
          category: '0',
          icon: 'qianggou.png',
          title: this.$t('Storage information management'),
          backgroundColor: `linear-gradient(to bottom, rgba(192, 232, 255, 1), rgba(192, 232, 255, 0.3))`,
          description: 'Shopping Spree',
          target: 'http://www.jiwangyun.com/products/wms',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692263687,
          updateTime: 1698743355,
        },
        {
          cid: 14,
          authorId: 1,
          type: 'tools',
          category: '0',
          icon: 'zhifu.png',
          title: this.$t('Clearing channel'),
          backgroundColor: `linear-gradient(to bottom, rgba(192, 232, 255, 1), rgba(192, 232, 255, 0.3))`,
          description: 'oss-border payment channel',
          target: 'https://www.pingpongx.com/zh',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692263687,
          updateTime: 1698743355,
        },

        {
          cid: 14,
          authorId: 1,
          type: 'tools',
          category: '0',
          icon: 'jifen.png',
          title: this.$t('Integral credit'),
          backgroundColor: `linear-gradient(to bottom, rgba(192, 232, 255, 1), rgba(192, 232, 255, 0.3))`,
          description: 'Credit exchange',
          target: '/pages/tabbar/pointMall',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692263687,
          updateTime: 1698743355,
        },
        {
          cid: 12,
          authorId: 1,
          type: 'tools',
          category: null,
          icon: 'zhoubao.png',
          title: this.$t('Financial service'),
          backgroundColor: '#ecd5d3',
          description: 'Financial service',
          target: 'http://www.fundparkcn.com/',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692263651,
          updateTime: 1692263651,
        },
        {
          cid: 13,
          authorId: 1,
          type: 'tools',
          category: null,
          icon: 'wuliu.png',
          title: this.$t('Logistics monitoring'),
          backgroundColor: '#fde1ae',
          description: 'Logistics Monitor',
          target: '/pages/logisticsTrack/index',
          content: null,
          images: null,
          sort: 0,
          local: 'zh',
          createTime: 1692263668,
          updateTime: 1698222103,
        },
      ],
      // 热卖推荐
      recommendList: [],

      // 话题
      topicList: [],
      logoUrl: `${host}/public/logoHome.png`,
      order: `${host}/public/tabbar/home/order.png`,
      buyer: `${host}/public/tabbar/home/buyer.png`,
      seller: `${host}/public/tabbar/home/seller.png`,
      alliance_icon: `${host}/public/tabbar/home/alliance-icon.png`,
      hot: `${host}/public/tabbar/home/hot.png`,
      appLanguage: '',
      pageNum: 1,
      pageSize: 10,
      total: 0,
      isShowDefaultPage: true,
      btnCustomStyle: {
        width: '100%',
        height: '54rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #fceddc 0%,  #f7ae64 100%)',
        color: '#FFF',
        marginTop: '10rpx',
        fontWeight: 'Bold',
        borderRadius: '24rpx',
      },

      promoList: [
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/13_1731233817867.png`,
          title: '海外仓储',
          desc: '覆盖全球的仓储网络',
          url: '/pages/warehouse/index',
          bgColor: `linear-gradient(to bottom,rgba(141, 177, 241, 0.9),rgba(141, 177, 241, 0.2))`,
        },
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/14_1731233825265.png`,
          title: '金融支持',
          desc: '灵活的跨境支付方案',
          url: '/pages/finance/index',
          bgColor: `linear-gradient(to bottom,rgba(168, 214, 255, 0.9),rgba(168, 214, 255, 0.2))`,
        },
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/15_1731233834512.png`, // 替换为实际的图片地址
          title: '全球物流服务',
          desc: '专业的跨境物流解决方案',
          url: '/pages/logistics/index',
          bgColor: `linear-gradient(to bottom,rgba(135, 177, 249, 0.9),rgba(135,177, 249, 0.2))`,
        },
      ],

      currentSwiperIndex: 0,
      currentPartnerIndex: 0,
      partnerList: [
        {
          id: 1,
          title: this.$t('Comprehensive protection area'),
          type: '',
          logo: require('@/static/zongbao.svg'), // 使用static文件夹中的svg
          color: '#FFB5B5',
          features: [{ text: '保税仓储' }, { text: '通关服务' }],
          target: '/pages/differentSku/index',
        },
        {
          id: 2,
          title: this.$t('Maitsch'),
          type: '',
          logo: require('@/static/maiqi.svg'), // 使用static文件夹中的svg
          color: '#95E1D3',
          features: [{ text: '平台运营' }, { text: '全球营销' }],
          target: '/pages/differentSku/index',
        },
        {
          id: 3,
          title: this.$t('Yunchuan'),
          type: '',
          logo: require('@/static/yunchuan.svg'), // 使用static文件夹中的svg
          color: '#FCE38A',
          features: [{ text: '采购管理' }, { text: '物流配送' }],
          target: '/pages/differentSku/index',
        },
        {
          id: 4,
          title: this.$t('barter'),
          type: '',
          logo: require('@/static/yihuo.svg'), // 使用static文件夹中的svg
          color: '#F38181',
          features: [{ text: '跨境支付' }, { text: '资金安全' }],
          target: '/pages/differentSku/index',
        },
      ],
      serviceList: [
        {
          title: this.$t('Logistics service'),
          icon: 'car',
          size: '44px',
          margin: '6',
          marginName: '54',
          logo: require('@/static/tms.svg'),
          color: '#4B79E4',
          url: '/pages/service/tms',
        },
        {
          title: this.$t('Overseas position'),
          icon: 'bell',
          size: '54px',
          margin: '1',
          marginName: '54',
          logo: require('@/static/wms.svg'),
          color: '#FF9A9E',
          url: '/pages/service/wms',
        },
        {
          title: this.$t('Financial service'),
          icon: 'checkbox-mark',
          color: '#FCE38A',
          size: '40px',
          marginName: '54',
          margin: '8',
          logo: require('@/static/fms.svg'),
          url: '/pages/service/fms',
        },
        {
          title: this.$t('Digital transformation'),
          icon: 'file-text',
          color: '#95E1D3',
          size: '46px',
          margin: '5',
          marginName: '54',
          logo: require('@/static/dtc.svg'),
          url: '/pages/service/dtc',
        },
      ],
      currentGradient: `linear-gradient(to bottom,rgba(135, 177, 249, 0.9),rgba(135,177, 249, 0.2))`,
      imageColors: [], // 存储每张图片的主色调
      scrollTop: 0,
      navBarBgColor: 'transparent',
      // 定义导航栏渐变的起始和结束位置
      navBarTransitionPoint: {
        start: 0,
        end: 200, // 可以根据需要调整这个值
      },
    };
  },
  components: {
    Tools,
  },
  onShow() {
    // this.getBanner();
    // this.getBoutique();
    // this.getSupplier();
    // this.getTools();

    this.getRecommend();

    // this.getPartner();

    this.pageNum = 1;
    this.appLanguage = validate.getAppLanguage();
  },
  mounted() {
    this.initHorizontalScroll();
  },
  methods: {
    initHorizontalScroll() {
      const scrollView = document.querySelector('.tool-concent');
      let isDown = false;
      let startX;
      let scrollLeft;

      scrollView.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollView.style.cursor = 'grabbing';
        startX = e.pageX - scrollView.offsetLeft;
        scrollLeft = scrollView.scrollLeft;
        console.log('按下', scrollLeft);
      });

      scrollView.addEventListener('mouseleave', () => {
        isDown = false;
        scrollView.style.cursor = 'grab';
      });

      scrollView.addEventListener('mouseup', () => {
        isDown = false;
        scrollView.style.cursor = 'grab';
      });

      scrollView.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollView.offsetLeft;
        const walk = (x - startX) * 2; //滚动速度
        scrollView.scrollLeft = scrollLeft - walk;
      });

      // 添加鼠标滚轮横向滚动
      scrollView.addEventListener('wheel', (e) => {
        e.preventDefault();
        scrollView.scrollLeft += e.deltaY;
      });
    },
    swiperRouter(index) {
      let target = this.swiperList[index].target;
      let title = this.swiperList[index].title;
      // console.log(target, title);
      this.navigateTo(target, title);
    },
    routerDetails(target, title) {
      if (title === '积分商城') {
        uni.switchTab({ url: target });
      } else if (title === '结算通道' || title === '金融服务' || title === '海关申报' || title === '库容信息管理') {
        window.location.href = target;
      } else {
        this.navigateTo(target, title);
      }
    },

    routerGoodsDetails(id) {
      uni.$u.route({
        url: '/pages/details/details',
        params: {
          spuId: id,
          from: 'find',
        },
      });
    },
    handleService() {
      uni.$u.route('/pages/service/index');
    },
    routerFind() {
      uni.switchTab({
        url: '/pages/tabbar/find',
      });
    },
    routerOrder() {
      // uni.$u.toast('订单正在赶来的路上')
      uni.$u.route('pages/order/order');
    },
    // 合作方，精品馆
    routerBoutique(target, title) {
      this.navigateTo(target, title);
      // uni.$u.route('pages/boutique/boutique')
    },
    routerFactory() {
      uni.$u.route('/pages/Admission/index');
    },
    routerBuyer() {
      uni.$u.route('/pages/inquiry/inquiry');
    },
    routerFind() {
      uni.$u.route('/pages/tabbar/find');
    },
    getNavRight() {
      uni.$u.route('/pages/search/search');
    },
    ApplyForAdmission() {
      uni.$u.route('/pages/Admission/index');
    },

    // 首页数据
    getBanner() {
      let that = this;
      let type = 'banner_index'; // 轮播图
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.swiperList = res.data;
          // console.log('that.swiperList', that.swiperList)
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    routeDetail(item) {
      setTimeout(() => {
        uni.$u.route({
          url: item.target,
          params: {
            tag: item.title,
          },
        });
      }, 300);
    },
    routeCoutryList(item) {
      uni.$u.route({
        url: item.target,
        params: {
          warehouse_id: item.warehouse_id,
        },
      });
    },
    getBoutique() {
      let that = this;
      let type = 'boutique'; // 精品馆
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.boutiqueList = res.data;
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    getPartner() {
      let that = this;
      let type = 'partner'; // 合作方
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.partnerList = res.data;
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    getSupplier() {
      let that = this;
      let type = 'supplier'; // 供应商
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.supplierList = res.data;
          // console.log('that.supplierList', that.supplierList)
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    getTools() {
      let that = this;
      let type = 'tools'; // 工具
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.toolsList = res.data;
          console.log('that.toolsList', that.toolsList);
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
    getRecommend() {
      let that = this;
      let goodsId = '';
      let params = {
        page: 1,
        page_size: 10,
      };
      that.sortList = [];
      IndexServer.getClientGoods(goodsId, params, {
        success(res) {
          let sortList = res.data.result;

          if (sortList == null || sortList.length <= 0) {
            that.sortList = [];
            that.page = 1;
            that.isShowDefaultPage = true;
            uni.stopPullDownRefresh();
            return;
          }
          that.recommendList = [];
          that.sortList = that.sortList.concat(sortList);
          that.sortList.forEach((item) => {
            item.skus.forEach((element) => {
              if (element.is_default) {
                element.name = item.name;
                element.image = item.images[0];
                that.recommendList.push(element);
              }
            });
          });
          console.log('recommendList', that.recommendList);
          that.total = res.data.total;

          uni.stopPullDownRefresh();
        },
        fail(err) {
          console.log(err);
          uni.stopPullDownRefresh();
        },
      });
    },

    // onReachBottom() {
    //   if (this.recommendList.length >= this.total) {
    //     return;
    //   }
    //   this.pageNum = this.recommendList.length < this.total ? this.pageNum + 1 : this.pageNum;
    //   // this.getRecommend();
    // },
    getLighterColor(hexColor) {
      // 将颜色变亮的辅助函数
      const color = hexColor.replace('#', '');
      const r = parseInt(color.substr(0, 2), 16);
      const g = parseInt(color.substr(2, 2), 16);
      const b = parseInt(color.substr(4, 2), 16);

      const lightenAmount = 40;

      const newR = Math.min(r + lightenAmount, 255);
      const newG = Math.min(g + lightenAmount, 255);
      const newB = Math.min(b + lightenAmount, 255);

      return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB
        .toString(16)
        .padStart(2, '0')}`;
    },
    getPartnerColor(index) {
      const colors = [
        '#4B79E4', // 蓝色
        '#FF9A9E', // 粉色
        '#A8EDEA', // 青色
        '#D4FC79', // 色
        '#FFB199', // 橙色
        '#A1C4FD', // 淡蓝
        '#96FBC4', // 薄荷
        '#F9D976', // 黄色
      ];
      return colors[index % colors.length];
    },
    // 处理轮播图点击
    handleBannerClick(item) {
      if (item.url) {
        uni.navigateTo({
          url: item.url,
        });
      }
    },
    handlePromoClick(item) {
      if (item.url) {
        uni.navigateTo({
          url: item.url,
        });
      }
    },
    handleQuickLink(item) {
      if (item.url) {
        uni.navigateTo({
          url: item.url,
        });
      }
    },
    handleSwiperChange(e) {
      this.currentSwiperIndex = e.detail.current;
      console.log('切换', this.currentSwiperIndex, this.imageColors);
      this.currentGradient = this.promoList[this.currentSwiperIndex].bgColor;
    },
    handlePartnerSwiperChange(e) {
      this.currentPartnerIndex = e.detail.current;
    },
    handleServiceClick(item) {
      uni.navigateTo({
        url: item.url,
      });
    },
    // 图片加载完成时提取颜色
    onImageLoad(e, index) {
      const img = e.target;

      this.extractImageColor(img.src, index);
    },
    // 提取图片主色调
    extractImageColor(imageUrl, index) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = () => {
        console.log('提取', this.imageColors);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        // 只获取图片顶部区域的颜色
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height / 3).data;

        let r = 0,
          g = 0,
          b = 0;
        let count = 0;

        // 增加采样间隔以提高性能
        for (let i = 0; i < imageData.length; i += 20) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // 存储颜色
        this.imageColors[index] = { r, g, b };

        // 如果是当前显示的图片，立即更新渐变
        if (index === this.currentSwiperIndex) {
          this.updateGradient({ r, g, b });
        }
      };

      img.src = imageUrl;
    },
    // 更新渐变背景
    updateGradient(color) {
      const { r, g, b } = color;
      // 修改渐变的透明度和范围
      this.currentGradient = `linear-gradient(to bottom,
        rgba(${r}, ${g}, ${b}, 0.9),
        rgba(${r}, ${g}, ${b}, 0.2)
      )`;
      console.log('颜色', this.currentGradient);
    },
    // 更新导航栏背景色
    updateNavBarBgColor() {
      const { start, end } = this.navBarTransitionPoint;
      const scrollTop = this.scrollTop;

      if (scrollTop <= start) {
        // 顶部时完全透明
        this.navBarBgColor = 'transparent';
      } else if (scrollTop >= end) {
        // 滚动到指定位置时显示完整背景色
        this.navBarBgColor = 'rgba(24, 154, 185, 1)';
      } else {
        // 滚动过程中渐变
        const alpha = (scrollTop - start) / (end - start);
        this.navBarBgColor = `rgba(24, 154, 185, ${alpha})`;
      }
    },
  },
  computed: {},
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    this.updateNavBarBgColor();
  },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  z-index: 1;

  // 导航栏样式优化
  :deep(.u-navbar) {
    background: transparent !important;

    &__content {
      background: transparent !important;
      backdrop-filter: blur(0px) !important;

      &::after {
        display: none; // 移除底部边框
      }
    }
  }

  // 导航栏内容样式优化
  .u-nav-slot {
    display: flex;
    align-items: center;

    view {
      color: #fff;
      font-weight: 600;
      text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2); // 添加文字阴影提高可读性
    }
  }

  // 搜索框样式优化
  .u-nav-slot-right {
    :deep(.u--input) {
      background: rgba(255, 255, 255, 0.2) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);

      .u-input__content__field {
        color: #fff !important;

        &::placeholder {
          color: rgba(255, 255, 255, 0.8) !important;
        }
      }

      .u-input__content__prefix-icon {
        color: rgba(255, 255, 255, 0.8) !important;
      }
    }
  }

  // 背景区域样式优化
  .bg {
    width: 100%;
    height: 605rpx;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;
    padding: 40px 10px 60px 10px;
    clip-path: ellipse(100% 100% at 50% 0%);
    box-shadow: 0 0 20px rgba(46, 130, 168, 0.5);
    transition: background 0.8s ease; // 添加过渡效果

    .bg-swiper {
      width: 100%;
      height: 80%;
      border-radius: 10px;
      border-radius: 10px;
      .bg-image {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        object-fit: cover;
      }
    }

    // 添加顶部渐变遮罩,提高导航栏内容可读性
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 200rpx;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
      pointer-events: none;
    }

    // 添加指示点样式
    .swiper-dots {
      position: absolute;
      right: 40rpx;
      top: 330rpx;
      display: flex;
      gap: 12rpx;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      z-index: 10;

      .dot {
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transition: all 0.3s ease;

        &.active {
          width: 24rpx;
          border-radius: 6rpx;
          background: #fff;
        }
      }
    }
  }
}

.swiper {
  width: 100%;
  margin-top: 24rpx;
}

.home {
  width: 100%;
  margin-top: 480rpx;
  padding: 10px;
  border-radius: 12px;
  background-color: #fff;
  .grid {
    height: 160rpx;
    display: flex;
    border-radius: 12rpx 12rpx 0 0;
    background-color: #fff;

    .grid-l {
      width: 50%;
      height: 100%;
      display: flex;
      padding: 24rpx 20rpx;
      flex-direction: row;
      align-items: center;
      border-radius: 24rpx;
      background-color: #fff;

      .grid-l-t-text {
        display: flex;
        flex-direction: column;
        margin-left: 24rpx;
        flex: 1;
        .tit {
          color: #000;
          font-size: 32rpx;
          margin-bottom: 12rpx;
          line-height: 36rpx;
          font-weight: bold;
        }
      }

      .text1 {
        color: #468df5;
        font-size: 36rpx;
        margin: 16rpx 0;
        line-height: 28rpx;
        font-weight: bold;
      }

      .text2 {
        color: #999;
        font-size: 20rpx;
      }
    }

    .grid-r {
      flex: 1;
      position: relative;
      border-radius: 24rpx;

      overflow: hidden;
      transition: all 0.3s ease;

      .grid-icons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);

        height: 100%;

        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rpx;
          transition: all 0.3s ease;

          &:active {
            transform: scale(0.95);
          }

          .icon-wrapper {
            width: 96rpx;
            height: 96rpx;
            background: rgba(75, 121, 228, 0.1);
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;

            .icon {
              width: 76rpx;
              height: 76rpx;
            }
          }

          .icon-text {
            font-size: 20rpx;
            color: #333;
            font-weight: 500;
          }

          // 为每个图标设置不同的背景色
          &:nth-child(1) .icon-wrapper {
            background: rgba(82, 196, 26, 0.1);
          }

          &:nth-child(2) .icon-wrapper {
            background: rgba(250, 173, 20, 0.1);
          }

          &:nth-child(3) .icon-wrapper {
            background: rgba(75, 121, 228, 0.1);
          }

          &:nth-child(4) .icon-wrapper {
            background: rgba(255, 77, 79, 0.1);
          }

          &:hover {
            .icon-wrapper {
              transform: translateY(-4rpx);
            }
          }
        }
      }
    }
  }
}

.boutique {
  width: 100%;
  background-color: #fff;
  position: relative;

  &_tit {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 24rpx;
    color: #fff !important;
    font-size: 36rpx;
    margin-left: 12rpx;
  }
}

.nation {
  width: 100%;
  background-color: #fff;
  // display: flex;
  // flex-wrap: wrap;
  padding: 0 26rpx;
  margin-top: 24rpx;

  &_title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 16rpx;

    img {
      width: 40rpx;
      height: 40rpx;
      margin-right: 12rpx;
    }
  }

  &_list {
    justify-content: space-between;
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, 100rpx);
    grid-gap: 10px;
  }
}
.nation_viewes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center !important;
  flex: 0 0 25%; /* 每行显示4个，占据父元素宽度的四分之一 */
  box-sizing: border-box;
  margin: 10rpx 0rpx;
}
.nation-concent {
  width: 90%;
  display: flex;
  top: 420rpx;
  border-radius: 10rpx;
  position: absolute;
  padding: 20rpx 0rpx 10rpx 0rpx;
  flex-wrap: wrap;
}
.grid-text {
  color: #999;
  font-size: 20rpx;
  text-align: center;
  height: 44rpx;
  line-height: 44rpx;
}
.alliance {
  // background-color: #edebec;
  width: 100%;
  display: flex;
  flex-direction: column;

  padding: 0px 30rpx;
  border-radius: 12rpx;
  @at-root &-tit {
    display: flex;
    justify-content: space-between;
    align-items: center;

    // margin-bottom: 24rpx;
    background-color: #fff;
    &-l {
      display: flex;
      align-items: center;
      color: #333;

      img {
        width: 40rpx;
        height: 40rpx;
        margin-right: 12rpx;
      }

      text {
        font-size: 36rpx;
        font-weight: bold;
      }
    }

    &-r {
      display: flex;
      align-items: center;
      height: 32rpx;

      text {
        color: #999;
        font-size: 24rpx;
        line-height: 32rpx;
      }
    }
  }

  &-concent {
    width: 100%;
    min-height: 144rpx;
    padding: 10rpx 10rpx;
    background-color: #fff;
    border-radius: 10rpx;
  }

  .m0 {
    margin: 0;
  }

  .b0 {
    border: 0;
  }

  .tool-concent {
    border-radius: 10rpx;
    overflow-x: scroll;
    &-l {
      width: 96%;
      height: 148rpx;
      display: flex;
      align-items: center;

      border-radius: 16rpx;

      // justify-content: center;
      position: relative;
      overflow: auto;
      transition: all 0.3s ease;

      // 悬浮效果
      &:active {
        transform: scale(0.98);

        .icon-wrapper {
          transform: translateY(-4rpx);
        }
      }

      // 为每个工具设置不同的渐变背景

      // 图标容器样式
      .icon-wrapper {
        width: 65rpx;
        height: 65rpx;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 32rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        animation: iconFloat 3s ease-in-out infinite;
      }

      &-r {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding-left: 10rpx;
        text-align: left;
        text:first-child {
          color: #fff;
          font-size: 30rpx;
          margin-bottom: 8rpx;
          font-weight: bold;
          text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
        }

        text:last-child {
          color: rgba(134, 174, 202, 0.9);
          font-size: 20rpx;
        }
      }
    }
  }

  .waterfall {
    @include flex();
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0px 30rpx;
    background-color: #fff;
    .waterfall-item {
      border-radius: 6px;
      width: 48%;
      background-color: #fff;
      margin-top: 10px;

      .waterfall-item__image {
        position: relative;

        .hot {
          width: 48rpx;
          height: 48rpx;
          position: absolute;
          top: 10rpx;
          right: 12rpx;
        }
      }
    }

    .waterfall-item__ft {
      padding: 0 0 24rpx 0;
      background: #fff;

      &__title {
        margin: 4rpx 0;

        .value {
          font-size: 28rpx;
          color: #333;
        }
      }

      &__desc .value {
        font-size: 16rpx;
        color: #ebdddd;
        background: #ffa6a6;
        text-align: center;
      }

      &__price {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .val {
          color: #ff5f00;
          font-size: 28rpx;
          margin-top: 2px;
        }

        .num {
          color: #999;
          font-size: 20rpx;
        }
      }

      &__btn {
        padding: 10px 0;
      }
    }

    .waterfall-item-price {
      width: 100%;
    }

    .waterfall-item-price-discuss {
      display: flex;
      justify-content: space-between;
      width: 100%;
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

    .val-wholesale {
      display: flex;
      justify-content: space-between;
      color: #ee4b36;
      font-size: 24rpx;
    }
  }
}
.order {
  display: flex;
  flex-direction: row;
  background-color: #d3edfc;
  margin-top: 24rpx;
  border-radius: 10rpx;
  padding: 20rpx 40rpx;
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    .text1 {
      color: #423b36;
      font-size: 46rpx;
      margin: 16rpx 0;
      line-height: 28rpx;
      font-weight: bold;
    }

    .text2 {
      color: #544532;
      font-size: 34rpx;
      margin: 16rpx 0;
      font-weight: 400;
    }
  }
}
.u-border-bottom {
  border-bottom-width: 0rpx !important;
}
.u-border-right {
  border-right-width: 0rpx !important;
}

.tools-section {
  margin: 20rpx;

  .tools-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
    padding: 16rpx;
  }

  .tool-card {
    position: relative;
    padding: 24rpx;
    border-radius: 24rpx;
    overflow: hidden;
    transition: all 0.3s ease;
    min-height: 140rpx;

    // 为每个卡片设置不同的渐变背景色
    &:nth-child(1) {
      background: linear-gradient(135deg, #a6dcf7 0%, #7bc6e7 100%);
      box-shadow: 0 4rpx 12rpx rgba(166, 220, 247, 0.2);
    }
    &:nth-child(2) {
      background: linear-gradient(135deg, #ffb5b5 0%, #ffd0d0 100%);
      box-shadow: 0 4rpx 12rpx rgba(255, 181, 181, 0.2);
    }
    &:nth-child(3) {
      background: linear-gradient(135deg, #b5e6d1 0%, #d0f0e3 100%);
      box-shadow: 0 4rpx 12rpx rgba(181, 230, 209, 0.2);
    }
    &:nth-child(4) {
      background: linear-gradient(135deg, #ffd6a5 0%, #ffe5c4 100%);
      box-shadow: 0 4rpx 12rpx rgba(255, 214, 165, 0.2);
    }

    // 添加光效渐变
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shine 3s infinite;
    }

    // 悬浮效果
    &:active {
      transform: scale(0.98);

      .floating-icon {
        transform: translateY(-8rpx) rotate(10deg);
      }

      .decoration-circle {
        transform: scale(1.1);
      }
    }

    // 内容区域
    .tool-content {
      position: relative;
      z-index: 2;

      .tool-title {
        font-size: 28rpx;
        font-weight: 600;
        color: #fff;
        margin-bottom: 8rpx;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
      }

      .tool-desc {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    // 图标
    .floating-icon {
      position: absolute;
      right: 20rpx;
      top: 50%;
      transform: translateY(-50%);
      width: 60rpx;
      height: 60rpx;
      background: rgba(111, 163, 187, 0.9);
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      animation: iconFloat 3s ease-in-out infinite;

      .icon {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
}

// 添加动
@keyframes shine {
  0% {
    left: -100%;
    opacity: 0.6;
  }
  20% {
    left: 100%;
    opacity: 0.6;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes iconFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6rpx);
  }
}

.partner-section {
  padding: 0 30rpx;

  .partner-grid {
    display: flex;
    justify-content: space-between; // 改为flex布局，在一行平均分布
  }

  .partner-card {
    position: relative;
    padding: 16rpx;
    border-radius: 20rpx;
    // background: #f9f5f5;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 160rpx; // 设置固定宽度
    height: 160rpx;
    // 简化hover效果
    &:active {
      transform: scale(0.95);
    }

    // 移除多余的装饰元素
    .card-decoration {
      display: none;
    }
  }

  .partner-icon {
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    // 调整图标大小
    :deep(.u-image) {
      width: 40rpx !important;
      height: 40rpx !important;
    }
  }

  .partner-name {
    font-size: 24rpx;
    color: #333;
    text-align: center;
    flex: 1;
    display: flex;
    align-items: center;
  }

  // 移除多余的内容
  .partner-content,
  .partner-features {
    display: none;
  }
}

// 添加动画
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

.grid {
  display: flex;
  gap: 10rpx;
  margin-bottom: 10px;

  .grid-l {
    flex: 1;
    position: relative;
    border-radius: 24rpx;
    background: linear-gradient(135deg, rgba(192, 232, 255, 0.2) 20%, rgba(192, 232, 255, 0.5) 100%);
    overflow: hidden;
    transition: all 0.3s ease;
    margin-top: 20rpx;
    &:active {
      transform: scale(0.98);
    }

    // 装饰性背景
    &::before {
      content: '';
      position: absolute;
      right: -60rpx;
      top: -60rpx;
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(155, 179, 235, 0.1) 0%, rgba(46, 91, 179, 0.05) 100%);
      animation: rotate 10s linear infinite;
    }

    // 装饰性圆点
    &::after {
      content: '';
      position: absolute;
      left: 30rpx;
      bottom: 30rpx;
      width: 120rpx;
      height: 60rpx;
      background: radial-gradient(circle at center, rgba(0, 0, 0, 0.03) 0%, transparent 70%);
    }

    .grid-l-t-text,
    .grid-r-t-text {
      position: relative;
      z-index: 2;

      .tit {
        font-size: 36rpx;
        font-weight: 600;
        background: linear-gradient(135deg, #333 0%, #666 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8rpx;
        display: block;
      }

      text:nth-child(2) {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 24rpx;
        display: block;
      }
    }

    // 图标样式
    .u-image {
      position: absolute;
      right: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      transition: all 0.3s ease;

      &::after {
        content: '';
        position: absolute;
        inset: -10rpx;
        border-radius: 16rpx;
        background: rgba(255, 255, 255, 0.8);
        z-index: -1;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
      }
    }
    .buyer-btn {
      width: 80px;
      height: 30px;
      background: linear-gradient(135deg, #a7bdf0 0%, #2e5bb3 100%) !important;
      box-shadow: 0 8rpx 16rpx rgba(46, 91, 179, 0.2);
      overflow: hidden;
      margin-left: 0;
      margin-top: 10px;
      &::before {
        content: '';
        position: absolute;
        top: 0px;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
        transform: skewX(-25deg);
        animation: shine 3s infinite;
      }
    }

    // 按钮样式
    :deep(.u-button) {
      position: relative;
      z-index: 2;
      width: 180rpx !important;
      height: 72rpx !important;

      &--primary {
        // 买家按钮样式

        // 卖家按钮样式
        &.seller-btn {
          background: linear-gradient(135deg, #ff9b64 0%, #f7ae64 100%) !important;
          box-shadow: 0 8rpx 16rpx rgba(247, 174, 100, 0.2);
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
            transform: skewX(-25deg);
            animation: shine 3s infinite;
          }
        }

        // 通用按钮样式
        border: none !important;
        border-radius: 36rpx !important;

        &::after {
          display: none;
        }

        // 按钮文字样式
        .u-button__text {
          font-size: 28rpx !important;
          font-weight: 600;
          letter-spacing: 2rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8rpx;

          &::after {
            content: '→';
            font-family: 'iconfont';
            font-size: 24rpx;
            transition: transform 0.3s ease;
          }
        }

        // 悬浮效果
        &:active {
          transform: translateY(2rpx);
          box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);

          .u-button__text::after {
            transform: translateX(4rpx);
          }
        }
      }
    }

    // 悬浮效果
    &:hover {
      .u-image {
        transform: translateY(-50%) scale(1.05);
      }
    }
  }

  // 买家入口特殊样式
  .grid-l {
    border-left: 6rpx solid #ecedf1;

    &::before {
      background: linear-gradient(135deg, rgba(75, 121, 228, 0.1) 0%, rgba(46, 91, 179, 0.05) 100%);
    }
  }

  // 卖家入口特殊样式
  .grid-r {
    // border-left: 6rpx solid #f7ae64;

    &::before {
      background: linear-gradient(135deg, rgba(247, 174, 100, 0.1) 0%, rgba(255, 155, 100, 0.05) 100%);
    }

    :deep(.u-button--primary) {
      background: linear-gradient(135deg, #ff9b64 0%, #f7ae64 100%) !important;
      box-shadow: 0 4rpx 12rpx rgba(247, 174, 100, 0.2);
    }
  }
}

// 动画
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 修改按钮默认样式
:deep(.u-button) {
  &__text {
    font-size: 26rpx !important;
  }
}

// 闪光画
@keyframes shine {
  0% {
    left: -100%;
    opacity: 0.8;
  }
  20% {
    left: 100%;
    opacity: 0.8;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

.swiper-section {
  margin: 24rpx 0;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .banner-swiper {
    width: 100%;
    height: 300rpx; // 可以根据需要调整高度

    .banner-image {
      width: 100%;
      height: 100%;
      border-radius: 24rpx;
      transition: all 0.3s ease;
    }

    .banner-content {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 20rpx 30rpx;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
      border-radius: 0 0 24rpx 24rpx;

      .banner-title {
        font-size: 32rpx;
        color: #fff;
        font-weight: bold;
        margin-bottom: 8rpx;
        display: block;
      }

      .banner-desc {
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.8);
        display: block;
      }
    }
  }

  :deep(.uni-swiper-dot) {
    width: 8rpx;
    height: 8rpx;
    border-radius: 4rpx;
    margin: 0 6rpx;
    transition: all 0.3s ease;

    &.uni-swiper-dot-active {
      width: 24rpx;
      border-radius: 4rpx;
    }
  }
}

.promo-swiper {
  margin: 24rpx 0;
  border-radius: 14rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);

  .swiper-box {
    width: 100%;
    height: 240rpx; // 可以根据需要调整高度
  }

  .swiper-item {
    position: relative;
    width: 100%;
    height: 100%;

    .promo-image {
      width: 100%;
      height: 100%;
      border-radius: 24rpx;
      transition: transform 0.3s ease;
    }

    .promo-content {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 20rpx 30rpx;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
      border-radius: 0 0 24rpx 24rpx;

      .promo-title {
        font-size: 28rpx;
        color: #fff;
        font-weight: 600;
        margin-bottom: 4rpx;
        display: block;
      }

      .promo-desc {
        font-size: 22rpx;
        color: rgba(255, 255, 255, 0.8);
        display: block;
      }
    }
  }

  :deep(.uni-swiper-dot) {
    width: 8rpx;
    height: 8rpx;
    border-radius: 4rpx;
    margin: 0 6rpx;
    transition: all 0.3s ease;

    &.uni-swiper-dot-active {
      width: 24rpx;
    }
  }
}

.tool-concent {
  width: 100%;

  box-sizing: border-box;
  margin: 20rpx 0;

  &::-webkit-scrollbar {
    display: none;
  }

  .tool-list {
    display: inline-flex;
    gap: 20rpx; // 增加间距
  }

  .tool-item {
    display: inline-block;
    width: 412rpx; // 增加宽度
    flex-shrink: 0;
  }

  .tool-concent-l {
    width: 100%;
    height: 168rpx;
    padding: 15rpx;
    border-radius: 24rpx;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column; // 改为纵向布局
    justify-content: space-between;

    // 文字内容区域
    .tool-concent-l-r {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      align-items: flex-start; // 左对齐

      text:first-child {
        font-size: 32rpx;
        font-weight: bold;
        color: #3e6b8d;
        margin-bottom: 12rpx;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
      }

      text:last-child {
        font-size: 24rpx;
        color: rgba(120, 156, 172, 0.9);

        border-radius: 20rpx;
      }
    }

    // 图片区域
    .u-image {
      position: absolute !important;
      right: -20rpx !important;
      bottom: -20rpx !important;
      width: 160rpx !important;
      height: 160rpx !important;
      opacity: 0.25;
      transform: rotate(-15deg);
      transition: all 0.3s ease;
      filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
    }

    // 添加装饰圆环
    &::after {
      content: '';
      position: absolute;
      right: 30rpx;
      top: 30rpx;
      width: 50rpx;
      height: 50rpx;
      border: 3rpx solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      opacity: 0.6;
    }

    // 悬浮效果
    &:hover {
      transform: translateY(-4rpx);

      .u-image {
        transform: rotate(0deg) scale(1.1);
        opacity: 0.3;
      }
    }
  }
}

// 添加动画
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
}

.partner-dots {
  position: absolute;
  bottom: 10rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 4rpx;
  padding: 4rpx;
  border-radius: 10rpx;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  z-index: 10;

  .dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;

    &.active {
      width: 24rpx;
      border-radius: 6rpx;
      background: #fff;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rpx 20rpx;
  position: relative;

  .header-main {
    flex: 1;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 6rpx;
    position: relative;

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      position: relative;
      z-index: 1;

      // 添加渐变色文字效果
      background: linear-gradient(135deg, #333 60%, #666);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .title-decoration {
      position: absolute;
      left: -8rpx;
      bottom: 4rpx;
      width: 60rpx;
      height: 12rpx;
      background: linear-gradient(135deg, rgba(59, 123, 212, 0.2), rgba(59, 123, 212, 0.1));
      border-radius: 6rpx;
      z-index: 0;
      animation: widthChange 3s ease-in-out infinite;
    }
  }

  .header-subtitle {
    font-size: 24rpx;
    color: #999;
    margin-left: 4rpx;
  }

  .header-more {
    display: flex;
    align-items: center;
    gap: 4rpx;
    padding: 8rpx 16rpx;
    border-radius: 24rpx;
    background: #f5f7fa;
    transition: all 0.3s ease;

    text {
      font-size: 24rpx;
      color: #666;
    }

    &:active {
      transform: scale(0.95);
      background: #eef0f6;
    }
  }

  // 添加装饰性元素
  &::after {
    content: '';
    position: absolute;
    right: 20rpx;
    top: 50%;
    width: 160rpx;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(59, 123, 212, 0.1));
  }
}

// 添加动画
@keyframes widthChange {
  0%,
  100% {
    width: 60rpx;
  }
  50% {
    width: 80rpx;
  }
}

.quick-services {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0rpx;
  background: #fff;
  border-radius: 12rpx;
  width: 100%;
  gap: 2%; // 使用百分比间距

  .service-item {
    flex: 1; // 让每个item平均分配空间
    aspect-ratio: 1; // 保持1:1的宽高比

    max-width: 80px; // 设置最小宽度
    max-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    // justify-content: center;

    transition: all 0.3s ease;
    border-radius: 10px;
    background: linear-gradient(to bottom, rgba(192, 232, 255, 1), rgba(192, 232, 255, 0.3));

    &:active {
      transform: scale(0.95);
    }

    // 图标容器

    // 文字
    .service-name {
      font-size: calc(11px + 0.1vw); // 响应式字体大小
      color: #333;
      margin-top: 4px;
      white-space: nowrap; // 防止文字换行
      text-align: center;
      width: 100%;
      position: absolute;
      // 文字过长时显示省略号
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

// 媒体查询，处理极小屏幕
@media screen and (max-width: 320px) {
  .quick-services {
    .service-item {
      min-width: 50px;

      .service-name {
        font-size: 10px;
      }
    }
  }
}
</style>
