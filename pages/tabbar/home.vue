<template>
  <view class="container">
    <u-navbar :placeholder="true" :bgColor="bgColor" :titleStyle="{ color: '#fff' }" fixed>
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
    <view class="bg">
      <!-- 添加轮播图作为背景 -->
      <swiper
        class="bg-swiper"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        :circular="true"
        @change="handleSwiperChange"
      >
        <swiper-item v-for="(item, index) in promoList" :key="index" @click="handlePromoClick(item)">
          <image :src="item.image" mode="aspectFill" class="bg-image" />
        </swiper-item>
      </swiper>

      <!-- 添加指示点 -->
      <view class="swiper-dots">
        <view
          v-for="(item, index) in promoList"
          :key="index"
          class="dot"
          :class="{ active: currentSwiperIndex === index }"
        ></view>
      </view>
    </view>

    <view class="home">
      <!-- 精品馆 -->
      <view style="width: 100%">
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
      <!-- 合作方 -->
      <view class="alliance partner-section">
        <view class="partner-grid">
          <view
            v-for="(item, index) in PartnerList"
            :key="index"
            class="partner-card animate__animated animate__fadeInUp"
            :style="{
              animationDelay: index * 0.1 + 's',
              '--hover-color': getPartnerColor(index),
            }"
            @click="routeDetail(item)"
          >
            <view class="partner-icon-wrapper">
              <view class="">
                <u-image
                  width="75rpx"
                  height="75rpx"
                  :src="require('@/static/catalog/' + item.icon)"
                  :fade="true"
                  mode="aspectFill"
                  duration="450"
                >
                  <template v-slot:loading>
                    <u-loading-icon></u-loading-icon>
                  </template>
                </u-image>
              </view>
            </view>

            <view class="partner-content">
              <text class="partner-title">{{ item.title }}</text>
            </view>
          </view>
        </view>
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

      <!-- 买卖家入口 -->
      <view class="grid">
        <!-- 左侧买家入口保持不变 -->
        <view class="grid-l" @click="routerFactory">
          <view class="grid-l-t-text">
            <text class="tit">供应商入驻</text>

            <u-button :text="$t('tabbar.button')" type="primary" class="buyer-btn"></u-button>
          </view>
          <u-image width="80rpx" height="80rpx" :src="buyer" mode="aspectFill" :fade="true" duration="450">
            <template v-slot:loading>
              <u-loading-icon></u-loading-icon>
            </template>
          </u-image>
        </view>

        <!-- 右侧改为四个小图标 -->
        <view class="grid-r">
          <Tools></Tools>
        </view>
      </view>

      <view class="boutique" v-if="boutiqueList != null && boutiqueList.length > 0">
        <!-- <u-image width="100%" height="96rpx" :src="boutique" :fade="true" mode="aspectFill" duration="450"
					:lazy-load="true">
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

      <!-- 常用工具 -->
      <view class="alliance" v-if="toolsList != null && toolsList.length > 0">
        <view class="alliance-tit m0" style="padding-top: 28rpx; padding-left: 20rpx">
          <view class="alliance-tit-l">
            <text>{{ $t('Common tool') }}</text>
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
    <view class="alliance" v-if="recommendList != null && recommendList.length > 0">
      <view class="alliance-tit b0" style="padding-left: 10px">
        <view class="alliance-tit-l">
          <img :src="alliance_icon" />
          <text>{{ $t('for you') }}</text>
        </view>
      </view>

      <view class="waterfall_container">
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
        background: 'rgba(255, 255, 255, 0.2)', // 修改搜索框背景为半透明
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
          cid: 32,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'https://flagcdn.com/w160/kr.png',
          title: '韩国站',
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
          cid: 34,
          authorId: 1,
          type: 'boutique',
          category: '0',
          icon: 'https://flagcdn.com/w160/us.png',
          title: '美国站',
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
          title: '西班牙站',
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
          target: 'https://www.singlewindow.sh.cn/winx-portal/#/home',
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
          title: '物流配送网络',
          desc: '覆盖全球的物流体系',
          url: '/pages/logistics/index',
        },
      ],
      promoList: [
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/hot2_1726827870425.jpg`, // 替换为实际的图片地址
          title: '全球物流服务',
          desc: '专业的跨境物流解决方案',
          url: '/pages/logistics/index',
        },
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/hot1_1726827782367.png`,
          title: '金融支持',
          desc: '灵活的跨境支付方案',
          url: '/pages/finance/index',
        },
        {
          image: `http://jwerp.oss-cn-shenzhen.aliyuncs.com/upload/hot3_1726827799363.jpg`,
          title: '海外仓储',
          desc: '覆盖全球的仓储网络',
          url: '/pages/warehouse/index',
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
      uni.$u.route({
        url: item.target,
        params: {
          tag: item.title,
        },
      });
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
        pageSize: 10,
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
    },
  },
  computed: {},
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
    height: 435rpx;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 0;

    .bg-swiper {
      width: 100%;
      height: 100%;

      .bg-image {
        width: 100%;
        height: 100%;
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
      right: 30rpx;
      bottom: 30rpx;
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
  margin-top: 324rpx;
  padding: 10px;
  border-radius: 12px;
  background-color: #fff;
  .grid {
    height: 245rpx;
    display: flex;
    border-radius: 12rpx 12rpx 0 0;
    background-color: #fff;
    margin-top: 24rpx;
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
  width: 100%;
  display: flex;
  margin-top: 20px;
  border-radius: 10rpx;
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
  margin-bottom: 24rpx;
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
  .waterfall_container {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    .waterfall {
      @include flex();
      width: 100%;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0px 8px 10px 8px;
      background-color: #f5f5f5;
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

// 添加动画
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
  .partner-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16rpx;
    padding: 16rpx;
    background: #fff;
    border-radius: 24rpx;
  }

  .partner-card {
    position: relative;
    padding: 20rpx;
    background: #fff;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--hover-color), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:active {
      transform: scale(0.98);

      &::before {
        opacity: 0.1;
      }

      .icon-bg {
        transform: translateY(-4rpx);
      }
    }
  }

  .partner-icon-wrapper {
    position: relative;
    margin-bottom: 12rpx;

    .icon-bg {
      position: relative;
      width: 72rpx;
      height: 72rpx;
      background: #fff;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      z-index: 2;
    }

    .decoration-circle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90rpx;
      height: 90rpx;
      border: 2rpx dashed rgba(0, 0, 0, 0.08);
      border-radius: 50%;
      animation: rotate 10s linear infinite;
    }
  }

  .partner-content {
    text-align: center;
    z-index: 1;

    .partner-title {
      font-size: 26rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 4rpx;
      display: block;
    }

    .partner-desc {
      font-size: 20rpx;
      color: #999;
      display: block;
    }
  }

  .partner-decoration {
    position: absolute;
    inset: 0;
    pointer-events: none;

    .deco-dots {
      position: absolute;
      right: 12rpx;
      bottom: 12rpx;
      display: flex;
      gap: 4rpx;

      .dot {
        width: 4rpx;
        height: 4rpx;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        animation: pulse 1.5s ease-in-out infinite;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
}

// 动画
@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

.grid {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
  padding: 0px 10px 0px 10px;
  .grid-l {
    flex: 1;
    position: relative;
    border-radius: 24rpx;
    background: linear-gradient(135deg, #ffffff 0%, #daddf0 100%);
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
    border-left: 6rpx solid #96aee6;

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

// 闪光动画
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

  padding: 0px 10px; // 增加内边距
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
</style>
