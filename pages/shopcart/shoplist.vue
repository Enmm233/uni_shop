<template>
	<view class="shoplist">
		<uni-nav-bar left-icon="arrowleft" right-text="清空" title="商品列表" :status-bar="navBar" fixed="true" @clickLeft="leftClick"
		 @clickRight="rightClick"></uni-nav-bar>
		<view class="shop">
			<view v-for="(item,index) in shop" :key="index">
				<view class="">
					<view class="class_name" v-if="item.count">
						<text class="class_tag">类别</text>
						<text> {{item.p_name}}({{item.count}})</text>
					</view>
					<view v-for="(list,second) in item.list" class="single_good" :key="second">
						<view class="flex">
							<view class="good_img">
								<image :src="config.logo" mode="aspectFit" class="shuiyin" v-if="config.logo&&config.shuiyin==1"></image>
								<image class="have_img" :src="list.img==''?imgRemote+config.item_default:list.img" mode="aspectFit"></image>
							</view>
							<view class="include_delete">
								<view class="info">
									<view style="width:86%;">
										<view>{{list.title}}</view>
										<view v-if="list.describe" class="hidden gray_font">{{list.describe}}</view>
									</view>
									<view @click="deleteSign(list,index,second)">
										<text class="iconfont icon-shanchu"></text>
									</view>
								</view>
								<view class="flex_left_right">
									<view>
										<view><text class="red_tag" v-for="label in list.label" :key="label">{{label}}</text></view>
										<block v-if="token">
											<block v-if="config.is_look==1">
												<view v-if="list.attr.length!=0">
													<text class="red_font" v-if="list.attr.activity_num>=list.cart_num&&list.attr.is_activity==1">￥{{list.attr.activity_price}}/{{list.attr.unit}}</text>
													<text class="red_font" v-else>
														<block v-if="list.attr.market_price==1">时价</block>
														<block v-else> ￥{{list.attr.attr_price}}/{{list.attr.unit}}</block>


													</text>
													<text class="gray_font">已选({{list.attr.attr_title}})</text>
												</view>
												<view v-else>
													<text class="red_font" v-if="list.activity_num>=list.cart_num&&list.is_activity==1">￥{{list.activity_price}}/{{list.unit}}</text>
													<text class="red_font" v-else>
														<block v-if="list.market_price==1">时价</block>
														<block v-else> ￥{{list.price}}/{{list.unit}}</block>
													</text>
												</view>
											</block>
											<view v-else class="red_font">
												￥***
											</view>
										</block>
										<block v-else>
											<view v-if="list.attr.length">
												<text class="red_font">￥{{list.attr.attr_price}}/{{list.attr.unit}}</text>
												<text class="gray_font">已选(list.attr.attr_title)</text>
											</view>
											<view v-else> <text class="red_font">￥{{list.price}}/{{list.unit}}</text></view>
										</block>
									</view>
									<view>
										<my-stepper :val="list.cart_num" @showKey="showKey(list,index,second)" @minus="minus(list,index,second,list.cart_num-1)"
										 @plus="plus(list,index,second,list.cart_num+1)"></my-stepper>
									</view>
								</view>
							</view>

						</view>
						<view class="align_center">
							<text>备注:</text>
							<view @click="getFocus(list,index,second)" style="width: 89%;"> <text v-if="list.remark">{{list.remark}}</text>
								<text v-else class="gray_font">请告诉我们需要注意的地方</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="gift" v-if="giftInfo[ruleKind]">
			<view class="class_name">
				<text class="class_tag">赠品</text>
				<text> 赠品(1)</text>
			</view>
			<view class="single_good">
				<view class="flex">
					<view class="good_img">
						<image :src="config.logo" mode="aspectFit" class="shuiyin" v-if="config.logo&&config.shuiyin==1"></image>
						<image class="have_img" :src="giftInfo[ruleKind].item[0].img==''?imgRemote+config.item_default:giftInfo[ruleKind].item[0].img"
						 mode="aspectFit"></image>
					</view>
					<view class="align_center flex_left_right" style="width: 100%;">

						<text>{{giftInfo[ruleKind].item[0].title}}</text>
						<text>X{{giftInfo[ruleKind].item[0].num}}</text>
					</view>

				</view>

			</view>
		</view>

		<view class="mask" v-show="showRemark">
			<view class="mask_overly"></view>
			<view class="remark_dialog">

				<view class="title">确定要修改备注吗</view>
				<view class="textarea">
					<textarea v-model="remark" :focus="showRemark" ref="text_id" placeholder="请输入你想说的" placeholder-class="place_style"
					 :show-confirm-bar="confirmBar" />
					</view>
					  <view class="buttons">
						  <view class="cancel" @click="showRemark=false">取消</view>
						  <view @click="determine">确定</view>
					  </view>
			</view>
		</view>
		
		<uni-popup ref="popup" type="bottom" @maskInfo="closeKey">
			<my-keyboard @cancelKey="$refs.popup.close()" :arrObj="shopItem" @toParent="toParent" ref="keyboard"></my-keyboard>
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
		imgRemote,
		navBar
	} = app;
	export default {
		data() {
			return {
				token: uni.getStorageSync('cdj_token'),
				imgRemote: imgRemote,
				navBar: navBar,
				shop: [],
				config: [],
				showRemark:false,
				confirmBar:false,
				remark:'',
				shopItem:{},
				firstIndex:'',
				secondIndex:'',
				ruleKind:-1,
				giftInfo:[]
			}
		},
		methods: {
			closeKey(){
				this.$refs.keyboard.cancel();
			},
			leftClick() {
				uni.navigateBack({
					delta: 1
				})
			},
			rightClick(){
				var that = this;
								uni.showModal({
									title: '',
									content: '确定清空购物车吗？',
									success(res) {
										if (res.confirm) {
											//获取清空的id
											let list = that.shop;
											let newlist = [];
											for (let i of list) {
												i.list.forEach(v => {
													newlist.push(v.cart_id)
												})}
												log(newlist)
												let timeStamp = Math.round(new Date().getTime() / 1000);
												let obj = {
													appid: appid,
													timeStamp: timeStamp
												};
												let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
												let params = Object.assign({
													sign: sign,
													keys: newlist
												}, obj)
												rs.postRequests("deleteByUserIds", params, (res) => {
													if (res.data.code == 200) {
														rs.Toast('成功清空购物车');
														setTimeout(()=>{uni.switchTab({
															url: '/pages/tabar/index'
														});},200)
														
													} else {
														rs.Toast(res.data.msg);
													}
												})
										}
									}
								});

			},
			deleteSign(data,one,two){
				let that=this;
				uni.showModal({
					content:'确定将该物品删除吗？',
					success(res){
						if(res.confirm){
							let id, attrid;
							if (data.attr.length == 0) {
														id = data.id;
														attrid = 0
													} else {
														id = data.attr.item_id;
														attrid = data.attr.id
													}
													let timeStamp = Math.round(new Date().getTime() / 1000);
													let obj = {
														appid: appid,
														timeStamp: timeStamp,
														item_id: id,
														attr_id: attrid
													};
													let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
													let params = Object.assign({
														sign: sign
													}, obj)
													rs.postRequests("deleteCart", params, (res) => {
														if (res.data.code == 200) {
															rs.Toast('成功删除该商品')
															that.shop[one].count--;
															that.shop[one].list.splice(two, 1);
															if (res.data.data.countNum == 0) {
																setTimeout(()=>{uni.switchTab({
																	url: '/pages/tabar/index'
																});},200)
																
															}
														}
													})
						}
					}
				})
			},
			openCart() {
				let timeStamp = Math.round(new Date().getTime() / 1000);
				let obj = {
					appid: appid,
					timeStamp: timeStamp
				};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				}, obj)
				rs.getRequests("openCart", params, (res) => {
					let {
						data
					} = res;
					if (data.code == 200) {
						this.config = data.data;
						this.shop = data.data.shop;
						if(data.data.activity_type==2){
							this.giftInfo=data.data.activity_rule;
								this.getCount();
						}
					}

				})
			},
			getFocus(item,index,second){
				// this.$nextTick(() =>{
				//     this.$refs.remarkTxt.focus();
				// })
		
				this.showRemark=true;
				this.remark=item.remark;
				this.shopItem=item;
				this.firstIndex=index;
				this.secondIndex=second;
			},
			determine(){
						let timeStamp = Math.round(new Date().getTime() / 1000);
							let obj = {
								appid: appid,
								timeStamp: timeStamp
							};
							let newobj = {};
							let item = this.shopItem;
								let itemId, attrId;
							if (item.attr.length != 0) {
								itemId = item.attr.item_id;
								attrId = item.attr.id;
							} else {
								itemId=item.id;
								attrId=0;	
							}
			            newobj = Object.assign({
				item_id: itemId,
				attr_id: attrId,
				remark: this.remark.replace(/\s+/g, ""),
			  }, obj);
							let sign = md5.hexMD5(rs.objKeySort(newobj) + appsecret);
							let params = Object.assign({
								sign: sign
							}, newobj);
							rs.postRequests("itemRemark", params, (res) => {
								if (res.data.code == 200) {
									rs.Toast('修改备注成功');
									this.shop[this.firstIndex].list[this.secondIndex].remark=this.remark;
									this.showRemark = false;
								} else {
									rs.Toast(res.data.msg)
								}
							})
			},
			showKey(data,one,two){
			this.$refs.popup.open();
			this.shopItem=data;
			this.firstIndex=one;
			this.secondIndex=two;
		},
		addCart(data, one, two,num) {
						let timeStamp = Math.round(new Date().getTime() / 1000);
						let obj = {
							appid: appid,
							timeStamp: timeStamp
						};
		
						let newobj = {};
						let item = data;
						let nums = num;
						let isFloat = "";
						let itemId, attrId;
						if (item.attr.length != 0) {
							isFloat = item.attr.is_float;
							itemId = item.attr.item_id;
							attrId = item.attr.id;
						} else {
							isFloat = item.is_float;
							itemId=item.id;
							attrId=0;
						}
						newobj = Object.assign({
							item_id: itemId,
							attr_id: attrId,
							item_num: num
						}, obj);
						if (isFloat == 1 && !Number.isInteger(Number(nums))) {
							rs.Toast('购买数量不能为小数');
							return;
						}
						let sign = md5.hexMD5(rs.objKeySort(newobj) + appsecret);
						let params = Object.assign({
							sign: sign
						}, newobj);
						if (num == 0) {
							rs.postRequests("deleteCart", params, (res) => {
								if (res.data.code == 200) {
									rs.Toast('删除成功');
								this.shop[one].count--;
								this.getCount();
								this.shop[one].list.splice(two, 1);
								if (res.data.data.countNum == 0) {
									setTimeout(()=>{uni.switchTab({
										url: '/pages/tabar/index'
									});},200)
								}
								} else {
									rs.Toast(res.data.msg)
								}
							})
						} else {
							rs.postRequests("changeNum", params, (res) => {
								let {data}=res;
								if (res.data.code == 200) {
									rs.Toast('操作成功');
									this.$refs.popup.close();
									this.shop[one].list[two].cart_num=num;
									this.getCount();
								}else if(data.code==406||data.code==407){
									rs.Toast('超出活动数量，将恢复原价');
										if(item.attr.length==0){
												this.shop[one].list[two].cart_num=item.activity_num;
										}else{
												this.shop[one].list[two].cart_num=item.attr.activity_num;
										}
									this.$refs.popup.close();
								}else{
									rs.Toast(data.msg)
								}
							})
						}
					},
		minus(item,one,two,num){
				this.addCart(item,one, two,num)
		},
		plus(item,one,two,num){	
			this.addCart(item, one, two,num);
			},
		toParent(e){
		this.addCart(e.arrObj, this.firstIndex, this.secondIndex,e.val);
		},
		getCount(){
			let timeStamp = Math.round(new Date().getTime() / 1000);
			let obj = {
				appid: appid,
				timeStamp: timeStamp
			};
				let sign = md5.hexMD5(rs.objKeySort(obj) + appsecret);
				let params = Object.assign({
					sign: sign
				},obj);	
					rs.getRequests("getCountNum", params, (res) => {
						let {data}=res;
						if(data.code==200){
							let {fullPrice,rule}=data.data;
							
							for(let i=rule.length-1;i>=0;i--){
								if(fullPrice>=rule[i].price){
								this.ruleKind=i;
								return;	
								}else{
									this.ruleKind=-1;
								}
									
							}
						}
					})
		}
		},
		onShow() {
			this.openCart();
		}
	}
