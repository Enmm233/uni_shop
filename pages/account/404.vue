<template>
	<view>
		<view class="not_found">
			<image src="../../static/img/404.png" mode="aspectFit"></image>
			<txt>页面走丢了，试着刷新一下</txt>
			<view class="btn" @click="toPage">刷新</view>
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
	} = app;
	export default {
		data() {
			return {
			}
		},
		methods: {
			toPage() {
				uni.navigateBack({
					delta:1
				})
			},
			
		},
		onShow() {
		
		},
	
	}
</script>

<style>
	page{
		background: #ffffff;
	}
	.not_found{
		margin-top: 45%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.not_found image{
		width: 50%;	
		height: 280rpx;
		margin-bottom: 40rpx;
	}
	.not_found txt{
		color: #9F9F9F;
		font-size: 29rpx;
		margin-bottom: 50rpx;
	}
	.not_found .btn{
		color: #4D4D4D;
		font-size: 30rpx;
		padding: 5rpx 35rpx;
		border: 1rpx solid #4D4D4D;
		border-radius: 50rpx;
	}
	
</style>
