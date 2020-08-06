<template>
	<view class="my_addcart">
		<view class="top">
			<view class="info">
				<view class="detail">
					<view>
						<image :src="config.logo" mode="aspectFit" class="shuiyin position_a" v-if="config.logo&&config.shuiyin==1"></image>
						<image class="good_img" :src="cartware.img==''?imgRemote+config.item_default:cartware.img" mode="aspectFit"></image>
					</view>
					<view class="cart_ware_info">
						<view>
							<view>{{cartware.title}}</view>
							<view class="hidden describe" v-if="cartware.describe">{{cartware.describe}}</view>
						</view>
						<view>
							<view><text class="red_tag" v-for="(item,index) in cartware.label" :key="index">{{item}}</text></view>
							<block v-if="token">
								<block v-if="config.is_look==1">
									<block  v-if="cartware.attr.length">
										<block v-if="cartware.attr[kind].is_activity==1">
											<view>
											<text class="red_font">￥{{cartware.attr[kind].activity_price}}/{{cartware.attr[kind].unit}}</text>	
											<text class="line_through ten">￥{{cartware.attr[kind].attr_price}}</text>
											</view>
										</block>
										<block v-else>	
										<view class="red_font" v-if="cartware.attr[kind].market_price==1">时价</view>
										<view class="red_font" v-else>￥{{cartware.attr[kind].attr_price}}/{{cartware.attr[kind].unit}}</view>
										</block>
									</block>
								
									<block v-else>
										<block v-if="cartware.is_activity==1">
											<view>
												<text class="red_font">￥{{cartware.activity_price}}/{{cartware.unit}}</text>
												<text class="line_through ten">￥{{cartware.price}}/{{cartware.unit}}</text>
											</view>
										</block>
										<block v-else>
										
											<view class="red_font" v-if="cartware.market_price==1">
											时价
											</view>
											<view class="red_font" v-else>
												￥{{cartware.price}}/{{cartware.unit}}
											</view>
										</block>
									</block>

								</block>
								<block v-else>
									<view class="red_font">￥***</view>
								</block>
							</block>
							<block v-else>
								<view v-if="cartware.attr.length" class="red_font">
									<text v-if="cartware.attr[kind].market_price==1">时价</text>
									<text v-else>￥{{cartware.attr[kind].attr_price}}/{{cartware.attr[kind].unit}}</text>
									</view>
								<view v-else class="red_font">
									<text v-if="cartware.market_price==1">时价</text>
									<text v-else>￥{{cartware.price}}/{{cartware.unit}}</text>
									
								</view>
							</block>
						</view>


					</view>
				</view>

				<text class="iconfont icon-X" @click="onClose"></text>
			</view>
			<view class="spec" v-if="cartware.attr.length">
				<view class="title">选择规格</view>
				<view class="select">
					<view class="label" v-for="(item, index) in cartware.attr" :key="index" :class="index == kind? 'active' : ''"
					 @click="selectSpec(index)">{{item.attr_title}}</view>

				</view>
			</view>
			<view class="buy_num">
				<view>购买数量</view>
				<view>
					<my-stepper :val="value" @showKey="showKey" @minus="minus" @plus="plus" min=1></my-stepper>
				</view>
			</view>
		</view>
		<view class="determine" @click="determine">确定</view>
		<my-keyboard v-if="isTop" @cancelKey="isTop=false" @toParent="toParent" :arrObj="arrObj"></my-keyboard>
	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	const app = getApp().globalData;
	const {
		appid,
		appsecret,
		imgRemote
	} = app;
	export default {
		props: ['cartware', 'config'],
		data() {
			return {
				token: uni.getStorageSync('cdj_token'),
				imgRemote: imgRemote,
				kind: 0,
				value: 1,
				isTop: false,
				arrObj: {}
			}
		},
		methods: {
			selectSpec(e) {
				this.kind = e;
			},
			onClose() {
				this.kind=0;
				this.value=1;
				this.isTop=false;
				this.$emit('onClose')
			},
			showKey() {
				this.isTop = true;
				this.arrObj = this.cartware;
			},
			plus() {
				this.value++;
			},
			minus() {
				this.value--;
				if (this.value <= 0) {
					this.value = 1;
				}
			},
			toParent(e) {	
				if(this.cartware.attr.length){
					if (this.cartware.attr[this.kind].is_float == 1 && !Number.isInteger(Number(e.val))) {
						rs.Toast( '购买数量不能为小数');
						return;
					}
				}
				
				this.isTop = false;
				this.value = e.val;
			},
			determine() {
				let info = this.cartware;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				
				let newobj = {};
				let itemId, attrId;
				if (info.attr.length == 0) {
					itemId = info.id;
					attrId = 0;
				} else {
					itemId = info.attr[this.kind].item_id;
					attrId = info.attr[this.kind].id
				}
				newobj = Object.assign({
						item_id: itemId,
						attr_id: attrId,
						item_num: this.value
					},
					obj
				);
				let sign = md5.hexMD5(rs.objKeySort(newobj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					newobj
				);

				rs.postRequests('firstChangeNum', params, res => {
					if (res.data.code == 200) {
						rs.Toast('成功加入购物车');
						let pages = getCurrentPages();

						if (pages[0].route == 'pages/tabar/shopcart') {
							// #ifdef APP-PLUS |MP-WEIXIN |MP-ALIPAY
							uni.reLaunch({
								url: '/pages/tabar/shopcart'
							})
							// #endif

							// #ifdef H5
						     window.location.reload();
							// #endif
						}
					} else if (res.data.code == 407 || res.data.code == 406) {
						rs.Toast('购买数量不能超过活动数量')
					} else {
						rs.Toast(res.data.msg)
					}
				});
				this.onClose();
			}
		}
	};
</script>
<style>
	.my_addcart .top {
		padding: 20rpx 20rpx 0;
	}

	.my_addcart {
		background: white;
		border-radius: 10rpx 10rpx 0 0;
	}

	.my_addcart .good_img {
		width: 200rpx;
		height: 200rpx;
	}

	.my_addcart .info,
	.my_addcart .detail {
		display: flex;
	}

	.is_top {
		margin-bottom: 540rpx;
	}

	.my_addcart .info,
	.my_addcart .spec {
		border-bottom: 1px solid #f7f6f6;
	}

	.my_addcart .describe {

		color: #808080;
	}

	.my_addcart .detail {}

	.my_addcart .info {
		justify-content: space-between;
	}

	.my_addcart .title {
		font-size: 26rpx;
		font-weight: 600;
		height: 80rpx;
		line-height: 80rpx;
	}

	.my_addcart .select {
		display: flex;
		flex-wrap: wrap;
	}

	.my_addcart .label {
		border-radius: 10rpx;
		padding: 0 8rpx;
		color: #009a44;
		border: 1px solid #009a44;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
	}

	.my_addcart .select .active {
		background: #009a44;
		color: white;
	}

	.my_addcart .buy_num {
		display: flex;
		justify-content: space-between;
		height: 80rpx;
		align-items: center;
	}

	.my_addcart .determine {
		background: #009a44;
		color: white;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 36rpx;
	}

	.my_addcart .cart_ware_info {
		width: 450rpx;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}
	.my_addcart .position_a{position:absolute;}
</style>
