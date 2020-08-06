<template>
	<view class="register">
		<uni-nav-bar left-icon="arrowleft" title="更换手机" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
  <view class="caution">绑定后可提高账号安全性</view>
		<view class="get_info">
			<view>
				<text>手机号</text>
				<input type="number" v-model="mobile" placeholder="请输入手机号" placeholder-class="place_style" />
			</view>


			<move-verify @result="verifyResult" ref="verifyElement"></move-verify>
			<view class="flex">
				<text>验证码</text>
				<view class="flex_left_right" style="width:79%;">
					<input type="number" v-model="verify_code"   placeholder="请输入验证码" placeholder-class="place_style" @focus="back=false" />
					<my-identifyingcode @getCode="getCode" ref="code"></my-identifyingcode>
				</view>
			</view>

		</view>
		<view class="submit_button button_style" :class="{'gray_b':back}" @click="forget">立即绑定</view>
	</view>
</template>

<script>
	import moveVerify from '@/components/helang-moveVerify/helang-moveVerify.vue';
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	const app = getApp().globalData;
	const {
		navBar,
		appid,
		appsecret
	} = app;
	export default {
		components: {
			moveVerify
		},
		data() {
			return {
				resultData: {},
				mobile: '',
				verify_code: '',
				secret_str: '',
				identifying: '',
				navBar: navBar,
				back: true,
				count:0
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			verifyResult(res) {
				this.resultData = res;
				if (this.resultData.flag == true) {
					this.captcha()
					return;
				}
			},
			/* 校验插件重置 */
			verifyReset() {
				this.$refs.verifyElement.reset();
				/* 删除当前页面的数据 */
				this.resultData = {};
			},

			captcha() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				rs.getRequests("random", params, (res) => {
					let data = res.data;
					if (data.code == 200) {
						this.secret_str = data.data.number
						uni.setStorageSync("laravel_session", res.header["Set-Cookie"]);
					} else {
						rs.Toast(data.msg);
					}
				})
			},
			// 获取短信验证码
			getCode() {
				var that = this;

				let timeStamp = Math.round(new Date().getTime() / 1000);
				if (!that.mobile) {
					rs.Toast('手机号不能为空');
					return;
				}
				var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
				if (!reg.test(that.mobile)) {
					rs.Toast('不能输入特殊字符和空格');
					return;
				}
				if (!that.secret_str) {
					rs.Toast('请拖动滑块验证');
					return;
				}

				let obj = {
					appid: appid,
					mobile: that.mobile,
					timeStamp: timeStamp
				};

				var random_str = md5.hexMD5(appsecret + that.secret_str);
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
					secret_str: random_str
				}, obj)
				uni.request({
					url: app.rootUrl + "/mobileOrder/sendCode",
					method: 'POST',
					header: {
						'content-type': 'application/json', // 默认值
						'cookie': uni.getStorageSync("laravel_session"),
						'Authorization': uni.getStorageSync("cdj_token"),
					},
					data: params,
					success: function(res) {
						if (res.data.code == 200) {
							that.secret_str = res.data.data.random_str;
							rs.Toast('验证码已发送到你手机中，请注意查收');
							that.$refs.code.sendCode();
						} else {
							that.verifyReset()
							rs.Toast(res.data.msg);
						}
					}
				})
			},
			//提交
			forget() {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				var that = this;
				
				var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
				if (!this.mobile) {
					rs.Toast('手机号不能为空');
					return;
				}

				if (!reg.test(this.mobile)) {
					rs.Toast('不能输入特殊字符和空格');
					return;
				}
				if (!this.verify_code) {
					rs.Toast('请输入验证码');
					return;
				}

				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				
				};
			
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
					mobile: this.mobile,
					code: this.verify_code,
					identifying: that.identifying
					
				}, obj)

				uni.request({
					url: app.rootUrl + "/mobileOrder/bindMobile",
					method: 'POST',
					data: params,
					header: {
						'content-type': 'application/json', // 默认值
						'cookie': uni.getStorageSync("laravel_session"),
						'Authorization': uni.getStorageSync("cdj_token"),
					},
					success: function(res) {
						if (res.data.code == 200) {
							let {
								data
							} = res;
							rs.Toast('手机号绑定成功');
							uni.setStorageSync('cdj_token', data.data.token);
							uni.setStorageSync('is_child', data.data.is_child);

							// #ifdef APP-PLUS
							uni.setStorageSync('is_miniBind', data.data.is_appBind);
							// #endif

							// #ifdef H5
							uni.setStorageSync('is_miniBind', data.data.is_bind);
							// #endif

							// #ifdef MP-WEIXIN
							uni.setStorageSync('is_miniBind', data.data.is_miniBind);
							// #endif
							setTimeout(() => {
								uni.switchTab({
									url: "../tabar/index"
								})
							}, 1000);

						} else if (res.data.code == 403) {
							rs.Toast('绑定手机成功，请耐心等待审核');
							setTimeout(() => {
								uni.navigateTo({
									url: './login'
								})
							}, 1000)

						} else {
							rs.Toast(res.data.msg);
						}
					}
				})
			},
		},
		onLoad(options) {
			this.identifying = options.identifying;

		}
	};
</script>

<style>
	page {
		background: white;
	}

	.register .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.register .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.register .get_info>view>text {
		width: 150rpx;
		color: #808080;
	}

	.register .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	.register .now_login {
		color: #A1A1A1;
		text-align: center;
		font-size: 24rpx;
	}

	.register .agree {
		position: fixed;
		width: 100%;
		bottom: 20rpx;
		text-align: center;
		font-size: 24rpx;
		color: #418d5f;
	}.register .caution{color: red;
    background: #f9d1cb;
    font-size: 12px;
    height: 25px;
    text-align: center;
    line-height: 25px;}
</style>
