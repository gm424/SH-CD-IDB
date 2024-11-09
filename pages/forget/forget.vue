<template>
	<view class="container">
		<view class="form">
			<u-avatar class="logo" :src="src" size="120"></u-avatar>
			<u--form :errorType="errorType" style="width: 100%;" :model="loginFrom" :rules="rules" ref="uForm">
				<block v-if="login_method_email">
					<u-form-item prop="userInfo.email">
						<u-input :customStyle="inputCustom" :placeholder="$t('email address')" v-model="loginFrom.userInfo.email"
							border="none">
							<image :src="email" class="input-icon" slot="prefix"></image>
						</u-input>
					</u-form-item>
					<u-form-item prop="userInfo.smsCode">
						<u-input :customStyle="inputCustomTop" :placeholder="$t('enter confirmation code')" v-model="loginFrom.userInfo.smsCode"
							border="none">
							<image :src="email" class="input-icon" slot="prefix"></image>
							<template slot="suffix">
								<view class="u-text-padding-right">
									<u--text size="12" color="#2E5BB3" @click="getCode" :disabled="disabled"
										:text="tips"></u--text>
								</view>
							</template>
						</u-input>
					</u-form-item>
				</block>
				<block v-else>
					<u-form-item prop="userInfo.phone">
						<u-input :customStyle="inputCustomTop" :placeholder="$t('Please enter phone number')" v-model="loginFrom.userInfo.phone"
							border="none">
							<image :src="phone" class="input-icon" slot="prefix"></image>
						</u-input>
					</u-form-item>
					<u-form-item prop="userInfo.code">
						<u-input :customStyle="inputCustomTop" :placeholder="$t('enter confirmation code')" v-model="loginFrom.userInfo.code"
							border="none">
							<image :src="password" class="input-icon" slot="prefix"></image>
							<template slot="suffix">
								<view class="u-text-padding-right">
									<u--text size="12" color="#2E5BB3" @click="goForgetPassword" :text="$t('Send the verification code')"></u--text>
								</view>
							</template>
						</u-input>
					</u-form-item>
				</block>
				<u-form-item prop="userInfo.oldpassword">
					<u-input :customStyle="inputCustomTop" :placeholder="$t('Please enter a new password')" password
						v-model="loginFrom.userInfo.oldpassword" border="none">
						<image :src="email" class="input-icon" slot="prefix"></image>
					</u-input>
				</u-form-item>

				<u-form-item prop="userInfo.password">
					<u-input :customStyle="inputCustomTop" :placeholder="$t('Confirm new password again')" password
						v-model="loginFrom.userInfo.password" border="none">
						<image :src="password" class="input-icon" slot="prefix"></image>
					</u-input>
				</u-form-item>
			</u--form>
			<u-button :customStyle="btnCustomStyle" shape="circle" class="btn" @click="submit">{{$t('submit')}}</u-button>
		</view>
		<u-code :startText="startText" :changeText="changeText" :endText="endText" ref="uCode" @change="codeChange" seconds="60" @start="disabled = true" @end="disabled = false"></u-code>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	const LoginServer = require('../../common/store/loginServer.js');
	const validate = require('../../common/utils/validate.js');
	const Api = require('../../common/store/api.js');
	const host = Api.host
	export default {
		data() {
			return {
				disabled: false,
				tips: '',
				errorType: 'toast',
				src: `${host}/public/login/logo.png`,
				email: `${host}/public/login/email.png`,
				password: `${host}/public/login/password.png`,
				phone: `${host}/public/login/phone.png`,
				inputCustom: {
					height: '114rpx',
				},
				inputCustomTop: {
					height: '114rpx',
					marginTop: '24rpx'
				},
				loginFrom: {
					userInfo: {
						email: '',
						// phone: '',
						oldpassword: '',
						password: '',
						smsCode: ''
					}
				},
				rules: {
					// 邮箱校验
					"userInfo.email": [{
							required: true,
							message: this.$t('please input your email'),
							trigger: ['blur', 'change']
						},
						{
							trigger: ['blur', 'change'],
							validator: (rule, value, callback) => {
								return uni.$u.test.email(value)
							},
							message: this.$t('E-mail format is incorrect')
						},
					],
					"userInfo.smsCode": {
						type: 'string',
						required: true,
						len: 6,
						message: this.$t('Please fill in the verification code'),
						trigger: ['blur']
					},
					"userInfo.oldpassword": [
						// 必填规则
						{
							required: true,
							message: this.$t('Please enter a new password'),
							// blur和change事件触发检验
							trigger: ['blur', 'change'],
						},
					],
					"userInfo.password": [{
						required: true,
						message: this.$t('Please enter new password again'),
						trigger: ['blur', 'change']
					}, {
						trigger: ['blur'],
						validator: (rule, value, callback) => {
							let oldpassword = this.loginFrom.userInfo.oldpassword
							return value === oldpassword
						},
						message: this.$t('The password entered twice is inconsistent')
					}],
				},
				login_method_email: true, // 是否邮箱
				btnCustomStyle: {
					background: 'radial-gradient(45.61% 102.44% at 49.78% 125.61%, #6CD6F9 0%, #2E5BB3 100%)',
					color: '#FFF',
					fontSize: '32rpx'
				},
				startText: this.$t('startText'),
				changeText: this.$t('changeText'),
				endText: this.$t('endText')
			}
		},
		onLoad(options) {
			let {
				value
			} = options
			console.log(value);
			switch (value) {
				case 'email':
					this.login_method_email = true
					break;
				case 'phone':
					this.login_method_email = false
					break;
				default:
					this.login_method_email = true
					break;
			}
		},
		methods: {
			goForgetPassword() {
				uni.$u.route('/pages/forget/forget');
			},
			submit() {
				let that = this
				that.$refs.uForm.validate().then(res => {
					console.log(that.loginFrom)
					
					let loginFrom = that.loginFrom.userInfo
					LoginServer.resetPwd(loginFrom, {
						success(res) {
							uni.showToast({
								title: that.$t('Password reset complete'),
								icon: 'none',
								duration: 2500
							});
							
							setTimeout(function() {
								uni.$u.route({
									type: 'back'
								});
							}, 1800);
							
						},
						fail(err) {
							uni.showToast({
								title: err,
								icon: 'none',
								duration: 2500
							});
						}
					})
				}).catch(errors => {
					console.log(errors);
					uni.$u.toast(errors[0].message)
				})
			},
			reset() {
				const validateList = ['userInfo.oldpassword', 'userInfo.email', 'userInfo.smsCode', 'userInfo.password']
				this.$refs.uForm.resetFields()
				this.$refs.uForm.clearValidate()
				setTimeout(() => {
					this.$refs.uForm.clearValidate(validateList)
					// 或者使用 this.$refs.form1.clearValidate()
				}, 10)
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				let that = this
				let email = this.loginFrom.userInfo.email
				if (validate.isEmply(email)) {
					uni.showToast({
						title: that.$t("please input your email"),
						icon: 'none',
						duration: 2500
					});
					return;
				}
				if (!uni.$u.test.email(email)) {
					uni.showToast({
						title: that.$t("Email format error"),
						icon: 'none',
						duration: 2500
					});
					return;
				}
				let params = {
					email: email,
					type: 'reset_pwd'
				}
				if (that.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: that.$t('Getting verification code')
					})
					LoginServer.smsCode(params, {
						success(res) {
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast(that.$t('Verification code sent'));
							// 通知验证码组件内部开始倒计时
							that.$refs.uCode.start();
						},
						fail(err) {
							uni.showToast({
								title: err,
								icon: 'none',
								duration: 2500
							});
						}
					})
				} else {
					uni.$u.toast(that.$t('Send after countdown ends'));
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #FBFBFD;
	}

	.container {
		padding: 0 40rpx;
		position: relative;
		height: 100%;
		background: #FBFBFD;

		.form {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;

			::v-deep .u-form-item__body {
				padding: 0;
			}

			.logo {
				margin: 48rpx 0 48rpx 0;
			}

			.input-icon {
				width: 96rpx;
				height: 96rpx;
				margin-right: 18rpx;
			}

			.btn {
				width: 600rpx;
				height: 80rpx;
				margin-top: 48rpx;
				margin-bottom: 48rpx;
			}

			.u-text-padding-right {
				padding-right: $uni-font-size-base;
			}

		}
	}
</style>