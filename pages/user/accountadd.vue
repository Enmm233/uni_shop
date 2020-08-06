<template>
	<view class="accountadd">
		<uni-nav-bar left-icon="arrowleft" title="账号添加" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>

		<view class="get_info">
			<view>
				<text>账号名称</text>
				<input type="text" v-model="nickname" placeholder="联系人姓名" placeholder-class="place_style" />
			</view>
			<view>
				<text>联系人</text>
				<input type="text" v-model="contact" placeholder="请输入联系人" placeholder-class="place_style" />
			</view>
			<view>
				<text>手机号</text>
				<input type="number" v-model="mobile" placeholder="请输入手机号" maxlength="11" placeholder-class="place_style" />
			</view>
			<view>
				<text>密码</text>
				<input type="password" v-model="password" placeholder="请输入六位及以上的密码" placeholder-class="place_style" />
			</view>
			<view @click="mapPage">
				<text>收货地址</text>
				<view class="flex_left_right" style="width: 83%;">
					<text class="hidden2">{{address}}</text>
					<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
				</view>
			</view>
			<view>
				<text>门牌号</text>
				<input type="text" v-model="details" placeholder="例如：5号509室" placeholder-class="place_style" />
			</view>
		</view>
		<view @click="formSubmit" class="submit_button button_style">保存</view>
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
				navBar: navBar,
				nickname: '',
				contact: '',
				mobile: '',
				password: '',
				address: '',
				details: '',
				longitude:'',
				latitude:'',
				hide:true,
				count:0
			};
		},
		methods: {
			leftClick() {
				this.hide = true;
				// #ifdef H5
				uni.navigateTo({
					url: "accountmange"
				})
				// #endif
				// #ifdef APP-PLUS |MP-WEIXIN |MP-ALIPAY
				uni.navigateBack({
					delta:1
				})
				// #endif
			},

			mapPage() {
				// #ifdef H5
				this.hide = false;
				var data = {
					childInfo:this.nickname,
					contact:this.contact,
					mobile:this.mobile,
					address:this.address,
					details:this.details,
					password:this.password,
				}
				var url = 'accountadd';
				uni.setStorageSync('append', data);
				uni.navigateTo({
					url: `address?url=${url}`
				})
				return;
				// #endif
				let that = this;
				uni.chooseLocation({
					success: function(res) {
						that.address = res.address;
						var obj = that.tobdMap(res.longitude, res.latitude);
						that.lng = obj.lng;
						that.lat = obj.lat;
					},
					fail: function(err) {
						console.log(err)
					}
				});
			},
			tobdMap(lng, lat) {
				let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
				let x = lng;
				let y = lat;
				let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
				let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
				let lngs = z * Math.cos(theta) + 0.0065;
				let lats = z * Math.sin(theta) + 0.006;
			
				return {
					lng: lngs,
					lat: lats
				}
			},
			formSubmit() {
				this.count++;
				if (this.count != 1) return;
				setTimeout(() => {
					this.count = 0
				}, 1000)
				var that = this;
				var nickname = that.nickname;
				var contact = that.contact;
				var mobile = that.mobile;
				var password = that.password;
				var address = that.address;
				var longitude = that.longitude;
				var latitude = that.latitude;
				var details = that.details;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
				  address: address,
				  appid: appid,
				  contact: contact,
				  mobile: mobile,
				  nickname: nickname,
				  password: password,
				  timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				if (nickname == "") {
				  rs.Toast("名称不能为空")
				  return false;
				}
				if (contact == "") {
				  rs.Toast("联系人不能为空")
				  return false;
				}
				if (mobile == "") {
				  rs.Toast("手机号不能为空")
				  return false;
				}
				if (password.length < 6) {
				  rs.Toast("密码不能小于六位数")
				  return false;
				}
				
				var data = {
				  address: address,
				  appid: appid,
				  contact: contact,
				  mobile: mobile,
				  nickname: nickname,
				  password: password,
				  timeStamp: timeStamp,
				  sign: sign,
				  longitude: longitude,
				  latitude: latitude,
				  details: details
				}
				rs.postRequests("addChild", data, (res) => {
				  if (res.data.code == 200) {
				    rs.Toast('添加成功')
				    setTimeout(function() {
				    	uni.navigateTo({
				    		url: "accountmange"
				    	})
				    }, 1000);
				  }else{
				    rs.Toast(res.data.msg)
				  }
				})
			}
		},
		onLoad(options) {
			var data = uni.getStorageSync('append');
			console.log(uni.getStorageSync('append'))
			if(data){
				this.nickname = data.childInfo;
				this.contact = data.contact;
				this.mobile = data.mobile;
				this.password = data.password;
				this.address = data.address;
				this.details = data.details;
			}
			this.latitude = options.lat;
			this.longitude = options.lng;
		},
		onHide(){
			if(this.hide == true){
				uni.removeStorage({ key: 'append'})
			}
		}
	};
</script>

<style>
	.accountadd .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.accountadd .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.accountadd .get_info>view>text {
		width: 150rpx;
		color: #808080;
	}

	.accountadd .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
	}
</style>
