<template>
	<view class="invest_list">
		<uni-nav-bar left-icon="arrowleft" title="充值记录" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<!-- 账号信息 -->
		<view class="all_account" v-if="bitmap">
			<view class="flex_left_right single" v-for="(item,index) in rechargeList" :key="index">
				<view class="account_info">

					<view>
						<text v-if="item.consume == 1&&item.type==1">订单消费：{{item.order_sn}}</text>
						<text class="bottom " v-if="item.consume == 1&&item.type==3">后台提现：{{item.order_sn}}</text>
						<text class="bottom " v-if="item.consume == 0&&item.type==2">前台充值：{{item.order_sn}}</text>
						<text class="bottom " v-if="item.consume == 0&&item.type==1">后台充值：{{item.order_sn}}</text>
					</view>
					<view class="gray_font">
						<text v-if="item.consume == 1&&item.type==1"> 消费时间：{{item.date}}</text>
						<text class="gray" v-if="item.consume==0">充值时间：{{item.date}}</text>
						<text class="gray" v-if="item.consume == 1&&item.type==3">提现时间：{{item.date}}</text>
					</view>
				</view>
				<view v-if="item.consume == 1">-{{item.price}}</view>
				<view v-if="item.consume == 0" class="red_font">+{{item.price}}</view>
			</view>
			<my-loading :loading="loading"></my-loading>
		</view>
		<view v-else class="bitmap">
			<image src="../../static/img/no_record.png" mode="aspectFit"></image>
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
				bitmap: true,
				page: 1,
				loading: true,
				rechargeList: [],
			}
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			/**
			 * 账单列表
			 */
			rechargeLista() {
				var that = this;
				var page = 1;
				var num = 15;
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
					page: 1,
					num: 15
				}
				rs.getRequests("rechargeList", data, (res) => {
					if (res.data.code == 200) {
						if (res.data.data != '') {
							that.rechargeList = res.data.data;
							that.bitmap = true;
							if (res.data.data.length <= 10) {
								that.loading = false;
							}
						} else {
							that.loading = true;
							that.bitmap = false;
						}
					}
				})
			},
		},
		onShow() {
			var that = this;
			that.rechargeLista()
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			var that = this;
			var page = that.page;
			var num = 15;
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
				page: page + 1,
				num: 15
			}
			rs.getRequests("rechargeList", data, (res) => {
				if (res.data.code == 200) {
					if (res.data.data != '') {
						that.rechargeList.push(...res.data.data);
						that.loading = true;
						that.bitmap =true;
						that.page = page + 1;
					} else {
						that.loading = false;
					}
				}
			})

		},
	}
</script>

<style>
	.invest_list .all_account {
		margin-top: 8rpx;
	}

	.invest_list .single {
		padding: 20rpx;
		background: white;
		margin-top: 2rpx;
	}

	.invest_list .single image {
		width: 28rpx;
		height: 28rpx;
		font-size: 24rpx;
	}

	.invest_list .single .account_info {
		width: 90%;
	}

	.invest_list .single .account_info>view {
		height: 40rpx;
		line-height: 40rpx;
	}

	.bitmap {
		text-align: center;
		margin-top: 20%;
	}

	.bitmap image {
		width: 50%;
	}
</style>
