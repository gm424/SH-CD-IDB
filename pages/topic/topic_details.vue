<template>
  <view class="page">
    <u-swiper
      height="560rpx"
      v-if="!$u.test.isEmpty(topicDetails.images)"
      imgMode="widthFill"
      :list="topicDetails.images"
      indicator
      indicatorMode="line"
      mode="aspectFill"
      circular
    ></u-swiper>
    <view class="container">
      <view class="shop shadow">
        <view class="shop_info">
          <view class="shop_info_text">
            <view class="shop_info_text_title u-line-2">
              {{ topicDetails.title }}
            </view>
            <view class="shop_info_text_rate">
              <text class="shop_info_text_rate_text">{{ topicDetails.description }}</text>
            </view>
          </view>
        </view>
        <view class="shop_info_btn" v-if="false">
          <commonButton :text="$t('focus on')"></commonButton>
        </view>
      </view>
      <view class="u-content shadow">
        <u-parse :lazyLoad="true" :content="topicDetails.content"></u-parse>
      </view>
    </view>
    <view class="tabbar">
      <view class="tabbar_item">
        <image :src="eye"></image>
        <text>{{ info.viewNum }}</text>
      </view>
      <view class="tabbar_item" @tap="postClientInteractionLike(topicDetails.cid, info.userLike ? 'DELETE' : 'POST')">
        <image :src="info.userLike ? like0 : like"></image>
        <text>{{ info.likeNum }}</text>
      </view>
      <view class="tabbar_item" @tap="uniShare">
        <image :src="share"></image>
        <text>{{ info.retweetNum }}</text>
      </view>
    </view>
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>
<script>
const indexServer = require('../../common/store/indexServer.js');
const Api = require('../../common/store/api.js');
import {
  getClientInteractionInfo,
  postClientInteractionLike,
  postClientInteractionRetweet,
} from '../../common/store/findServer.js';
import UniShare from 'uni_modules/uni-share/js_sdk/uni-share.js';
import commonButton from '@/components/myButton/commonButton.vue';
const uniShare = new UniShare();
const host = Api.host;
export default {
  data() {
    return {
      share: `${host}/public/tabbar/find/share.png`,
      eye: `${host}/public/tabbar/find/eye.png`,
      like: `${host}/public/tabbar/find/like.png`,
      like0: `${host}/public/tabbar/find/like0.png`,
      src: `${host}/public/login/logo.png`,
      cid: '',
      topicDetails: {},
      info: {},
    };
  },
  components: {
    commonButton,
  },
  onLoad(options) {
    let { cid } = options;
    this.cid = cid;
    this.getTopicDetails();
    this.getClientInteractionInfo();
  },
  methods: {
    uniShare() {
      let that = this;
      uniShare.show(
        {
          content: {
            //公共的分享参数配置  类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
            type: 0,
            href: 'https://www.ccmg.cn/',
            title: '数城科技',
            summary: that.topicDetails.title,
            imageUrl: that.src,
          },
          menus: [
            {
              img: '/static/app-plus/sharemenu/wechatfriend.png',
              text: '微信好友',
              share: {
                //当前项的分享参数配置。可覆盖公共的配置如下：分享到微信小程序，配置了type=5
                provider: 'weixin',
                scene: 'WXSceneSession',
              },
            },
            {
              img: '/static/app-plus/sharemenu/wechatmoments.png',
              text: '微信朋友圈',
              share: {
                provider: 'weixin',
                scene: 'WXSceneTimeline',
              },
            },
            // {
            // 	"img": "/static/app-plus/sharemenu/copyurl.png",
            // 	"text": "复制",
            // 	"share": "copyurl"
            // },
          ],
          cancelText: '取消分享',
        },
        (e) => {
          //callback
          console.log(uniShare.isShow);
          console.log(e);
          if (e.event === 'clickMenu') {
            postClientInteractionRetweet(that.cid, {
              success(res) {
                // uni.$u.toast(res.msg)
                that.getClientInteractionInfo();
              },
              fail(err) {
                uni.$u.toast(err.msg);
              },
            });
          }
          // postClientInteractionRetweet
        }
      );
    },
    getTopicDetails() {
      let that = this;
      let type = `topic/${that.cid}`;
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          let topicDetails = res.data;
          that.topicDetails = topicDetails;
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
    getClientInteractionInfo() {
      let that = this;
      let objId = that.cid;
      getClientInteractionInfo(objId, {
        success(res) {
          that.info = res.data;
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
    postClientInteractionLike(id, method) {
      let that = this;
      let obj_id = id;
      postClientInteractionLike(obj_id, method, {
        success(res) {
          uni.$u.toast(res.msg);
          that.getClientInteractionInfo();
        },
        fail(err) {
          uni.$u.toast(err.msg);
        },
      });
    },
  },
  onBackPress({ from }) {
    if (from == 'backbutton') {
      this.$nextTick(function () {
        uniShare.hide();
      });
      return uniShare.isShow;
    }
  },
};
</script>
<style lang="scss" scoped>
.page {
  position: relative;
  padding-bottom: 92rpx;

  .container {
    padding: 0 24rpx;

    .shop {
      width: 100%;
      border-radius: 12rpx;
      padding: 24rpx;
      margin-top: 24rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &_info {
        width: 414rpx;
        height: auto;
        display: flex;

        &_text {
          width: 314rpx;
          margin-left: 26rpx;

          &_title {
            width: 100%;
            max-height: 80rpx;
            font-size: 32rpx;
            line-height: 40rpx;
            margin-bottom: 8rpx;
            color: #666;
          }

          &_rate {
            display: flex;
            align-items: center;

            &_text {
              color: #666;
              font-size: 24rpx;
              line-height: 40rpx;
              margin-right: 20rpx;
            }
          }
        }
      }
    }

    .u-content {
      width: 100%;
      margin-top: 24rpx;
      padding: 40rpx;
    }
  }

  .tabbar {
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 430px;
    margin: 0 auto;
    height: 92rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 14rpx rgba(218, 218, 218, 0.5);
    padding: 22rpx 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &_item {
      height: 48rpx;
      display: flex;
      align-items: center;

      image {
        width: 48rpx;
        height: 48rpx;
      }

      text {
        color: #666;
        font-size: 24rpx;
        line-height: 40rpx;
        margin-left: 12rpx;
      }
    }
  }
}
</style>