</script>

<style>
	.shoplist .icon-shanchu {
		color: red;
		font-weight: 700;
	}

	.shoplist .class_name {
		padding-top: 10rpx;
	}

	.shoplist .shop {
		background: white;
		margin-top: 10rpx;
		padding: 0 20rpx;
	}

	.shoplist .single_good {
		padding: 10rpx 0;
		border-bottom: 1px solid #f7f6f6;
	}

	.shoplist .class_tag {
		background: #009a44;
		color: #fff;
		padding: 0 8rpx;
		margin-right: 10rpx;
		border-radius: 6rpx;
	}

	.shoplist .good_img {
		width: 30%;
	}

	.shoplist .good_img .have_img {
		width: 100%;
		height: 160rpx;
	}

	.shoplist .include_delete {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 70%;
	}

	.shoplist .include_delete .info {
		display: flex;
		justify-content: space-between;
	}
	.shoplist .mask_overly{
		position: fixed;
		width: 100%;
		top:0;left:0;
		z-index: 999;
		height:100%;background-color: rgba(0,0,0,.5);
	}
	.shoplist .remark_dialog{
		position: fixed;
		width: 480rpx;
		top: 300rpx;left:18.5%;
		z-index: 1000;border-radius: 5px;
		background-color: white;
	}
	.shoplist .remark_dialog .title{height:80rpx;line-height: 80rpx;text-align: center;}
	.shoplist .remark_dialog .textarea{height: 160rpx;
    width:80%;
    border: 1px solid #ccc;
   padding:10rpx;
	margin:0 auto;
    border-radius: 5px;}
	.shoplist .remark_dialog textarea{width:100%;height:100%;}
	.shoplist .remark_dialog .buttons{display: flex;height: 60rpx;line-height: 60rpx;   border-top: 1px solid #ccc;margin-top:40rpx;}
	.shoplist .remark_dialog .buttons>view{width:50%;text-align: center;}
	.shoplist .remark_dialog .cancel{border-right:1px solid #ccc;}
	.shoplist .gift {margin-top: 10rpx;background: white;padding:0 20rpx;}
</style>
