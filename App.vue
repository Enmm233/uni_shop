<script>
	export default {
		//全局共享数据
		globalData: {
			// #ifdef APP-PLUS
			navBar: true,
			backFast:true,
			// #endif
			// #ifdef MP-WEIXIN |H5
			navBar: false,
			// #endif
			appid: '1',
			active: '2', 
			appsecret: 'StJfzJcXmya6k6Ar',
			// #ifdef APP-PLUS |MP-WEIXIN |MP-ALIPAY
			rootUrl: 'https://bcny.caidj.cn', //主接口地址
			imgRemote: 'https://bcny.caidj.cn',
			// #endif 
			// #ifdef H5
			isWeixin: false,
			// rootUrl: '/api', //主接口地址
			// imgRemote: 'http://test.caidj.cn',
			rootUrl: window.location.protocol + "//" + window.location.hostname, //线上地址
			imgRemote: window.location.protocol + "//" + window.location.hostname,
			// #endif
			classId: '',
			isReload: true,
			aData: {
				show: true
			}
		},
		onLaunch: function() {

		},
		onShow: function() {
		},
		onHide: function() {}
	};
</script>

<style>
	/*每个页面公共css */
@font-face {
  font-family: 'iconfont';  /* project id 1843139 */
  src: url('https://at.alicdn.com/t/font_1843139_qglkn6qh8t.eot');
  src: url('https://at.alicdn.com/t/font_1843139_qglkn6qh8t.eot?#iefix') format('embedded-opentype'),
  url('https://at.alicdn.com/t/font_1843139_qglkn6qh8t.woff2') format('woff2'),
  url('https://at.alicdn.com/t/font_1843139_qglkn6qh8t.woff') format('woff'),
  url('https://at.alicdn.com/t/font_1843139_qglkn6qh8t.ttf') format('truetype'),
  url('https://at.alicdn.com/t/font_1843139_qglkn6qh8t.svg#iconfont') format('svg');
}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.icon-zhifubaorenzheng:before {
	  content: "\e625";
	}
	
	.icon-sousuo:before {
	  content: "\e60f";
	}
	
	.icon-fenxiang:before {
	  content: "\e623";
	}
	
	.icon-buy-fill:before {
	  content: "\e64c";
	}
	
	.icon-huidaodingbu:before {
	  content: "\e6c0";
	}
	
	.icon-alreadystar:before {
	  content: "\e624";
	}
	
	.icon-xing:before {
	  content: "\e600";
	}
	
	.icon-tianchongxing--:before {
	  content: "\e614";
	}
	
	.icon-mima:before {
	  content: "\e645";
	}
	
	.icon-yuyin:before {
	  content: "\e631";
	}
	
	.icon-08_zizhanghaoguanli:before {
	  content: "\e630";
	}
	
	.icon-shanchu:before {
	  content: "\e663";
	}
	
	.icon-qianbao:before {
	  content: "\e604";
	}
	
	.icon-juan:before {
	  content: "\e64b";
	}
	
	.icon-huabanfuben:before {
	  content: "\e65d";
	}
	
	.icon-X:before {
	  content: "\e674";
	}
	
	.icon-weixin:before {
	  content: "\e637";
	}
	
	.icon-yonghu:before {
	  content: "\e603";
	}
	
	.icon-fapiao:before {
	  content: "\e720";
	}
	
	.icon-tuichu:before {
	  content: "\e69e";
	}
	





	page {
		background: #f8f6f9;
		font-size: 28rpx;
	}

	.addcart image {
		width: 32rpx;
		height: 32rpx;
	}
    .white_b{background: white;}
	.status_bar {
		/* background: white; */

		height: var(--status-bar-height);
		width: 100%;
	}

	.hidden {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.red_tag {
		background: red;
		color: white;
		border-radius: 6rpx;
		padding: 0 1px;
		font-size: 20rpx;
		margin-right: 5rpx;
	}

	.red_font {
		color: red !important;
	}

	.gray_font {
		color: #808080;
	}

	.flex {
		display: flex;
	}

	.flex_left_right {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.align_center {
		display: flex;
		align-items: center;
	}

	.line_through {
		color: #808080;
		text-decoration: line-through;
	}

	.uni-countdown {
		align-items: center;
	}

	.line_border {
		width: 4px;
		height: 40rpx;
		background: #009a44;
	}

	.weight {
		font-weight: 700;
	}

	.home .uni-countdown__number {
		height: 30rpx !important;

		color: white !important;
		border-radius: 4rpx;
		width: 40rpx !important;
	}

	.flash_sale .uni-countdown__number {
		height: 30rpx !important;

		color: white !important;
		border-radius: 4rpx;
		width: 35rpx !important;
	}

	.uni-nav-bar-right-text {
		color: #009a44;
	}

	.recomend .title {
		display: flex;
		align-items: center;
		height: 80rpx;
		line-height: 80rpx;
		background-image: linear-gradient(180deg, #fff, #f7f7f7);
		padding: 0 20rpx;
		margin-top: 10rpx;
	}

	.recomend .title .name {
		margin: 0 12rpx;
		font-size: 32rpx;
		font-weight: 600;
	}

	.recomend .body {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 20rpx;
	}

	.body .myc_recomend:nth-child(n+3) {
		margin-top: 40rpx;
	}
	/* #ifdef MP-ALIPAY */
	.body .recomend_single:nth-child(n+3) {
		margin-top: 40rpx;
	}
	/* #endif */

	.order .uni-icons {
		color: #009a44 !important;
	}

	.place_style {
		font-size: 24rpx;
		color: #c2c2c2;
	}

	.center {
		text-align: center;
	}

	.submit_button {
		background: #009a44;
		color: white;
		border-radius: 12rpx;
		text-align: center;
		margin: 30rpx auto;
	}

	.twelve {
		font-size: 24rpx;
	}

	.ten {
		font-size: 20rpx;
	}

	.fiveteen {
		font-size: 50rpx;
	}

	.width {
		width: 100%;
	}

	.shuiyin {
		width: 60rpx;
		height: 20rpx;
		/* position: absolute; */
		z-index: 1;
	}

	.uni-modal__btn_primary {
		color: #009a44 !important;
	}

	.uni-modal__btn_default {
		color: #999 !important;
	}

	.uni-modal__bd {
		color: black !important;
	}

	input {
		font-size: 28rpx !important;
		line-height: initial !important;
		min-height: initial !important;
	}

	.green_b {
		background: #009a44 !important;
	}

	.gray_b {
		background: gray !important;
	}

	.icon-sousuo {
		color: #d6cdd2;
	}
	text-no-space{
	white-space:nowrap
	}
</style>
