<template>
	<view class="flash_sale">
		<uni-nav-bar left-icon="arrowleft" title="限时抢购" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="time_stage">
			<image src="../../static/img/secondsha.png"></image>
			<view class="single_stage">
				<view v-for="(item, index) in activeList" :key="index" :class="index == kind ? 'active_back' : ''" @click="selectStage(index)">
					<view class="twelve">
						<text v-if="item.status== 1">距离结束</text>
						<text v-else>即将开始</text>
					</view>
					<view v-if="item.status == 1">
						<my-countdown :time="item.timeRemain" lineC="white" bgC="none" style="line-height: 21px;"></my-countdown>
						<!-- <uni-countdown :hour="item.timeRemain / 3600" :minute="minute" :second="second" :show-day="false" 
						 background-color="none" splitor-color="white"></uni-countdown>-->
					</view>
					<view v-else class="ten" style="hieght:42rpx;line-height: 42rpx;">{{item.day+' '+item.hour}}</view>
				</view>
			</view>
			<view class="square">

				<view class="" v-for="(item,index) in activeList" :key="item.id">
					<view :class="index==kind?'show_square':''"></view>
				</view>
			</view>
		</view>

		<view class="all_things">
			<view v-for="(item, index) in list" :key="index" class="flex single_good">
				<view class="photo" @click="detailPage(item.item_id)">

					<image :src="config.logo" mode="aspectFit" class="shuiyin" v-if="config.logo&&config.shuiyin==1"></image>
					<view style="width: 100%;display: flex;align-items: center;justify-content: center;">
						<block v-if="item.num_limit>0"><view class="show_text" v-if="item.activity_inventory <= item.cart_num">抢光了</view></block>
						<block v-else><view class="show_text" v-if="item.activity_num <= item.cart_num">抢光了</view></block>
					
						
						<image class="good_img" :src="item.img==''?imgRemote+config.item_default:item.img" mode="aspectFit"></image>
					</view>


				</view>
				<view class="good_info" @click="detailPage(item.item_id)">
					<view>{{item.item_title}}</view>
					<view class="gray_font twelve">{{item.attr_title}}</view>
					<view>
						<view class="align_center" style="flex-wrap: wrap;">
							<text class="red_tag" v-for="(label,index) in item.label" :key="label">{{label}}</text>
							<view class="distance align_center">
								<text class="red_tag">省</text>
								<text class="red_font">{{item.difference}}元</text>
							</view>
							<text class="gray_font" v-if="item.activity_num <= item.cart_num">剩余:0个</text>
							<text class="gray_font" v-if="item.activity_num > item.cart_num">剩余:{{ item.activity_num - item.cart_num }}个</text>
						</view>
						<view v-if="token">
							<view v-if="config.is_look==1">
								<text class="red_font">¥{{item.activity_price}}/{{item.unit}}</text>
								<text class="line_through ten">￥{{item.price}}</text>
							</view>
							<view v-else class="red_font">￥*** </view>
						</view>
						<view v-else>
							<text class="red_font">￥{{item.price}}/{{item.unit}}</text>
						</view>
					</view>
					<view class="num_limit" v-if="item.num_limit!=0&&item.activity_num<=item.cart_num">
						<text>限购{{item.num_limit}}已恢复原价</text></view>
				</view>
				<view class="good_num">
					<block v-if="activeList[kind].status==1">
						<block v-if="item.num_limit>0">
							<view class="buy_num" v-if="item.activity_inventory> item.cart_num">
								<image v-if="item.cart_num == 0" src="../../static/img/plus.png" class="plus" @click="plusSing(item,index)"></image>
								<block v-else>
									<my-stepper @showKey="showKey(item,index)" :val="item.cart_num" @plus="plus(item,item.cart_num+1,index)"
									 @minus="minus(item,item.cart_num-1,index)">
									</my-stepper>
								</block>
							</view>

							<view class="no_num" v-else><text>已抢完</text></view>
						</block>
						<block v-else>
							<view class="buy_num" v-if="item.activity_num > item.cart_num">
								<image v-if="item.cart_num == 0" src="../../static/img/plus.png" class="plus" @click="plusSing(item,index)"></image>
								<block v-else>
									<my-stepper @showKey="showKey(item,index)" :val="item.cart_num" @plus="plus(item,item.cart_num+1,index)"
									 @minus="minus(item,item.cart_num-1,index)">
									</my-stepper>
								</block>
							</view>

							<view class="no_num" v-else><text>已抢完</text></view>
						</block>
					</block>
					<block v-else>
						<view class="no_num"><text>即将开始</text></view>
					</block>
				</view>
			</view>
			<my-loading :loading="loading"></my-loading>

		</view>
		<my-backtop bottom="10" :showTop="showTop"></my-backtop>
	
		<uni-popup ref="popup" type="bottom" @maskInfo="closeKey">
			<my-keyboard @cancelKey="$refs.popup.close()" :arrObj="arrObj" @toParent="toParent" ref="keyboard"></my-keyboard>
		</uni-popup>
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
				token: uni.getStorageSync('cdj_token'),
				imgRemote: imgRemote,
				showTop: false,
				kind: 0,
				navBar: navBar,
				loading:true,
				pbId: '',
				list: [],
				activeList: [],
				minute: 0,
				second: 0,
				config: [],
				goodIndex: '',
				arrObj: {},
				count:0
			};
		},
		methods: {
			closeKey(){
				this.$refs.keyboard.cancel();
			},
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			detailPage(id) {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				if (this.config.is_detail == 1) {
					uni.navigateTo({
						url: `shopdetail?id=${id}`
					})
				}
			},
			selectStage(index) {
				this.kind = index;
				this.pbId = this.activeList[index].id;
				this.loading=true;
				this.panicBuylist();
			},
			panicBuylist() {
				this.list=[];
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let {
					pbId
				} = this;
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign,
						pbId: pbId
					},
					obj
				);
				rs.getRequests('panicBuyList', params, res => {
					let {
						data
					} = res;
					if (data.code == 200) {
						this.config = data.data;
						this.activeList = data.data.activeList;
						this.list = data.data.goodsList;
						this.loading=false;
					}
				});
			},
			// 显示键盘
			showKey(item, index) {
				this.$refs.popup.open();
				this.arrObj = item;
				this.goodIndex = index;
			},
			toParent(e) {
				this.addCart(this.arrObj, 'changeNum', e.val, '成功加入购物车', this.goodIndex);
				this.$refs.popup.close();
			},
			addCart(item, url, num, message, index) {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					item_id: item.item_id,
					attr_id: item.attr_id,
					item_num: num
				};

				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					obj
				);
				rs.postRequests(url, params, res => {
					let data = res.data;
					if (data.code == 200) {
						rs.Toast(message);
						this.list[index].cart_num = num;
					} else if (data.code == 407 || data.code == 406) {
						rs.Toast("购买数量不能超过活动数量");
					} else {
						rs.Toast(res.data.msg);
					}
				});
			},
			plusSing(item, index) {
				this.addCart(item, 'changeNum', 1, '成功加入购物车', index)
			},
			plus(item, num, index) {
				if (item.is_float == 1 && !Number.isInteger(Number(num))) {
					rs.Toast('购买数量不能为小数');
					return;
				}
				this.addCart(item, 'changeNum', num, '成功加入购物车', index)
			},
			minus(item, num, index) {
				if (item.is_float == 1 && !Number.isInteger(Number(num))) {
					rs.Toast('购买数量不能为小数');
					return;
				}
				if (num <= 0) {
					this.addCart(item, 'deleteCart', num, '删除商品成功', index);
				} else {
					this.addCart(item, 'changeNum', num, '成功加入购物车', index)
				}
			}
		},
		onShow() {
			this.loading=true;
			this.panicBuylist();
		},
		onPageScroll(e) {
			if (e.scrollTop == 0) {
				this.showTop = false;
			} else {
				this.showTop = true;
			}
		}
	};
