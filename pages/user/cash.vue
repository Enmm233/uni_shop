<template>
	<view class="cash">
		<uni-nav-bar left-icon="arrowleft" title="现金劵" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view style="position: fixed;width:100%;background:#f8f6f9;">
			
			<!-- #ifdef APP-PLUS || H5 || MP-WEIXIN -->
			<my-s-tabs slot-title :nav-per-view="5" @change="changeFirst" v-model="activeTab" class="custom-tabs">
				<my-s-tab v-for="(item, index) in cashList" :key="index">{{ item.name }}</my-s-tab>
			</my-s-tabs>
			<!-- #endif -->
			
			<!-- #ifdef MP-ALIPAY -->
			<my-o-tabs :tabList="cashList" :isShow="activeTab" @tab="tabClick"></my-o-tabs>
			<!-- #endif -->
			
			
			
		</view>

		<view class="" style="height:80rpx;"></view>
		<view v-if="bitmap">
			<view class="flex single_cash" v-for="(item, index) in list" :key="index" @click="detailPage(item.id)" :class="{cash2:item.coupons_status==2,cash1:item.coupons_status==1,cash3:item.coupons_status==3,cash4:item.coupons_status==4}">
				<view class="price_cash">
					<view class="color">余额</view>
					<view class="color">
						￥
						<text class="fiveteen" style="font-size: 28px;">{{ item.residue.split('.')[0] }}</text>
						.
						<text class="twelve">{{ item.residue.split('.')[1] }}</text>
					</view>
					<view>面值{{ item.money }}元</view>
				</view>
				<view class="info_cash">
					<view class="detail">
						<view class="flex_left_right">
							<text class="fourteen">{{ item.coupons_title }}</text>
							<text class="ten" v-if="item.coupons_status == 2">正常</text>
							<text class="ten" v-if="item.coupons_status == 1">未开始</text>
							<text class="ten" v-if="item.coupons_status == 3">已使用</text>
							<text class="ten" v-if="item.coupons_status == 4">已过期</text>
						</view>
						<view class=" all_tag">
							<view class="tag_cash"><text v-for="(label, index) in item.coupons_label" :key="index" class="color">{{label}}</text></view>

							<uni-icons type="arrowright" size="18" color="black"></uni-icons>
						</view>
					</view>
					<view class="date gray_font ten" v-if="item.coupons_status == 1">{{ item.start_time }} 开始</view>
					<view class="date gray_font ten" v-if="item.coupons_status == 2">{{ item.expire_time }} 过期</view>

				</view>
			</view>
			<my-loading :loading="loading" ></my-loading>
		</view>
		<view class="bitmap" v-else>
			<image src="../../static/img/no_record.png" mode="aspectFit"></image>
		</view>
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
				navBar: navBar,
				cashList: [{
						name: '正常',
						id: '2'
					},
					{
						name: '未开始',
						id: '1'
					},
					{
						name: '已使用',
						id: '3'
					},
					{
						name: '已过期',
						id: '4'
					}
				],
				list: [],
				page: 1,
				num: 10,
				bitmap: true,
				loading: true,
				// #ifdef MP-ALIPAY
				activeTab: -1,
				// #endif
				activeTab: 0,
				orderType: 2,
				count:0
			};
		},
		methods: {
			// #ifdef MP-ALIPAY
			tabClick(data){
				this.activeTab = data;
				this.orderType = this.cashList[data].id;
				this.list = [];
				this.page = 1;
				this.myCash();
			},
			// #endif
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			changeFirst(index) {
				console.log(index)
				this.page = 1;
				this.list = [];
				this.orderType = this.cashList[index].id;
				this.myCash();
			},
			myCash() {
				var that = this;
				
				if (that.page != 1) {
					return;
				}
				that.loading=true;
				that.bitmap=true;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var {
					num,
					page,
					orderType
				} = that;
				var obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					num: num,
					page: page,
					timeStamp: timeStamp,
					type: orderType,
					sign: sign
				};
				rs.getRequests('couponsList', data, res => {
					let {
						data
					} = res;

					if (data.code == 200) {
						let list = data.data.list;
						this.list = list;
						if (list.length == 0) {
							this.bitmap = false;
							this.loading = '空';
						} else {
							this.bitmap = true;
							if (list.length <10) {
								this.loading = false;
							}else{
								this.loading=true;
							}
						}
					}
				});
			},
			detailPage(id) {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				uni.navigateTo({
					url: 'cashdetail?id=' + id
				})
			}
		},
		onShow() {
			this.myCash();
		},
		onReachBottom() {
			var that = this;
			var timeStamp = Math.round(new Date().getTime() / 1000);
			var {
				num,
				page,
				orderType
			} = that;
			var obj = {
				appid: appid,
				timeStamp: timeStamp,
			}
			var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
			var data = {
				appid: appid,
				num: num,
				page: page + 1,
				timeStamp: timeStamp,
				type: orderType,
				sign: sign
			}
			rs.getRequests("couponsList", data, (res) => {
				let {
					data
				} = res
				if (data.code == 200) {
					if (res.data.data.list == '') {
						that.loading = false
					} else {
						that.list.push(...res.data.data.list);
						that.page += 1;
						that.loading = true;
					}
				}
			})
		}
	};
