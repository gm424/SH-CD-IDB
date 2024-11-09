<template>
  <view class="container">
    <image class="banner" :src="banner"></image>
    <view class="u-page">
      <view class="u-demo-block">
        <text class="u-demo-block__title">{{ $t('Inquiry details') }}</text>
        <view class="u-demo-block__content">
          <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
          <u--form
            :errorType="errorType"
            labelPosition="top"
            :model="model"
            ref="form"
            labelWidth="100%"
            :labelStyle="labelStyle"
          >
            <u-form-item :label="$t('product name')" prop="inquiry.goodsName" borderBottom>
              <u--input
                v-model="model.inquiry.goodsName"
                border="none"
                :disabled="this.disabledGoodsNameInput"
                :placeholder="$t('please input the product name')"
              ></u--input>
            </u-form-item>
            <u-form-item :label="$t('Product Categories')" prop="categoryName " borderBottom @click="hideKeyboard()">
              <u--input
                v-model="model.categoryName"
                disabled
                disabledColor="#ffffff"
                :placeholder="placeholder"
                border="none"
              ></u--input>
              <u-icon v-if="categoryId !== '0'" slot="right" name="arrow-right"></u-icon>
            </u-form-item>
            <u-form-item :label="$t('Purchase quantity')" prop="inquiry.num" borderBottom>
              <u--input
                type="number"
                v-model="model.inquiry.num"
                border="none"
                :disabled="this.disabledNumInput"
                :placeholder="$t('Please enter quantity')"
              ></u--input>
            </u-form-item>
            <u-form-item :label="$t('purchasing unit')" prop="inquiry.unit" borderBottom>
              <u--input
                v-model="model.inquiry.unit"
                border="none"
                :placeholder="$t('Please enter the purchasing unit')"
              ></u--input>
            </u-form-item>
            <u-form-item :label="$t('Procurement specifications')" prop="inquiry.specification" borderBottom>
              <u--input
                v-model="model.inquiry.specification"
                border="none"
                :disabled="this.disabledSpecificationInput"
                :placeholder="$t('Please enter product specifications')"
              ></u--input>
            </u-form-item>
            <u-form-item :label="$t('Is tax included?')" prop="inquiry.taxIncluded">
              <u-radio-group v-model="model.inquiry.taxIncluded" :size="radioSize" :iconSize="radioSize">
                <u-radio
                  :iconSize="radioSize"
                  :labelSize="radioSize"
                  v-for="(item, index) in radiolist"
                  :key="index"
                  :label="item.name"
                  :name="item.value"
                >
                </u-radio>
              </u-radio-group>
            </u-form-item>
            <text class="u-demo-block__title" style="border-bottom: 0">{{ $t('A detailed description') }}</text>
            <u-form-item labelPosition="top" prop="inquiry.description">
              <u--textarea
                :placeholder="$t('Please fill in the product description')"
                v-model="model.inquiry.description"
                height="192rpx"
                count
              ></u--textarea>
            </u-form-item>
            <u-form-item labelPosition="top" :label="$t('Upload Attachment')">
              <u-upload
                :width="120"
                :height="120"
                :fileList="fileList"
                @afterRead="afterRead"
                deletable
                @delete="deletePic"
                name="1"
                multiple
                :maxCount="10"
              ></u-upload>
            </u-form-item>
            <u-form-item prop="checkboxValue1" labelWidth="160rpx">
              <u-checkbox-group shape="circle" :size="radioSize" :iconSize="radioSize" v-model="model.checkboxValue1">
                <u-checkbox v-for="(item, index) in checkboxList1" :key="index" :name="item.name"></u-checkbox>
              </u-checkbox-group>
              <u--text color="#1989FA" size="28rpx" decoration="underline" :text="$t('I agree')"></u--text>
            </u-form-item>
            <u-form-item prop="checkboxValue2" labelWidth="160rpx">
              <u-checkbox-group shape="circle" :size="radioSize" :iconSize="radioSize" v-model="model.checkboxValue2">
                <u-checkbox v-for="(item, index) in checkboxList2" :key="index" :name="item.name"></u-checkbox>
              </u-checkbox-group>
              <u--text color="#1989FA" size="28rpx" decoration="underline" :text="$t('I have read')"></u--text>
            </u-form-item>
          </u--form>
          <u-button :text="$t('submit')" :customStyle="btnCustomStyle" @click="submit"></u-button>
          <!-- <u-button type="error" text="重置" customStyle="margin-top: 10px" @click="reset"></u-button> -->
          <u-picker
            :cancelText="cancelText"
            :confirmText="confirmText"
            :show="showSategory"
            @confirm="categoryIdSelect"
            :columns="actions"
            @cancel="showSategory = false"
            keyName="catName"
          ></u-picker>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { token } from '../../common/utils/constant.js';
