<template>
	<view class="search_list">

		<view class="fixed">
			<!-- #ifdef APP-PLUS |H5 -->

			<view class="status_bar fixed white_b">
				<!-- 这里是状态栏 -->
			</view>
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<!-- #endif -->
			<view class="input_key">
				<view class="arrow_left" @click="back">
					<uni-icons type="arrowleft" size="25"></uni-icons>
				</view>
				<view class="flex_left_right right_area">
					<view class="select_key align_center">
						<text class="iconfont icon-sousuo"></text>
						<input v-model="keyword" placeholder="请输入商品名称" @focus="focus" placeholder-class="place_style" class="keyword" />
						<!-- #ifndef MP-ALIPAY -->
							<uni-icons type="mic-filled" size="20" color="#808080" @click="speed"></uni-icons>
						<!-- #endif -->
					
					</view>
					<view style="color:#009B44;" @click="submit">搜索</view>
				</view>
			</view>
		</view>

		<!-- #ifdef APP-PLUS |H5 -->
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<!-- #endif -->
		<view style="height:109rpx;"></view>
		<!-- 热门搜索 -->
		<view class="hot_search" v-if="showSearch">
			<view class="title">热门搜索</view>
			<view class="key_tag"><text v-for="(item, index) in keyList" :key="index" @click="searchList(item.keywords)">{{item.keywords}}</text></view>
		</view>
		<!-- 搜索结果 -->
		<view class="search_result" v-else>
			<my-profile v-for="(item,index) in list" :wares="item" :config="config" :key="index" @showCart="openCart(item)"
			 @showKey="showKey(item,index)"></my-profile>
			<!-- 占位图 -->
			<view class="search_bitmap" v-if="bitmap">
				<image class="bitmap" src="../../static/img/no_content.png" mode="aspectFit"></image>
			</view>
		</view>

		<uni-popup ref="speech" type="bottom">
			<view class="lang_search">
				<text class="iconfont icon-X" @click="$refs.speech.close()"></text>

				<view style="display: flex;justify-content: center;align-items: center;height: 371rpx;">
					<view v-if="startSpeech" class="correct">
						<view>正在倾听</view>
						<view>请说出你想要的的内容</view>
					</view>
					<view v-else class="error_txt">
						<view>没有听清,请重试</view>
						<view>点击说话</view>
						<view style="height: 40rpx;line-height: 14rpx;">
							<uni-icons type="arrowdown" size="18" color="#009943"></uni-icons>
						</view>
						<view style="margin-top:10rpx;" @click="speed">
							<uni-icons type="mic-filled" size="40" color="white" class="mic_filled"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	
		
		<uni-popup ref="popup" type="bottom" @maskInfo="closeKey">
			<my-keyboard @cancelKey="$refs.popup.close()" :arrObj="arrObj" @toParent="toParent" ref="keyboard"></my-keyboard>
		</uni-popup>
		<uni-popup ref="cart" type="bottom" @maskInfo="closeCart">
			<my-addcart @onClose="onClose" :cartware="cartware" :config="config" ref="addcart"></my-addcart>
		</uni-popup>
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
		imgRemote
	} = app;
	// #ifdef H5
	var wx = require('jweixin-module');
	// #endif

	export default {
		data() {
			return {
				keyList: [],
				list: [],
				keyword: '',
				showSearch: true,
				startSpeech: true,
				config: [],
				bitmap: false,
				arrObj: {},
				index: '',
				cartware: {}
			}
		},
		methods: {
			closeCart(){
				this.$refs.addcart.onClose();
			},
			closeKey(){
				this.$refs.keyboard.cancel();
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			toParent(e) {
				let item = e.arrObj;
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					item_id: item.id,
					attr_id: 0,
					item_num: e.val
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					obj
				);
				rs.postRequests('changeNum', params, res => {
					let data = res.data;
					if (data.code == 200) {
						rs.Toast('加入购物车成功')
						this.list[this.index].cart_num = e.val;
					} else if (data.code == 407 || data.code == 406) {
						rs.Toast("购买数量不能超过活动数量")
					} else {
						rs.Toast(res.data.msg)
					}
				});
				this.$refs.popup.close();
			},
			openCart(item) {
				this.cartware = item;
				this.$refs.cart.open();
			},
			onClose() {
				this.$refs.cart.close();
			},
			// 显示键盘
			showKey(item, index) {
				this.arrObj = item;
				this.index = index;
				this.$refs.popup.open();
			},
			// 热门搜索
			getSearchData() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					obj
				);
				rs.getRequests('getSearchData', params, res => {
					let data = res.data;
					if (data.code == 200) {
						this.keyList = data.data;
					} else {
						rs.Toast(data.msg);
					}
				});
			},
			submit() {
				this.searchList(this.keyword);
			},
			focus() {
				this.keyword = '',
					this.showSearch = true;
			},
			// 搜索列表
			searchList(key) {
				this.list = [];
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp,
					keyword: key
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
						sign: sign
					},
					obj
				);
				rs.getRequests('getSearchItem', params, res => {
					let data = res.data;
					if (data.code == 200) {
						this.keyword = key;
						this.showSearch = false;
						if (data.data.length != 0) {
							this.list = data.data.list;
							this.config = data.data;
							this.bitmap = false;
						} else {
							this.bitmap = true;
						}
					} else {
						rs.Toast(data.msg)
					}
				});
			},
			// #ifdef APP-PLUS |MP-WEIXIN
			speed() {
				this.$refs.speech.open();
				let that = this;
				that.startSpeech = true;
				const recorderManager = uni.getRecorderManager();

				const options = {
					duration: 3000, //指定录音的时长，单位 ms
					sampleRate: 16000, //采样率
					numberOfChannels: 1, //录音通道数
					encodeBitRate: 96000, //编码码率
					format: 'mp3', //音频格式，有效值 aac/mp3
					frameSize: 50, //指定帧大小，单位 KB
				}

				recorderManager.start(options)

				recorderManager.onStop((res) => {
					var timeStamp = Math.round(new Date().getTime() / 1000);
					var obj = {
						appid: appid,
						timeStamp: timeStamp,
					}
					let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
					var audio = res.tempFilePath;
					uni.uploadFile({
						url: app.rootUrl + "/mobileOrder/voiceSearch",
						filePath: audio,
						method: 'POST',
						name: 'audio',
						header: {
							'content-type': 'multipart/form-data',
						},
						formData: {
							appid: appid,
							timeStamp: timeStamp,
							audio: audio,
							sign: sign,
						},
						success: function(reg) {
							console.log(JSON.parse(reg.data))
							var reg = JSON.parse(reg.data)

							if (reg.code == 200) {
								that.keyword = reg.data.message.replace(/。/g, '');
								that.showSearch = false;
								that.$refs.speech.close();
								that.searchList(that.keyword);
							}
							if (reg.code == 501) {
								that.startSpeech = false;
							}
						},
						fail: function() {
							that.startSpeech = false;
							console.log("语音识别失败");
						}
					})
				});
			},

			// #endif

			// #ifdef H5
			speed() {
				this.$refs.speech.open();
				let that = this;
				that.startSpeech = true;

				wx.startRecord({
					success: function() {
						console.log(wx)
						recordTimer = setTimeout(() => {
							wx.stopRecord({
								success: function(res) {

									that.wxuploadVoice(res.localId);
									clearTimeout(recordTimer);
								},
								fail: function(res) {
									alert(JSON.stringify(res));
								}
							});
						}, 5000);
					},
					cancel: function() {
						that.$toast('用户拒绝授权录音');
					}
				});
			},
			wxuploadVoice(localId) {
				var that = this;
				//调用微信的上传录音接口把本地录音先上传到微信的服务器
				//不过，微信只保留3天，而我们需要长期保存，我们需要把资源从微信服务器下载到自己的服务器
				wx.uploadVoice({
					localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
					isShowProgressTips: 1, // 默认为1，显示进度提示
					success: function(res) {
						wx.downloadVoice({
							serverId: res.serverId, // 需要下载的音频的服务器端ID，由uploadVoice接口获得
							isShowProgressTips: 1, // 默认为1，显示进度提示
							success: function(res) {
								var localId = res.localId; // 返回音频的本地ID
								wx.translateVoice({
									localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
									isShowProgressTips: 1, // 默认为1，显示进度提示
									success: function(res) {

										var transl = res.translateResult
										transl = transl.replace(/。/g, "");
										that.keyword = transl;
										that.list = [];
										that.showSearch = false;
										that.$refs.speech.close();
										that.searchList(that.keyword);
									},
									fail: function(res) {
										that.startSpeech = false;
									}
								});
							}
						});
					}
				});
			},
			// #endif

			wxConfig() {
				var timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				rs.getRequests("wxConfig", params, (response) => {

					if (response.data.code == 200) {
						console.log(response.data)
						wx.config({
							debug: false, // 开启调试模式
							appId: response.data.data.appId, // 必填，公众号的唯一标识
							timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
							nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
							signature: response.data.data.signature, // 必填，签名，见附录1
							jsApiList: [
								'checkJsApi',
								'startRecord',
								'stopRecord',
								'translateVoice',
								'downloadVoice',
								'uploadVoice',
								'getLocation'
							] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
					}
				});
			}
		},
		onHide() {
			uni.setStorageSync('search', this.list);
		},
		onShow() {
			// #ifdef H5
			this.wxConfig();
			// #endif
			
			this.getSearchData();
			if (this.keyword) {
				this.list = uni.getStorageSync('search');
			}
		}
	}
