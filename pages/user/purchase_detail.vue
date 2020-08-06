<template>
	<view class="purchase_detail">
		<uni-nav-bar left-icon="back" left-text=" " title="详细记录" :status-bar="navBar" fixed="true" @clickLeft="urlPage"></uni-nav-bar>
		<view class="bill_record">
			<view class="record_box">
				<view class="img">
					<image :src="detailItem.item_url"></image>
				</view>
				<view class="record_detail">
					<view class="top">
						<view class="left">
							<view class="title">
								{{detailItem.item_title}}
							</view>
							<view class="txt">
								{{detailItem.describe}}
							</view>
							<view class="txt" v-if="detailItem.attr_title">
								【{{detailItem.attr_title}}】
							</view>
						</view>

					</view>
					<view class="flex_left_right">
						<view>总量:{{count}}</view>
						<view class="bottom">
							合计：<text>¥{{detail.total}}</text>
						</view>
					</view>

				</view>
			</view>
		</view>

		<view class="pur_list">
			<view class="item" v-for="item in detail.list">
				<view class="left">
					<view class="time">
						{{item.send_time}}
					</view>
					<view class="num">
						<text>数量：{{item.nums}}{{detailItem.unit}}</text>
						<text>单价：¥{{item.price}}</text>
					</view>
				</view>
				<view class="right">
					小计：¥{{item.subtotal}}
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
				imgUrl: app.imgUrl,
				data: '',
				detail: '',
				detailItem: '',
				count: ''
			};
		},
		methods: {
			urlPage() {
				uni.navigateBack({
					delta: 1
				});

			},
			/**
			 * 购买记录
			 */
			recordDetail() {
				var that = this;
				var data = that.data;
				// console.log(data)
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					timeStamp: timeStamp,
					sign: sign,
					item_id: data.item_id,
					attr_id: data.attr_id,
					start: data.date[0],
					end: data.date[1],
				}
				rs.getRequests("buyRecordDetail", data, (res) => {
					if (res.data.code == 200) {
						that.detail = res.data.data;
						that.detailItem = res.data.data.item;
						let sum = 0;
						for (let i of res.data.data.list) {
							sum += parseFloat(i.nums);
						}
						this.count = sum;
					} else {
						rs.Toast(res.data.msg)
					}
				})
			},

		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			var that = this;
			getApp().globalData.isReload = false;
			that.recordDetail()
		},
		onLoad(options) {
			this.data = JSON.parse(options.obj);
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {

		},
	};
</script>

<style>
	page {
		background: #FFFFFF !important;
	}

	.purchase_detail .record_detail {
		width: 100%;
	}

	.uni-searchbar__box {
		border-style: none !important;
	}

	.uni-searchbar {
		padding: 0 10px 20px;
		position: fixed !important;
		width: 94%;
	}

	.bill_record {
		background: #FFFFFF;
		padding: 10px 15px;
		border-top: 10rpx #F7F6F6 solid;
		border-bottom: 10rpx #F7F6F6 solid;
	}

	.bill_record .record_box {
		display: flex;
		align-items: center;
	}

	.bill_record .record_box .img {
		width: 100px;
		height: 80px;
		margin-right: 10px;
	}

	.bill_record .record_box .img image {
		width: 100px;
		height: 80px;
	}

	.bill_record .record_box .record_detail .top {
		display: flex;
		justify-content: space-between;
	}

	.bill_record .record_box .record_detail .top .left {
		width: 80%;
	}

	.bill_record .record_box .record_detail .top .right {
		font-size: 12px;
	}

	.bill_record .record_box .record_detail .top .title {
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}

	.bill_record .record_box .record_detail .top .txt {
		font-size: 12px;
		color: #C1C1C1;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.bill_record .record_box .record_detail .top .txt:nth-child(2) {
		color: #808080;
	}

	.bill_record .record_box .record_detail .bottom {
		/* 	margin-top: 10px;
		text-align: end;
		font-size: 14px; */
	}

	.bill_record .record_box .record_detail .bottom text {
		color: #FF3E1E;
	}

	.pur_list .item {
		padding: 10px;
		border-bottom: 1px solid #F7F6F6;
		background: #ffffff;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}

	.pur_list .item .time {
		margin-bottom: 5px;
	}

	.pur_list .item .num,
	.pur_list .item .right {
		font-size: 12px;
		color: #808080;
	}

	.pur_list .item .num text {
		margin-right: 10px;
	}
</style>
