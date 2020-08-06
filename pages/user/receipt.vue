<template>
	<view class="receipt">
		<uni-nav-bar left-icon="arrowleft" title="开具发票" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="receipt_select">
			<view class="receipt_type">
				<view class="enterprise" :class="isactive==true?'checked':''" @click="receipType">企业发票</view>
				<view class="person" :class="isactive==false?'checked':''" @click="receipType">个人单位</view>
			</view>
			<view class="caution">注 : 电子发票和纸质发票具有同等法律效率，可支持报销入账</view>
		</view>
		<view class="get_info">
			<view>
				<text>发票抬头</text>
				<input type="text" v-model="header" placeholder="请填写发票抬头" placeholder-class="place_style" />
			</view>
			<view>
				<text>税号</text>
				<input type="text" v-model="number" placeholder="请填写纳税人识别号" placeholder-class="place_style" />
			</view>
			<view>
				<text>发票内容</text>
				<input type="text" v-model="content" placeholder="请填写发票内容" placeholder-class="place_style" />
			</view>
			<view>
				<text>发票金额</text>
				<input type="number" v-model="price" placeholder="请输入金额" placeholder-class="place_style" style="width: 130rpx;color:red;" />
				<view>元</view>
			</view>
		</view>
		<view @click="formSubmit" class="submit_button button_style">保存</view>
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
				isactive: true,
				types: 1,
				header:'',
				number:'',
				content:'',
				price:'',
				count:0
			};
		},
		methods: {
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			formSubmit() {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				var that = this;
				var header = that.header;
				var number = that.number;
				var content = that.content;
				var price = that.price;
				var type = that.types;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = { appid: appid, content: content, header: header, number: number, price: price, timeStamp: timeStamp, type: type };
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = { appid: appid, content: content, header: header, number: number, price: price, timeStamp: timeStamp, sign: sign, type: type };
				rs.postRequests('handleBill', data, res => {
					if (res.data.code == 200) {
						rs.Toast('提交成功');
						setTimeout(function() {
							uni.navigateBack({});
						}, 1000);
					} else {
						rs.Toast(res.data.msg);
					}
				});
			},
			receipType() {
				this.isactive = !this.isactive;
				if (this.isactive == true) {
					this.types = 1;
				} else if (this.isactive == false) {
					this.types = 2;
				}
			},
			/**
			 * 发票信息
			 */
			billInfoa() {
				var that = this;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					timeStamp: timeStamp,
					sign: sign
				};
				rs.getRequests('billInfo', data, res => {
					if (res.data.code == 200) {
						that.header = res.data.data.header;
						that.number = res.data.data.number;
						that.content = res.data.data.content;
						that.price = res.data.data.price;
						that.types = res.data.data.type;
						if (that.billInfo.type == 1) {
							that.isactive = true;
						} else if (that.billInfo.type == 2) {
							that.isactive = false;
						}
					}
				});
			}

		},
		onShow: function() {
			var that = this;
			that.billInfoa();
		}
	};
</script>

<style>
	.receipt .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.receipt .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.receipt .get_info>view>text {
		width: 120rpx;
		text-align: right;
		margin-right: 30rpx;
		color: #808080;
	}

	.receipt .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	.receipt .receipt_select {
		margin-top: 10rpx;
	}

	.receipt .receipt_select .caution {
		font-size: 20rpx;
		color: red;
		text-align: center;
		margin-top: 3rpx;
	}

	.receipt .receipt_type {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.receipt .receipt_type>view {
		width: 164rpx;
		height: 46rpx;
		border: 1px solid #009a44;
		text-align: center;
		line-height: 46rpx;
		color: #009A44;
	}

	.receipt .receipt_type .enterprise {
		border-radius: 4rpx 0 0 4rpx;
	}

	.receipt .receipt_type .person {
		border-radius: 0rpx 4rpx 4rpx 0;
	}

	.receipt .checked {
		background: #009A44;
		color: white !important;
	}
</style>
