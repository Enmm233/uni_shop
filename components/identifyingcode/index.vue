<template>
	<view class="identifying_code" :class="count == true ? 'greencode' : 'graycode'" @click="getCode">{{str}}</view>
</template>

<script>
export default {
	data() {
		return {
			count:'',
			str:'获取验证码'
		};
	},
	methods: {
		sendCode(){
			this.count=true;
			if(this.str!='获取验证码'){
				return;
			}
			let seconds=60;
			let clear=setInterval(()=>{
				seconds--;
				this.str=seconds+'s';
				if(seconds<=0){
					clearInterval(clear);
					this.str='获取验证码';
					this.count=false;
				}
			},1000)
		},
		getCode() {
			if(this.str!='获取验证码'){
				return;
			}
			this.$emit('getCode')		
		}
	}
};
</script>

<style>
.identifying_code {
	width: 150rpx;
	height: 38rpx;
	color: white;
	border-radius: 6px;
	text-align: center;
	padding:0 4rpx;
}
.greencode {
	background: #009a44;
}
.graycode {
	background: #808080;
}
</style>
