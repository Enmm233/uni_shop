<template>
	<view class="myinfo">
		<uni-nav-bar v-if="showtitle" left-icon="arrowleft" title="个人信息" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<uni-nav-bar v-else title="裁剪" :status-bar="navBar" fixed="true" color="white" background-color="black"></uni-nav-bar>

		<view class="get_info">
			<view class="flex_left_right avator">
				<text>头像</text>
				<view class="align_center" @tap="upload">
					<image class="goods_img" v-if="cropFilePath" :src='cropFilePath' mode='scaleToFill'></image>
					<image class="goods_img" v-if="!cropFilePath" :src='imgRemote+member_default '></image>
					<uni-icons type="arrowright" size="18" color="black"></uni-icons>
				</view>
			</view>
			<view>
				<text>单位名称</text>
				<input type="text"  v-model="nickname" placeholder="请输入单位名称" placeholder-class="place_style" />
			</view>
			<view class="flex_left_right" @click="bindPhonePage">
				<text v-if="!phone">绑定手机号</text>
				<text v-if="phone">更换手机号</text>
				<view>
					<text>{{phone}}</text>
					<uni-icons type="arrowright" size="18" color="black"></uni-icons>
				</view>
			</view>
			<block v-if="memberInfoData.is_password==0">
				<view>
					<text>密码</text>
					<input type="number" v-model="password" placeholder="请输入六位及以上的密码" placeholder-class="place_style" />
				</view>
				<view>
					<text>确认密码</text>
					<input type="number" v-model="confirmPwd" placeholder="请再次确认登录密码" placeholder-class="place_style" />
				</view>
			</block>
		</view>
		<view class="submit_button button_style" @click="formSubmit">保存</view>
		<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
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
	import ImageCropper from '@/components/ling-imgcropper/ling-imgcropper.vue';
	export default {
		components: {
			ImageCropper
		},
		data() {
			return {
				tempFilePath: '',
				cropFilePath: '',
				showtitle: true,
				navBar: navBar,
				imgUrl: app.imgUrl,
				imgRemote: imgRemote,
				phone: '',
				memberInfoData: '',
				member_default: '',
				nickname: '',
				password:'',
				confirmPwd:'',
				imgPath:'',
				count:0
			};
		},
		methods: {
			memberInfo() {
				var that = this
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
				}
				rs.getRequests("memberInfo", data, (res) => {
					if (res.data.code == 200) {
						var reg = /^(\d{3})\d*(\d{4})$/;
						
						that.memberInfoData = res.data.data.info;
						that.cropFilePath = that.memberInfoData.logo;
						that.nickname = that.memberInfoData.nickname;
						that.member_default = res.data.data.member_default;
						that.phone = res.data.data.info.phone.replace(reg, '$1****$2')
					}
				})
			},
			leftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			bindPhonePage() {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				uni.navigateTo({
					url: 'bindphone'
				})
			},
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					success: res => {
						this.showtitle = false;
						this.tempFilePath = res.tempFilePaths.shift();
					}
				});
			},
			confirm(e) {
				this.showtitle = true;
				this.tempFilePath = '';
				var media_id = e.detail.tempFilePath;
				var feed = "avatars";
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					type: feed,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var that = this
				uni.uploadFile({
					method: 'POST',
					url: app.rootUrl + "/mobileOrder/uploadImg", //此处换上你的接口地址
					name: 'img',
					header: {
						'Authorization': uni.getStorageSync('cdj_token'),
					},
					formData: {
						appid: appid,
						timeStamp: timeStamp,
						type: feed,
						img: media_id,
						sign: sign,
					},
					filePath: media_id,
					success: function(res) {
						var imga = JSON.parse(res.data);
						that.imgPath = imga.data.path
						that.cropFilePath = imga.data.src;   
						that.uploadAvatar()
					},
				})
				
				
			},
			//确认更换头像
			uploadAvatar() {
				var that = this
				var img = that.imgPath;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					img: img,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					img: img,
					timeStamp: timeStamp,
					sign: sign
				}
				rs.postRequests("uploadAvatar", data, (res) => {
					if (res.data.code == 200) {
						uni.showToast({
							title: "更换头像成功",
							icon: 'none'
						})
					}
				})
			},
			formSubmit() {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				var that = this;
				if(that.memberInfoData.is_password==0){
					if(!that.password){
					  rs.Toast('密码不能为空');
					  return;
					}
					if(!that.confirmPwd){
					  rs.Toast('确认密码不能为空');
					  return;
					}
					if(that.password!=this.confirmPwd){
					  rs.Toast('密码和确认密码不一致');
					  return;
					}
				}
				
				var nickname = that.nickname.replace(/\s+/g, "");
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = {
					appid: appid,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					nickname: nickname,
					password:that.password,
					confirm_pwd:that.confirmPwd,
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.postRequests("saveMemberInfo", data, (res) => {
					if (res.data.code == 200) {
						rs.Toast("修改成功")
						setTimeout(function() {
							uni.navigateBack({
								delta:1
							})
						}, 1000);
			
					} else {
						rs.Toast(res.data.msg)
					}
				})
			},
			
			cancel() {
				this.showtitle = true;
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			var that = this;
			that.memberInfo();
		},
	};
</script>

<style>
	.myinfo .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.myinfo .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.myinfo .get_info>view>text {
		width: 150rpx;
		color: #808080;
	}

	.myinfo .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
	}

	.myinfo .get_info .avator {
		height: 120rpx;
	}

	.myinfo .avator image {
		width: 80rpx !important;
		height: 80rpx;
		border-radius: 50%;
	}
</style>
