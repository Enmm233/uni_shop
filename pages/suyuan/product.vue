<template>
	<div class="product">
		<h1 v-if="details">商品展示</h1>
		<!--        有描述时-->
		<div class="describle" v-if="details">
			
			<img :src="products.img">

			<div class="detail1">
				<div>商品<br>描述</div>
			</div>
			<div class="detail2">{{products.describe}}</div>
			<address class="center">技术支持:黑蚂蚁科技<br>
				Coryright &copy;2016-2019
			</address>
		</div>
		<!--        无描述时-->
		<div class="none" v-else>
			<div v-html="message"></div>

			<address class="center">技术支持:黑蚂蚁科技<br>
				Coryright &copy;2016-2019
			</address>
		</div>
		<my-s_tabbar activeIndex=1></my-s_tabbar>

	</div>
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
				details: '',
				products: [],
				message: '',
			}
		},
		created() {
			//溯源产品介绍
			this.tbInfo();
		},
		methods: {
			tbInfo() {
				var id = localStorage.getItem('shopId');
				var timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					item_id: id,
					timeStamp: timeStamp
				}
				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj);

				rs.getRequests('tbInfo', params, (response) => {
					let data = response.data.data;
					if (response.data.code == 200) {
						this.products = data.item;

						if (this.products.info == null) {
							this.details = true;
						} else {
							this.details = false;
							this.message = data.item.info;
						}
					}
				});
			}
		}

	}
</script>
<style>
	.product .describle{
		margin:1% 3% 0;
	}

	.product h1 {
		border-left: 12rpx solid #009A44;
		color: #009A44;
		font-weight: normal;
		font-size: 40rpx;
		padding-left: 2%;
		margin:1% 3% 0;
	}

	.product .describle img {
		margin: 4% 0 8%;
		width: 100%;
		height:30vh;object-fit: contain;background: white;
		border-radius: 4px;
	}

	.product .detail1 {
		border: 34px solid #009A44;
		margin-top: 2px;
		position: absolute;
		border-radius: 50%
	}

	.product .detail1>div {
		display: flex;
		border: 2px solid white;
		display: -webkit-box;
		display: -ms-flexbox;
		display: flex;
		width: 65px;
		background: #1A763D;
		border-radius: 50%;
		position: absolute;
		height: 65px;
		-webkit-box-pack: center;
		-ms-flex-pack: center;
		justify-content: center;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		color: white;
		margin: -32px 1px 0 -33px;
	}

	.product .detail2 {
		text-overflow: ellipsis;
		font-size: 12px;
		overflow: hidden;
		border: 1px dashed #009A44;
		width: 80%;
		margin: 0 auto;
		border-radius: 5px;
		height: 73px;
		padding: 5px 5px 5px 40px
	}

	.product .describle address {
		position: fixed;
		text-align: center;
		font-size: 10px;
		padding: 8% 0;
		width: 94%;font-style: normal;
		bottom: 5.5%;
	}

	.product .none div {
		font-size: 14px;
	}

	.product .none address {
		font-size: 10px;font-style: normal;
		text-align: center;
		padding: 3% 0 21% 0;
	}
</style>
