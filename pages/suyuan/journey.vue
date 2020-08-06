<template>
	<div class="journey">
		<div class="solution">

			<div v-if="journey.sign_for_time!=0">

				<i class="iconfont icon-yuandian"></i>
				<p>已签收</p>
				<p>签收时间: {{journey.sign_for_time}}</p>
			</div>
			<div v-if="journey.delivery_time!=0">
				<i class="iconfont icon-yuandian"></i>
				<p>配送</p>
				<p>配送时间:{{journey.delivery_time}}</p>
			</div>
			<div v-if="journey.sorting_time!=0">
				<i class="iconfont icon-yuandian"></i>
				<p>分拣</p>
				<p>分拣时间: {{journey.sorting_time}}</p>
			</div>
			<div v-if="journey.storage_time!=0">
				<i class="iconfont icon-yuandian"></i>
				<p>入库</p>
				<p>入库时间: {{journey.storage_time}}</p>
			</div>
			<div v-if="journey.purchase_time!=0">
				<i class="iconfont icon-yuandian"></i>
				<p>采购</p>
				<p>采购时间: {{journey.purchase_time}}</p>
			</div>

			<div v-if="journey.created_at!=0">
				<i class="iconfont icon-yuandian"></i>
				<p>下单</p>
				<p>下单时间: {{journey.created_at}}</p>
			</div>

		</div>
		<address class="center">技术支持:黑蚂蚁科技<br>
			Coryright &copy;2016-2019
		</address>
		<my-s_tabbar activeIndex=2></my-s_tabbar>
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
				details: false,
				journey: [],
				status1: true,
				status2: true,
			}
		},
		created() {
			//溯源产品介绍
			this.traceBack();
		},

		methods: {
			traceBack() {

				var id = localStorage.getItem('shopId');

				var timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					old: id,
					timeStamp: timeStamp
				}

				var sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj);

				rs.getRequests('traceBack', params, (response) => {

					if (response.data.code == 200) {
						this.journey = response.data.data.info;

						if (this.journey.order_status == 1) {
							this.status1 = false;
							this.status2 = false;
						} else if (this.journey.order_status == 2) {
							this.status1 = false;

						} else {
							this.status1 = true;
							this.status2 = true;
						}

					}
				});
			}
		}

	}
</script>
<style>
	/* @import "//at.alicdn.com/t/font_1480408_n96i4988y6.css"; */

	.journey {
		position: fixed;
		width: 100%;
		height: 100%;
	}

	.journey address {
		text-align: center;
		font-size: 10px;
		padding: 8% 0;
		position: fixed;
		bottom: 5.5%;
		width: 100%;font-style: normal;
	}

	.journey {
		background: #C5E3D0;
		padding-top: 3%;
	}

	.journey .solution {
		background: white;
		padding: 4% 4%;
		margin: 0px 3%;
		box-shadow: 0px 1px 2px grey;
		border-radius: 5px;
	}

	.journey .solution div {
		border-left: 2px solid #1A763D;
		font-size: 14px;
		height: 16.6%;
	}

	.journey .solution div:nth-child(n+2) {
		color: #808080;
		border-left: 2px solid #808080;
		padding: 0% 0 12% 4%;
	}

	.journey .solution div:nth-child(1) {
		padding: 4% 0 10% 4%;
	}

	.journey .solution div:first-child i+p {
		color: #1A763D;
	}

	.journey .solution div i {
		position: fixed;
		left: 5.2%;
	}

	.journey .solution div:first-child i {
		color: #1A763D;
	}

	@media(max-width:320px) {
		.journey .solution div i {
			left: 4.6%;
		}
	}

	@media(min-width:320px max-width:360px) {
		.journey .solution div i {
			left: 5.5%;
		}
	}

	@media(min-width:360px max-width:412px) {
		.journey .solution div i {
			left: 5.8%;
		}
	}
</style>
