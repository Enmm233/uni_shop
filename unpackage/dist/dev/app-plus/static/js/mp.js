// 百度地图
export function MP(ak) {
  return new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(BMap)
    }
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
    script.onerror = reject;
    document.head.appendChild(script);
  })

}

//腾讯地图
// export function MP(ak) {
//   return new Promise(function (resolve, reject) {
//     window.init = function () {
//       resolve(BMap)
//     }
//     var script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = "https://map.qq.com/api/js?v=2.exp&key=" + ak + "&callback=init";
//     script.onerror = reject;
//     document.head.appendChild(script);
//   })
//
// }
