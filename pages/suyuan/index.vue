<template>
	<div class="suyuan_index" id="suyuan">
		
		<div class="img_deal">   <img :src="index.img" onerror="javascript:this.src='images/suyuan/defaultimg.png';"></div>
		<div class="musicinfo" id="musicinfo" style="display:block;">
		</div>

		<p class='red'>恭喜,你查询的是{{message}}销售的正品!!!</p>

		<div class="info white">

			<table>
				<tr>
					<th colspan="6">商品信息</th>
				</tr>
				<tr style="height:10px;"></tr>
				<tr>
					<td>商品名称</td>
					<td>{{index.title}}</td>
				</tr>
				<tr>
					<td>商品规格</td>
					<td>{{index.attr_title}}</td>
				</tr>
				<tr>
					<td>商品单位</td>
					<td>{{index.unit}}</td>
				</tr>
				<tr>
					<td>商品售价</td>
					<td>{{index.price}}元</td>
				</tr>
				<tr>
					<td>商品数量</td>
					<td>{{index.weight}}{{index.unit}}</td>
				</tr>
				<tr style="height:6px;"></tr>
				<tr>
					<td>商品描述</td>
					<td>
						<div>
							{{index.describe}}
						</div>
					</td>
				</tr>
			</table>
		</div>
		<address class="center">技术支持:黑蚂蚁科技<br>
			Coryright &copy;2016-2019

		</address>
		<div style="height:1rem;"></div>
		<my-s_tabbar activeIndex=0></my-s_tabbar>
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
				index: [],
				message: '',
			}
		},
		onShow() {
			//溯源查询
			this.result();
		},

		methods: {

			result() {
				let that=this;
				var id = uni.getStorageSync('resultId');
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

				rs.getRequests('result', params,(response) => {
						let data = response.data.data;
                             
						if (response.data.code == 200) {
							this.message = data.company_name;

							let shop = document.getElementById('musicinfo');
							shop.innerHTML =
								`<audio id="musicid" src="http://api.ew80yun.com/tts.php?txt=恭喜,你查询的是${this.message}销售的正品!!!" preload="preload" autoplay="autoplay"></audio>`;

							that.index = data.item;
							
							this.describle = data.item.describe;
							localStorage.setItem('shopId', response.data.data.item.id)
						}
					});
			}
		}

	}
</script>
<style>
	* {
		padding: 0;
		margin: 0;
	}

	.suyuan_index {
		/*position: fixed;*/
		height: 100vh;
		background: #C5E3D0;
	}

	.suyuan_index img {
		width: 100%;
         height:30vh;
		 object-fit: contain;
		
	}

	.red {
		color: red;
	}
    .suyuan_index .img_deal{border-bottom: 5px solid #EF9428;background: white;}
	.white {
		background: white;
	}

	.suyuan_index .info {
		width: 82%;
	
		margin: 0 auto;
		padding: 0% 4%;
	}

	.suyuan_index .info tr:nth-child(n+2) {
		font-size: 12px;
	}

	.suyuan_index .info table tr td:first-child {
		width: 33%;
		color: #6BB885;
		margin-left: 1%;
	}

	.suyuan_index .info table tr th {
		color: #6BB885
	}

	.suyuan_index p {
		text-align: center;
		margin: 2% 0 3% 0;
		font-weight: 500;
	}

	.suyuan_index .info tr {
		/*vertical-align: sub;*/
		height: 32px;
	}

	.suyuan_index .info tr:last-child {
		vertical-align: sub;

	}

	.suyuan_index .info tr td:first-child {
		font-weight: 550;
		font-size: 14px;
	}

	.suyuan_index .info tr:last-child td {
		font-size: 13px;
		padding: 0 0 2% 0;
	}

	.suyuan_index .info tr td:last-child div {
		height: 54px;
		overflow: hidden;

	}

	.suyuan_index .info tr th {
		border-bottom: 1px solid #ddd;
	}

	.center {
		text-align: center;
	}

	.suyuan_index address {
		font-size: 10px;
	font-style: normal;
		bottom: 10%;
		margin-top: 11%;
		text-align: center;
		width: 100%;
	}

	.suyuan_index table {
		width: 100%;
	}

	@media (max-height: 568px) {
		.suyuan_index .info tr td:last-child div {
			height: 16px;
			overflow: hidden;

		}
	}
</style>
