<template>
	<view class="collect">
		<uni-nav-bar left-icon="arrowleft" title="常用推荐" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="all_collect" v-if="bitmap">
			<my-profile class="single_collect" v-for="(item, index) in list" :wares="item" :config="config" :key="index"
			 @showCart="openCart(item)" @showKey="showKey(item, index)"></my-profile>
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
				loading:true,
				config: [],
				list: [],
				page: 1,
				num: 10,
				arrObj: [],
				index: '',
				bitmap:true,
				cartware: []
			};
		},
		methods: {
			closeCart(){
				this.$refs.addcart.onClose();
			},
			closeKey(){
				this.$refs.keyboard.cancel();
			},
			leftClick(e) {
				uni.navigateBack({
					delta: 1
				});
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
						uni.showToast({
							title: '加入购物车成功',
							icon: 'none',
							duration: 2000
						})
						this.list[this.index].cart_num = e.val;
					} else if (data.code == 407 || data.code == 406) {
						rs.Toast("购买数量不能超过活动数量")
					} else {
						rs.Toast(res.data.msg)
					}
				});
				this.$refs.popup.close();
			},
			getIndexSelect() {
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
						page: page,
						num: num
					},
					obj
				);
				rs.getRequests('itemCommon', params, res => {
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
				this.arrObj = item;
				this.index = index;
				this.$refs.popup.open();
			}
		},
		onHide(){
			// uni.setStorageSync('recommed',);
			uni.setStorageSync('recommed',this.list);
			console.log(this.list)
		},
		onShow() {
			console.log(this.page)
			if (this.page==1) {
				this.getIndexSelect();
			}else{
				
				this.list=uni.getStorageSync('recommed');
				// console.log(this.list);
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
			rs.getRequests('itemCommon', params, res => {
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
