<template>
	<view class="accountedit">
		<uni-nav-bar left-icon="arrowleft" title="账号编辑" :status-bar="navBar" fixed="true" @clickLeft="leftClick" right-text="删除"
		 @clickRight="deleteAccount"></uni-nav-bar>
		<form @submit="formSubmit">
			<view class="get_info">
				<view>
					<text>账号名称</text>
					<input name="nickname" type="text" :value="childInfo.nickname" placeholder="联系人姓名" placeholder-class="place_style" />
				</view>
				<view>
					<text>联系人</text>
					<input name="contact" type="text" :value="childInfo.contact" placeholder="请输入联系人" placeholder-class="place_style" />
				</view>
				<view>
					<text>手机号</text>
					<input name="mobile" type="number" :value="childInfo.phone" placeholder="请输入手机号" maxlength="11" placeholder-class="place_style" />
				</view>
				<view>
					<text>密码</text>
					<input name="password" type="password" v-model="password" placeholder="请输入六位及以上的密码" placeholder-class="place_style" />
				</view>
				<view class="flex_left_right">
					<view style="color:#1EA55A;">账号启用和禁用</view>
					<evan-switch v-model="checked" active-color="#1EA55A" @change="openStatu"></evan-switch>
				</view>
				<view @click="mapPage">
					<text>收货地址</text>
					<view class="flex_left_right" style="width: 83%;">
						<text class="hidden2">{{ childInfo.address }}</text>
						<uni-icons type="arrowright" size="18" color="gray"></uni-icons>
					</view>
				</view>
				<view>
					<text>门牌号</text>
					<input name="details" type="text" :value="childInfo.details" placeholder="例如：5号509室" placeholder-class="place_style" />
				</view>
			</view>
			<button form-type="submit" class="submit_button button_style">保存</button>
		</form>
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
				checked: false,
				status: '',
				childInfo: '',
				select_zid: '',
				longitude: '',
				latitude: '',
				save: true,
				password: '',
				count: '',
				hide: '',
				clickcount: 0
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
					delta: 1
				})
				// #endif

			},
			urlPage() {
				if (this.save == false) {
					uni.showModal({
						title: '放弃编辑',
						content: '地址信息未保存，确定离开吗？',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "accountmange"
								})
							} else if (res.cancel) {}
						}
					});
				} else {
					uni.navigateTo({
						url: "accountmange"
					})
				}
			},

			mapPage() {
				// #ifdef H5
				this.hide = false;
				var data = {
					childInfo: this.childInfo,
					password: this.password,
					select_zid: this.select_zid
				}
				var url = 'accountedit';
				uni.setStorageSync('amend', data);
				uni.navigateTo({
					url: `address?url=${url}`
				})
				return;
				// #endif
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						// console.log('位置名称：' + res.name);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);
						that.childInfo.address = res.address
						var obj = that.tobdMap(res.longitude, res.latitude);
						that.lng = obj.lng;
						that.lat = obj.lat;
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
			deleteAccount() {
				var that = this
				uni.showModal({
					title: '提示',
					content: '是否删除该子账号？',
					success: function(res) {
						if (res.confirm) {
							// console.log('用户点击确定');
							var select_zid = that.select_zid;
							var timeStamp = Math.round(new Date().getTime() / 1000);
							var obj = {
								appid: appid,
								select_zid: select_zid,
								timeStamp: timeStamp,
							}
							var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
							var data = {
								appid: appid,
								timeStamp: timeStamp,
								select_zid: select_zid,
								sign: sign,
							}
							rs.getRequests("delChild", data, (res) => {
								if (res.data.code == 101) {
									rs.Toast('该账号已产生数据，无法删除')
								}
								if (res.data.code == 200) {
									rs.Toast('删除成功')
									setTimeout(function() {
										uni.navigateTo({
											url: "accountmange"
										})
									}, 1000);
								}
							})
						} else if (res.cancel) {
							// console.log('用户点击取消');
						}
					}
				});

			},
			openStatu(e) {
				var that = this;
				that.checked = e.target.value;
			},
			memberAddressInfo() {
				var that = this;
				var select_zid = that.select_zid;
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
					select_zid: select_zid
				}
				rs.getRequests("memberAddressInfo", data, (res) => {
					if (res.data.code == 200) {
						that.childInfo = res.data.data;
						that.status = res.data.data.status;
						if (that.status == 0) {
							that.checked = false
						} else if (that.status == 1) {
							that.checked = true
						}
					}
				})
			},
			formSubmit(e) {
				this.clickcount++;
				if(this.clickcount!=1)return;
				setTimeout(()=>{this.clickcount=0},500)
				var that = this;
				var zid = that.select_zid;
				if (that.checked == false) {
					var status = 0;
				} else if (that.checked == true) {
					var status = 1;
				}
				var nickname = e.detail.value.nickname;
				var contact = e.detail.value.contact;
				var mobile = e.detail.value.mobile;
				var password = e.detail.value.password;
				var address = that.childInfo.address;
				var longitude = that.longitude;
				var latitude = that.latitude;
				var details = e.detail.value.details;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					address: address,
					appid: appid,
					contact: contact,
					mobile: mobile,
					nickname: nickname,
					password: password,
					status: status,
					timeStamp: timeStamp,
					zid: zid,
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
				
				var data = {
					address: address,
					appid: appid,
					contact: contact,
					mobile: mobile,
					nickname: nickname,
					password: password,
					status: status,
					zid: zid,
					timeStamp: timeStamp,
					sign: sign,
					longitude: longitude,
					latitude: latitude,
					details: details
				}
				rs.postRequests("editChild", data, (res) => {
					if (res.data.code == 200) {
						rs.Toast('修改成功')
						that.save = true;
						setTimeout(function() {
							uni.navigateTo({
								url: "accountmange"
							})
						}, 1000);
					}
					if (res.data.code == 400) {
						rs.Toast(res.data.msg)
					}
				})
			},
		},
		onLoad(options) {
			var data = uni.getStorageSync('amend');
			if (data) {
				this.childInfo = data.childInfo;
				this.password = data.password;
				this.select_zid = data.select_zid;
			} else {
				this.select_zid = options.select_zid;
			}
			this.latitude = options.lat;
			this.longitude = options.lng;
			this.count = options.count || 1;
			if (this.count == 1) {
				this.memberAddressInfo()
			}
		},
		onHide() {
			if (this.hide == true) {
				uni.removeStorage({
					key: 'amend'
				})
			}
		}
	};
</script>

<style>
	.accountedit .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.accountedit .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.accountedit .get_info>view>text {
		width: 150rpx;
		color: #808080;
	}

	.accountedit .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
	}
</style>
