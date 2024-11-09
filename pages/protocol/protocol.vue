<template>
  <view class="container">
    <!-- <view class="sub">
			<u-subsection style="height: 100%;padding:8rpx" :list="policyList" keyName="title" :current="curNow" @change="sectionChange"
				activeColor="#2E5BB3" fontSize="28rpx"></u-subsection>
		</view>
		<view class="text">
			<u-parse :content="content"></u-parse>
		</view> -->
    <view v-html="policyList"></view>
  </view>
</template>

<script>
const indexServer = require('../../common/store/indexServer.js');
export default {
  data() {
    return {
      // 或者如下，也可以配置keyName参数修改对象键名
      // list: [{name: '未付款'}, {name: '待评价'}, {name: '已付款'}],
      curNow: 0,
      policyList: `<h2>IDB隐私政策</h2>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;欢迎您访问我们的产品。 <strong>数城科技</strong>（包括App等产品提供的服务，以下简称“产品和服务”）是由 <strong>中传明智(青岛)数字科技有限公司</strong> （以下简称“我们”）开发并运营的。 确保用户的数据安全和隐私保护是我们的首要任务， 本隐私政策载明了您访问和使用我们的产品和服务时所收集的数据及其处理方式。
</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请您在继续使用我们的产品前务必认真仔细阅读并确认充分理解本隐私政策全部规则和要点， 一旦您选择使用，即视为您同意本隐私政策的全部内容，同意我们按其收集和使用您的相关信息。 如您在在阅读过程中，对本政策有任何疑问，可联系我们的客服咨询， 请通过 12343412512 或产品中的反馈方式与我们取得联系。 如您不同意相关协议或其中的任何条款的，您应停止使用我们的产品和服务。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本隐私政策帮助您了解以下内容:</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一、我们如何收集和使用您的个人信息;</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二、我们如何存储和保护您的个人信息;</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三、我们如何共享、转让、公开披露您的个人信息;</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;四、我们如何使用 Cookie 和其他追踪技术;</p>


<h3>一、我们如何收集和使用您的个人信息</h3>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;个人信息是指以电子或者其他方式记录的能够单独或者与其他信息，结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。我们根据《中华人民共和国网络安全法》和《信息安全技术个人信息安全规范》（GB/T35273-2017）以及其它相关法律法规的要求，并严格遵循正当、合法、必要的原则，出于您使用我们提供的服务和/或产品等过程中而收集和使用您的个人信息，包括但不限于电话号码、电子邮箱地址、偏好及兴趣等。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为接受我们全面的产品服务，您应首先注册一个用户账号，我们将通过它记录相关的数据。 您所提供的所有信息均来自于您本人在注册时提供的数据。 您准备使用的账户名、密码、您本人的联系方式，我们可能通过发短信或者邮件的方式来验证您的身份是否有效</p>

<h3>二、我们如何存储和保护您的个人信息</h3>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;作为一般规则，我们仅在实现信息收集目的所需的时间内保留您的个人信息。我们会在对于管理与您之间的关系严格必要的时间内保留您的个人信息（例如，当您开立帐户，从我们的产品获取服务时）。出于遵守法律义务或为证明某项权利或合同满足适用的诉讼时效要求的目的，我们可能需要在上述期限到期后保留您存档的个人信息，并且无法按您的要求删除。当您的个人信息对于我们的法定义务或法定时效对应的目的或档案不再必要时，我们确保将其完全删除或匿名化。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们使用符合业界标准的安全防护措施保护您提供的个人信息，并加密其中的关键数据， 防止其遭到未经授权访问、公开披露、使用、修改、损坏或丢失。我们会采取一切合理可行的措施，保护您的个人信息。 我们会使用加密技术确保数据的保密性；我们会使用受信赖的保护机制防止数据遭到恶意攻击。</p>

<h3>三、我们如何共享、转让、公开披露您的个人信息</h3>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在管理我们的日常业务活动所需要时，为追求合法利益以更好地服务客户，我们将合规且恰当的使用您的个人信息。出于对业务和各个方面的综合考虑，我们将与第三方合作伙伴分享这些数据，这些数据将同样符合他们的隐私政策，不会被随意处置</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。 在符合法律法规的前提下，当我们收到上述披露信息的请求时，我们会要求必须出具与之相应的法律文件，如传票或调查函。 我们坚信，对于要求我们提供的信息，应该在法律允许的范围内尽可能保持透明</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意：</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1、与国家安全、国防安全直接相关的；</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、与犯罪侦查、起诉、审判和判决执行等直接相关的；</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4、您自行向社会公众公开的个人信息；</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5、从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6、根据个人信息主体要求签订和履行合同所必需的；</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7、用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8、法律法规规定的其他情形。</p>

<h3>四、我们如何使用 Cookie 和其他追踪技术</h3>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为确保产品正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。 Cookie 通常包含标识符、产品名称以及一些号码和字符。 借助于 Cookie，我们能够存储您的偏好或商品等数据，并用以判断注册用户是否已经登录， 提升服务和产品质量及优化用户体验。</p>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们出于不同的目的使用各种Cookie，包括：严格必要型Cookie、性能Cookie、营销Cookie和功能Cookie。 某些Cookie可能由外部第三方提供，以向我们的产品提供其它功能。 我们不会将 Cookie 用于本政策所述目的之外的任何用途。您可根据自己的偏好管理或删除 Cookie。 您可以清除计算机上或手机中保存的所有 Cookie，大部分网络浏览器都设有阻止或禁用 Cookie 的功能， 您可对浏览器进行配置。阻止或禁用 Cookie 功能后，可能影响您使用或不能充分使用我们的产品和服务。</p>
`,
      content: '',
    };
  },
  onLoad() {
    // this.getBanner();
  },
  methods: {
    sectionChange(index) {
      this.curNow = index;
      let that = this;
      let type = 'policy';
      let cid = that.policyList[index].cid;
      indexServer.getContent(type, cid, {
        success(res) {
          that.content = res.data.content;
          console.log('that.content', res.data.content);
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
    // 首页数据
    getBanner() {
      let that = this;
      let type = 'policy';
      let param = {};
      indexServer.getHomeContent(param, type, {
        success(res) {
          that.policyList = res.data;
          console.log('that.policyList', that.policyList);
          that.sectionChange(that.curNow);
        },
        fail(err) {
          console.log('err', err);
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 52rpx;
  height: 100%;
  background: #fbfbfd;

  .sub {
    width: 100%;
    height: 84rpx;
    margin-top: 24rpx;

    /deep/ .u-subsection--button__bar {
      height: 68rpx !important;
    }

    /deep/ .u-subsection--button {
      text-align: center !important;
    }
  }

  .text {
    margin-top: 64rpx;
    color: #666;
    font-size: 28rpx;
    line-height: 44rpx;
  }
}
</style>
