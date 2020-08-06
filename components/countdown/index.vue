<template>
	<view class="my_countdown">
		<text :style="{background:bgC}" class="text">{{hour}}</text>
		<text :style="{color:lineC}" class="text"> : </text>
		<text :style="{background:bgC}" class="text">{{minus}}</text>
		<text :style="{'color':lineC}" class="text"> : </text>
		<text :style="{background:bgC}" class="text">{{second}}</text>

	</view>
</template>

<script>
	export default {
		props: {
			time: {
				type: Number,
				default: 0
			},
			bgC: {
				type: String,
				default: 'black'
			},
			lineC: {
				type: String,
				default: 'black'
			},

		},
		data() {
			return {
				totaltime: this.time,
				hour: '00',
				minus: '00',
				second: '00'
			}
		},
		methods: {
			start() {
				
				setInterval(() => {
					this.totaltime--;
					if (this.totaltime == 0) {
						// #ifdef H5
						window.location.reload();
						return;
						// #endif
							let pages = getCurrentPages();
							uni.reLaunch({
								url: '/' + pages[0].route
							})
					} else {
						this.countDown();
					}
				}, 1000)
			},
			countDown() {
				this.hour = Math.floor(this.totaltime / 3600);
				this.minus = Math.floor(this.totaltime / 60 % 60);
				this.second = Math.floor(this.totaltime % 60);
				if (this.hour < 10) {
					this.hour = '0' + this.hour;
				}
				if (this.minus < 10) {
					this.minus = '0' + this.minus;
				}
				if (this.second < 10) {
					this.second = '0' + this.second;
				}
			}
		},
		created() {
			this.start();
		}


	}
</script>

<style>
	.my_countdown {
		color: white;
		font-size: 24rpx;
	}

	.my_countdown .text {
		padding: 0 2px;
		border-radius: 2px;
	}
</style>
