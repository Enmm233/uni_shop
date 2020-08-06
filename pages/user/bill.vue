<template>
	<view class="bill">
		<uni-nav-bar left-icon="arrowleft" title="账单记录" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="search_style">
			<view class="my_search_content" @click="openCalendar">
				<text class="iconfont icon-sousuo"></text>
				<text :style="{'color':(date!='请选择日期'?'black':'#d6cdd2')}">{{date}}</text>
			</view>
		</view>
		<view style="width: 100%; height: 100rpx;position: fixed;background: #f7f6f9;"></view>

		<!-- 账单信息 -->
		<view class="all_account" v-if="bitmap">
			<view class="flex_left_right single" v-for="(item, index) in list" :key="index" @click="detailPage(item.id)">
				<view class="account_info">
					<view style="color:#009a44;" v-if="item.pay_type==1">余额</view>
					<view style="color:#52ca28;" v-if="item.pay_type==2">现金</view>
					<view style="color:#02B1E4;" v-if="item.pay_type==3">转账</view>
					<view class="gray_font">{{item.date}}</view>
				</view>
				<view class="red_font">¥{{item.receivable}}</view>
			</view>
			<my-loading :loading="loading" ></my-loading>
		</view>
		<!-- 占位图 -->
		<view v-else class="bitmap">
			<image src="../../static/img/no_record.png" mode="aspectFit"></image>
		</view>
		<uni-calendar :insert="false" :lunar="true" ref="calendar" :range="true" @confirm="confirm" />
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
				date: '请选择日期',
				dateArr: '',
				bitmap: true,
				navBar: navBar,
				list: [],
				page: 1,
				loading:true,
				count:0
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			detailPage(id) {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				uni.navigateTo({
					url: 'billdetail?id='+id
				});
			},
			openCalendar() {
				this.$refs.calendar.open()
			},
			confirm(e) {
				if (!e.range.before || !e.range.after) {
					rs.Toast("请选择正确的日期区间")
				}else{
					this.date = e.range.before + ',' + e.range.after;
					this.dateArr = e.range.before + ',' + e.range.after;
					this.loading=true;
					this.list = [];
					this.moneyList()
				}
			},
			/**
			 * 账单列表
			 */
			moneyList() {
				var that = this;
				var time = JSON.stringify(that.dateArr);
				if (time == "") {
					time = '';
				} else {
					time = JSON.stringify(that.dateArr);
				}
				var date = time;
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
					date_str: date,
					num: 20,
				}
				that.list = [];
				rs.getRequests("moneyListPaginate", data, (res) => {
					if (res.data.code == 200) {
						if (res.data.data.list != '') {
							that.bitmap = true;
							for(var i=0;i<res.data.data.list.length;i++){
								that.list.push(res.data.data.list[i]);
							}
							if (that.list.length < 20) {
								this.loading = false;
							} else {
								this.loading = true;
							}
						} else {
							this.loading = '空';
							that.bitmap = false;
						}
					} else {
						this.loading = '空';
						rs.Toast(res.data.msg)
					}
				})
			},
		},
		onShow() {
			var that = this;
			if(app.isReload){that.moneyList()}
			
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			var that = this;
			var time = that.dateArr;
			if (time == "请选择日期") {
				time = '';
			} else {
				time = that.dateArr;
			}
			var page = that.page;
			var num = 20;
			var date = time;
			var timeStamp = Math.round(new Date().getTime() / 1000);
			var obj = {
				appid: appid,
				timeStamp: timeStamp,
			}
			var sign = md5.hexMD5(rs.objKeySort(obj) + app.globalData.appsecret);
			var data = {
				appid: appid,
				timeStamp: timeStamp,
				sign: sign,
				page: page + 1,
				date: date,
				num: 20
			}
			rs.getRequest("moneyListPaginate", data, (res) => {
				if (res.data.code == 200) {
					if (res.data.data.moneyList != '') {
						for(var i=0;i<res.data.data.moneyList.length;i++){
							this.list.push(res.data.data.moneyList[i]);
						}
						this.page = page + 1;
						this.loading = true;
					}else{
						this.loading = false;
					}
				}
			})

		},
	};
</script>

<style>
	.bill .all_account {
		margin-top: 100rpx;
	}

	.bill .single {
		padding: 20rpx;
		background: white;
		margin-top: 2rpx;
	}

	.bill .single image {
		width: 28rpx;
		height: 28rpx;
		font-size: 24rpx;
	}

	.bill .single .account_info {
		width: 90%;
	}

	.bill .single .account_info>view {
		height: 40rpx;
		line-height: 40rpx;
	}

	.bill .search_style {
		background: white;
		padding: 0 0 20rpx 0;
		width: 100%;
		position: fixed;
		z-index: 3;
	}

	.bill .my_search_content {
		background: #f7f6f6;
		height: 68rpx;
		margin: 0 20rpx;
		display: flex;
		border-radius: 50rpx;
		justify-content: center;
		align-items: center;
	}

	.bill .bitmap {
		text-align: center;
		margin-top: 40%;
	}

	.bill .bitmap image {
		width: 314rpx;
	}
</style>
