<template>
	<view class="delivery">
		<uni-nav-bar left-icon="arrowleft" title="收货地址" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>

		<view class="get_info">
			<view>
				<text>联系人</text>
				<input type="text" v-model="contact" placeholder="联系人姓名" placeholder-class="place_style" />
			</view>
			<view>
				<text>手机号</text>
				<input type="number" v-model="mobile" placeholder="请输入手机号" placeholder-class="place_style" />
			</view>
			<view @click="mapPage">
				<text>收货地址</text>
				<view class="flex_left_right" style="width: 83%;">
					<text>{{address?address:''}}</text>
					<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
				</view>
			</view>
			<view>
				<text>门牌号</text>
				<input type="text" v-model="details" placeholder="例如：5号509室" placeholder-class="place_style" />
			</view>
		</view>
		<view class="submit_button button_style" @click="submit">保存</view>

	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	let {
		log
	} = console;
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
				address: '',
				contact: '',
				details: '',
				mobile: '',
				childzid: '',
				navBar: navBar,
				lat: '',
				lng: '',
				count:0
			};
		},
		methods: {
			leftClick() {
				uni.switchTab({
					url: '../tabar/shopcart'
				})
			},
			mapPage() {
				let that = this;
				// #ifdef H5
				
				uni.navigateTo({
					url: `address?contact=${this.contact}&mobile=${this.mobile}&address=${this.address}&details=${this.details}&lat=${that.lat}&lng=${that.lng}`
				})
				return;
				// #endif

				uni.chooseLocation({
					success: function(res) {
						// console.log('位置名称：' + res.name);
						that.address = res.address;
						that.lat = res.latitude;
						that.lng = res.longitude;
					}
				});
			},
			memberAddressInfo() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};

				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					select_zid: this.childzid,
					sign: sign
				}, obj)
				rs.getRequests("memberAddressInfo", params, (res) => {
					// console.log(res)
					if (res.data.code == 200) {
						let data = res.data.data;
						this.contact = data.contact;
						this.mobile = data.phone;
						this.address = data.address;
						this.details = data.details;
					}
				})
			},
			submit() {
				var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
				if (!this.contact) {
					rs.Toast('联系人不能为空');
					return;
				}
				if (!this.mobile) {
					rs.Toast('手机号不能为空');
					return;
				}
				if (!reg.test(this.contact)) {
					rs.Toast('输入的信息不能含有特殊字符和空格');
					return;
				}
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},500)
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					contact: this.contact,
					mobile: this.mobile,
					address: this.address,
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign,
					details: this.details,
					latitude: this.lat,
					longitude: this.lng
				}, obj)
				rs.postRequests("updateAddress", params, (res) => {
					if (res.data.code == 200) {
						rs.Toast('保存成功');
						setTimeout(() => {
							this.leftClick();
						}, 1000);

					} else {
						rs.Toast(res.data.msg);
					}

				})
			},
		},
		onLoad(option) {
			this.childzid = option.childzid;
			this.contact = option.contact;
			this.mobile = option.mobile;
			this.address = option.address;
			this.details = option.details;
			let count = option.count || 1;
			// console.log(option.count)
			if (count == 1) {
				
					this.memberAddressInfo()
			}
		},



	};
</script>

<style>
	.delivery .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.delivery .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.delivery .get_info>view>text {
		width: 150rpx;
		color: #808080;
	}

	.delivery .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
		
	}
	.delivery input{padding:0;}
	.delivery text-no-space{white-space: pre-line;}
</style>
