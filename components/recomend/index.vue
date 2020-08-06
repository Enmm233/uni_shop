<template>

	<view class="recomend_single">
		<view @click="detail">
			<view>
				<image :src="config.logo" mode="aspectFit" class="shuiyin" v-if="config.logo&&config.shuiyin==1"></image>
				<image class="photo" :src="ware.img==''?imgRemote+config.item_default:ware.img" mode="aspectFit"></image>
			</view>

			<view>
				<view>{{ware.title}}</view>
				<view class="gray_font hidden" style="width: 100%;" v-if="ware.describe">{{ware.describe}}</view>
			</view>
		</view>
		<view>

			<view class="price">
				<view style="width:90%;">
					<view>
						<text class="red_tag" v-for="(item,index) in ware.label" :key="index">{{item}}</text>
					</view>

					<block v-if="token">
						<block v-if="config.is_look==1">
							<block v-if="ware.attr.length">
								<view class="hidden">
									<text class="red_font">￥{{ware.area_price}}/{{ware.unit}}</text>
									<text class="gray_font">(多规格)</text>
								</view>
							</block>
							<block v-else>

								<view class="red_font" v-if="ware.market_price==1">时价</view>

								<view class="red_font" v-else>￥{{ware.price}}/{{ware.unit}}</view>
							</block>
						</block>
						<block v-else>
							<view class="red_font">
								￥***
							</view>
						</block>
					</block>
					<block v-else>
						<view v-if="ware.attr.length" class="hidden">
							<text class="red_font">￥{{ware.area_price}}/{{ware.unit}}</text>
							<text class="gray_font">(多规格)</text>

						</view>
						<view v-else class="red_font">
							<text v-if="ware.market_price==1">时价</text>
							<text v-else>	￥{{ware.price}}/{{ware.unit}}</text>
						
						</view>
					</block>

				</view>
				<view class="addcart" @click="showCart">
					<image src="../../static/img/addcart.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	const {
		imgRemote
	} = app;
	export default {
		props: ['ware', 'config'],
		data() {
			return {
				imgRemote: imgRemote,
				token: uni.getStorageSync('cdj_token'),
				count:0
			}
		},
		methods: {
			showCart() {
				this.$emit('showCart')
			},
			detail() {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				if (this.config.is_detail == 1) {
					uni.navigateTo({
						url: `/pages/index/shopdetail?id=${this.ware.id}`
					})
				}
			}
		}
	}
</script>

<style>
	.recomend_single {
		box-shadow: 1px 1px 6px #d3d3d3;
		background: #fff;
		height: 400rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-radius: 6px;
		padding: 10rpx;
		width: 320rpx;
	}

	.recomend_single .photo {
		width: 100%;
		height: 200rpx;
	}

	.recomend_single .price {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
