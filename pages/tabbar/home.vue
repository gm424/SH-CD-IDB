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
        <!-- 修改合作伙伴标题部分 -->
        <view class="section-header">
          <view class="header-main">
            <view class="header-title">
              <text class="title-text">合作伙伴</text>
              <view class="title-decoration"></view>
            </view>
            <text class="header-subtitle">携手共创跨境新未来</text>
          </view>
          <view class="header-more">
            <text>更多</text>
            <u-icon name="arrow-right" size="24" color="#666"></u-icon>
          </view>
        </view>

        <view class="partner-grid">
          <view
            v-for="(item, index) in partnerList"
            :key="index"
            class="partner-card animate__animated animate__fadeInUp"
            :style="{ '--delay': index * 0.1 + 's', '--color': item.color }"
            @click="routeDetail(item)"
          >
            <view class="card-decoration">
              <view class="decoration-circle"></view>
              <view class="decoration-dots"></view>
            </view>

            <view class="partner-icon">
              <u-image width="40rpx" height="40rpx" :src="item.logo" mode="aspectFit" :fade="true" duration="450">
                <template v-slot:loading>
                  <u-loading-icon></u-loading-icon>
                </template>
              </u-image>
              <text class="partner-name">{{ item.title }}</text>
            </view>

            <view class="partner-content">
              <text class="partner-type">{{ item.type }}</text>
            </view>

            <view class="partner-features">
              <view class="feature-tag" v-for="(tag, tIndex) in item.features.slice(0, 2)" :key="tIndex">
                {{ tag.text }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 修改快捷服务部分 -->
      <view class="alliance">
        <!-- 修改常用工具标题部分 -->
        <view class="section-header">
          <view class="header-main">
            <view class="header-title">
              <text class="title-text">一站式服务</text>
              <view class="title-decoration"></view>
            </view>
            <text class="header-subtitle">便捷工具，助力发展</text>
          </view>
        </view>
        <view class="grid">
          <!-- 左侧买家入口保持不变 -->
          <view class="grid-l" @click="routerFactory">
            <view class="grid-l-t-text">
              <text class="tit">供应商入驻</text>
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
            <u-image width="40rpx" height="40rpx" :src="item.logo" mode="aspectFit" :fade="true" duration="450">
            </u-image>
            <text class="service-name">{{ item.title }}</text>
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
            <text class="header-subtitle">便捷工具，助力发展</text>
          </view>
        </view>

        <!-- 修改为横向滚动列表 -->
        <scroll-view scroll-x class="tool-concent" show-scrollbar="false" enhanced :scroll-with-animation="true">
          <view class="tool-list">
            <view
              v-for="(item, index) in toolsList"
              @click="routerDetails(item.target, item.title)"
              :key="index"
              class="tool-item"
            >
              <view class="tool-concent-l" :style="{ backgroundColor: item.backgroundColor }">
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
          <text class="header-subtitle">精选优质好物</text>
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
              width="334rpx"
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
              <view class="num"> 8000+人付款 </view>
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
      text1: '行业内资讯内容播放',
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
          title: '欧洲站',
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
          icon: 'https://flagcdn.com/w160/kr.png',
          title: '中东',
          description: 'Korean Sector',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 1,
          warehouse_id: '5',
          local: 'zh',
          createTime: 1692944972,
          updateTime: 1698287728,
        },

        {
          cid: 34,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'https://flagcdn.com/w160/us.png',
          title: '俄罗斯',
          warehouse_id: '7',
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
          icon: 'https://flagcdn.com/w160/es.png',
          title: '墨西哥',
          warehouse_id: '8',
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
      //合作方
      PartnerList: [
        {
          cid: 32,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'dazong.png',
          title: '综保区',
          description: 'Block Trade',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 2,
          local: 'zh',
          createTime: 1692944986,
          updateTime: 1698287735,
        },
        {
          cid: 33,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'aolai.png',
          title: '迈奇',
          description: 'Outlets',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 1,
          local: 'zh',
          createTime: 1692944972,
          updateTime: 1698287728,
        },

        {
          cid: 34,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'mingpin.png',
          title: '云川',
          description: 'Niche Products',
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
          icon: 'yihuo.png',

          title: '易货',
          description: 'Barter Trade',
          target: '/pages/differentSku/index',
          content: null,
          images: null,
          sort: 1,
          local: 'zh',
          createTime: 1692944972,
          updateTime: 1698287728,
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
          title: '海关申报',
          backgroundColor: '#eae7fe',
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
          title: '库容信息管理',
          backgroundColor: '#bafae5',
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
          title: '结算通道',
          backgroundColor: '#d6caee',
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
          title: '积分信用',
          backgroundColor: '#cdd2f8',
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
          title: '金融服务',
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
          title: '物流监测',
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
      bannerList: [
        {
          image: 'https://example.com/banner1.jpg', // 替换为实际的图片地址
          title: '全球贸易合作',
          desc: '开启跨境贸易新篇章',
          url: '/pages/trade/index',
        },
        {
          image: 'https://example.com/banner2.jpg',
          title: '金融解决方案',
          desc: '一站式金融服务支持',
          url: '/pages/finance/index',
        },
        {
          image: 'https://example.com/banner3.jpg',
          title: '物流送网络',
          desc: '覆盖球的物流体系',
          url: '/pages/logistics/index',
        },
      ],
      promoList: [
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/13_1731147929540.png`,
          title: '海外仓储',
          desc: '覆盖全球的仓储网络',
          url: '/pages/warehouse/index',
          bgColor: `linear-gradient(to bottom,rgba(141, 177, 241, 0.9),rgba(141, 177, 241, 0.2))`,
        },
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/12_1731147915265.png`,
          title: '金融支持',
          desc: '灵活的跨境支付方案',
          url: '/pages/finance/index',
          bgColor: `linear-gradient(to bottom,rgba(168, 214, 255, 0.9),rgba(168, 214, 255, 0.2))`,
        },
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/11_1731147901246.png`, // 替换为实际的图片地址
          title: '全球物流服务',
          desc: '专业的跨境物流解决方案',
          url: '/pages/logistics/index',
          bgColor: `linear-gradient(to bottom,rgba(135, 177, 249, 0.9),rgba(135,177, 249, 0.2))`,
        },
      ],
      quickLinks: [
        {
          icon: `${host}/public/tabbar/home/medical.png`,
          title: '金融服务',
          url: '/pages/service/fms',
        },
        {
          icon: `${host}/public/tabbar/home/law.png`,
          title: '物流服务',
          url: '/pages/service/tms',
        },
        {
          icon: `${host}/public/tabbar/home/social.png`,
          title: '海外仓',
          url: '/pages/service/wms',
        },
        {
          icon: `${host}/public/tabbar/home/fund.png`,
          title: '数字化转型',
          url: '/pages/service/dtc',
        },
      ],
      currentSwiperIndex: 0,
      currentPartnerIndex: 0,
      partnerList: [
        {
          id: 1,
          title: '综保区',
          type: '',
          logo: require('@/static/zongbao.svg'), // 使用static文件夹中的svg
          color: '#FFB5B5',
          features: [{ text: '保税仓储' }, { text: '通关服务' }],
          target: '/pages/differentSku/index',
        },
        {
          id: 2,
          title: '迈奇',
          type: '',
          logo: require('@/static/maiqi.svg'), // 使用static文件夹中的svg
          color: '#95E1D3',
          features: [{ text: '平台运营' }, { text: '全球营销' }],
          target: '/pages/differentSku/index',
        },
        {
          id: 3,
          title: '云川',
          type: '',
          logo: require('@/static/yunchuan.svg'), // 使用static文件夹中的svg
          color: '#FCE38A',
          features: [{ text: '采购管理' }, { text: '物流配送' }],
          target: '/pages/differentSku/index',
        },
        {
          id: 4,
          title: '易货',
          type: '',
          logo: require('@/static/yihuo.svg'), // 使用static文件夹中的svg
          color: '#F38181',
          features: [{ text: '跨境支付' }, { text: '资金安全' }],
          target: '/pages/differentSku/index',
        },
      ],
      serviceList: [
        {
          title: '物流服务',
          icon: 'car',
          logo: require('@/static/tms.svg'),
          color: '#4B79E4',
          url: '/pages/service/tms',
        },
        {
          title: '海外仓',
          icon: 'bell',
          logo: require('@/static/wms.svg'),
          color: '#FF9A9E',
          url: '/pages/service/wms',
        },
        {
          title: '金融服务',
          icon: 'checkbox-mark',
          color: '#FCE38A',
          logo: require('@/static/fms.svg'),
          url: '/pages/service/fms',
        },
        {
          title: '数字链转型',
          icon: 'file-text',
          color: '#95E1D3',
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
  methods: {
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
    height: 145rpx;
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

  padding: 0px 8px;
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
    &-l {
      width: 96%;
      height: 148rpx;
      display: flex;
      align-items: center;

      border-radius: 16rpx;

      // justify-content: center;
      position: relative;
      overflow: hidden;
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
    padding: 0px 4px 10px 4px;
    background-color: #fff;
    .waterfall-item {
      border-radius: 6px;
      width: 334rpx;
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
  margin: 24rpx 0;
  padding: 0 20rpx;

  .partner-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
    padding: 20rpx 0;
  }

  .partner-card {
    position: relative;
    padding: 16rpx;
    border-radius: 20rpx;
    background: #f9f5f5;
    overflow: hidden;
    transition: all 0.3s ease;
    animation-delay: var(--delay);

    // 悬浮效果
    &:hover {
      transform: translateY(-6rpx);
      box-shadow: 0 10rpx 20rpx rgba(0, 0, 0, 0.08);

      .partner-icon {
        transform: scale(1.1) rotate(10deg);
      }

      .decoration-circle {
        transform: scale(1.2);
      }

      .feature-tag {
        background: var(--color);
        color: #fff;
      }
    }

    // 装饰元素
    .card-decoration {
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.1;

      .decoration-circle {
        position: absolute;
        right: -30rpx;
        top: -30rpx;
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        background: var(--color);
        transition: all 0.3s ease;
      }

      .decoration-dots {
        position: absolute;
        left: 10rpx;
        bottom: 10rpx;
        width: 60rpx;
        height: 60rpx;
        background-image: radial-gradient(circle, var(--color) 2px, transparent 3px);
        background-size: 12px 12px;
      }
    }
  }

  .partner-icon {
    width: 100%;
    height: 80rpx;
    background: rgba(var(--color), 0.1);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    margin-bottom: 16rpx;
    transition: all 0.3s ease;
  }
  .partner-name {
    font-size: 26rpx;
    font-weight: 600;
    color: #333;
    flex: 1;
    margin-bottom: 4rpx;
    display: block;
  }

  .partner-content {
    margin-bottom: 16rpx;

    .partner-type {
      font-size: 20rpx;
      color: #666;
      display: block;
    }
  }

  .partner-features {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;

    .feature-tag {
      font-size: 20rpx;
      padding: 2rpx 12rpx;
      border-radius: 12rpx;
      background: #f5f5f5;
      color: #666;
      transition: all 0.3s ease;
    }
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
    background: linear-gradient(135deg, rgba(24, 154, 185, 0.1) 20%, rgba(24, 154, 185, 0.4) 100%);
    overflow: hidden;
    transition: all 0.3s ease;

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
      font-size: 36rpx;
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
  padding: 20rpx 0rpx;
  background: #fff;
  border-radius: 12rpx;

  .service-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    padding: 16rpx;
    transition: all 0.3s ease;
    border-radius: 10px;
    background: linear-gradient(to bottom, rgba(192, 232, 255, 1), rgba(192, 232, 255, 0.3));
    &:active {
      transform: scale(0.95);
    }

    .u-icon {
      background: rgba(75, 121, 228, 0.1);
      padding: 16rpx;
      border-radius: 16rpx;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-4rpx);
      }
    }

    .service-name {
      font-size: 24rpx;
      color: #333;
      margin-top: 8rpx;
    }
  }
}
</style>
