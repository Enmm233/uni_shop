<template>
	<view class="order_detail">
		<uni-nav-bar left-icon="arrowleft" title="分拣信息" :status-bar="navBar" fixed="true" @clickLeft="LeftClick"></uni-nav-bar>

		<view class="order_info">
			<!-- 支付信息 -->
			<view class="pay_info">
				<view>
					<view class="title">用户信息</view>
					<view></view>
				</view>
				<view>
					<view>单位编号</view>
					<view>{{list.code}}</view>
				</view>
				<view>
					<view>单位名称</view>
					<view>{{list.nickname}}</view>
				</view>
				<view>
					<view>收货人</view>
					<view>{{list.contact}}</view>
				</view>
				<view>
					<view>收货地址</view>
					<view>{{list.address}}</view>
				</view>


			</view>
			<!-- 商品信息 -->
			<view class="money_info">
				<view>
					<view class="title">商品信息</view>
					<view></view>
				</view>
				<view>
					<view>商品名称</view>
					<view>{{list.item_title}}</view>

				</view>
				<view>
					<view>规格</view>
					<view>{{list.attr_title}}</view>
				</view>
				<view>
					<view>预定量</view>
					<view>{{list.num}}</view>

				</view>
				<view>
					<view>分拣量</view>
					<view>{{list.weight}}</view>
				</view>

				<view>
					<view>备注</view>
					<view>{{list.remark}}</view>
				</view>


			</view>
			<view class="money_info">
				<view>
					<view class="title">其他信息</view>
					<view></view>
				</view>
				<view>
					<view>分拣员</view>
					<view>{{list.sorting_name}}</view>
				</view>
				<view>
					<view>分拣时间</view>
					<view>¥{{list.sorting_time}}</view>
				</view>
				<view>
					<view>配送路线</view>
					<view>{{list.line}}</view>
				</view>
				<view>
					<view>配送时间</view>
					<view>{{list.send_time}}</view>
				</view>

			</view>

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
				id: '',
				list: ''
			};
		},
		methods: {
			LeftClick() {
				uni.switchTab({
					url: '/pages/tabar/order'
				})
			},
			/**
			 * 分拣详情
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
				rs.getRequests("sortingDetail", data, (res) => {
					if (res.data.code == 200) {
						that.list = res.data.data;
                            if(res.data.data.is_trace_back>0){
								uni.navigateTo({
									url:"/pages/suyuan/index"
								})
								uni.setStorageSync('resultId',that.id)
							}
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
			this.id = options.id
		},
		onShow() {

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
