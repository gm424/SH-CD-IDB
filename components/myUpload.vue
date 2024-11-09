<template>
  <u-upload
    :fileList="fileList"
    @afterRead="afterRead"
    :useBeforeRead="true"
    name="1"
    :maxCount="10"
    :deletable="false"
    width="180"
    height="180"
  >
  </u-upload>
</template>

<script>
const IndexServer = require('@/common/store/indexServer.js');

export default {
  data() {
    return {
      timestamp: '',
      ossUploadUrl: '',
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossAccessKeyId: '',
        dir: '',
        host: '',
      },
      fileList: [],
    };
  },
  props: {
    value: Array,
  },
  computed: {},
  methods: {
    // 删除图片
    // deletePic(event) {
    //   this[`fileList${event.name}`].splice(event.index, 1);
    // },
    emitInput(val) {
      console.log('处理一下', val);
      const list = val.map((item) => {
        return item.url;
      });
      this.$emit('input', list);
    },
    // 新增图片
    async afterRead(event) {
      this.beforeRead(event).then(async (res) => {
        if (res) {
          const result = await this.uploadFilePromise(event.file.url);
          if (result.statusCode === 200) {
            this.fileList.push({
              status: 'success',
              message: '',
              url: this.dataObj.host + '/' + this.dataObj.key,
            });
            console.log('成功！', this.fileList);
            this.emitInput(this.fileList);
          } else {
            uni.$u.toast('上传失败，图片太大');
            // this.fileList.splice(0, 1, file);
          }
        }
      });
    },
    //oss
    beforeRead(file) {
      let that = this;
      console.log('上传前', file);
      return new Promise((resolve, reject) => {
        IndexServer.getOssSignature({
          success(response) {
            that.timestamp = Math.floor(100000 + Math.random() * 900000);
            console.log('上传前!!', response.data.signature, that.dataObj.signature);
            that.dataObj.signature = response.data.signature;
            that.dataObj.ossAccessKeyId = response.data.ossAccessKeyId;
            let name = file.file.name;
            let key = name;
            that.dataObj.key = response.data.dir + key;
            that.dataObj.dir = response.data.dir;
            that.dataObj.host = response.data.host;
            that.dataObj.policy = response.data.policy;
            that.ossUploadUrl = response.data.host;

            resolve(true);
          },
          fail(err) {
            console.log(err);
            reject(false);
          },
        });
      });
    },
    uploadFilePromise(url) {
      let that = this;
      return new Promise((resolve, reject) => {
        let a = uni.uploadFile({
          url: that.ossUploadUrl, // 仅为示例，非真实的接口地址
          filePath: url,
          name: 'file',
          formData: { ...that.dataObj, success_action_status: '200' },
          success: (res) => {
            console.log('res', res);
            resolve(res);
          },
        });
      });
    },
  },
};
</script>