</script>

<style lang="scss">
	.cash .s-tabs-nav-wrap .s-tab-nav-view {
		display: flex !important;
		justify-content: space-around !important;
	}

	.cash .custom-tabs {
		/deep/.s-tab-nav-view {
			display: flex;
			justify-content: space-between;
		}
	}

	.cash .s-tab-nav {
		width: 100% !important;
	}

	.cash .single_cash {
		margin: 0 20rpx;
		border-radius: 10rpx;
		height: 200rpx;
	}

	.cash .single_cash:nth-child(n+2) {
		margin-top: 10rpx;
	}

	.cash .price_cash {
		width: 50%;
		padding: 11px 0 11rpx 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.cash .info_cash {
		width: 80%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.cash .info_cash .detail {
		padding: 10rpx 5rpx 15rpx 0;
	}

	.cash .date {
		border-top: 1px solid #efefef;
		height: 50rpx;
		line-height: 50rpx;
	}

	.cash .tag_cash {
		display: flex;
		flex-wrap: wrap;
		width: 160rpx;
	}

	.cash .tag_cash>text {
		margin-right: 10rpx;
		font-size: 20rpx;
		display: flex;
		align-items: center;
		padding: 0 6rpx;
		border-radius: 4rpx;
	}

	.cash .tag_cash>text:nth-child(n + 3) {
		margin-top: 10rpx;
	}

	.cash .all_tag {
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.cash .cash2 {
		background: url(../../static/img/cash_green.png);
		background-size: cover;
	}

	.cash .cash1 {
		background: url(../../static/img/cash_blue.png);
		background-size: cover;
	}

	.cash .cash3 {
		background: url(../../static/img/cash_red.png);
		background-size: cover;
	}

	.cash .cash4 {
		background: url(../../static/img/cash_grey.png);
		background-size: cover;
	}

	.cash .cash2 .tag_cash>text {
		border: 1px solid #009a44;
	}

	.cash .cash1 .tag_cash>text {
		border: 1px solid #3d98ff;
	}

	.cash .cash3 .tag_cash>text {
		border: 1px solid #CD2D44;
	}

	.cash .cash4 .tag_cash>text {
		border: 1px solid #808080;
	}

	.cash .cash2 .color {
		color: #009a44;
	}

	.cash .cash1 .color {
		color: #3d98ff;
	}

	.cash .cash3 .color {
		color: #CD2D44;
	}

	.cash .cash4 .color {
		color: #808080;
	}

	.bitmap {
		text-align: center;
		margin-top: 20%;
	}

	.bitmap image {
		width: 50%;
	}
</style>
