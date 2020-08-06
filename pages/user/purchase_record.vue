<template>
	<view class="">
		<uni-nav-bar left-icon="back" left-text=" " title="购买记录" :status-bar="navBar" fixed="true" @clickLeft="urlPage"></uni-nav-bar>
		<!-- <uni-search-bar :radius="100" @="search" cancelButton="none" placeholder="请选择日期"></uni-search-bar> -->
		<view class="bill_search" @click="open">
			<view class="search_date">
				<text class="iconfont icon-sousuo"></text>
				<text v-if="!date">请选择日期</text>
				<text v-else>{{date}}</text>
				
			</view>
			<view v-if="list.length" class="flex_left_right" style="padding-top:6px;">
				<view class="">
					商品数量 : {{list.length}}种
				</view>
				<view class="total_box">
					合计：<text>¥{{record.total}}</text>
				</view>
			</view>
			
			
		</view>

		<view style="height:55px;">   

		</view>
		<view class="bill" v-if="bitmap">
			<view class="bill_record" v-for="(item, index) in list" @click="billdetail(item.item_id,item.attr_id)">
				<view class="record_box">
					<view class="img">
						<image :src="item.item_url" alt=""></image>
						<!-- <van-image use-error-slot :src="item.item_img==''?imgRemote+orderInfo.item_default:item.item_img" width="100px"
						 height="80px" fit="contain">
							<van-image width="100px" height="80px" fit="contain" slot="error" :src="imgRemote+orderInfo.item_default"></van-image>
						</van-image> -->
					</view>
					<view class="record_detail">
						<view class="top">
							<view class="left">
								<view class="title">
									{{item.item_title}}
									<text v-if="item.attr_title" class="gray_font">【{{item.attr_title}}】</text>
								</view>
								<view class="txt">
									{{item.describe}}                          
								</view>
							</view>
						</view>
						<view class="bottom">
                                 共:{{item.nums}}/{{item.unit}} 小计:{{item.subtotal}}元 
						</view>
					</view>
				</view>
			</view>
			<my-loading :loading="loading" ></my-loading>
	
		</view>
		<view v-else class="bitmap">
			<image src="../../static/img/no_record.png" mode="aspectFit"></image>
		</view>
		<uni-calendar :insert="false" :lunar="true" ref="calendar" :range="true" @confirm="confirm" />
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
				navBar:navBar,
				imgUrl: app.imgUrl,
				imgRemote:imgRemote,
				date: '',
				dateArr: '',
				bitmap: true,
				record:'',
				list: [],
				loading: true,
				count:0
			};
		},
		methods: {
			urlPage() {
				uni.navigateBack({
					delta: 1
				});
			},
			billdetail(item_id,attr_id) {
				this.count++;
				if(this.count!=1)return;
				setTimeout(()=>{this.count=0},1000)
				var timeArr = rs.thedefaulttime();
				var time = this.dateArr;
				if (time == "") {
					var date = timeArr;
				} else {
					var date = this.dateArr;
				}
				var obj = {
					item_id:item_id,
					attr_id:attr_id,
					date:date
				}
				
				uni.navigateTo({
					url: 'purchase_detail?obj='+JSON.stringify(obj)
				});
			},
			open() {
				this.$refs.calendar.open();
			},
			confirm(e) {
				if (!e.range.before || !e.range.after) {
					rs.Toast("请选择正确的日期区间")
				}else{
					
					let startDate=e.range.data[0];
					let endDate=e.range.data[e.range.data.length-1];
					this.date = startDate + ',' + endDate;
					this.loading=true;
					this.dateArr =  [startDate,endDate];
					this.list = [];
					this.moneyList()
				}
				
			},
			/**
			 * 账单列表
			 */
			moneyList() {
				var that = this;
				var timeArr = rs.thedefaulttime();
				var time = that.dateArr;
				if (time == "") {
					var start = timeArr[0];
					var end = timeArr[1];
				} else {
					var start = that.dateArr[0];
					var end = that.dateArr[1];
				}
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
					start:start,
					end:end,
				}
				that.list = [];
				rs.getRequests("buyRecord", data, (res) => {
					if (res.data.code == 200) {
						that.record = res.data.data;
						if (res.data.data.list != '') {
							that.bitmap = true;
							this.loading = false;
								that.list.push(...res.data.data.list);
						} else {
							this.loading = '空';
							that.bitmap = false;
						}
					} else {
						this.loading = '空';
						rs.Toast(res.data.msg)
					}
				})
			},
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			var that = this;
			if(app.isReload){
				var timeArr = rs.thedefaulttime();
				that.date = timeArr[0] + ',' + timeArr[1];
				that.moneyList()
			}
			
		},
	};
</script>

<style>
	body {
		background: #f7f7f7;
	}

	.uni-searchbar__box {
		border-style: none !important;
	}

	.uni-searchbar {
		padding: 0 10px 20px;
		position: fixed !important;
		width: 94%;
	}
	.total_box{
	/* 	background: #FFFFFF;
		text-align: end;
		padding: 10px 0 0 0; */
	}
	.total_box text{ 
		color: #FF3E1E;
	}
	.bill {
		margin-top: 25px;
	}
	
	.bill .bill_record {
		background: #FFFFFF;
		padding: 8rpx 20rpx;
		margin: 10rpx 0;
	}
	
	.bill .bill_record .record_box {
		display: flex;
		align-items: center;
	}
	.bill .bill_record .record_box .img{
		width: 100px;
		height: 80px;
		margin-right: 10px;
		z-index: 1;
	}
	.bill .bill_record .record_box .img image{
		width: 100px;
		height: 80px;
	}
	.bill .bill_record .record_box .record_detail .top{
		display: flex;
		justify-content: space-between;
	}
	.bill .bill_record .record_box .record_detail .top .left{
		width: 90%;
	}
	.bill .bill_record .record_box .record_detail .top .right{
		font-size: 12px;
	}
	.bill .bill_record .record_box .record_detail .top .title{
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}
	.bill .bill_record .record_box .record_detail .top .txt{
		font-size: 12px;
		color: #808080;
		display: -webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:2;
		overflow: hidden;
	}
	.bill .bill_record .record_box .record_detail .bottom{
		color: #808080;
		margin-top: 10px;
		/* text-align: end; */
		font-size: 12px;
	}
	
  .record_detail{width:100%;}
	.bitmap {
		text-align: center;
		margin-top: 20%;
	}

	.bitmap image {
		width: 50%;
	}

	.bill_search {
		position: fixed;
		padding: 0 14px 8px 14px;
		background: white;
	
		width: 93%;
		z-index: 99;
	}

	.search_date {
		border-radius: 40px;
		background: #f7f6f5;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		line-height: 40px;
	}

	.loading__text {
		padding: 10px 0;
	}
	/* #ifdef MP-WEIXIN */
	.uni-navbar__content_view.data-v-9404327c{}
	/* #endif */
</style>