</script>

<style>
	.flash_sale .all_things .photo {
		width: 30%;
	}

	.flash_sale .all_things .photo .show_text {
		position: absolute;
		z-index: 2;
		width: 140rpx;
		height: 140rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0.1, 0.2, 0.3, 0.5);
		color: white;
	}

	.flash_sale .all_things .good_info {
		width: 50%;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}

	.flash_sale .all_things .good_num {
		width: 20%;
	}

	.flash_sale .all_things .good_num .buy_num {
		margin-top: 75%;
		height: 19px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.flash_sale .all_things .good_num .buy_num .plus {
		width: 32rpx;
		height: 32rpx;
	}

	.flash_sale .all_things .good_info .num_limit text {
		color: red;
		border: 1px solid red;
		border-radius: 2px;
		font-size: 24rpx;
		padding: 0 5rpx;
	}

	.flash_sale .time_stage {
		position: fixed;
		width: 100%;
		display: flex;
		z-index: 3;
		flex-direction: column;
	}

	.flash_sale .time_stage image {
		width: 100%;
		height: 188rpx;
	}

	.flash_sale .time_stage .single_stage {
		display: flex;
		flex: 1;
	}

	.flash_sale .time_stage .single_stage>view {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #999;
		flex: 1;
		color: #fff;
		padding: 2% 0;

	}

	.flash_sale .all_things {
		margin-top: 320rpx;
	}

	.flash_sale .photo .good_img {
		width: 100%;
		height: 150rpx;
	}

	.flash_sale .active_back {
		background: #009b44 !important;
	}

	.flash_sale .single_good {
		padding: 10rpx 20rpx;

		background: white;
	}

	.flash_sale .single_good:nth-last-child(n+3) {
		margin-bottom: 10rpx;
	}

	.flash_sale .time_stage .square {
		display: flex;
	}

	.flash_sale .time_stage .square>view {
		flex: 1;
	}

	.flash_sale .time_stage .square .show_square {
		width: 0 !important;
		transform: translateX(0);
		transition-duration: .3s;
		height: 0;
		margin: 0 auto;
		bottom: 12px;
		border: 8px solid transparent;
		border-top-color: #009a44;
	}

	.flash_sale .good_num .no_num {
		justify-content: flex-end;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.flash_sale .good_num text {
		background: #808080;
		color: white;
		border-radius: 12rpx;
		padding: 0 10rpx;
		font-size: 20rpx;
	}

	.flash_sale .all_things .distance {
		margin: 0 20rpx 0 5rpx;
	}
</style>
