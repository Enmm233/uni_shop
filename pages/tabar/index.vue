<template>
	<view class="home">
		<my-search></my-search>
		<!-- banner图 -->
		<view class="banner">
			<swiper class="swiper" indicator-dots="true" autoplay="true" duration="2000" circular="true">
				<swiper-item v-for="(item, index) in adList.ad" :key="index">
					<image :src="item.banner"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 公告 -->
		<view class="" v-if="adList.public_msg">
			<uni-notice-bar showIcon="true" background-color="white" color="balck" scrollable="true" single="true" :text="adList.public_msg"
			 :speed="speed"></uni-notice-bar>
		</view>
		<!-- 导航 -->
		<view class="nav">
			<view v-for="(item, index) in adList.nav" :key="index" @click="navUrl(item)">
				<image :src="imgRemote + item.img_url" mode="aspectFit" v-if="item.cate_id != 0"></image>
				<image :src="imgRemote + '/' + item.img_url" mode="aspectFit" v-if="item.cate_id == 0"></image>
				<text class="hidden" style="width: 70%;text-align: center;">{{item.title}}</text>
			</view>
		</view>
		<!-- banner4 -->
		<view class="banner4" v-if="adList.banner4">
			<image :src="adList.banner4" mode="aspectFit"></image>
		</view>
		<!-- 限时抢购 -->

		<view class="limit_buy" v-if="showActive">
			<view class="head" @click="newPage('flashsale')">
				<view class="title">
					<view class="line_border"></view>
					<text class="name">限时抢购</text>
					<text v-if="activeConf.activity_status==0" style="margin-right: 10rpx;">距离开始</text>
					<my-countdown :time="hours"></my-countdown>
				</view>
				<view class="align_center more">
					更多
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>

			<view class="whole">
				<view class="body" v-for="(item, index) in activeList" :key="index" @click="newPage('shopdetail',item.item_id)">
					<view>
						<image :src="config.logo" mode="aspectFit" class="shuiyin1" v-if="config.logo&&config.shuiyin==1"></image>
						<image class="good_img" :src="item.img==''?imgRemote+activeConf.item_default:item.img" mode="aspectFit"></image>
					</view>
					<view>
						<view>
							<view>{{item.item_title}}</view>
							<view class="hidden"><text class="red_tag" v-for="(label,index) in item.label" :key="index">{{label}}</text></view>
						</view>
						<view class="price">

							<block v-if="token">
								<block v-if="config.is_look==1">
									<view style="width:66%;">
										<view class="red_font hidden">¥{{item.activity_price}}/{{item.unit}}</view>
										<view class="line_through hidden">¥{{item.price}}</view>
									</view>
								</block>
								<block v-else>
									<view class="red_font ">¥***</view>
								</block>

							</block>
							<block v-else>
								<view class="red_font">￥{{item.price+'/'+item.unit}}</view>
							</block>

							<view class="addcart">
								<image src="../../static/img/addcart.png"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 为你推荐 -->
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
		<view class="support" v-if="support&&adList.copyright.is_copyright==0">
			<!-- #ifndef H5 -->
			由<text>菜东家</text>提供技术支持
			<!-- #endif -->

			<!-- #ifdef H5 -->
			<a :href="adList.copyright.caidj_url">由<text>菜东家</text>提供技术支持</a>
			<!-- #endif -->
		</view>
		<my-backtop bottom="60" :showTop="showTop"></my-backtop>
		<uni-popup ref="popup" type="bottom" @maskInfo="closeCart">
			<my-addcart @onClose="onClose" :cartware="cartware" :config="config" ref="addcart"></my-addcart>
		</uni-popup>
		<my-tabar tabarIndex=0></my-tabar>
	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue';

	const app = getApp().globalData;
	const {
		appid,
		appsecret,
		imgRemote
	} = app;
	export default {
		components: {
			uniNoticeBar
		},
		data() {
			return {
				showActive: false,
				support: false,
				showTop: false,
				token: '',
				imgRemote: imgRemote,
				speed: 30,
				loading: true,
				page: 1,
				num: 10,
				hours:1000,
				adList: {},
				activeList: {},
				activeConf: {},
				cartware: {},
				config: {},
				itemList: [],
				count: 0
			};
		},
		methods: {
			closeCart() {
				this.$refs.addcart.onClose();
			},
			//导航页面
			navUrl(e) {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				let {
					id,
					cate_id,
					status
				} = e;
				if (status == 0) {
					rs.Toast("该栏目已下架");
					return;
				}
				switch (id) {
					case 1:
						uni.navigateTo({
							url: '/pages/index/collect'
						});
						break;
					case 2:
						uni.navigateTo({
							url: '/pages/index/newback'
						});
						break;
					case 3:
						uni.navigateTo({
							url: '/pages/index/recommed'
						});
						break;
					case 4:
						uni.makePhoneCall({
							phoneNumber: this.adList.phone
						});
						break;
					case 5:
						uni.switchTab({
							url: '/pages/tabar/classify'
						});
						break;
					case 6:
						uni.switchTab({
							url: '/pages/tabar/shopcart'
						});
						break;
					case 7:
						uni.switchTab({
							url: '/pages/tabar/order'
						});
						break;
					case 8:
						uni.switchTab({
							url: '/pages/tabar/user'
						});
						break;
					default:
						console.log(cate_id)
						getApp().globalData.classId = cate_id;
						wx.switchTab({
							url: '/pages/tabar/classify'
						});
						break;
				}
			},
			openCart(item) {
				this.$refs.popup.open();
				this.cartware = item;
			},
			onClose() {
				this.$refs.popup.close();
			},
			newPage(url, id) {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				if (id) {
					uni.navigateTo({
						url: `/pages/index/${url}?id=${id}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/index/${url}`
					});
				}

			},
			indexAd() {
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
				rs.getRequests('indexAd', params, res => {
					let data = res.data;
					if (data.code == 200) {
						this.adList = data.data;
					}
				});
			},
			indexItem() {
				this.itemList = [];
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
						page: page,
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
							this.support = true;
						} else {
							this.support = false;
							this.loading = true;
						}
					}
				});
			},
			//限时抢购
			limitList() {
			
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
				rs.getRequests('panicBuyIndex', params, res => {
					let data = res.data;
					if (data.code == 200) {
						let {
							itemList,
							timeRemain
						} = data.data;
						if (data.data.length != 0) {
							this.showActive = true;
						} else {
							this.showActive = false;
						}
						this.hours = Math.abs(timeRemain);
						this.activeConf = data.data;
						this.activeList = itemList;
					}
				});
			},

		},
		onShow() {
			this.token = uni.getStorageSync('cdj_token');
			this.indexAd();
			this.limitList();
			if (app.isReload == true) {
				this.page = 1;
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
				this.indexItem();
			}

		},
		onLoad() {
			uni.hideTabBar();
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
						this.support = true;
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
	.nav {
		display: flex;
		flex-wrap: wrap;
		padding-bottom: 20rpx;
		justify-content: space-between;
	}

	.nav>view {
		margin-top: 20rpx;
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.nav>view text {
		margin-top: 10rpx;
	}

	.banner image {
		width: 100%;
		height: 100%;
	}

	.nav>view image {
		width: 100rpx;
		height: 100rpx;
	}

	.banner4 {
		margin: 10rpx 20rpx 0;
		height: 200rpx;
		background: white;
	}

	.banner4 image {

		width: 100%;
		height: 200rpx;
	}

	.home .limit_buy .head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.home .limit_buy .title {
		display: flex;
		align-items: center;
		align-items: center;
		height: 80rpx;
		line-height: 80rpx;
	}

	.home .limit_buy .name {
		margin: 0 12rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.home .limit_buy .body .good_img {
		width: 240rpx;
		height: 200rpx;
	}

	.home .limit_buy .body .price {
		display: flex;
		justify-content: space-between;
	}

	.home .limit_buy .whole {
		overflow-x: scroll;
		display: flex;
	}

	.home .limit_buy .more {
		color: #009a44;
	}

	.home .limit_buy .head {
		padding: 0 20rpx;
	}

	,
	.home .limit_buy .whole {
		padding: 0 0 20rpx 20rpx;
	}

	.home .limit_buy .icon-jiantou {
		font-size: 20rpx;
		height: 32rpx;
		line-height: 32rpx;
	}

	.whole::-webkit-scrollbar {
		width: 0;
		display: none;
	}

	.nav,
	.limit_buy {
		background: white;
		/* padding: 0 20rpx; */
		margin-top: 10rpx;
	}

	.banner,
	.notice {
		background: white;
		padding: 0 20rpx;
	}

	.support {
		text-align: center;
		color: #808080;
		margin-bottom: 20rpx;
		font-size: 28rpx;
	}

	.support text {
		color: rgb(157, 212, 127);
	}

	.home .uni-countdown__number {
		height: 30rpx !important;

		color: white !important;
		border-radius: 4rpx;
		width: 40rpx !important;
	}

	.home .my_loading {
		height: 70rpx;
	}

	.home .limit_buy .whole .body {
		margin-right: 20rpx;
		width: 33%;
	}

	.home .shuiyin1 {
		width: 60rpx;
		height: 20rpx;
	}

	/* #ifdef H5 */
	a {
		text-decoration: none;
		color: gray;
	}

	/* #endif */
</style>
