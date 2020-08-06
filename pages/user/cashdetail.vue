<template>
	<view class="cash_detail">
		<uni-nav-bar left-icon="arrowleft" title="现金劵信息" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="information">
			<view class="weight fourteen">
				<text  v-if="detailList.coupons_status == 2">正常</text>
				<text  v-if="detailList.coupons_status == 1">未开始</text>
				<text  v-if="detailList.coupons_status == 3">已使用</text>
				<text  v-if="detailList.coupons_status == 4">已过期</text>
			</view>
			<view class="keys_str">
				<view>
					<view>标签</view>
					<view>
						<text class="cash_se" :class="{cash_se2:detailList.coupons_status==2,
						cash_se1:detailList.coupons_status==1,cash_se3:detailList.coupons_status==3,cash_se4:detailList.coupons_status==4}"
						v-for="item in detailList.coupons_label">{{item}}</text>
					</view>
				</view>
				<view>
					<view>名称</view>
					<view>{{detailList.coupons_title}}</view>
				</view>
				<view>
					<view>面值</view>
					<view>{{detailList.money}}元</view>
				</view>
				<view>
					<view>余额</view>
					<view>{{detailList.residue}}元</view>
				</view>
				<view>
					<view>开始时间</view>
					<view>{{detailList.start_time}}</view>
				</view>
				<view>
					<view>结束时间</view>
					<view>{{detailList.expire_time}}</view>
				</view>
				<view>
					<view>描述</view>
					<view>{{detailList.describe}}</view>
				</view>
			</view>
		</view>
		<view class="usage_record">
			<view class="record_title">使用记录</view>
			<view>
				<view v-for="(item, index) in detailList.details" class="record_info">
					<text>{{item.order_sn}}</text>
					<text>{{item.spend}}元</text>
					<text>{{item.created_at}}</text>
				</view>
			</view>
			<view class="bitmap" v-if="exist">
				<image src="../../static/img/cash_record.png" mode=""></image>
				<text class="ten">无记录</text>
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
				exist: false,
				detailList: []
			};
		},
		filters: {
			// 根据后台的coupons_status字段来判断样式,以下是模拟,
			coupons_status(val) {
				switch (val) {
					case 1:
						return 'cash_se1';
					case 2:
						return 'cash_se2';
					case 3:
						return 'cash_se3';
					default:
						return 'cash_se4';
				}
			}
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			list() {
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var {
					id
				} = this;
				var obj = {
					appid: appid,
					id: id,
					timeStamp: timeStamp
				};  
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var params = Object.assign({
						sign: sign
					},
					obj
				);
			
				rs.getRequests('couponsDetails', params, res => {
					if (res.data.code == 200) {
						this.detailList = res.data.data;
						let length = res.data.data.details.length;
						if (!length) {
							this.exist = true;
						}
					}
				});
			}
		},
		onLoad: function(options) {
			let {
				id
			} = options;
		
			this.id = id;
		
			this.list();
		}
	};
</script>

<style lang="scss">
	.cash_detail {

		.information,
		.usage_record {
			background: white;
			padding: 20rpx;
			margin-top: 10rpx;
		}
	}

	.cash_detail .information .keys_str>view {
		display: flex;
		justify-content: space-between;
		padding: 10rpx 0;
		font-size: 24rpx;
	}

	.cash_detail .information .keys_str>view>view:first-child {
		width: 100rpx;
		text-align: right;
	}

	.cash_detail .information .keys_str>view>view:last-child {
		color: #808080;
	}

	.usage_record .record_title {
		text-align: center;
	}

	.usage_record .record_info {
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		padding: 10rpx 0;
	}

	.usage_record .bitmap {
		
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.usage_record .bitmap image {
		margin:30rpx 0 10rpx 0 ;
		width: 44rpx;
		height: 56rpx;
	}
	.cash_se {
		padding: 0 2px;
		border-radius: 3px;
		margin-left: 3px;
	}
	
	.cash_se1 {
		border: 1px solid #3D98FF;
		color: #3D98FF;
	}
	
	.cash_se2 {
		border: 1px solid #009A44;
		color: #009A44;
	}
	
	.cash_se3 {
		border: 1px solid #CD2D44;
		color: #CD2D44;
	}
	
	.cash_se4 {
		border: 1px solid #808080;
		color: #808080;
	}
</style>
