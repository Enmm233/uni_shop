(my["webpackJsonp"]=my["webpackJsonp"]||[]).push([["pages/account/bind"],{"3bc9":function(e,t,n){"use strict";(function(e){n("1995");a(n("66fd"));var t=a(n("8544"));function a(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,n("c11b")["createPage"])},"5b7d":function(e,t,n){},"7ee3":function(e,t,n){"use strict";var a=n("5b7d"),i=n.n(a);i.a},8544:function(e,t,n){"use strict";n.r(t);var a=n("f47f"),i=n("ee54");for(var o in i)"default"!==o&&function(e){n.d(t,e,(function(){return i[e]}))}(o);n("7ee3");var s,r=n("f0c5"),u=Object(r["a"])(i["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],s);t["default"]=u.exports},e6fb:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=o(n("4b89")),i=o(n("d07b"));function o(e){return e&&e.__esModule?e:{default:e}}var s=function(){n.e("components/helang-moveVerify/helang-moveVerify").then(function(){return resolve(n("2f01"))}.bind(null,n)).catch(n.oe)},r=getApp().globalData,u=r.navBar,c=r.appid,d=r.appsecret,f={components:{moveVerify:s},data:function(){return{resultData:{},mobile:"",verify_code:"",secret_str:"",identifying:"",navBar:u,back:!0,count:0}},methods:{leftClick:function(){e.navigateBack({delta:1})},verifyResult:function(e){this.resultData=e,1!=this.resultData.flag||this.captcha()},verifyReset:function(){this.$refs.verifyElement.reset(),this.resultData={}},captcha:function(){var t=this,n=Math.round((new Date).getTime()/1e3),o={appid:c,timeStamp:n},s=a.default.hexMD5(i.default.objKeySort(o)+d),r=Object.assign({sign:s},o);i.default.getRequests("random",r,(function(n){var a=n.data;200==a.code?(t.secret_str=a.data.number,e.setStorageSync("laravel_session",n.header["Set-Cookie"])):i.default.Toast(a.msg)}))},getCode:function(){var t=this,n=Math.round((new Date).getTime()/1e3);if(t.mobile){var o=/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;if(o.test(t.mobile))if(t.secret_str){var s={appid:c,mobile:t.mobile,timeStamp:n},u=a.default.hexMD5(d+t.secret_str),f=a.default.hexMD5(i.default.objKeySort(s)+d),l=Object.assign({sign:f,secret_str:u},s);e.request({url:r.rootUrl+"/mobileOrder/sendCodeNot",method:"POST",header:{"content-type":"application/json",cookie:e.getStorageSync("laravel_session")},data:l,success:function(e){200==e.data.code?(t.secret_str=e.data.data.random_str,i.default.Toast("验证码已发送到你手机中，请注意查收"),t.$refs.code.sendCode()):(t.verifyReset(),i.default.Toast(e.data.msg))}})}else i.default.Toast("请拖动滑块验证");else i.default.Toast("不能输入特殊字符和空格")}else i.default.Toast("手机号不能为空")},forget:function(){var t=this,n=this,o=/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;if(this.mobile)if(o.test(this.mobile))if(this.verify_code){if(this.count++,1==this.count){setTimeout((function(){t.count=0}),1e3);var s=Math.round((new Date).getTime()/1e3),u={appid:c,timeStamp:s},f=a.default.hexMD5(i.default.objKeySort(u)+d),l=Object.assign({sign:f,mobile:this.mobile,code:this.verify_code,identifying:n.identifying},u);e.request({url:r.rootUrl+"/mobileOrder/wxLoginFollow",method:"POST",data:l,header:{"content-type":"application/json",cookie:e.getStorageSync("laravel_session")},success:function(t){if(200==t.data.code){var n=t.data;i.default.Toast("手机号绑定成功"),e.setStorageSync("cdj_token",n.data.token),e.setStorageSync("is_child",n.data.is_child),e.setStorageSync("is_miniBind",n.data.is_alipayBind),setTimeout((function(){e.switchTab({url:"../tabar/index"})}),1e3)}else 403==t.data.code?(i.default.Toast("绑定手机成功，请耐心等待审核"),setTimeout((function(){e.navigateTo({url:"./login"})}),1e3)):i.default.Toast(t.data.msg)}})}}else i.default.Toast("请输入验证码");else i.default.Toast("不能输入特殊字符和空格");else i.default.Toast("手机号不能为空")}},onLoad:function(e){this.identifying=e.identifying}};t.default=f}).call(this,n("c11b")["default"])},ee54:function(e,t,n){"use strict";n.r(t);var a=n("e6fb"),i=n.n(a);for(var o in a)"default"!==o&&function(e){n.d(t,e,(function(){return a[e]}))}(o);t["default"]=i.a},f47f:function(e,t,n){"use strict";var a={"uni-nav-bar":function(){return n.e("components/uni-nav-bar/uni-nav-bar").then(n.bind(null,"f858"))},"my-identifyingcode":function(){return n.e("components/identifyingcode/index").then(n.bind(null,"a86e"))}},i=function(){var e=this,t=e.$createElement;e._self._c;e._isMounted||(e.e0=function(t){e.back=!1})},o=[];n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){return a}))}},[["3bc9","common/runtime","common/vendor"]]]);