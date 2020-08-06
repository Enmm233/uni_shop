<template>
	<view class="modifypwd">
		<uni-nav-bar left-icon="arrowleft" title="修改密码" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>
		<view class="get_info">
			<view>
				<text>原密码</text>
				<input type="password" v-model="old_pwd" placeholder="请输入原密码" placeholder-class="place_style" />
			</view>
			<view>
				<text>新密码</text>
				<input type="password" v-model="password" placeholder="请填写六位及以上的密码" placeholder-class="place_style" />
			</view>
			<view>
				<text>确认密码</text>
				<input type="password" v-model="password_confirmation" placeholder="请再次确认密码" placeholder-class="place_style" />

			</view>
		</view>
		<view class="submit_button button_style" @click="formSubmit">保存</view>
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
				old_pwd:'',  //旧密码
				password:'',  //旧密码
				password_confirmation:'',  //旧密码
				navBar: navBar,
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
				var old_pwd = this.old_pwd;
				var password = this.password;
				var password_confirmation = this.password_confirmation;
				var timeStamp = Math.round(new Date().getTime() / 1000);
				var obj = { appid: appid, old_pwd: old_pwd, password: password, password_confirmation: password_confirmation, timeStamp: timeStamp, }
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				if (old_pwd == "") {
				  rs.Toast("原始密码不能为空")
				  return false;
				}
				if (password.length < 6) {
				  rs.Toast("密码不能小于六位数")
				  return false;
				}
				if (password_confirmation != password) {
				  rs.Toast("密码不一致")
				  return false;
				}
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},500)
				var data = { appid: appid, old_pwd: old_pwd, password: password, password_confirmation: password_confirmation, timeStamp: timeStamp, sign: sign, }
				rs.postRequests("modifyPassword", data, (res) => {
				  if (res.data.code == 200) {
					  rs.Toast('修改成功');
					  setTimeout(() => {
					  	uni.navigateTo({
					  		url:"/pages/account/login"
					  	})
					  }, 1000);
				  }
				  if(res.data.code == 400){
				    rs.Toast(res.data.msg)
				  } 
				})
			}
		}
	};
</script>

<style>
	.modifypwd .get_info {
		background: white;
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.modifypwd .get_info>view {
		display: flex;
		height: 80rpx;
		align-items: center;
		border-bottom: 1px solid #f7f6f6;
	}

	.modifypwd .get_info>view>text {
		width: 150rpx;
		color: #808080;
	}

	.modifypwd .button_style {
		font-size: 32rpx;
		width: 384rpx;
		height: 64rpx;
		line-height: 64rpx;
	}
</style>
