<template>
	<view class="collect">
		<uni-nav-bar left-icon="arrowleft" right-text="清空" title="收藏列表" :status-bar="navBar" fixed="true" @clickLeft="leftClick"
		 @clickRight="rightClick"></uni-nav-bar>
		<view class="all_collect" v-if="bitmap">
			<my-profile class="single_collect" v-for="(item, index) in list" :wares="item" :config="config" :key="index" url="collect"
			 @showCart="openCart(item)" @showKey="showKey(item,index)" @cancelCollect="cancelCollect(item,index)"></my-profile>
			<my-loading :loading="loading"></my-loading>
		</view>
		<view v-else class="bitmap">
			<image src="../../static/img/no_content.png" mode="aspectFit"></image>
		</view>


		<uni-popup ref="popup" type="bottom" @maskInfo="closeKey">
			<my-keyboard @cancelKey="$refs.popup.close()" :arrObj="arrObj" @toParent="toParent" ref="keyboard"></my-keyboard>
		</uni-popup>
		<uni-popup ref="cart" type="bottom" @maskInfo="closeCart">
			<my-addcart @onClose="onClose" :cartware="cartware" :config="config" ref="addcart"></my-addcart>
		</uni-popup>
	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	const app = getApp().globalData;
	let {
		log
	} = console;
	const {
		navBar,
		imgRemote,
		appid,
		appsecret
	} = app;
	export default {
		data() {
			return {
				navBar: navBar,
				imgRemote: imgRemote,
				config: [],
				list: [],
				page: 1,
				num: 10,
				arrObj: {},
				cartware: [],
				count: 1,
				bitmap: true,
				loading: true,
				backpage: false
			};
		},
		methods: {
			closeCart() {
				this.$refs.addcart.onClose();
			},
			closeKey() {
				this.$refs.keyboard.cancel();
			},
			leftClick() {
				
				// if (this.backpage) {
					uni.navigateBack({
						delta: 1
					});
				// }
			},
			rightClick() {

				if (this.list.length) {
					uni.showModal({
						content: '确定将收藏商品全部清空吗？',
						success: function(res) {
							if (res.confirm) {
								let timeStamp = Math.round(new Date().getTime() / 1000);
								let obj = {
									appid: appid,
									timeStamp: timeStamp
								};
								let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
								let params = Object.assign({
										sign: sign
									},
									obj
								);
								rs.getRequests('deleteCollect', params, res => {
									let data = res.data;
									if (data.code == 200) {
										rs.Toast('成功清空收藏列表');
										setTimeout(() => {
											uni.navigateBack({
												delta: 1
											});
										}, 1000);
									} else {
										rs.Toast(res.data.msg);
									}
								});
							}
						}
					});
				} else {
					rs.Toast('没有可以清空的商品')
				}
			},
			cancelCollect(item, index) {
				this.count++;
				if (this.count != 2) {
					return
				}
				setTimeout(() => {
					this.count = 1
				}, 500)
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					item_id: item.id,
					appid: appid,
					timeStamp: timeStamp,
					status: 1
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					obj
				);
				rs.getRequests('changeCollect', params, res => {
					let data = res.data;

					if (data.code == 200) {

						this.list.splice(index, 1)
						console.log(this.list.length);
						if (this.list.length == 0) {
							this.bitmap = false;
						}
						rs.Toast('取消收藏');
					} else {
						rs.Toast(data.msg);
					}
				});
			},
			getIndexSelect() {
				let {
					page,
					num,
					list
				} = this;

				if (page != 1) {
					this.list = uni.getStorageSync("collect")
					return;
				}

				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign,
						page: page,
						num: num
					},
					obj
				);
				rs.getRequests('getIndexSelect', params, res => {
					let data = res.data;
					if (data.code == 200) {
						this.config = data.data;

						if (data.data.list.length == 0) {
							this.list = [];
							this.bitmap = false;
						} else {
							this.list = data.data.list;
							if (data.data.list.length < 10) {
								this.loading = false;
							} else {
								this.loading = true;
							}
						}
					}
				});
			},
			openCart(item) {
				this.cartware = item;
				this.$refs.cart.open();
			},
			onClose() {
				this.$refs.cart.close();
			},
			// 显示键盘
			showKey(item, index) {
				console.log(45)
				this.arrObj = item;
				this.index = index;
				this.$refs.popup.open();
			},
			toParent(e) {
				let item = e.arrObj;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					item_id: item.id,
					attr_id: 0,
					item_num: e.val
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					obj
				);
				rs.postRequests('changeNum', params, res => {
					let data = res.data;
					if (data.code == 200) {
						rs.Toast('加入购物车成功')
						this.list[this.index].cart_num = e.val;
					} else if (data.code == 407 || data.code == 406) {
						rs.Toast("购买数量不能超过活动数量")
					} else {
						rs.Toast(res.data.msg)
					}
				});
				this.$refs.popup.close();
			}
		},
		onHide() {
			uni.setStorageSync('collect', this.list);
		},
		onShow() {
			// setTimeout(() => {
			// 	this.backpage = true;
			// }, 1000);
			if (this.page == 1) {
				this.getIndexSelect();
			} else {
				this.list = uni.getStorageSync('collect');
			}

		},
		onReachBottom() {
			let {
				page,
				num,
				list
			} = this;
			let timeStamp = Math.round(new Date().getTime() / 1000);
			let obj = {
				appid: appid,
				timeStamp: timeStamp
			};
			let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			let params = Object.assign({
					sign: sign,
					page: page + 1,
					num: num
				},
				obj
			);
			rs.getRequests('getIndexSelect', params, res => {
				if (res.data.code == 200) {
					if (res.data.data.list.length != 0) {
						this.list.push(...res.data.data.list);
						this.page += 1;
						this.loading = true;
					} else {
						this.loading = false;
					}
				}
			});
		}
	};
</script>
<style lang="scss">
	.collect .all_collect .my_profile {
		background: white;
		margin-top: 10rpx;
	}

	.collect .bitmap {
		text-align: center;
	}

	.collect .bitmap image {
		width: 50%;
		margin-top: 20%;
	}
</style>
