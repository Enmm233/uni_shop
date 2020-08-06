<template>
	<view class="newback">
		<uni-nav-bar left-icon="arrowleft" title="新品反馈" :status-bar="navBar" fixed="true" @clickLeft="leftClick"></uni-nav-bar>


		<view class="xp-con"><textarea maxlength="60" show-confirm-bar=false placeholder-style="font-size:14px;" placeholder="商城没有您要的商品？请提供资料我们帮您找..." v-model="contents"></textarea></view>
		 <!-- #ifndef MP-ALIPAY -->
		 <view class="text_length">
		 	{{contents.length}}/60
		 </view>
		 <!-- #endif -->
		
		<view class="xp-sc">
			<block v-for="(item, index) in img" :key="index" v-if="img != ''">
				<view class="select-photo">
					<!-- <van-icon name="cross" class="delete-icon" @click="deletePhoto(index)" /> -->
					<text class="delete-icon iconfont icon-X" @click="deletePhoto(index)"></text>
					<image class="xp-sc-img" :src="item.src"></image>
				</view>
			</block>

			<view class="xp-sc-left" @click="uploadImg" v-if="img.length < 3"></view>
			<view class="xp-sc-right">(最多上传3张照片)</view>
		</view>
		<view class="xp-tj"><button @click="feedBack">提交</button></view>

	</view>
</template>

<script>
	import md5 from '../../static/js/md5.js';
	import rs from '../../static/js/request.js';
	let app = getApp().globalData;
	let {
		appid,
		navBar,
		appsecret,
		rootUrl,
		imgUrl
	} = app;
	export default {
		data() {
			return {
				imgUrl: app.imgUrl,
				img: [],
				contents: '',
				navBar: navBar,
				count:0,
			};
		},
		methods: {
			leftClick() {
				uni.hideKeyboard()
				setTimeout(()=>{uni.navigateBack({
					delta: 1
				});},300)
				
			},
			deletePhoto(e) {

				let {
					img
				} = this;
				img.splice(e, 1);
			},
			uploadImg() {
				var that = this;
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						var media_id = res.tempFilePaths;

						var feed = 'feed';
						var timeStamp = Math.round(new Date().getTime() / 1000);
						var obj = {
							appid: appid,
							type: feed,
							timeStamp: timeStamp
						};

						var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
						for (var i = 0; i < media_id.length; i++) {
							uni.uploadFile({
								method: 'POST',
								url: rootUrl + '/mobileOrder/uploadImg', //此处换上你的接口地址
								name: 'img',
								header: {
									Authorization: uni.getStorageSync('cdj_token')
								},
								formData: {
									appid: appid,
									timeStamp: timeStamp,
									type: feed,
									img: media_id,
									sign: sign
								},
								filePath: media_id[i],
								success: function(res) {
									var img = JSON.parse(res.data);
									if (img.code == 200) {
										that.img.push(img.data);
									} else if (img.code == 401) {
										rs.Toast('请先登录')
										setTimeout(() => {
											uni.navigateTo({
												url: '/pages/account/login'
											})
										}, 1000)
										
									} else {
										rs.Toast(img.msg)
									}

								}
							});
						}
					}
				});
			},
			feedBack() {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				var that = this
				var img = that.img;
				let path = [];
				for (let i of img) {
					path.push(i.path)
				}
				console.log(path)
				var contents = that.contents;
				var timeStamp = Math.round(new Date().getTime() / 1000);

				var obj = {
					appid: appid,
					contents: contents,
					timeStamp: timeStamp,
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				var data = {
					appid: appid,
					contents: contents,
					img: path,
					timeStamp: timeStamp,
					sign: sign,
				}
				rs.postRequests("feedBack", data, (res) => {
					if (res.data.code == 200) {
						rs.Toast('提交成功')
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabar/index',
							})
						}, 1000)
					} else {
						rs.Toast(res.data.msg)
					}
				})
			}
		}
	};
</script>

<style>
	body {
		background: #f7f6f6;
	}

	.feedback {
		margin-top: 5px;
	}

	.feedback .inp {
		background: #ffffff;
		padding: 15px;
		border-bottom: 1px solid #f7f6f6;
	}

	.feedback .inp textarea {
		width: 100%;
		font-size: 14px;
	}

	.feedback .img_box {
		background: #ffffff;
		padding: 15px;
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #1a1a1a;
	}

	.feedback .img_box .img {
		border: 1px dotted #808080;
		width: 60px;
		height: 60px;
		text-align: center;
		margin-right: 10px;
	}

	.feedback .img_box .img image {
		width: 30px;
		height: 30px;
		margin-top: 15px;
	}

	.feedback .btn {
		padding: 0 25%;
		margin-top: 30px;
	}

	.feedback .btn button {
		font-size: 14px;
		background: #009a44;
		color: #fff;
	}

	.xp-nav {
		border-top: 15rpx solid #f5f5f5;
		line-height: 85rpx;
		font-size: 28rpx;
		color: #333;
		padding-left: 30rpx;
		/* border-bottom:1rpx #f0f0f0 solid; */
		font-weight: bolder;
	}

	.xp-con {
		margin-top: 10rpx;
		height: 280rpx;
		border-bottom: 1rpx #f0f0f0 solid;
		font-size: 26rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
		background: white;
	}

	.xp-con textarea {
		padding-top: 30rpx;
		height: 240rpx;
		width: 690rpx;
	}

	.select-photo {
		margin-left: 20rpx;
		width: 120rpx;
		height: 120rpx;
	}

	.xp-sc {
		background: white;
		/* border-bottom:1rpx #f0f0f0 solid; */
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		font-size: 24rpx;
		color: #999;
		/* margin-left: 30rpx;
  margin-right: 30rpx; */
		display: flex;
	}

	.xp-sc image {
		width: 120rpx;
		height: 120rpx;
		/* margin-right: 30rpx; */
		/* background: transparent; */
		border: 1rpx #fff dashed;
	}

	.xp-sc-left {
		background-image: url(../../static/img/feedback.png);
		background-repeat: no-repeat;
		background-position: center;
		margin: 0 20rpx;
		width: 120rpx;
		height: 120rpx;
		border: 1rpx #ebedf0 dashed;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.xp-sc-left i {
		font-size: 100rpx;
		line-height: 160rpx;
	}

	.xp-sc-right {
		line-height: 160rpx;
		margin-left: 30rpx;
	}

	.xp-tj {
		margin-top: 70rpx;
		font-size: 30rpx;
		display: flex;
		justify-content: center;
	}

	.xp-tj button {
		line-height: 72rpx;
		width: 400rpx;
		background: #009a44;
		color: #fff;
		height: 72rpx;
	}

	.delete-icon {
		background: #808080;
		border-radius: 50%;
		position: absolute;
		margin: -12rpx 0 0 105rpx;
		color: white;
		width: 30rpx;
		height: 30rpx;
		z-index: 8;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 15rpx;
	}
	.newback .text_length{position: absolute;font-size: 20rpx;color:gray;right:20rpx;margin-top:-40rpx;}
</style>