</script>

<style>
	.search_list .input_key {
		position: fixed;
		width: 98%;
		z-index: 9;
		background: white;
		height: 68rpx;
		padding: 20rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-right: 20rpx;
	}

	.search_list .input_key .select_key {
		padding: 0 10rpx 0 20rpx;
		border-radius: 40rpx;
		background: #f7f6f6;
		width: 84%;
		height: 68rpx;
	}

	.search_list .input_key .arrow_left {
		width: 14%;
	}

	.search_list .input_key .right_area {
		width: 85%;
	}

	.search_list .input_key .select_key .keyword {
		width: 100%;background: #f7f6f6;
	}

	.search_list .hot_search {
		position: fixed;
		height: calc(100vh - 108rpx);
		background: white;
		width: 100%;
		padding: 0 20rpx;
	}


	.search_list .hot_search .key_tag {
		display: flex;
		flex-wrap: wrap;
	}

	.search_list .hot_search .key_tag text {
		border-radius: 3px;
		color: grey;
		padding: 0 6rpx;
		background: #f2f2f2;
		margin: 20rpx 20rpx 0 0;
	}

	.search_list .search_bitmap {
		margin-top: 25%;
		text-align: center;
	}

	.search_list .search_bitmap .bitmap {
		width: 47%;
	}

	.search_list .search_result .my_profile {
		margin-bottom: 10rpx;
	}

	.search_list .lang_search {
		background: white;
		border-radius: 10rpx 10rpx 0 0;
		height: 371rpx;
		color: #009943;
	}


	.search_list .lang_search .icon-X {
		position: absolute;
		right: 20rpx;
		text-align: right;
		color: gray;
		margin-top: 20rpx;

	}

	.search_list .lang_search .correct>view {
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
	}

	.search_list .lang_search .error_txt>view {
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
	}

	/* #ifdef APP-PLUS */
	.search_list .lang_search .error_txt .mic_filled {
		background: #009943;
		border-radius: 50%;
		padding: 10rpx;
	}

	.search_list .fixed {
		background: white;
		position: fixed;
		z-index: 9;
	}

	/* #endif */
	/* #ifdef MP-WEIXIN */
	.search_list .lang_search .error_txt .mic_filled .uni-icons {
		background: #009943;
		border-radius: 50%;
		padding: 10rpx;
	}

	/* #endif */
</style>
