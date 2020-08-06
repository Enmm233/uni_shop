<template>
	<view>
		<view class="my_search" @click="searchPage">
			<!-- #ifdef APP-PLUS |H5 -->
			<view class="status_bar"><!-- 这里是状态栏 --></view>

			<!-- #endif -->
			<view class="my_search_content">
			<text class="iconfont icon-sousuo"></text>
				<text class="text">请输入商品名称</text>
			</view>
		</view>
		<!-- #ifdef APP-PLUS |H5 -->
		<view class="status_bar"><!-- 这里是状态栏 --></view>
	
		<!-- #endif -->
			<view style="height:105rpx;"></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			count:0
		};
	},
	methods:{
		searchPage(){
			this.count++;
			if (this.count != 1) return;
			setTimeout(() => {
				this.count = 0
			}, 1000)
			uni.navigateTo({
				url:"/pages/index/search"
			})
		}
	}
};
</script>

<style>
.my_search {
	background: white;
	padding: 20rpx 0;
	width: 100%;
	position: fixed;
	z-index: 3;
}
.my_search_content {
	background: #f7f6f6;
	height: 68rpx;
	margin: 0 20rpx;
	display: flex;
	border-radius: 50rpx;
	justify-content: center;
	align-items: center;
}
.my_search_content .text {
	color: #d6cdd2;
}

</style>
