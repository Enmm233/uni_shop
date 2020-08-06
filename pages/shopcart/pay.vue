<template>
	<view class="invest_record">
		<uni-nav-bar left-icon="arrowleft" title="马上支付" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		
		<!-- #ifdef MP-ALIPAY -->
		<view class="tip">如出现下单端账号与支付账号不一样，请到个人中心更改绑定支付宝</view>
		<!-- #endif -->
		
		<!-- #ifndef MP-ALIPAY -->
		<view class="tip">如出现下单端账号与支付账号不一样，请到个人中心更改绑定微信</view>
		<!-- #endif -->
		<view class="info">
			<view>
				<text>订单编号</text>
				<text>{{list.order_sn}}</text>
			</view>
			<view>
				<text>配送时间</text>
				<text>{{list.send_time}}</text>
			</view>
			<view>
				<text>订单金额</text>
				<text>￥{{list.total_fee}}</text>
			</view>
			<view>
				<text>现金券抵扣</text>
				<text>￥{{list.coupons_price}}</text>
			</view>
			<view>
				<text>我的余额</text>
				<text class="red_font">￥{{list.myBalance}}</text>
			</view>
			<view>
				<text>余额支付</text>
				<text class="red_font">￥{{list.payBalance}}</text>
			</view>
			<view>
				<!-- #ifdef MP-ALIPAY -->
					<text>支付宝支付</text>
				<!-- #endif -->
				<!-- #ifndef MP-ALIPAY -->
				<text>微信支付</text>
				<!-- #endif -->
				
				<text class="red_font">￥{{list.payWx}}</text>
			</view>
		</view>
		<view class="notice">
			<view>注：</view>
			<view>平台不会以订单异常，系统升级等理由要求您点击任何链接进行退款操作，请提高警惕谨防受骗！</view>
		</view>
		<view class="select">
			<view class="determine" @click="payOrder" v-if="is_miniBind==1">确认支付</view>
			<view class="determine" @click="bindWechat" v-else>确认支付</view>
			<view class="cancel" @click="cancelPay">取消支付</view>
		</view>
	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	let {
		log
	} = console;
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
				id: '',
				is_miniBind: uni.getStorageSync('is_miniBind'),
				list: [],
				isDisable: true,
				count: 0
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			cancelPay() {
				uni.switchTab({
					url: '/pages/tabar/shopcart'
				})
			},
			bindWechat() {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				rs.Toast('该账号未绑定微信，请先绑定再来支付');
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/tabar/user'
					})
				}, 1000)

			},
			// #ifdef H5
			payOrder() {
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
				if (!this.isDisable) {
					return
				}
				let timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					timeStamp: timeStamp,
					oid: this.id,
					type: 'mp'
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj)
				rs.postRequests('payTemOrder', params, (res) => {
					let {
						data
					} = res;

					if (data.code == 406) {
						rs.Toast('请您先绑定微信')
						setTimeout(() => {
							this.isDisable = true;
							uni.switchTab({
								url: '../tabar/user'
							})
						}, 1000)
						return false
					} else if (data.code == 200) {
						this.isDisable = false;
						if (data.data.payType == 1) {
							var that = this;
							rs.Toast('支付成功')
							setTimeout(() => {
								this.isDisable = true;
								uni.switchTab({
									url: '../tabar/order'
								})
							}, 1000)
						} else if (data.data.payType == 2) {
							var thta = this;
							var wxOrder = data.data.wxParams;

							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": wxOrder.appId, //公众号名称，由商户传入
									"timeStamp": wxOrder.timeStamp, //时间戳，自1970年以来的秒数
									"nonceStr": wxOrder.nonceStr, //随机串
									"package": wxOrder.package,
									"signType": wxOrder.signType, //微信签名方式：
									"paySign": wxOrder.paySign //微信签名
								},
								function(res) {
									if (res.err_msg == "get_brand_wcpay_request:ok") {
										rs.Toast('支付成功')
										setTimeout(() => {
											uni.switchTab({
												url: '../tabar/order'
											})
										}, 1000)
									}
								}
							);
						}
					} else {
						this.isDisable = true;
						rs.Toast(data.msg)
					}
				});

			},
			// #endif
			// #ifdef APP-PLUS
			payOrder() {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				let {
					id
				} = this;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					oid: id,
					type: 'app'
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj)
				rs.postRequests("payTemOrder", params, (res) => {
					let {
						data
					} = res;

					if (data.code == 200) {

						if (data.data.payType == 1) {
							rs.Toast('支付成功');
							uni.switchTab({
								url: '/pages/tabar/order',
							})
						}

						if (res.data.data.payType == 2) {
							let {
								wxParams
							} = res.data.data;
							log(res.data)
							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: wxParams, //微信、支付宝订单数据
								success: function(res) {
									let resJSON=JSON.stringify(res);
									rs.Toast('支付成功');
									
									uni.switchTab({
										url: '/pages/tabbar/order',
									})
								},
								fail: function(err) {
									console.log(err)
									rs.Toast("充值失败");
								}
							});

						}
					}
				})
			},

			// #endif
			// #ifdef MP-WEIXIN
			payOrder() {
				console.log(132)
				let {
					id
				} = this;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					oid: id,
					type: 'mini'
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj)
				rs.postRequests("payTemOrder", params, (res) => {
					let {
						data
					} = res;

					if (data.code == 200) {
						if (data.data.payType == 1) {
							rs.Toast('支付成功');
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabar/order',
								})
							}, 1000)

						}
						log(res.data.data.wxParams);
						if (res.data.data.payType == 2) {
							let {
								wxParams
							} = res.data.data;

							uni.requestPayment({
								provider: 'wxpay',
								orderInfo: wxParams, //微信、支付宝订单数据
								timeStamp: wxParams.timeStamp,
								nonceStr: wxParams.nonceStr,
								package: wxParams.package,
								signType: wxParams.signType,
								paySign: wxParams.paySign,
								success: function(res) {
									console.log('success:' + JSON.stringify(res));
									rs.Toast('支付成功');
									setTimeout(() => {
										uni.switchTab({
											url: '/pages/tabar/order',
										})
									}, 1000)
								},
								fail: function(err) {
									console.log(err)
									rs.Toast("充值失败");
								}
							});

						}
					} else {
						rs.Toast(data.msg)
					}
				})
			},
			// #endif
			// #ifdef MP-ALIPAY
			payOrder() {
				console.log(132)
				let {
					id
				} = this;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					oid: id,
					type: 'mini'
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
					pay: 'alipay',
				}, obj)
				rs.postRequests("payTemOrder", params, (res) => {
					let {
						data
					} = res;
			
					if (data.code == 200) {
						if (data.data.payType == 1) {
							rs.Toast('支付成功');
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/tabar/order',
								})
							}, 1000)
			
						}
						log(res.data.data.wxParams);
						if (res.data.data.payType == 2) {
							let {
								alipayParams
							} = res.data.data;
							uni.requestPayment({
								provider: 'alipay',
								orderInfo: alipayParams.trade_no, //微信、支付宝订单数据
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
							});
			
						}
					} else {
						rs.Toast(data.msg)
					}
				})
			},
			
			// #endif
			// 临时订单信息
			temOrder() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					id: this.id
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj)
				rs.getRequests("temOrderMsg", params, (res) => {
					let {
						data
					} = res;
					if (data.code == 200) {
						this.list = data.data
					} else {
						rs.Toast(data.msg);
					}

				})
			}
		},
		onShow() {
			this.temOrder();
		},
		onLoad(option) {
			this.id = option.id;
		}
	};
</script>

<style>
	.invest_record .tip {
		color: red;
		background: #f9d1cb;
		font-size: 24rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
	}

	.invest_record .info>view {
		padding: 0 20rpx;
		height: 80rpx;
		background: white;
		font-size: 26rpx;
		line-height: 80rpx;
		padding: 0 20rpx;

		display: flex;
		justify-content: space-between;
	}

	.invest_record .info>view:nth-last-child(n+2) {
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
