(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-user-address"],{"0b5c":function(t,a,e){var n=e("24fb");a=n(!1),a.push([t.i,"#test[data-v-0137892c]{width:100vw;height:100vh}.test uni-image[data-v-0137892c]{display:block;border-radius:50%;-webkit-box-shadow:0 0 2px grey;box-shadow:0 0 2px grey;width:35px;position:absolute;top:calc(45% + 44px);left:3%;background:#fff;height:35px}",""]),t.exports=a},3208:function(t,a,e){"use strict";var n={"uni-nav-bar":e("f858").default},i=function(){var t=this,a=t.$createElement,n=t._self._c||a;return n("v-uni-view",{attrs:{id:"test"}},[n("uni-nav-bar",{attrs:{"left-icon":"arrowleft","right-text":"确定",title:"选择地址","status-bar":t.navBar,fixed:"true"},on:{clickLeft:function(a){arguments[0]=a=t.$handleEvent(a),t.leftClick.apply(void 0,arguments)},clickRight:function(a){arguments[0]=a=t.$handleEvent(a),t.rightClick.apply(void 0,arguments)}}}),n("v-uni-view",{staticClass:"test",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.test.apply(void 0,arguments)}}},[n("v-uni-image",{attrs:{src:e("caca"),mode:""}})],1),n("iframe",{attrs:{id:"mapPage",width:"100%",height:"100%",frameborder:"0",src:t.a}})],1)},o=[];e.d(a,"b",(function(){return i})),e.d(a,"c",(function(){return o})),e.d(a,"a",(function(){return n}))},a7b6:function(t,a,e){var n=e("0b5c");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var i=e("4f06").default;i("09e9fb40",n,!0,{sourceMap:!1,shadowMode:!1})},c167:function(t,a,e){"use strict";var n=e("a7b6"),i=e.n(n);i.a},c4de:function(t,a,e){"use strict";(function(t){var n=e("ee27");e("99af"),Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var i=n(e("4b89")),o=n(e("d07b")),r=e("546a"),c=t,u=(c.log,getApp().globalData),s=u.appid,d=u.appsecret,l=(u.imgRemote,u.navBar),f={data:function(){return{navBar:l,url:"",lat:"",lng:"",a:""}},methods:{leftClick:function(){"user"!=this.url?"accountedit"!=this.url?"accountadd"!=this.url||uni.navigateTo({url:"accountadd?count=2"}):uni.navigateTo({url:"accountedit?count=2"}):uni.navigateTo({url:"userAddress?count=2"})},rightClick:function(){if(this.address1){if("user"==this.url){var t=uni.getStorageSync("userAddress");return t.address=this.address1,uni.setStorageSync("userAddress",t),void uni.navigateTo({url:"userAddress?lat=".concat(this.lat,"&lng=").concat(this.lng,"&count=2")})}if("accountedit"==this.url){t=uni.getStorageSync("amend");return t.childInfo.address=this.address1,uni.setStorageSync("amend",t),void uni.navigateTo({url:"accountedit?lat=".concat(this.lat,"&lng=").concat(this.lng,"&count=2")})}if("accountadd"==this.url){t=uni.getStorageSync("append");return t.address=this.address1,uni.setStorageSync("append",t),void uni.navigateTo({url:"accountadd?lat=".concat(this.lat,"&lng=").concat(this.lng,"&count=2")})}}},test:function(){window.location.reload()},wxConfig:function(){var t=this,a=Math.round((new Date).getTime()/1e3),e={appid:s,timeStamp:a},n=i.default.hexMD5(o.default.objKeySort(e)+d),c=Object.assign({sign:n},e);o.default.getRequests("wxConfig",c,(function(a){200==a.data.code&&(r.config({debug:!1,appId:a.data.data.appId,timestamp:a.data.data.timestamp,nonceStr:a.data.data.nonceStr,signature:a.data.data.signature,jsApiList:["getLocation"]}),r.ready((function(){r.getLocation({type:"wgs84",success:function(a){var e=a.latitude,n=a.longitude;t.a="https://apis.map.qq.com/tools/locpicker?search=1&type=1&coord="+e+","+n+"&key=EE7BZ-2ODH2-DFUUE-C2PG7-RWE6F-XDBMG&referer=myapp"}})})))}))}},onShow:function(){this.wxConfig()},onLoad:function(a){var e=this;this.url=a.url,t.log(this.url),window.addEventListener("message",(function(t){var a=t.data;a&&"locationPicker"==a.module&&(e.address1=a.poiaddress,e.lat=a.latlng.lat,e.lng=a.latlng.lng)}),!1)}};a.default=f}).call(this,e("5a52")["default"])},e0c8:function(t,a,e){"use strict";e.r(a);var n=e("c4de"),i=e.n(n);for(var o in n)"default"!==o&&function(t){e.d(a,t,(function(){return n[t]}))}(o);a["default"]=i.a},ebdd:function(t,a,e){"use strict";e.r(a);var n=e("3208"),i=e("e0c8");for(var o in i)"default"!==o&&function(t){e.d(a,t,(function(){return i[t]}))}(o);e("c167");var r,c=e("f0c5"),u=Object(c["a"])(i["default"],n["b"],n["c"],!1,null,"0137892c",null,!1,n["a"],r);a["default"]=u.exports}}]);