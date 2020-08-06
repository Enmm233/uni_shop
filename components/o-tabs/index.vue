<template>
	<div class="o_tabs">
		<div class="tabs_box">
			<div class="tabs" v-for="(item,index) in tabList" @click="tabClick(index)">
				<div class="txt" :class="{ active: isShow == index }">{{item.name}}</div>
				<div class="xian" v-if="isShow == index"></div>
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		name: 'o-tabs',
		props: {
			tabList: {
				type: Array,
				value: false
			},
			isShow: {
				type: Number,
				value: false
			}
		},
		data() {
			return {
			}
		},
		methods: {
			tabClick(index){
				this.$emit('tab', index);
			}

		},
		created() {


		},
		mounted() {

		}
	};
</script>

<style>
	.o_tabs {
		width: 100%;
		height: 75rpx;
	}

	.o_tabs .tabs_box {
		width: 100%;
		font-size: 28rpx;
		height: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.o_tabs .tabs_box .tabs {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.o_tabs .tabs_box .tabs .xian {
		position: absolute;
		height: 6rpx;
		border-radius: 6rpx;
		background: #21a75f;
		width: 40rpx;
		margin-top: 35rpx;
	}
	.active{
		color: #21a75f;
	}
</style>

<!-- 	<view class="o_tabs">
		<view class="tabs_box">
			<view class="tabs" v-for="item in tabList">{{item.name}}</view>
			<view class="xian"></view>
		</view>
		
	</view> -->
