<template>
	<view class="invest_record">
		<uni-nav-bar left-icon="arrowleft" title="支付信息" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		
			<!-- #ifdef MP-ALIPAY -->
			<view class="tip">如出现下单端账号与支付账号不一样，请到个人中心更改绑定支付宝</view>
			<!-- #endif -->

			<!-- #ifndef MP-ALIPAY -->
			<view class="tip">如出现下单端账号与支付账号不一样，请到个人中心更改绑定微信</view>
			<!-- #endif -->
		
		<view class="info">
			<view>
				<text>订单编号</text>
				<text>{{payOrder.order_sn}}</text>
			</view>
			<view>
				<text>配送时间</text>
				<text>{{payOrder.send_time}}</text>
			</view>
			<view>
				<text>订单金额</text>
				<text>￥{{payOrder.total_fee}}</text>
			</view>
			<view>
				<text>我的余额</text>
				<text class="red_font">￥{{payOrder.myBalance}}</text>
			</view>
			<view>
				<text>余额支付</text>
				<text class="red_font">￥{{payOrder.payBalance}}</text>
			</view>
			<view>
				<!-- #ifdef MP-ALIPAY -->
				<text>支付宝支付</text>
				<text class="red_font">￥{{payOrder.alipay}}</text>
				<!-- #endif -->
				<!-- #ifndef MP-ALIPAY -->
				<text>微信支付</text>
				<text class="red_font">￥{{payOrder.payWx}}</text>
				<!-- #endif -->

			</view>
		</view>
		<view class="notice">
			<view>注：</view>
			<view>平台不会以订单异常，系统升级等理由要求您点击任何链接进行退款操作，请提高警惕谨防受骗！</view>
		</view>
		<view class="select">
			<view class="determine" v-if="payOrder.payType == 2" @click='querenchongzhi'>确认支付</view>
			<view class="determine" v-if="payOrder.payType == 1" @click='goPay'>确认支付</view>
			<view class="cancel" @click="leftClick">返回订单</view>
		</view>
	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	const app = getApp().globalData;
	const {
		appid,
		appsecret,
		imgRemote,
		navBar
	} = app;
	export default {
		data() {
			return {
				navBar: navBar,
				oid: '',
				payOrder: '',
				is_miniBind: uni.getStorageSync('is_miniBind'),
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 支付信息
			 */
			payOrdera() {
				var that = this
				var oid = that.oid;
				// #ifdef H5
				var type = 'mp';
				// #endif
				// #ifdef APP-PLUS
				var type = 'app';
				// #endif
				// #ifdef MP-WEIXIN |MP-ALIPAY
				var type = 'mini';
				// #endif
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					oid: oid,
					type: type,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					oid: oid,
					type: type,

					// #ifdef MP-ALIPAY
					pay: 'alipay',
					// #endif

					timeStamp: timeStamp,
					sign: sign,
				}
				rs.postRequests("payOrder", data, (res) => {
					if (res.data.code == 200) {
						that.payOrder = res.data.data;
					} else if (res.data.code == 406) {

						// #ifdef MP-ALIPAY
						rs.Toast("请先绑定支付宝");
						// #endif
						// #ifndef MP-ALIPAY
						rs.Toast("请先绑定微信");
						// #endif
					} else {
						rs.Toast(res.data.msg)
					}
				})
			},

			// #ifdef APP-PLUS
			querenchongzhi() {
				var that = this
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						if (res.provider.indexOf('wxpay')) {
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: that.payOrder.wxParams, //微信、支付宝订单数据
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									rs.Toast('支付成功')
									setTimeout(function() {
										uni.switchTab({
											url: "/pages/tabar/order"
										})
									}, 1000);
								},
								fail: function(err) {
									console.log(err)
									rs.Toast('充值失败')
								}
							});
						}


					}
				});

			},
			// #endif
			// #ifdef H5
			querenchongzhi() {
				console.log(typeof WeixinJSBridge)
				if (typeof WeixinJSBridge == "undefined") {
					if (document.addEventListener) {
						document.addEventListener('WeixinJSBridgeReady', this.jsApiCall(), false);
					} else if (document.attachEvent) {
						document.attachEvent('WeixinJSBridgeReady', this.jsApiCall());
						document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall());
					}
				} else {
					this.jsApiCall();
				}

			},
			jsApiCall() {
				var thta = this;
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": this.payOrder.wxParams.appId, //公众号名称，由商户传入 
						"timeStamp": this.payOrder.wxParams.timeStamp, //时间戳，自1970年以来的秒数 
						"nonceStr": this.payOrder.wxParams.nonceStr, //随机串 
						"package": this.payOrder.wxParams.package,
						"signType": this.payOrder.wxParams.signType, //微信签名方式： 
						"paySign": this.payOrder.wxParams.paySign //微信签名 
					},
					function(res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							rs.Toast('支付成功')
							setTimeout(function() {
								uni.switchTab({
									url: "/pages/tabar/order"
								})
							}, 1000);
						}
					}
				);

			},
			// #endif

			// #ifdef MP-WEIXIN
			querenchongzhi() {
				console.log('微信支付')
				var that = this
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: that.payOrder.wxParams, //微信、支付宝订单数据
					timeStamp: that.payOrder.wxParams.timeStamp,
					nonceStr: that.payOrder.wxParams.nonceStr,
					package: that.payOrder.wxParams.package,
					signType: that.payOrder.wxParams.signType,
					paySign: that.payOrder.wxParams.paySign,
					success: function(res) {
						rs.Toast('充值成功')
						setTimeout(function() {
							uni.switchTab({
								url: "/pages/tabar/order"
							})
						}, 1000);
					},
					fail: function(err) {
						console.log(err)
						rs.Toast("充值失败");
					}

				})
			},
			// #endif
			// #ifdef MP-ALIPAY
			querenchongzhi() {
				console.log('支付宝支付')
				var that = this
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: that.payOrder.aliParams.trade_no, //微信、支付宝订单数据
					success: function(res) {
						if (res.resultCode == 9000) {
							rs.Toast('充值成功');
							setTimeout(function() {
								uni.switchTab({
								url: "/pages/tabar/order"
								})
							}, 1000);
						}
					},
					fail: function(err) {
						console.log(err)
						rs.Toast("充值失败");
					}

				})
			},

			// #endif

			goPay() {
				var that = this
				var oid = that.oid;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					id: oid,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					id: oid,
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.postRequests("balancePay", data, (res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: '支付成功',
							duration: 2000,
							icon: "none"
						});
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabar/index'
							});
						}, 1000)
					}
					if (res.data.code == 400) {
						rs.Toast(res.data.msg);
					}
					if (res.data.code == 500) {
						rs.Toast('网络错误');
					}
				})
			},
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.oid = options.oid
		},
		onShow() {
			this.payOrdera()
			app.aData.show = false;
		}
	};
</script>

<style>
	.invest_record .tip {
		color: red;
		background: #f9d1cb;
		font-size: 24rpx;
		height: 40rpx;
		text-align: center;
		line-height: 40rpx;
	}

	.invest_record .info>view {
		height: 80rpx;
		background: white;
		font-size: 26rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
border-bottom: 1px solid #efefef;
		display: flex;
		justify-content: space-between;
	}

	.invest_record .notice {
		font-size: 20rpx;
		color: #808080;
		display: flex;
		padding: 20rpx 20rpx 80rpx;
	}

	.invest_record .select>view {
		width: 329rpx;
		height: 64rpx;
		color: white;
		margin: 0 auto;
		border-radius: 12rpx;
		text-align: center;
		line-height: 64rpx;
		margin-top: 20rpx;
	}

	.invest_record .select .determine {
		background: #009a44;
	}

	.invest_record .select .cancel {
		background: #808080;
	}
</style>