const MineServer = require('../../common/store/mineServer.js');
const Api = require('../../common/store/api.js');
const IndexServer = require('../../common/store/indexServer.js');
const Validate = require('../../common/utils/validate.js');
export default {
  data() {
    return {
      cancelText: this.$t('cancelText'),
      confirmText: this.$t('confirmText'),
      banner: '/static/inquiry/inquiryBanner.png',
      errorType: 'toast',
      model: {
        inquiry: {
          goodsId: '',
          goodsName: '',
          categoryId: '0',
          num: '',
          unit: '',
          specification: '',
          taxIncluded: true,
          description: '',
          // effectTime: '',
          images: [],
        },
        checkboxValue1: [],
        checkboxValue2: [],
        categoryName: '',
      },
      skuId: null, //产品规格id
      disabledGoodsNameInput: false, // 禁用数量输入框
      disabledNumInput: false, // 禁用数量输入框
      disabledSpecificationInput: false, // 禁用规格输入框
      showSategory: false,
      actions: [],
      categoryId: '',
      rules: {
        'inquiry.goodsName': [
          {
            type: 'string',
            required: true,
            message: this.$t('please input the product name'),
            trigger: ['blur', 'change'],
          },
        ],
        categoryName: [
          {
            type: 'string',
            required: true,
            message: this.$t('Please select a product category'),
            trigger: ['blur', 'change'],
          },
        ],
        'inquiry.num': [
          {
            type: 'number',
            required: true,
            message: this.$t('Please enter quantity'),
            trigger: ['blur', 'change'],
          },
        ],
        'inquiry.unit': [
          {
            type: 'string',
            required: true,
            message: this.$t('Please select a product category'),
            trigger: ['blur', 'change'],
          },
        ],
        'inquiry.specification': [
          {
            type: 'string',
            required: true,
            message: this.$t('Please enter product specifications'),
            trigger: ['blur', 'change'],
          },
        ],
        'inquiry.taxIncluded': [
          {
            type: 'boolean',
            required: true,
            message: this.$t('Please select whether tax is included or not'),
            trigger: ['blur', 'change'],
          },
        ],
        'inquiry.description': [
          {
            type: 'string',
            required: true,
            message: this.$t('Please fill in the product description'),
            trigger: ['blur', 'change'],
          },
        ],
        checkboxValue1: [
          {
            type: 'array',
            required: true,
            message: this.$t('Please agree business'),
            trigger: ['blur', 'change'],
          },
        ],
        checkboxValue2: [
          {
            type: 'array',
            required: true,
            message: this.$t('Please agree specification'),
            trigger: ['blur', 'change'],
          },
        ],
      },
      placeholder: this.$t('Please select a product category'),
      radiolist: [
        {
          name: this.$t('tax included'),
          disabled: true,
          value: true,
        },
        {
          name: this.$t('Excluding tax'),
          disabled: false,
          value: false,
        },
      ],
      checkboxList1: [
        {
          name: this.$t('I agree'),
          disabled: false,
        },
      ],
      checkboxList2: [
        {
          name: this.$t('I have read'),
          disabled: false,
        },
      ],
      labelStyle: {
        height: '96rpx',
        fontWeight: 'bold',
        fontSize: '32rpx',
        lineHeight: '150%',
      },
      radioSize: '28rpx',
      fileList: [],
      btnCustomStyle: {
        width: '450rpx',
        height: '82rpx',
        background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
        color: '#FFF',
        fontSize: '32rpx',
        marginTop: '46rpx',
      },
    };
  },
  onReady() {
    // 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
    this.$refs.form.setRules(this.rules);
  },
  onLoad(options) {
    if (!uni.$u.test.isEmpty(options)) {
      let { goodsName, categoryId, goodsId, num, specification, skuId } = options;
      this.model.inquiry.goodsName = goodsName;
      this.model.inquiry.goodsId = goodsId;
      this.categoryId = categoryId;
      // 20231128 新增 ↓↓↓
      this.model.inquiry.num = num;
      this.model.inquiry.specification = specification;
      this.skuId = skuId;
      this.disabledNumInput = true;
      this.disabledSpecificationInput = true;
      this.disabledGoodsNameInput = true;
    }
    if (this.categoryId === '0') {
      this.placeholder = this.$t('This product has no classification yet');
    }
    this.getClientCategory();
  },
  methods: {
    // 删除图片
    deletePic(event) {
      this.fileList.splice(event.index, 1);
    },
    // 新增图片
    async afterRead(event) {
      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      let lists = [].concat(event.file);
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
    categoryIdSelect(e) {
      this.model.inquiry.categoryId = e.value[0].catId;
      this.model.categoryName = e.value[0].catName;
      this.$refs.form.validateField('userInfo.categoryId');
      this.showSategory = false;
    },
    submit() {
      let that = this;
      console.log(that.model.inquiry);
      // 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
      that.$refs.form
        .validate()
        .then((res) => {
          let params = that.model.inquiry;
          this.skuId && (params['id'] = this.skuId); // 20231128 新增产品规格
          if (uni.$u.test.array(that.fileList)) {
            params.images = that.fileList.map((obj) => {
              return obj.url;
            });
          }
          console.log('params: ', params);
          IndexServer.clientInquiry(params, {
            success(res) {
              uni.$u.toast(res.msg);
              that.reset();
            },
            fail(error) {
              console.log(error);
              uni.$u.toast(error);
            },
          });
        })
        .catch((errors) => {
          console.log(errors);
          uni.$u.toast(errors[0].message);
        });
    },
    reset() {
      const validateList = [
        'inquiry.goodsId',
        'inquiry.goodsName',
        'inquiry.num',
        'inquiry.unit',
        'inquiry.specification',
        'inquiry.description',
        'inquiry.images',
        'checkboxValue1',
        'checkboxValue2',
      ];
      this.fileList = [];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
      setTimeout(() => {
        this.$refs.form.clearValidate(validateList);
        // 或者使用 this.$refs.form.clearValidate()
      }, 10);
    },
    hideKeyboard() {
      if (this.categoryId !== '0') {
        this.showSategory = true;
      }
      uni.hideKeyboard();
    },
    // 获取分类详情
    getClientCategory() {
      let that = this;
      IndexServer.getClientCategory({
        success(res) {
          if (!uni.$u.test.array(res.data.result)) {
            uni.$u.toast('产品分类加载失效');
            return;
          }
          if (!uni.$u.test.isEmpty(that.categoryId)) {
            res.data.result.map((i) => {
              if (i.catId == that.categoryId) {
                that.model.categoryName = i.catName;
              }
            });
          }
          that.actions.push(res.data);
          console.log('that.actions', that.actions);
          console.log('that.categoryId', that.categoryId);
        },
        fail(err) {
          console.log(err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 24rpx;
  position: relative;

  // /deep/ .u-transition {
  // 	position: absolute !important;
  // 	height: 100%;
  // }

  .banner {
    width: 100%;
    height: 208rpx;
    border-radius: 12rpx;
    margin: 40rpx 0;
  }

  .u-page {
    width: 100%;

    .u-demo-block {
      width: 100%;
      padding: 0 24rpx;

      .u-demo-block__title {
        margin-top: 40rpx;
        width: 100% !important;
        display: flex;
        color: #333;
        font-size: 36rpx;
        font-weight: bold;
        line-height: 150%;
        /* 27px */
        letter-spacing: -0.36px;
        padding-bottom: 40rpx;
        border-bottom: 1px solid rgb(214, 215, 217);

        border-top-color: rgb(214, 215, 217);
        border-right-color: rgb(214, 215, 217);
        border-left-color: rgb(214, 215, 217);
      }

      /deep/ .u-input {
        background: #fbfbfd !important;
      }

      /deep/ .u-textarea {
        border-radius: 6px;
        background: #f4f6f8;
      }

      /deep/ .u-textarea__count {
        background: #f4f6f8 !important;
      }

      .checkbox-text {
        font-size: 28rpx !important;
        text-decoration: underline;
      }
    }
  }
}
</style>
