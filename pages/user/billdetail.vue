<template>
	<view class="bill_detail">
		<uni-nav-bar left-icon="arrowleft" title="账单详情" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<!-- 转账方式 -->
		<view class="method_way">
			<view style="color:#009a44;" v-if="moneyListInfo.pay_type==1">余额</view>
			<view style="color:#52ca28;" v-if="moneyListInfo.pay_type==2">现金</view>
			<view style="color:#02B1E4;" v-if="moneyListInfo.pay_type==3">转账</view>
			<view class="twelve gray_font">账单编号 : {{moneyListInfo.moneySn}}</view>
			<view class="twelve gray_font">账单创建时间 : {{moneyListInfo.date}}</view>
		</view>
		<!-- 订单数量 -->
		<view class="order_num">
			<view>订单数量 ({{num}})</view>
			<view v-for="(item, index) in moneyListInfo.list" :key="index" class="twelve flex_left_right">
				<text>订单编号 : {{item.order_sn}}</text>
				<text class="red_font">¥{{item.totalPrice}}</text>
			</view>
			<view class="twelve text_right">总额 : <text class="red_font">¥{{moneyListInfo.total}}</text></view>
		</view>
		<!-- 收款金额 -->
		<view class="pay_money twelve">
			<view class="flex_left_right">
				<text>实收 </text>
				<text class="red_font">¥{{moneyListInfo.net_receipts}}</text>
			</view>
			<view class="flex_left_right">
				<text>差额 </text>
				<text class="red_font">¥{{moneyListInfo.difference}}</text>
			</view>
			<view class="flex_left_right">
				<text>应收 </text>
				<text class="red_font">¥{{moneyListInfo.receivable}}</text>
			</view>
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
				moneyListInfo: '',
				num:''
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			moneyListInfoa() {
				var that = this;
				var id = that.id;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					id: id,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					id: id,
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.getRequests("moneyListInfo", data, (res) => {
					if (res.data.code == 200) {
						that.moneyListInfo = res.data.data;
						that.num=res.data.data.list.length;
					}
				})
			}
		},
		onLoad(options) {
			this.id = options.id;
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			getApp().globalData.isReload=false;
			var that = this;
			that.moneyListInfoa();
		},
	};
</script>

<style lang="less">
	.bill_detail {

		.method_way,
		.order_num,
		.pay_money {
			background: white;
			padding: 15rpx 20rpx;
			margin-top: 10rpx;
		}
	}

	.bill_detail {

		.method_way>view,
		.order_num>view,
		.pay_money>view {
			margin: 10rpx 0;
		}
	}

	.bill_detail .way {
		font-size: 32rpx;
		margin-bottom: 10rpx;
	}

	.bill_detail .text_right {
		text-align: right;
	}
</style>
