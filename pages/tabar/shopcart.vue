<template>
	<view>
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar white_b" style="position: fixed;z-index: 9999;">
			<!-- 这里是状态栏 -->
		</view>
		<view class="status_bar white_b"></view>
		<!-- #endif -->
		<view class="shopcart" v-if="cartInfo.countNum!=0">
			<view class="cart_buy">
				<!-- <view style="height:10px;background-color: #F8F6F9;"></view> -->
				<!-- 送货地址 -->
				<view class="deliver_address" @click="deliveryPage">
					<view>
						<text class="weight nickname">{{contact?contact:'请输入地址'}}</text>
						<text>{{mobile?mobile:''}}</text>
					</view>
					<view class="detail_address">
						<view class="align_center dizhi">
							<view>
								<image src="../../static/img/dizhi.png" mode="aspectFit"></image>
							</view>
							<view>{{address?address:''}}</view>
						</view>
						<view>
							<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
						</view>
					</view>
				</view>
				<!-- 下单时间段 -->
				<view class="order_time align_center">
					<image src="../../static/img/clock.gif" mode="aspectFit"></image>
					<text class="red_font">请在( {{cartInfo.open_time+'-'+cartInfo.end_time}})之间下单</text>
				</view>
				<view class="select_info">
					<view>
						<view class="weight">子账号</view>
						<view class="gray_font" @click="selectAccount">
							{{account}}
							<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
						</view>
					</view>
					<view>
						<view class="weight">配送日期</view>
						<view class="gray_font" @click="selectDate">
							{{ sendDate }}
							<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
						</view>
					</view>
					<view>
						<view class="weight">配送时间</view>
						<view class="gray_font" @click="selectTime">
							{{deliveryTime}}
							<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
						</view>
					</view>
					<view>
						<view class="weight">商品列表</view>
						<view class="gray_font" @click="shoplist">
							单品备注
							<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
						</view>
					</view>
				</view>
				<!-- 价格信息 -->
				<view class="price_info">
					<view v-if="cartInfo.is_child==0&&cartInfo.on_delivery==0">
						<view class="weight">现金劵</view>
						<view class="gray_font" @click="selectCash">
							{{cash}}
							<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
						</view>
					</view>
					<view>
						<view class="weight">小计</view>
						<view class="weight margin_right">￥{{cartInfo.countPrice}}</view>
					</view>
					<view>
						<view class="weight">运费</view>
						<view class="weight margin_right" v-if="cartInfo.fare!=0">￥{{cartInfo.fare}}</view>
						<view v-else class="gray_font margin_right">(免运费)</view>
					</view>
				</view>
				<!-- 备注 -->
				<view class="remark">
					<text class="weight">备注</text>
					<input placeholder="请告诉我们需要注意的地方" @focus="onFocus()" @blur="onBlur()" v-model="remark" placeholder-style="font-size:28rpx;" class="twelve remark_note"
					 show-confirm-bar=false />
				</view>
				<!-- 下单 -->
				<view class="order_method" v-if="display">
					<view class="flex_left_right active_info" v-if="cartInfo.activity_type==1" @click="collectBill">
						<view>
							<rich-text :nodes="reduce"></rich-text>
						</view>
						<view class="red_font">
							去凑单
							<uni-icons type="arrowright" size="18" color="red"></uni-icons>
						</view>
					</view>
					<view class="flex_left_right price_order">
						<view class="flex total_price">
							<view class="cart_num">
								<view class="gray_font">共{{cartInfo.countNum+gift}}件</view>
								<view class="gift_num" v-if="gift==1">(含赠品1件)</view>
							</view>
							<view class="count">
								<view>
									<text class="weight">合计</text>
									　<text style="margin:0 10rpx;">:</text>　
									<text class="red_font">¥{{(cartInfo.totalPrice-juanPrice-cartInfo.discount).toFixed(2)}}</text>
								</view>
								<view class="real_price" v-if="cartInfo.discount!=0">¥{{cartInfo.totalPrice}}</view>
							</view>
						</view>
						<view class="determine" @click="confirmOrder">确认下单</view>
					</view>
				</view>
			</view>

			<!-- 子账号 -->
			<w-picker mode="selector" default-type="title" :default-props="childListProps" :options="childList" @confirm="onConfirmAccount($event, 'selector')"
			 ref="account">
				子账号
			</w-picker>
			<!-- 配送日期 -->
			<w-picker mode="date" :value="sendDate" fields="day"   @confirm="onConfirmDate($event, 'date')" :startYear="startyear"
			 endYear="2029" :disabled-before="true" ref="date">
				配送日期
			</w-picker>
		
			<!-- 配送时间-->
			<w-picker mode="selector" default-type="title" :default-props="deliveryListProps" :options="deliveryList" @confirm="onConfirmDelivery($event, 'selector')"
			 ref="delivery">
				配送时间
			</w-picker>
			<!-- 现金券-->
			<w-picker mode="selector" default-type="title" :default-props="couponsListProps" :options="couponsList" @confirm="onConfirmCash($event, 'selector')"
			 ref="cash">
				现金券
			</w-picker>


		</view>
		<view v-else class="null_cart">
			<view class="null_img">
				<image src="../../static/img/nullcart.png" mode="aspectFit"></image>
			</view>
			<view class="recomend">
				<view class="title">
					<view class="line_border"></view>
					<text class="name">为你推荐</text>
				</view>
				<view class="body">
					<my-recomend v-for="(item, index) in itemList" :key="index" :ware="item" :config="config" @showCart="openCart(item)"
					 class="myc_recomend"></my-recomend>
				</view>
				<my-loading :loading="loading"></my-loading>
			</view>
			<my-backtop bottom="60" :showTop="showTop"></my-backtop>

			<uni-popup ref="popup" type="bottom" @maskInfo="closeCart">
				<my-addcart @onClose="onClose" :cartware="cartware" :config="config" ref="addcart"></my-addcart>
			</uni-popup>
		</view>
		<my-tabar tabarIndex=2 v-if="display"></my-tabar>
	</view>
