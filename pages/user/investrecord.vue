<template>
	<view class="invest_record">
		<uni-nav-bar left-icon="arrowleft" title="充值信息" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		
		<!-- #ifdef MP-ALIPAY -->
		<view class="tip">如出现下单端账号与支付账号不一样，请到个人中心更改绑定支付宝</view>
		<!-- #endif -->
		
		<!-- #ifndef MP-ALIPAY -->
		<view class="tip">如出现下单端账号与支付账号不一样，请到个人中心更改绑定微信</view>
		<!-- #endif -->
		<view class="info">
			<view>
				<text>充值编号</text>
				<text class="gray_font">{{placeRecharge.order_sn}}</text>
			</view>
			<view>
				<text>充值金额</text>
				<text class="red_font">￥{{placeRecharge.count_price}}</text>
			</view>
		</view>
		<view class="notice">
			<view>注：</view>
			<view>平台不会以订单异常，系统升级等理由要求您点击任何链接进行退款操作，请提高警惕谨防受骗！</view>
		</view>
		<view class="select">
			<view class="determine" @click="querenchongzhi">确认充值</view>
			<view class="cancel" @click='order'>返回首页</view>
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
				is_bind: '',
				orderId: '',
				placeRecharge: '',
				count: 0
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			order() {
				this.leftClick()
			},
			/**
			 * 充值信息
			 */
			placeRechargea() {
				var that = this
				var id = that.orderId;
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
					id: id,
					type: type,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					id: id,
					type: type,
					// #ifdef MP-ALIPAY
					pay: 'alipay',
					// #endif
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.postRequests("placeRecharge", data, (res) => {
					if (res.data.code == 200) {
						that.placeRecharge = res.data.data
					} else if (res.data.code == 406) {
						rs.Toast('请先绑定微信')
					} else {
						rs.Toast(res.data.msg)
					}
				})
			},
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
						"appId": this.placeRecharge.wxParams.appId, //公众号名称，由商户传入 
						"timeStamp": this.placeRecharge.wxParams.timeStamp, //时间戳，自1970年以来的秒数 
						"nonceStr": this.placeRecharge.wxParams.nonceStr, //随机串 
						"package": this.placeRecharge.wxParams.package,
						"signType": this.placeRecharge.wxParams.signType, //微信签名方式： 
						"paySign": this.placeRecharge.wxParams.paySign //微信签名 
					},
					function(res) {
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							rs.Toast('充值成功')
							setTimeout(function() {
								uni.switchTab({
									url: "/pages/tabar/user"
								})
							}, 1000);
						}
					}
				);

			},
			// #endif
			// #ifdef APP-PLUS
			querenchongzhi() {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				var that = this;
				uni.getProvider({
					service: 'payment',
					success: function(res) {
						if (~res.provider.indexOf('wxpay')) {
							console.log(that.placeRecharge.wxParams)
							// var str = JSON.stringify(that.placeRecharge)
							// console.log(typeof that.placeRecharge)
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: that.placeRecharge.wxParams, //微信、支付宝订单数据
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									rs.Toast('充值成功')
									setTimeout(function() {
										uni.switchTab({
											url: "/pages/tabar/user"
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
			// #ifdef MP-WEIXIN
			querenchongzhi() {
				console.log('微信支付')
				var that = this
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: that.placeRecharge.wxParams, //微信、支付宝订单数据
					timeStamp: that.placeRecharge.wxParams.timeStamp,
					nonceStr: that.placeRecharge.wxParams.nonceStr,
					package: that.placeRecharge.wxParams.package,
					signType: that.placeRecharge.wxParams.signType,
					paySign: that.placeRecharge.wxParams.paySign,
					success: function(res) {
						rs.Toast('充值成功')
						setTimeout(function() {
							uni.switchTab({
								url: "/pages/tabar/user"
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
				var that = this;
				uni.requestPayment({
					provider: 'alipay',
					orderInfo: that.placeRecharge.alipayParams.trade_no, //微信、支付宝订单数据	
					success: function(res) {
						console.log(res)

						if (res.resultCode == 9000) {
							rs.Toast('充值成功');
							setTimeout(function() {
								uni.switchTab({
									url: "/pages/tabar/user"
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
		},
		onLoad(options) {
			this.orderId = options.orderId
		},
		onShow() {
			var that = this;
			that.placeRechargea();
		}
	};
</script>

<style>
	page {
		background: #f8f6f9;
	}

	.invest_record .tip {
		color: red;
		background: #f9d1cb;
		font-size: 24rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
	}

	.invest_record .info>view {
		height: 80rpx;
		background: white;
		font-size: 26rpx;
		line-height: 80rpx;
		padding: 0 20rpx;

		display: flex;
		justify-content: space-between;
	}

	.invest_record .info>view:first-child {
		border-bottom: 1px solid #efefef;
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
