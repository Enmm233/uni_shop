<template>
	<view class="select_way">
		<uni-nav-bar left-text="关闭" color="#009A44" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="select_option">
			<view class="new_count" @click="pageUrl('register')">
				创建新账号
			</view>
			<view class="bind_count" @click="pageUrl('bind')">
				绑定已有账号
			</view>
		</view>
	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	const app = getApp().globalData;
	const {
		navBar,
		appid,
		appsecret
	} = app;
	export default {
		data() {
			return {
				navBar: navBar,
				identifying: '',
				count:0
			}
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			pageUrl(url) {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0;
				}, 1000)
				var that = this;
				var data = that.identifying;
				uni.navigateTo({
					url: url+'?identifying=' + data
				});
			}
		},
		onLoad(options) {
			var that = this;
			that.identifying = options.identifying
		}
	}
</script>

<style>
	page {
		background: white;
	}

	.select_way .select_option {
		width: 420rpx;
		margin: 0 auto;
		margin-top: 400rpx;
	}

	.select_way .select_option>view {
		height: 65rpx;
		text-align: center;
		line-height: 65rpx;
		font-size: 32rpx;
		border-radius: 8rpx;
	}

	.select_way .new_count {
		background: #009A44;
		color: white;
		margin-bottom: 40rpx;
		border: 1px solid #009A44
	}

	.select_way .bind_count {
		border: 1px solid #009A44;
		color: #009A44;
	}
	.select_way .uni-navbar{margin:0 20rpx!important;}
</style>
