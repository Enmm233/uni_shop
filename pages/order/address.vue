<template>
	<view class="order_detail">
		<uni-nav-bar left-icon="arrowleft" title="查看物流" :status-bar="navBar" fixed="true" @clickLeft="LeftClick"></uni-nav-bar>
		 <div class="baidumap" id="container"></div>
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
				navBar: navBar,
				data:''
			};
		},
		methods: {
			LeftClick() {
				uni.navigateBack({
					delta: 1
				});
			},
			loadmap() {
			  var map = new BMap.Map("container");
			  var point = new BMap.Point(this.data.longitude, this.data.latitude);
			  map.centerAndZoom(point, 15);
			  var marker = new BMap.Marker(point); // 创建标注    
			  map.addOverlay(marker);
			}
			
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.data = JSON.parse(options.data);
			console.log(this.data)
			var _this = this;
			//加载百度地图
			rs.MP(_this.data.ak).then(BMap => {
			
			  _this.loadmap()
			})
		},
		onShow() {
			app.aData.show = true;
			var that = this
			that.orderInfo()
		},
	};
</script>

<style>
	.baidu_map .van-nav-bar .van-icon {
	  margin-left: -10px;
	  color: #808080;
	}
	
	.baidu_map #list li {
	  padding: 3px 0;
	  line-height: 1rem;
	  border-bottom: 1px solid #efefef;
	  color: gray;
	}
	
	.baidu_map #list {
	  font-size: 0.7rem;
	  padding: 5px 10px;
	}
	
	.baidu_map .title {
	  align-items: center;
	  padding: 2% 0;
	}
	
	.baidu_map .title h2 {
	  font-size: 0.8rem;
	  margin-left: -3%;
	}
	
	.baidu_map .search_style {
	  padding: 5px 0;
	}
	
	.baidu_map [class*=van-hairline]::after {
	  border: none;
	}
	
	#container {
	  width: 100%;
	  height: 100vh;
	
	}
	
	.baidu_map .search {
	  padding: 0 23%;
	}

</style>
