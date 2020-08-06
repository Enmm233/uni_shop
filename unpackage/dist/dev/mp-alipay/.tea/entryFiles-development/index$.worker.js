if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
  self.getCurrentPages = AFAppX.getCurrentPages;
  self.getApp = AFAppX.getApp;
  self.Page = AFAppX.Page;
  self.App = AFAppX.App;
  self.my = AFAppX.bridge || AFAppX.abridge;
  self.abridge = self.my;
  self.Component = AFAppX.WorkerComponent || function(){};
  self.$global = AFAppX.$global;
  self.requirePlugin = AFAppX.requirePlugin;
          

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../components/search/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-icons/uni-icons?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/uni-notice-bar/uni-notice-bar?hash=993ca45dec9dcdb8f19451ba17e5ec831eb613a0');
require('../../components/countdown/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/recomend/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/loading/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/backtop/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-transition/uni-transition?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-popup/uni-popup?hash=63f3d097e78ac04213190ce4a92c81860617f7b4');
require('../../components/stepper/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/keyboard/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/addcart/index?hash=9e385500a22055f8365897af5b2ae97f729980ad');
require('../../components/tabar/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/s-tabs/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/s-tab/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/profile/index?hash=82012776da0e20c0d2b0711ebea5a1a7dccbd0b1');
require('../../components/uni-drawer/uni-drawer?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/uni-status-bar/uni-status-bar?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-nav-bar/uni-nav-bar?hash=e131c6705ecd6504274661106fc380014f3123b8');
require('../../components/o-tabs/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/w-picker/date-picker?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/w-picker/selector-picker?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/w-picker/w-picker?hash=fb9868b586a64b4e8f0245d1963c26dac53c8bf8');
require('../../components/identifyingcode/index?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/helang-moveVerify/helang-moveVerify?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/evan-switch/evan-switch?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-calendar/uni-calendar-item?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../components/uni-calendar/uni-calendar?hash=39d75801fe65ecc7ad5149459f3065de50abed34');
require('../../components/ling-imgcropper/ling-imgcropper?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../pages/tabar/index?hash=9d83cc76fe675b276ef94da83281c54b524411ea');
require('../../pages/tabar/classify?hash=e0d79acd02069d295fb22d94d4f5e0738675dcf6');
require('../../pages/tabar/order?hash=bd9b3da773c286f71b376b0aa94694e07e98b04a');
require('../../pages/tabar/shopcart?hash=6eca2f9916315b3ef9ce773baa4864d583787df5');
require('../../pages/tabar/user?hash=a2403adf0f7c6b7b26a7e3f10e6c00f0d1d85d43');
require('../../pages/index/shopdetail?hash=267e48987bcc151c596a8c4192925cb8f734f127');
require('../../pages/index/collect?hash=663e009ca7fc3ea6ba4a4d3a7de259929734ff70');
require('../../pages/index/recommed?hash=663e009ca7fc3ea6ba4a4d3a7de259929734ff70');
require('../../pages/index/newback?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/index/search?hash=b13632eb1c655fa31d52083d9697951bda7e9260');
require('../../pages/index/flashsale?hash=8bde98e999f6337f073f23a086a07d8741711372');
require('../../pages/account/login?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/account/selectway?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/account/forget?hash=0cce962104fde57ac47ff85077293c14c4b7f935');
require('../../pages/account/register?hash=0cce962104fde57ac47ff85077293c14c4b7f935');
require('../../pages/account/service?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/account/treaty?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/account/bind?hash=0cce962104fde57ac47ff85077293c14c4b7f935');
require('../../pages/account/404?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../pages/order/orderdetail?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/order/address?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/order/pay?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/order/fenjian?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/shopcart/delivery?hash=f0d7a58cb04cc482c81bea1feee610d1e562034d');
require('../../pages/shopcart/pay?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/shopcart/address?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/shopcart/shoplist?hash=f831ca20dae71cc4448ce6b15865bd18e3edbd9c');
require('../../pages/user/accountmange?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/accountadd?hash=f0d7a58cb04cc482c81bea1feee610d1e562034d');
require('../../pages/user/accountedit?hash=8fb81030335291a2ccf7e012eb4491d39a0eca9a');
require('../../pages/user/modifypwd?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/receipt?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/invest?hash=84ebc9cca29ec85bc09619080f1031a4455758cb');
require('../../pages/user/investlist?hash=147f37272437f390cbebb1a564893941507003eb');
require('../../pages/user/investrecord?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/bill?hash=8a19c00141a2ff6febb2fc744b695a57ccb87717');
require('../../pages/user/billdetail?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/cash?hash=1ce7ffeb02e365ddbd97e12e1d072b26f4f56d7a');
require('../../pages/user/cashdetail?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/myinfo?hash=536affd1741536a75bf62a6eadd09a528d002a5c');
require('../../pages/user/bindphone?hash=0cce962104fde57ac47ff85077293c14c4b7f935');
require('../../pages/user/userAddress?hash=f0d7a58cb04cc482c81bea1feee610d1e562034d');
require('../../pages/user/address?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/purchase_detail?hash=57f163bfc0512e187bc203ae92656c7a1ba9e313');
require('../../pages/user/purchase_record?hash=8a19c00141a2ff6febb2fc744b695a57ccb87717');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}