<template>
	<view class="account_mange">
		<uni-nav-bar left-icon="arrowleft" right-text="添加" title="账号管理" :status-bar="navBar" fixed="true" @clickLeft="leftClick"
		 @clickRight="rightClick"></uni-nav-bar>
		<!-- 账号信息 -->
		<view class="all_account">
			<view class="flex_left_right single" v-for="(item,index) in childInfo" :key="index" @click="editPage(item)">
				<view class="account_info">
					<view>账号名称 : {{item.nickname}}</view>
					<view class="hidden">收货地址 : {{item.address}}</view>
				</view>
				<view>
					<image src="../../static/img/edit.png"></image>
				</view>
			</view>
		</view>
		<!-- 无账号 -->
		<view class="search_default" v-if="show">
			<image src="../../static/img/no_content.png" alt=""></image>
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
				show: false,
				childInfo: '',
				count:0
			}
		},
		methods: {
			leftClick() {
				uni.switchTab({
					url: "/pages/tabar/user"
				})
			},
			rightClick() {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				uni.navigateTo({
					url: "/pages/user/accountadd"
				})
			},
			editPage(data) {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				uni.navigateTo({ 
					url: "/pages/user/accountedit?select_zid=" + data.zid
				})
			},
			childInfoa() {
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
				rs.getRequests("childInfo", data, (res) => {
					if (res.data.code == 200) {
						if (res.data.data != '') {
							that.childInfo = res.data.data;
							that.show = false;
						} else {
							that.show = true;
						}
					}
				})
			},
		},
		onShow() {
			var that = this;
			that.childInfoa()
		}
	}
</script>

<style>
	.account_mange .all_account {
		margin-top: 8rpx;
	}

	.account_mange .single {
		padding: 20rpx;
		background: white;
		margin-top: 2rpx;
	}

	.account_mange .single image {
		width: 28rpx;
		height: 28rpx;
		font-size: 24rpx;
	}

	.account_mange .single .account_info {
		width: 90%;
	}

	.account_mange .single .account_info>view {
		height: 40rpx;
		line-height: 40rpx;
	}
	.search_default {
		text-align: center;
	}
	.search_default image {
		width: 400rpx;
		height: 360rpx;
		margin-top: 150rpx;
	}

</style>
