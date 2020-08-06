<template>
  <div class="suyuan_tabar">
    <!-- <div style="height:50px;"></div> -->
    <ul class="suyuan_nav">
      <li v-for="(item,index) in nav" @click="color(item)">
        <img v-if="activeIndex==index" :src="imgPath+item.activeimg">
        <img v-else :src="imgPath+item.img">
        <span :class="{green:activeIndex==index}"> {{item.title}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
	let path = '/pages',
		imgPath = '../../new/static/img/';
export default {
	props:['activeIndex'],
  data() {
    return {
		imgPath:imgPath,
     
      nav: [
        { title: '查询结果', link: path+"/suyuan/index", activeimg: 'resultgreen.png', img: 'resultgray.png' },
        { title: '产品介绍', link: path+'/suyuan/product', activeimg: 'productgreen.png', img: 'productgray.png' },
        { title: '全程追溯', link: path+'/suyuan/journey', activeimg: 'journeygreen.png', img: 'journeygray.png' },
        { title: '质检报告', link: path+'/suyuan/quantity', activeimg: 'quantitygreen.png', img: 'quantitygray.png' },
      ]
    }
  },
 
  methods: {
    color(data) {
      let id = this.$route.query.id;
    
      this.$router.push({ path: data.link})
     
    }
  }
}

</script>
<style>
	.suyuan_tabar {  position: fixed; bottom: 0; width: 100%;}
.suyuan_nav {
  display: flex;
  justify-content: space-around;

  padding: 0;
  background: #F5F5F5;
 align-items: center;
 height:50px;
  font-size: 12px;
}

.suyuan_nav img {
  display: block;
  width: 25%;
  margin: 0px 25% 2% 25%;
}

.suyuan_nav li {
	height: 100%;width:25%;
 list-style: none;
 display: flex;flex-direction: column;
 justify-content: center;align-items: center;
}

.suyuan_nav li .green {
  color: #009A44;
}

.suyuan_nav li span {
  color: #9C9C9C;
}

</style>
