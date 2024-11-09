<template>
  <view class="container">
    <view class="u-page">
      <view class="u-demo-block">
        <view class="u-demo-block__content">
          <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
          <u--form
            labelPosition="left"
            :errorType="errorType"
            :model="from"
            ref="form"
            labelWidth="160rpx"
            :labelStyle="labelStyle"
          >
            <u-form-item labelPosition="top" prop="content">
              <u--textarea
                :placeholder="$t('Please enter the question you want to give feedback (within 5-500 words)')"
                height="402rpx"
                maxlength="500"
                v-model="from.content"
              ></u--textarea>
            </u-form-item>
            <view class="upload">
              <text>{{ $t('Provide a screenshot or photo of the problem (optional)') }}</text>
              <u-form-item labelPosition="top">
                <u-upload
                  :width="120"
                  :height="120"
                  :fileList="fileList"
                  @afterRead="afterRead"
                  deletable
                  @delete="deletePic"
                  name="1"
                  multiple
                  :maxCount="1"
                ></u-upload>
              </u-form-item>
            </view>
            <view class="input">
              <u-form-item style="width: 100%" :label="$t('Contact information')" prop="contact">
                <u--input
                  clearable
                  v-model="from.contact"
                  inputAlign="right"
                  border="none"
                  :placeholder="$t('Please enter phone number')"
                ></u--input>
              </u-form-item>
            </view>
            <view class="remind" style="width: 100%">
              <view class="remind_text u-line-2">
                {{ $t('Feedback description') }}
              </view>
            </view>
          </u--form>
          <u-button :text="$t('submit')" :customStyle="btnCustomStyle" @click="submit()"></u-button>
          <!-- <u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const MineServer = require('../../common/store/mineServer.js');
const Api = require('../../common/store/api.js');
const Validate = require('../../common/utils/validate.js');
export default {
  data() {
    return {
      errorType: 'toast',
      fileList1: [],
      value: '',
      from: {
        title: '用户反馈',
        content: '',
        contact: '', //联系方式
        img: '',
      },
      rules: {
        content: [
          {
            type: 'string',
            required: true,
            message: this.$t('Please fill in the feedback content'),
            trigger: ['blur', 'change'],
          },
        ],
        contact: {
          type: 'number',
          required: true,
          message: this.$t('Please enter phone number'),
          trigger: ['blur', 'change'],
        },
      },
      labelStyle: {
        fontWeight: 'bold',
        fontSize: '24rpx',
        color: '#999',
      },
      fileList: [],
      btnCustomStyle: {
        width: '100%',
        height: '104rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
        color: '#FFF',
        fontSize: '32rpx',
        marginTop: '48rpx',
        fontWeight: 'Bold',
      },
      placeholderStyle: {
        color: '#000',
        fontSize: '24rpx',
        color: 'red',
      },
    };
  },
  onReady() {
    // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    // 删除图片
    deletePic(event) {
      this.fileList.splice(event.index, 1);
      console.log(this.fileList);
    },
    // 新增图片
    async afterRead(event) {
      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
      console.log(lists);
      let fileListLen = this.fileList.length;
      lists.map((item) => {
        this.fileList.push({
          ...item,
          status: 'uploading',
          message: this.$t('uploading'),
        });
      });
      console.log(lists, fileListLen);
      for (let i = 0; i < lists.length; i++) {
        const result = await this.uploadFilePromise(lists[i].url);
        let item = this.fileList[fileListLen];
        this.fileList.splice(
          fileListLen,
          1,
          Object.assign(item, {
            status: 'success',
            message: '',
            url: result,
          })
        );
        fileListLen++;
      }
    },
    uploadFilePromise(url) {
      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: Api.user_profile_avatar,
          filePath: url,
          name: 'avatarfile',
          header: {
            Authorization: `Bearer ${uni.getStorageSync('token')}`,
          },
          success: (res) => {
            let data = JSON.parse(res.data);
            resolve(data.imgUrl);
          },
        });
      });
    },

    submit() {
      let that = this;
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
      that.$refs.form
        .validate()
        .then((res) => {
          // uni.$u.toast('校验通过',)
          if (that.fileList.length >= 1) {
            that.from.img = that.fileList[0].url;
          }
          let params = that.from;

          // MineServer.clientFeedback(params, {
          // 	success(res) {
          // 		uni.$u.toast(res.msg)
          // 		that.reset()
          // 		that.fileList = []
          // 	},
          // 	fail() {
          // 		uni.$u.toast(error)
          // 		that.reset()
          // 	}
          // })
          uni.$u.toast('已反馈！');
        })
        .catch((errors) => {
          console.log(errors);
          uni.$u.toast(errors[0].message);
        });
    },
    reset() {
      const validateList = ['content', 'contact', 'img'];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      setTimeout(() => {
        this.$refs.form.clearValidate(validateList);
        // 或者使用 this.$refs.form.clearValidate()
      }, 10);
    },
    hideKeyboard() {
      uni.hideKeyboard();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 24rpx;

  .u-page {
    width: 100%;

    .u-demo-block {
      width: 100%;
      margin-top: 20rpx;

      /deep/ .u-textarea {
        border-radius: 6px;
        background: #f4f6f8;
      }

      /deep/ .u-textarea__count {
        background: #f4f6f8 !important;
      }

      /deep/ .uni-textarea-placeholder {
        color: #999;
        font-size: 24rpx;
      }

      .upload {
        width: 100%;
        height: 310rpx;
        background-color: #f4f6f8;
        border-radius: 16rpx;
        margin-top: 40rpx;
        @include flex(column);
        justify-content: space-between;
        padding: 24rpx 0 0 24rpx;
        color: #999;
        font-size: 24rpx;

        &_upload {
          padding: 4rpx;
        }
      }

      .input {
        width: 100%;
        height: 80rpx;
        background: #f4f6f8;
        margin-top: 62rpx;
        border-radius: 12rpx;
        @include flex();
        align-items: center;
        padding: 24rpx;
      }

      .remind {
        margin-top: 24rpx;
        @include flex();
        justify-content: center;

        &_text {
          width: 504rpx;
          color: #999;
          text-align: center;
          font-size: 16rpx;
        }
      }
    }
  }
}
</style>
