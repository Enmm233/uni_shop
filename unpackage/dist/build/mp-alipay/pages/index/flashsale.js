(my["webpackJsonp"]=my["webpackJsonp"]||[]).push([["pages/index/flashsale"],{"5a20":function(t,n,e){"use strict";e.r(n);var i=e("6766"),a=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);n["default"]=a.a},6766:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=o(e("4b89")),a=o(e("d07b"));function o(t){return t&&t.__esModule?t:{default:t}}var u=getApp().globalData,c=u.appid,s=u.appsecret,d=u.imgRemote,r=u.navBar,l={data:function(){return{token:t.getStorageSync("cdj_token"),imgRemote:d,showTop:!1,kind:0,navBar:r,loading:!0,pbId:"",list:[],activeList:[],minute:0,second:0,config:[],goodIndex:"",arrObj:{},count:0}},methods:{closeKey:function(){this.$refs.keyboard.cancel()},leftClick:function(){t.navigateBack({delta:1})},detailPage:function(n){var e=this;this.count++,1==this.count&&(setTimeout((function(){e.count=0}),1e3),1==this.config.is_detail&&t.navigateTo({url:"shopdetail?id=".concat(n)}))},selectStage:function(t){this.kind=t,this.pbId=this.activeList[t].id,this.loading=!0,this.panicBuylist()},panicBuylist:function(){var t=this;this.list=[];var n=Math.round((new Date).getTime()/1e3),e={appid:c,timeStamp:n},o=this.pbId,u=i.default.hexMD5(a.default.objKeySort(e)+s),d=Object.assign({sign:u,pbId:o},e);a.default.getRequests("panicBuyList",d,(function(n){var e=n.data;200==e.code&&(t.config=e.data,t.activeList=e.data.activeList,t.list=e.data.goodsList,t.loading=!1)}))},showKey:function(t,n){this.$refs.popup.open(),this.arrObj=t,this.goodIndex=n},toParent:function(t){this.addCart(this.arrObj,"changeNum",t.val,"成功加入购物车",this.goodIndex),this.$refs.popup.close()},addCart:function(t,n,e,o,u){var d=this,r=Math.round((new Date).getTime()/1e3),l={appid:c,timeStamp:r,item_id:t.item_id,attr_id:t.attr_id,item_num:e},f=i.default.hexMD5(a.default.objKeySort(l)+s),p=Object.assign({sign:f},l);a.default.postRequests(n,p,(function(t){var n=t.data;200==n.code?(a.default.Toast(o),d.list[u].cart_num=e):407==n.code||406==n.code?a.default.Toast("购买数量不能超过活动数量"):a.default.Toast(t.data.msg)}))},plusSing:function(t,n){this.addCart(t,"changeNum",1,"成功加入购物车",n)},plus:function(t,n,e){1!=t.is_float||Number.isInteger(Number(n))?this.addCart(t,"changeNum",n,"成功加入购物车",e):a.default.Toast("购买数量不能为小数")},minus:function(t,n,e){1!=t.is_float||Number.isInteger(Number(n))?n<=0?this.addCart(t,"deleteCart",n,"删除商品成功",e):this.addCart(t,"changeNum",n,"成功加入购物车",e):a.default.Toast("购买数量不能为小数")}},onShow:function(){this.loading=!0,this.panicBuylist()},onPageScroll:function(t){0==t.scrollTop?this.showTop=!1:this.showTop=!0}};n.default=l}).call(this,e("c11b")["default"])},"8f50":function(t,n,e){"use strict";e.r(n);var i=e("cca5"),a=e("5a20");for(var o in a)"default"!==o&&function(t){e.d(n,t,(function(){return a[t]}))}(o);e("b627");var u,c=e("f0c5"),s=Object(c["a"])(a["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],u);n["default"]=s.exports},"98d7":function(t,n,e){"use strict";(function(t){e("1995");i(e("66fd"));var n=i(e("8f50"));function i(t){return t&&t.__esModule?t:{default:t}}t(n.default)}).call(this,e("c11b")["createPage"])},b627:function(t,n,e){"use strict";var i=e("d5be"),a=e.n(i);a.a},cca5:function(t,n,e){"use strict";var i={"uni-nav-bar":function(){return e.e("components/uni-nav-bar/uni-nav-bar").then(e.bind(null,"f858"))},"my-countdown":function(){return e.e("components/countdown/index").then(e.bind(null,"4225"))},"my-stepper":function(){return e.e("components/stepper/index").then(e.bind(null,"b7a4"))},"my-loading":function(){return e.e("components/loading/index").then(e.bind(null,"efc6"))},"my-backtop":function(){return e.e("components/backtop/index").then(e.bind(null,"d521"))},"uni-popup":function(){return Promise.all([e.e("common/vendor"),e.e("components/uni-popup/uni-popup")]).then(e.bind(null,"c6a8"))},"my-keyboard":function(){return e.e("components/keyboard/index").then(e.bind(null,"ae27"))}},a=function(){var t=this,n=t.$createElement;t._self._c;t._isMounted||(t.e0=function(n){return t.$refs.popup.close()})},o=[];e.d(n,"b",(function(){return a})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return i}))},d5be:function(t,n,e){}},[["98d7","common/runtime","common/vendor"]]]);