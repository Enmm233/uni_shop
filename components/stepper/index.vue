<template>
	<view class="my_stepper addcart">
		<image src="../../static/img/jian.png" mode="aspectFit" @click="minus"></image>
		<view @click="showkey" class="align_center"><input class="input_value" type="number" v-model="value" disabled="true" /></view>
		<image src="../../static/img/plus.png" mode="aspectFit" @click="plus"></image>
	</view>
</template>

<script>
export default {
	props:['val','min'],
	data() {
		return {
			 value:this.val
		};
	},
	watch:{
		val(newval){
			this.value=newval;
		}
	},
	methods: {
		minus() {
			this.$emit('minus',parseFloat(this.value)); 
		},
		plus(){
			this.$emit('plus',parseFloat(this.value));
		},
		showkey(){
			this.$emit('showKey')
		}
	}
};
</script>

<style>
.my_stepper {
	display: flex;
	align-items: center;
	height:38rpx;
}
.my_stepper .input_value {
	width: 80rpx;
	height: initial;
	text-align: center;
}

</style>
