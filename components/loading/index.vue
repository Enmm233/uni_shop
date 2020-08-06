<template>
	<view class="my_loading">
		
		<view class="loading" v-if="loading">
			
			<image class="load_img" src="../../static/img/loading.gif" mode="aspectFit"></image>
			<text>正在加载中...</text>
		</view>
	
		<view v-else>已经到底呢!</view>
	</view>
</template>

<script>
	export default{
		props:['loading']
	}
</script>

<style>
	.loading {
		display: flex;align-items: center;justify-content: center;
	}
	.loading .load_img{width:25rpx;height:25rpx;margin-right: 10rpx;}

	
	.my_loading{color: #808080;font-size: 24rpx!important;text-align: center;height:80rpx;line-height: 80rpx;background:#F8F6F9 ;}
</style>
