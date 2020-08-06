<template>

	<view class="my_keyboard">
	
		<view class="inputval">	
		<view v-if="invest" style="padding-top:20rpx;">充值金额 (元)</view>
			<input type="text" class="getval" v-model="val" disabled="true" placeholder="请输入..." placeholder-style="font-size:28rpx;" /></view>
		<view class="keyboard">
			<view class="left">
				<view v-for="(item, index) in 9" :key="index" v-bind:id="index" @click="changeNum(index+1)" class="num">{{ index+1}}</view>
				<view @click="changeNum(0)" class="num">0</view>
				<view @click="changeNum('.')" class="num">.</view>
				<view class="shanchu num" @click="changeNum('delete')" >
					<image class="delte" src="@/static/img/shanchu.png" mode="aspectFit"></image>
				</view>
			</view>
			<view class="right">
				<view >
					<view @click="clean" class="option_button">清除</view>
					<view @click="cancel" class="option_button">取消</view>
					<view class="determine option_button" @click="toParent">确认</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import rs from '../../static/js/request.js';
	export default {
		props: {
			keyStatu: {
				type: Boolean,
				value: false
			},
			arrObj: {
				type: Object,
				value: false
			},
			invest:{
				type:Boolean,
				value:false
			}
		},
		data() {
			return {
				val: '',
				id: 0
			};
		},
		methods: {
			clean() {
				this.val = '';
			},
			cancel() {
				this.val = '';
				this.$emit('cancelKey');
			},
			changeNum(data) {
				let str = String(data);
				if (data == 'delete') {
					this.val = this.val.substring(0, this.val.length - 1);
				} else {
					if (this.val.indexOf('.') >= 0 && data == '.') {
						rs.Toast('格式不正确');
						return;
					}
					this.val += str;
				}
			},
			toParent() {
				if (this.val == '') {
					rs.Toast('还没有输入');
				} else if (this.val == 0) {
					rs.Toast( '购买数量不能为零');
				} else if (this.arrObj.is_float == 1 && !Number.isInteger(Number(this.val))) {
					rs.Toast( '购买数量不能为小数');
				} else {
					var obj = {
						arrObj: this.arrObj,
						val: parseFloat(this.val)
					};
					this.$emit('keyBoard', this.keyStatu);
					this.$emit('toParent', obj);
					this.val = '';
				}
			}
		}
	};
</script>

<style lang="scss">
	.flex {
		display: flex;
	}

	.small_font {
		font-size: 24rpx;
	}

	.inputval {
		background: white;
	}

	.smaller_font {
		font-size: 20rpx;
	}

	.height {
		height: 80rpx;
		line-height: 80rpx;
	}

	.green_b {
		background: #009a44;
	}



	.width {
		width: 100%;
	}

	.inputval {
		padding: 0 20rpx;
		font-size: 28rpx;
		border-radius: 10rpx 10rpx 0 0;

		.getval {
			height: 90rpx;
			line-height: 90rpx;
		}
	}

	.my_keyboard {
		font-size: 32rpx;

	}

	.keyboard {
		padding-bottom: 20rpx;
		background: #f7f6f6;
		z-index: 9998;
		@extend .flex;

		.left {
			width: 75%;
			@extend .flex;
			margin: 0 20rpx;
			justify-content: space-between;
			flex-wrap: wrap;

			.num{
				margin: 20rpx 0 0;

				width: 165rpx;
				text-align: center;
				@extend .height;
				border-radius: 2px;
				background: white;
			}

			.shanchu {
				@extend .flex;
				justify-content: center;
				align-items: center;

				.delte {
					width: 50%;
					height: 40rpx;
					line-height: 60rpx;
				}
			}
		}

		.right {
			width: 25%;

			.option_button{
				@extend .green_b;
				width: 80%;
				margin: 20rpx 0 0;
				width: 165rpx;
				text-align: center;
				@extend .height;
				color: white;
			}
		}
	}

	.my_keyboard .determine {
		height: 180rpx !important;
		line-height: 180rpx !important;
	}
</style>
