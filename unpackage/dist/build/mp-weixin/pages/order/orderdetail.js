(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/order/orderdetail"],{2225:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=r(n("4b89")),o=r(n("d07b"));function r(t){return t&&t.__esModule?t:{default:t}}var u=getApp().globalData,i=u.appid,d=u.appsecret,c=(u.imgRemote,u.navBar),f={data:function(){return{navBar:c,id:"",orderDetail:"",detail:""}},methods:{phone:function(){var e=this;console.log(e.orderDetail),t.makePhoneCall({phoneNumber:e.orderDetail.tel})},LeftClick:function(){t.navigateBack({delta:1})},orderInfo:function(){var t=this,e=t.id,n=Math.round((new Date).getTime()/1e3),r={appid:i,id:e,timeStamp:n},u=a.default.hexMD5(o.default.objKeySort(r)+d),c={appid:i,timeStamp:n,sign:u,id:e};o.default.getRequests("orderInfo",c,(function(e){200==e.data.code?(t.orderDetail=e.data.data,t.detail=e.data.data.orderInfo):o.default.Toast(e.data.msg)}))}},onLoad:function(t){this.id=t.orderItem},onShow:function(){u.aData.show=!0;var t=this;t.orderInfo()}};e.default=f}).call(this,n("543d")["default"])},3947:function(t,e,n){"use strict";n.r(e);var a=n("6036"),o=n("cd12");for(var r in o)"default"!==r&&function(t){n.d(e,t,(function(){return o[t]}))}(r);n("ce9b");var u,i=n("f0c5"),d=Object(i["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],u);e["default"]=d.exports},"578f":function(t,e,n){},6036:function(t,e,n){"use strict";var a={"uni-nav-bar":function(){return n.e("components/uni-nav-bar/uni-nav-bar").then(n.bind(null,"f858"))}},o=function(){var t=this,e=t.$createElement;t._self._c},r=[];n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return a}))},"7e99":function(t,e,n){"use strict";(function(t){n("1995"),n("921b");a(n("66fd"));var e=a(n("3947"));function a(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,n("543d")["createPage"])},cd12:function(t,e,n){"use strict";n.r(e);var a=n("2225"),o=n.n(a);for(var r in a)"default"!==r&&function(t){n.d(e,t,(function(){return a[t]}))}(r);e["default"]=o.a},ce9b:function(t,e,n){"use strict";var a=n("578f"),o=n.n(a);o.a}},[["7e99","common/runtime","common/vendor"]]]);