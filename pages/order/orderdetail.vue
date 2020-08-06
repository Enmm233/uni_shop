<template>
	<view class="order_detail">
		<uni-nav-bar left-icon="arrowleft" title="订单详情" :status-bar="navBar" fixed="true" @clickLeft="LeftClick"></uni-nav-bar>

		<view class="order_info">
			<!-- 支付信息 -->
			<view class="pay_info">
				<view>
					<view class="title">支付信息</view>
					<view style="color:#1EA55A;" class="right" v-if="detail.order_status==0">待审核</view>
					<view style="color:#1EA55A;" class="right" v-if="detail.order_status==1">备货中</view>
					<view style="color:#1EA55A;" class="right" v-if="detail.order_status==2">配送中</view>
					<view style="color:#1EA55A;" class="right" v-if="detail.order_status==3">已收货</view>
					<view style="color:#FF3E1E;" class="right" v-if="detail.order_status==4">已取消</view>
				</view>
				<view>
					<view>下单时间</view>
					<view>{{detail.create_time}}</view>
				</view>
				<view>
					<view>配送日期</view>
					<view>{{detail.send_time}}</view>
				</view>
				<view>
					<view>配送时间</view>
					<view>{{detail.delivery_time_info?detail.delivery_time_info:'不限'}}</view>
				</view>
				<view>
					<view>订单编号</view>
					<view>{{detail.order_sn}}</view>
				</view>
				<view>
					<view>联系电话</view>
					<view>{{detail.mobile}}</view>
				</view>
				<view>
					<view>送货地址</view>
					<view>{{detail.address}}</view>
				</view>
				<view>
					<view>备注</view>
					<view>{{detail.remark?detail.remark:'/'}}</view>
				</view>
			</view>
			<!-- 金额信息 -->
			<view class="money_info">
				<view>
					<view class="title">金额信息</view>
					<view></view>
				</view>
				<view>
					<view>下单金额</view>
					<view class="red_font" v-if="orderDetail.is_look==0">¥ ***</view>
					<view class="red_font" v-if="orderDetail.is_look==1">¥{{detail.xd_price}}</view>
				</view>
				<view>
					<view>退货金额</view>
					<view class="red_font" v-if="orderDetail.is_look==0">¥ ***</view>
					<view class="red_font" v-if="orderDetail.is_look==1">¥{{detail.th_price}}</view>
				</view>
				<view>
					<view>运费</view>
					<view class="red_font" v-if="orderDetail.is_look==0">¥ ***</view>
					<view class="gray_font" v-if="orderDetail.is_look==1">¥{{detail.delivery_fee}}</view>
				</view>
				<view>
					<view>应付金额</view>
					<view class="red_font" v-if="orderDetail.is_look==0">¥ ***</view>
					<view class="red_font" v-if="orderDetail.is_look==1">¥{{detail.yf_price}}</view>
				</view>
			
				<view v-if="detail.is_cash_delivery == 1">
					<view>实付金额</view>
					<view v-if="orderDetail.is_look==0" class="red_font">¥ ***</view>
					<view v-if="orderDetail.is_look==1" class="red_font">¥{{detail.total_fee}}</view>
				</view>
				<view>
					<view>支付状态</view>
					<view v-if="detail.pay_status==0">未支付</view>
					<view v-if="detail.pay_status==1">已支付</view>
				</view>

			</view>

			<!-- 商品信息 -->
			<view class="good_info">
				<view class="title">商品信息</view>
				<view class="single_good" v-for="item in detail.order_list">
					<view class="flex_left_right">
						<text><text class="labe" v-if="item.is_gift==1">赠</text>{{item.item_title}}</text>
						<view v-if="orderDetail.is_look==0">¥ ***</view>
						<view class="red_font" v-if="orderDetail.is_look==1">¥{{item.price}}/{{item.unit}}</view>
					</view>

					<view class="flex_left_right gray_font">
						<text>下单数量 : {{item.num}}</text>
						<text>配送数量 : {{item.weight}}</text>
					</view>
				</view>
			</view>
		</view>
		<image class="contact_phone" src="../../static/img/service.png" mode="aspectFit" @click="phone"></image>
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
				id: '',
				orderDetail: '',
				detail: ''
			};
		},
		methods: {
			/**
			 * 客服电话
			 */
			phone() {
				var that = this;
				console.log(that.orderDetail)
				uni.makePhoneCall({
					phoneNumber: that.orderDetail.tel
				})
			},
			LeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 订单详情
			 */
			orderInfo() {
				var that = this;
				var id = that.id;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					id: id,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					timeStamp: timeStamp,
					sign: sign,
					id: id,
				}
				rs.getRequests("orderInfo", data, (res) => {
					if (res.data.code == 200) {
						that.orderDetail = res.data.data;
						that.detail = res.data.data.orderInfo;
					} else {
						rs.Toast(res.data.msg)
					}
				})
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.id = options.orderItem
		},
		onShow() {
			app.aData.show = true;
			var that = this
			that.orderInfo()
		},
	};
</script>

<style>
	.order_detail .order_info>view {
		margin-top: 10rpx;
		background: white;
		padding: 0rpx 20rpx;
		font-size: 24rpx;
	}

	.order_detail .order_info .pay_info>view,
	.order_detail .order_info .money_info>view {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
	}

	.order_detail .pay_info>view>view:last-child,
	.order_detail .money_info>view>view:last-child {
		color: #808080;
		width: 74%;
		text-align: right;
	}

	.order_detail .pay_info>view:nth-child(n + 2)>view:first-child,
	.order_detail .money_info>view:nth-child(n + 2)>view:first-child {
		width: 100rpx;
		text-align: right;
	}

	.order_detail .contact_phone {
		width: 80rpx;
		height: 80rpx;
		position: fixed;
		bottom: 60rpx;
		right: 20rpx;
	}

	.order_detail .title {
		font-size: 28rpx;
		font-weight: 700;
		width: 150rpx;
	}

	.order_detail .good_info {
		padding: 10rpx 20rpx !important;
	}

	.order_detail .good_info .single_good {
		margin-top: 10rpx !important;
	}

	.order_detail .good_info .single_good>view {
		height: 40rpx;
	}

	.order_detail .good_info .labe {
		background: #FF3E1E;
		color: #fff;
		border-radius: 5rpx;
		padding: 0 5rpx;
		margin-right: 10rpx;
	}
</style>
