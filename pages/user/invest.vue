<template>
	<view class="invest">
		<uni-nav-bar left-icon="arrowleft" title="充值" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view style="height: 10rpx;background: #F8F6F9;"></view>
		<view class="self_money">
			<view>账户余额(元)</view>
			<view class="money">{{memberInfoData.balance}}</view>
			<view class="record" @click="recordPage">
				<text >充值记录</text>
				<uni-icons type="arrowright" size="18" color="#9e9e9e" ></uni-icons>
			</view>
		</view>
		<view class="invest_button" @click="$refs.popup.open()" v-if="is_miniBind==1">充值</view>
		<view class="invest_button"  v-else @click="userPage">充值</view>
		<uni-popup ref="popup" type="bottom">
			<my-keyboard @cancelKey="close" :arrObj="arrObj" @toParent="toParent" :invest="invest"></my-keyboard>
		</uni-popup>

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
				arrObj: {
					is_float: 0
				},
				is_miniBind: '',
				memberInfoData: '',
				code: '',
				invest:true,
				count:0
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			recordPage() {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				uni.navigateTo({
					url: './investlist'
				})
			},
			userPage(){
				// #ifdef MP-ALIPAY
				rs.Toast('请先绑定支付宝')
				// #endif
				// #ifndef MP-ALIPAY
				rs.Toast('请先绑定微信')
				// #endif
				setTimeout(()=>{
					uni.switchTab({
						url:"../tabar/user"
					})
				},1000)
				
			},
			memberInfo() {
				var that = this
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.getRequests("memberInfo", data, (res) => {
					if (res.data.code == 200) {
						that.memberInfoData = res.data.data.info;
					}
				})
			},
			//充值
			close(){
				this.$refs.popup.close();
			},
			toParent(e) {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				if(this.is_miniBind == 0){
					rs.Toast('请先绑定微信')
					setTimeout(function() {
						uni.switchTab({
							url: "/pages/tabar/user"
						})
					}, 1000);
					return;
				}
				var that = this;
				var price = e.val;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					price: price,
					timeStamp: timeStamp,
				}
				// #ifdef H5
				     let type="mp";
				// #endif
				// #ifdef APP-PLUS
				     let type="mp";
				// #endif
				// #ifdef MP-WEIXIN |MP-ALIPAY
				     let type='mini';
				// #endif
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					price: price,
					type: type,
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.postRequests("createRecharge", data, (res) => {
					if (res.data.code == 200) {
						uni.navigateTo({
							url: './investrecord?orderId=' + res.data.data.orderId,
						})
					}else if (res.data.code == 404) {
						rs.Toast('未找到用户')
					}else if (res.data.code == 500) {
						rs.Toast('充值失败')
					}else{
						rs.Toast(res.data.msg)
					}
					this.close();
				})
			},
			
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			var that = this;
			that.is_miniBind = uni.getStorageSync("is_miniBind"),
			that.memberInfo()
		},
	};
</script>

<style>
	page {
		background: white;
	}

	.invest .money {
		font-size: 48rpx;
		margin: 25rpx 0;
	}

	.invest .self_money {
		margin: 90rpx 0 270rpx;
		text-align: center;
	}

	.invest .self_money .record {
		color: #9e9e9e;
		display: inline-block;
	}

	.invest .invest_button {
		background-color: #009a44;
		width: 240rpx;
		height: 64rpx;
		color: white;
		margin: 0 auto;
		line-height: 64rpx;
		text-align: center;
		border-radius: 4rpx;
	}
</style>
