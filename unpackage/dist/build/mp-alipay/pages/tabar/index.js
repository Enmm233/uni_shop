(my["webpackJsonp"]=my["webpackJsonp"]||[]).push([["pages/tabar/index"],{"0c6a":function(t,e,n){"use strict";n.r(e);var a=n("6603"),i=n.n(a);for(var o in a)"default"!==o&&function(t){n.d(e,t,(function(){return a[t]}))}(o);e["default"]=i.a},"4cf7":function(t,e,n){"use strict";n.r(e);var a=n("56b9"),i=n("0c6a");for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);n("cdbb");var r,u=n("f0c5"),c=Object(u["a"])(i["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],r);e["default"]=c.exports},"56b9":function(t,e,n){"use strict";var a={"my-search":function(){return n.e("components/search/index").then(n.bind(null,"82f1"))},"uni-notice-bar":function(){return n.e("components/uni-notice-bar/uni-notice-bar").then(n.bind(null,"d616"))},"my-countdown":function(){return n.e("components/countdown/index").then(n.bind(null,"4225"))},"my-recomend":function(){return n.e("components/recomend/index").then(n.bind(null,"72f1"))},"my-loading":function(){return n.e("components/loading/index").then(n.bind(null,"efc6"))},"my-backtop":function(){return n.e("components/backtop/index").then(n.bind(null,"d521"))},"uni-popup":function(){return Promise.all([n.e("common/vendor"),n.e("components/uni-popup/uni-popup")]).then(n.bind(null,"c6a8"))},"my-addcart":function(){return n.e("components/addcart/index").then(n.bind(null,"b877"))},"my-tabar":function(){return n.e("components/tabar/index").then(n.bind(null,"abb6"))}},i=function(){var t=this,e=t.$createElement;t._self._c},o=[];n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return a}))},6603:function(t,e,n){"use strict";(function(t,a){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=r(n("4b89")),o=r(n("d07b"));function r(t){return t&&t.__esModule?t:{default:t}}function u(t){return l(t)||d(t)||s(t)||c()}function c(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function s(t,e){if(t){if("string"===typeof t)return f(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(t,e):void 0}}function d(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function l(t){if(Array.isArray(t))return f(t)}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,a=new Array(e);n<e;n++)a[n]=t[n];return a}function p(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var m=function(){n.e("components/uni-notice-bar/uni-notice-bar").then(function(){return resolve(n("d616"))}.bind(null,n)).catch(n.oe)},b=getApp().globalData,h=b.appid,g=b.appsecret,v=b.imgRemote,y={components:{uniNoticeBar:m},data:function(){return{showActive:!1,support:!1,showTop:!1,token:"",imgRemote:v,speed:30,loading:!0,page:1,num:10,hours:1e3,adList:{},activeList:{},activeConf:{},cartware:{},config:{},itemList:[],count:0}},methods:{closeCart:function(){this.$refs.addcart.onClose()},navUrl:function(e){var n=this;if(this.count++,1==this.count){setTimeout((function(){n.count=0}),1e3);var i=e.id,r=e.cate_id,u=e.status;if(0!=u)switch(i){case 1:t.navigateTo({url:"/pages/index/collect"});break;case 2:t.navigateTo({url:"/pages/index/newback"});break;case 3:t.navigateTo({url:"/pages/index/recommed"});break;case 4:t.makePhoneCall({phoneNumber:this.adList.phone});break;case 5:t.switchTab({url:"/pages/tabar/classify"});break;case 6:t.switchTab({url:"/pages/tabar/shopcart"});break;case 7:t.switchTab({url:"/pages/tabar/order"});break;case 8:t.switchTab({url:"/pages/tabar/user"});break;default:console.log(r),getApp().globalData.classId=r,a.switchTab({url:"/pages/tabar/classify"});break}else o.default.Toast("该栏目已下架")}},openCart:function(t){this.$refs.popup.open(),this.cartware=t},onClose:function(){this.$refs.popup.close()},newPage:function(e,n){var a=this;this.count++,1==this.count&&(setTimeout((function(){a.count=0}),1e3),n?t.navigateTo({url:"/pages/index/".concat(e,"?id=").concat(n)}):t.navigateTo({url:"/pages/index/".concat(e)}))},indexAd:function(){var t=this,e=Math.round((new Date).getTime()/1e3),n={appid:h,timeStamp:e},a=i.default.hexMD5(o.default.objKeySort(n)+g),r=Object.assign({sign:a},n);o.default.getRequests("indexAd",r,(function(e){var n=e.data;200==n.code&&(t.adList=n.data)}))},indexItem:function(){var t,e=this;this.itemList=[];var n=Math.round((new Date).getTime()/1e3),a={appid:h,timeStamp:n},r=this.num,u=this.page,c=i.default.hexMD5(o.default.objKeySort(a)+g),s=Object.assign((t={page:1,sign:c},p(t,"page",u),p(t,"num",r),t),a);o.default.getRequests("indexItem",s,(function(t){var n=t.data;200==n.code&&(e.itemList=n.data.list,e.config=n.data,n.data.total<=10?(e.loading=!1,e.support=!0):(e.support=!1,e.loading=!0))}))},limitList:function(){var t=this,e=Math.round((new Date).getTime()/1e3),n={appid:h,timeStamp:e},a=i.default.hexMD5(o.default.objKeySort(n)+g),r=Object.assign({sign:a},n);o.default.getRequests("panicBuyIndex",r,(function(e){var n=e.data;if(200==n.code){var a=n.data,i=a.itemList,o=a.timeRemain;0!=n.data.length?t.showActive=!0:t.showActive=!1,t.hours=Math.abs(o),t.activeConf=n.data,t.activeList=i}}))}},onShow:function(){this.token=t.getStorageSync("cdj_token"),this.indexAd(),this.limitList(),1==b.isReload&&(this.page=1,t.pageScrollTo({scrollTop:0,duration:0}),this.indexItem())},onLoad:function(){t.hideTabBar()},onReachBottom:function(){var t=this,e=this,n=Math.round((new Date).getTime()/1e3),a=e.num,r=e.page,c={appid:h,timeStamp:n},s=i.default.hexMD5(o.default.objKeySort(c)+g),d={appid:h,num:a,page:r+1,timeStamp:n,sign:s};o.default.getRequests("indexItem",d,(function(e){var n,a=e.data;(a.code=200)&&(""!=a.data?((n=t.itemList).push.apply(n,u(a.data.list)),t.page+=1,t.loading=!0):(t.support=!0,t.loading=!1))}))},onPageScroll:function(t){0==t.scrollTop?this.showTop=!1:this.showTop=!0}};e.default=y}).call(this,n("c11b")["default"],n("c11b")["default"])},"6c52":function(t,e,n){},ad26:function(t,e,n){"use strict";(function(t){n("1995");a(n("66fd"));var e=a(n("4cf7"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("c11b")["createPage"])},cdbb:function(t,e,n){"use strict";var a=n("6c52"),i=n.n(a);i.a}},[["ad26","common/runtime","common/vendor"]]]);