</template>

<script>
	import wPicker from '@/components/w-picker/w-picker.vue';
	import md5 from '../../static/js/md5.js';
	import parseHtml from '../../static/js/parseHtml.js';
	import rs from '../../static/js/request.js';
	import ruiDatePicker from '@/components/rattenking-dtpicker/rattenking-dtpicker.vue';
	let {
		log
	} = console;
	const app = getApp().globalData;
	const {
		appid,
		appsecret,
		imgRemote
	} = app;

	export default {
		components: {
			wPicker,ruiDatePicker
		},
		data() {
			return {
				display: true,
				scrollHeight: '',
				newHeight: '',
				title: '',
				contact: '',
				mobile: '',
				address: '',
				childzid: '',
				childListProps: {
					label: 'nickname',
					value: 'zid'
				},
				childList: [{
					zid: '',
					nickname: '当前账号'
				}],
				deliveryListProps: {
					label: 'delivery_time_info',
					value: 'delivery_time_id'
				},
				deliveryList: [{
					delivery_time_id: '',
					delivery_time_info: '不限'
				}],
				couponsListProps: {
					label: 'txt',
					value: 'id'
				},
				couponsList: [{
					id: '',
					txt: '不使用'
				}],
				deliveryId: '',
				deliveryTime: '不限',
				account: '当前账号',
				cash: '不使用',
				couponsId: '',
				juanPrice: 0,
				sendDate: '',
				startyear: '',
				cartInfo: {
					countNum: 0
				},
				reduce: '',
				page: 1,
				num: 10,
				loading: true,
				showTop: false,
				config: [],
				cartware: [],
				itemList: [],
				remark: '',
				gift: 0,
				count: 0,
			};
		},
		methods: {
			// #ifdef H5
			onFocus(){
				if(uni.getSystemInfoSync().platform == 'ios'){
					this.display=false;
				}
			},
			onBlur(){
				if(uni.getSystemInfoSync().platform == 'ios'){
					this.display=true;
				}
			},
			// #endif
		
			closeCart() {
				this.$refs.addcart.onClose();
			},
			shoplist() {
				uni.navigateTo({
					url: "/pages/shopcart/shoplist"
				})
			},
			deliveryPage() {
				uni.navigateTo({
					url: '/pages/shopcart/delivery?childzid=' + this.childzid
				});
			},
			collectBill() {
				uni.switchTab({
					url: '/pages/tabar/index'
				})
			},
			childInfo() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				rs.getRequests("childInfo", params, (res) => {
					let data = res.data;
					if (data.code == 200) {
						this.childList.push(...data.data)
					}
				})
			},
			newArr(arr) {
				return arr.map(function(val, ind) {
					return {
						id: val.id,
						txt: '',
					}
				});
			},
			addInfo() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				rs.getRequests("addInfo", params, (res) => {
					let {
						data
					} = res;
					this.cartInfo = data.data;
					let {
						userInfo,
						activity_rule,
						totalPrice,
						activity_type
					} = data.data;
					this.contact = userInfo.contact;
					this.mobile = userInfo.phone;
					this.address = userInfo.address;

					// 判断购物车是否有数量
					if (data.data.countNum == 0 && app.isReload == true) {
						this.indexItem()
					}
					// 配送时间
					this.deliveryList.push(...data.data.delivery_time_list);

					// 现金券
					if (data.data.couponsList.length != 0) {
						let nrr = this.newArr(data.data.couponsList)
						for (let i = 0; i < data.data.couponsList.length; i++) {
							nrr[i].txt = `${data.data.couponsList[i].coupons_title}(余额${data.data.couponsList[i].residue}元)`
						}
						this.couponsList.push(...nrr);
					}
					// 满赠
					if (activity_type == 2) {
						if (data.data.fullPrice >= activity_rule[0].price) {
							this.gift = 1
						} else {
							this.gift = 0;
						}
					}
					// 满减
					let length = activity_rule.length - 1;
					if (activity_type == 1) {
						if (activity_rule[length].price <= totalPrice) {
							this.reduce = parseHtml(
								`已享受满<span style='color: #FF3E1E;'>${activity_rule[length].price}元</span>减<span style='color: #FF3E1E;'>${activity_rule[length].reduce}元<span>`
							);
						} else {
							for (let i of activity_rule) {
								if (totalPrice < i.price) {
									this.reduce = parseHtml(
										`再满<span style='color: #FF3E1E;'>${i.price - totalPrice}元</span>减<span style='color: #FF3E1E;'>${i.reduce}元</span>`
									);
									return;
								}
							}
						}
					}
				})
			},
			// 显示子账号
			selectAccount() {
				this.$refs.account.show();
			},
			onConfirmAccount(e) {
			
				if (!e.value) {
					let {
						userInfo
					} = this.cartInfo;
					this.address = userInfo.address;
					this.contact = userInfo.contact;
					this.mobile = userInfo.mobile;
				} else {
					this.address = e.obj.address;
					this.contact = e.obj.contact;
					this.mobile = e.obj.mobile;
				}
				this.childzid = e.value;
				this.account = e.result;
			},
			// 显示配送日期
			selectDate() {
				this.$refs.date.show();
				
			},
			onConfirmDate(e) {
				let {
					year,
					month,
					day
				} = e.obj;
			
				this.sendDate = `${year}-${month}-${day}`;
			},
			// 显示配送时间
			selectTime() {
				this.$refs.delivery.show();
			},
			onConfirmDelivery(e) {
				log(e);
				this.deliveryTime = e.result;
				this.deliveryId = e.value;
			},
			// 显示现金券
			selectCash() {
				this.$refs.cash.show();
			},
			onConfirmCash(e) {
				this.cash = e.result;
				this.couponsId = e.value;
				this.juanPrice = 0;
				log(e)
				if (e.obj.id != '') {
					let timeStamp = Math.round(new Date().getTime() / 1000);
					let obj = {
						appid: appid,
						timeStamp: timeStamp,
						id: e.obj.id
					};

					let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
					let params = Object.assign({
						sign: sign,
					}, obj)
					rs.getRequests("useCouponsPrice", params, (res) => {
						if (res.data.code == 200) {
							this.juanPrice = res.data.data.couponsPrice;
						} else {
							rs.Toast(res.data.msg)
						}
					})
				}
			},
			//确认下单
			confirmOrder() {
				if (!this.contact || !this.mobile || !this.address) {
					rs.Toast('请先填写收货信息');
					setTimeout(() => {
						uni.navigateTo({
							url: '../shopcart/delivery'
						})
					}, 1000)
					return;
				}
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0;
				}, 500)
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					send_time: this.sendDate
				};

				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj)
				var that = this;
				rs.getRequests("testOrder", params, (res) => {
					let code = res.data.code;
					let data = res.data.data;
					if (data.on_delivery == 1) {
						switch (code) {
							case 101:
								uni.showModal({
									title: '提示',
									content: '直接下单？',
									success: function(res) {
										if (res.confirm) {
											that.order();
										}
									}
								});
								break;
							case 300:

								uni.showModal({
									title: '提示',
									content: '信用金即将用完，请及时结账（可以直接下单）？',
									success: function(res) {
										if (res.confirm) {
											that.order();
										}
									}
								});

								break;
							case 301:
								uni.showModal({
									title: '提示',
									content: '信用金即将用完，请及时结账（可以合并订单）？',
									success: function(res) {
										if (res.confirm) {
											that.mergeOrder();
										} else if (res.cancel) {
											uni.showModal({
												title: '提示',
												content: '直接下单？',
												success: function(res) {
													if (res.confirm) {
														that.order();
													}
												}
											});
										}
									}
								});
								break;

							case 500:
								rs.Toast({
									message: '信用金已用完，不能下单',
									duration: 1200
								});
								break;

							case 200:

								uni.showModal({
									title: '提示',
									content: '可以合并订单？',
									success: function(res) {
										if (res.confirm) {
											that.mergeOrder();
										} else if (res.cancel) {
											uni.showModal({
												title: '提示',
												content: '直接下单？',
												success: function(res) {
													if (res.confirm) {
														that.order();
													}
												}
											});
										}
									}
								});
								break;
						}
					} else {
						uni.showModal({
							title: '提示',
							content: '直接下单？',
							success: function(res) {
								if (res.confirm) {
									that.order();
								}
							}
						});
					}
				})
			},
			// 合拼下单
			mergeOrder() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				var date = this.sendDate;
				// way 1公众号 2App 3小程序 下单方式
				// #ifdef H5
				let way = 1;
				// #endif
				// #ifdef APP-PLUS
				let way = 2;
				// #endif
				// #ifdef MP-WEIXIN | MP-ALIPAY
				let way = 3;
				// #endif
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					send_time: date,
					way: way
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
				}, obj)
				rs.postRequests('mergeOrder', params, (res) => {
					if (res.data.code != 200) {
						rs.Toast(res.data.msg)
					} else {
						rs.Toast('合拼订单成功');
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabar/order',
							})
						}, 1000)

					}
				})
			},
			// 直接下单
			order() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				var date = this.sendDate;
				var select_zid = this.childzid;
				var timearea = this.deliveryTime;
				var timeId = this.deliveryId;
				var remark = this.remark.replace(/\s/g, '');
				let timeInfo = '';
				if (timearea == "不限") {
					timeInfo = '';
				} else {
					timeInfo = timearea;
				}
				// #ifdef H5
				let way = 1;
				// #endif
				// #ifdef APP-PLUS
				let way = 2;
				// #endif
				// #ifdef MP-WEIXIN | MP-ALIPAY
				let way = 3;
				// #endif
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					send_time: date,
					way: way
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				// console.log(this.cashId)
				let params = Object.assign({
					delivery_time_id: timeId,
					delivery_time_info: timeInfo,
					sign: sign,
					remark: remark,
					coupons_member_id: this.cartInfo.on_delivery == 0 ? this.couponsId : 0,
					select_zid: select_zid
				}, obj);

				rs.postRequests('addOrder', params, (res) => {
					let data = res.data;

					if (data.code == 104) {
						rs.Toast('超出下单时间，不能下单');
						return false;
					} else if (data.code == 200) {
						if (data.data.on_delivery == 0) {
							let id = data.data.orderId;
							uni.navigateTo({
								url: `/pages/shopcart/pay?id=${id}`,
							})
							return;
						}
						rs.Toast('下单成功');
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabar/order',
							})
						}, 1000)

					} else if (data.code == 500) {
						rs.Toast('服务器内部错误,请稍候再试')
					} else if (data.code == 407) {
						rs.Toast('超出活动限制,请删除部分商品');
					} else {
						rs.Toast(data.msg)
					}
				})
			},
			indexItem() {
				this.itemList = [];
				this.page = 1;
				this.loading = true;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let {
					num,
					page
				} = this;

				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						page: 1,
						sign: sign,
						num: num
					},
					obj
				);

				rs.getRequests('indexItem', params, res => {
					let data = res.data;
					if (data.code == 200) {
						this.itemList = data.data.list;
						this.config = data.data;
						if (data.data.total <= 10) {
							this.loading = false;
						} else {
							this.loading = true;
						}
					}
				});
			},
			openCart(item) {
				this.$refs.popup.open();
				this.cartware = item;
			},
			onClose() {
				this.$refs.popup.close();
			},
			getSendTime() {
				var date = new Date();
				let n = date.getTime() + 24 * 3600000;
				date.setTime(n);
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				this.startyear = year;
				if (month < 10) {
					month = '0' + month;
				}
				if (day < 10) {
					day = '0' + day;
				}
				this.sendDate = `${year}-${month}-${day}`;
			},
			onShow() {
				if (!uni.getStorageSync("cdj_token")) {
					uni.navigateTo({
						url: '/pages/account/login'
					});
					return;
				}
				if (uni.getStorageSync("is_child") != 1) {
					this.childInfo();
				}

				this.getSendTime();
				this.addInfo();
				// #ifdef H5
				this.scrollHeight = document.body.clientHeight;
				// #endif

			},
			onHide() {
				this.childzid = '';
				this.childList = [{
					zid: '',
					nickname: '当前账号'
				}];
				this.deliveryList = [{
					delivery_time_id: '',
					delivery_time_info: '不限'
				}];
				this.couponsList = [{
					id: '',
					txt: '不使用'
				}];
				this.deliveryId = '';
				this.deliveryTime = '不限';
				this.account = '当前账号';
				this.cash = '不使用';
				this.couponsId = '';
				this.juanPrice = 0;
				this.remark = '';
			},
			onLoad() {
				uni.hideTabBar();
				// #ifdef H5				
				if (uni.getSystemInfoSync().platform === 'android') {
					window.onresize = () => {
						// 解决刷新底部会隐藏的问题
						let newHeight = document.body.clientHeight;
						if (this.scrollHeight == newHeight) {
							this.display = true;
						} else {
							this.display = false;
						}

					}
				}
				// else if(uni.getSystemInfoSync().platform == 'ios'){
					
				// 	 uni.getSystemInfo({
				// 	        success: (res)=> {
				// 	            this.scrollHeight = res.windowHeight;
				// 	        }
				// 	    });
				// 	    uni.onWindowResize((res) => {
				// 	        if(res.size.windowHeight < this.scrollHeight){
				// 	            this.display = false
				// 	        }else{
								
				// 	            this.display = true
				// 	        }
				// 	    })
				// }


				// #endif
			}
		},

		onReachBottom() {
			//页面上拉触底事件的处理函数
			var that = this;
			var timeStamp = Math.round(new Date().getTime() / 1000);
			let {
				num,
				page
			} = that;
			var obj = {
				appid: appid,
				timeStamp: timeStamp
			};

			var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			var data = {
				appid: appid,
				num: num,
				page: page + 1,
				timeStamp: timeStamp,
				sign: sign
			};
			rs.getRequests('indexItem', data, res => {
				let {
					data
				} = res;
				if ((data.code = 200)) {
					if (data.data != '') {
						this.itemList.push(...data.data.list);
						this.page += 1;
						this.loading = true;
					} else {
						this.loading = false;
					}
				}
			});
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
	.shopcart .cart_buy>view {
		background: white;
	}

	.shopcart .cart_buy>view:nth-child(n + 3) {
		margin-top: 5px;
	}

	.shopcart .cart_buy .gray_font {
		display: flex;
	}

	.deliver_address {
		padding: 10rpx 5rpx 10rpx 20rpx;
	}

	/* #ifdef MP-WEIXIN */
	.deliver_address {
		margin-top: 0 !important;
	}

	/* #endif */
	.deliver_address .nickname {
		font-size: 40rpx;
		margin-right: 10rpx;
	}

	.deliver_address .icon-jiantou {
		font-size: 30rpx !important;
		color: #808080;
	}

	.deliver_address image {
		width: 38rpx;
		height: 38rpx;
		margin-right: 10rpx;
	}

	.deliver_address .detail_address {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 5rpx 0;
	}

	.deliver_address .dizhi {
		display: flex;
		align-items: center;
	}

	.deliver_address .dizhi image {
		width: 40rpx;
		height: 40rpx;
	}

	.order_time {
		padding: 0 !important;
		background: #f8f6f9 !important;
		height: 60rpx;
	}

	.order_time image {
		width: 60rpx;
		height: 40rpx;
	}

	.select_info>view,
	.price_info>view {
		padding: 0rpx 5rpx 0 20rpx;
		display: flex;
		justify-content: space-between;
		height: 68rpx;
		line-height: 58rpx;
	}

	.shopcart .remark {
		display: flex;
		padding: 15rpx 20rpx !important;
		height: 100rpx;
	}

	.shopcart .remark .weight {
		width: 70rpx;
	}

	.shopcart .remark .remark_note {
		margin-right: 20rpx;
		width: 100%;

	}

	/* #ifdef MP-ALIPAY */
	.shopcart .remark .remark_note {
		margin-right: 20rpx;
		width: 100%;
		height: 28rpx;
	}

	/* #endif */

	.order_method .active_info {
		/* padding: 5rpx 20rpx; */
		padding: 0 0 0 20rpx;
		height: 50rpx;
		background: rgba(173, 219, 140, 0.2);
	}

	.order_method .price_order {
		height: 90rpx;
	}

	.order_method .total_price {
		padding-left: 20rpx;
		width: 70%;
	}

	.order_method .total_price .count {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.order_method .determine {
		height: 100%;
		line-height: 90rpx;
		background: red;
		color: white;
		width: 30%;
		text-align: center;
		font-size: 32rpx;
	}

	.order_method .gift_num {
		color: #009a44;
		font-size: 20rpx;
	}

	.order_method .cart_num {
		margin-right: 20rpx;
	}

	.order_method .real_price {
		color: #808080;
		text-decoration: line-through;
		font-size: 20rpx;
		text-indent: 80rpx;
	}

	.order_method {
		position: fixed;
		bottom: 50px;
		width: 100%;
	}

	.null_cart .null_img {
		background: white;
		text-align: center;
		padding: 20% 0;
	}

	.null_cart .null_img image {
		width: 37%;
		height: 260rpx;
	}

	.margin_right {
		margin-right: 10rpx;
	}

	/* .showNav .order_method{display: none;}
	.showNav .my_tabar{display: none;} */
</style>
