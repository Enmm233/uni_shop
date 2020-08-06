let app = getApp();
var active = {
	'active': app.globalData.active
};
var rootDocment = app.globalData.rootUrl + '/mobileOrder/'; //主接口; //主接口
var globalUrl = ["login"]
if (uni.getStorageSync("cdj_token")) {
	var header = {
		'Accept': 'application/json',
		'content-type': 'application/json', //
		'Authorization': uni.getStorageSync("cdj_token"),
	}
}
/***
 * uri: 请求地址
 * datas:请求参数
 * success:请求成功的返回值
 * fail:请求失败的返回值
 */
//get请求带加载
function getRequest(url, datas, success) {
	uni.showLoading({
		title: '加载中...',
		duration: 2000,
		mask: true,
		success: function(res) {
			uni.request({
				url: rootDocment + url,
				method: 'GET',
				header: {
					'Accept': 'application/json',
					'content-type': 'application/json', //
					'Authorization': uni.getStorageSync("cdj_token"),
				},
				data: Object.assign(datas, active),
				success: res => {
					success(res)
					if (res.header.Authorization != undefined) {
						uni.setStorageSync("cdj_token", res.header.Authorization)
					}
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 1000,
							success: function() {

							}
						})
					}
					if (res.data.code == 401) {
						uni.navigateTo({
							url: '/pages/account/login'
						});
					}
					if (res.data.code == 404) {

						uni.navigateTo({
							url: '/pages/account/404'
						});

					}

					uni.hideLoading();
				},
				fail: res => {
					uni.showModal({
						title: res.data,
						content: '网络出错，请刷新重试',
						showCancel: false
					})
				},

			})
		},
		fail: function(res) {},
		complete: function(res) {},
	})


}

//get请求
function getRequests(url, datas, success) {
	uni.request({
		url: rootDocment + url,
		method: 'GET',
		header: {
			'Accept': 'application/json',
			'content-type': 'application/json',
			'Authorization': uni.getStorageSync("cdj_token"),
		},
		data: Object.assign(datas, active),
		success: res => {
			success(res)
			if (res.header.Authorization != undefined) {
				uni.setStorageSync("cdj_token", res.header.Authorization)
			}
			if (res.data.code == 401) {
				uni.navigateTo({
					url: '/pages/account/login'
				});
			}
			if (res.data.code == 404) {
				uni.navigateTo({
					url: '/pages/account/404'
				});

			}
			if (res.data.code == 408) {
				uni.navigateTo({
					url: '/pages/account/service'
				})
			}
		},
		fail: res => {
			uni.showModal({
				title: res.data,
				content: '网络出错，请刷新重试',
				showCancel: false
			})
		},

	})
}

/***
 * 
 * uri: 请求地址
 * datas:请求参数
 * success:请求成功的返回值
 * fail:请求失败的返回值
 */
//POST请求带加载中
function postRequest(url, datas, success) {
	uni.showLoading({
		title: '加载中',
		mask: true,
		success: function(res) {
			uni.request({
				url: rootDocment + url,
				method: 'POST',
				header: {
					'Accept': 'application/json',
					'content-type': 'application/json', //
					'Authorization': uni.getStorageSync("cdj_token"),
				},
				data: Object.assign(datas, active),
				success: res => {
					success(res)
					if (res.header.Authorization != undefined) {
						uni.setStorageSync("cdj_token", res.header.Authorization)
					}
					if (res.data.code == 400) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 1000,
							success: function() {

							}
						})
					}
					if (res.data.code == 401) {

						uni.navigateTo({
							url: '/pages/account/login'
						});

					}
					if (res.data.code == 403) {
						uni.showToast({
							title: '账号已禁用',
							icon: 'none',
							duration: 1000,
							success: function() {
								uni.navigateTo({
									url: '/pages/account/login'
								});
							}
						})
					}
					if (res.data.code == 404) {

						uni.navigateTo({
							url: '/pages/account/404'
						});

					}
					if (res.data.code == 408) {
						uni.showToast({
							title: '抱歉，您的服务已到期，请联系《菜东家》工作人员续费！',
							icon: 'none',
							duration: 2000,
						})
					}
					uni.hideLoading();
				},
				fail: res => {
					uni.showModal({
						title: '网络错误',
						content: '网络出错，请刷新重试',
						showCancel: false
					})
				},

			})
		},
		fail: function(res) {},
		complete: function(res) {},
	})

}
//POST请求不带加载中
function postRequests(url, datas, success) {
	uni.request({
		url: rootDocment + url,
		method: 'POST',
		header: {
			'Accept': 'application/json',
			'content-type': 'application/json', //
			'Authorization': uni.getStorageSync("cdj_token"),
		},
		data: Object.assign(datas, active),
		success: res => {
			success(res)
			if (res.header.Authorization != undefined) {
				uni.setStorageSync("cdj_token", res.header.Authorization)
			}
			if (res.data.code == 401) {

				uni.navigateTo({
					url: '/pages/account/login'
				});

			}
		},
		fail: res => {
			uni.showModal({
				title: '网络错误',
				content: '网络出错，请刷新重试',
				showCancel: false
			})
		},

	})
}

function objKeySort(obj) { //排序的函数
	var newkey = Object.keys(obj).sort();
	//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
	var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
	var sz = '';
	for (var i = 0; i < newkey.length; i++) { //遍历newkey数组
		newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
	}
	Object.keys(newObj).forEach(function(key) {
		sz += '&' + key + '=' + newObj[key]
	});
	return sz.substr(1); //返回排好序的新对象
}


function Toast(message) {
	uni.showToast({
		title: message,
		icon: 'none',
		duration: 1000
	})
}


function getLastDay() {
	var current = new Date();
	var currentMonth = current.getMonth();
	var nextMonth = ++currentMonth;

	var nextMonthDayOne = new Date(current.getFullYear(), nextMonth, 1);

	var minusDate = 1000 * 60 * 60 * 24;

	return new Date(nextMonthDayOne.getTime() - minusDate);
}

function thedefaulttime() { //购买记录默认时间
	var date = new Date();
	var year = date.getFullYear().toString();
	var time = (date.getMonth() + 1).toString();


	var month = '';
	if (time < 10) {
		month = "0" + time;
	} else {
		month = time;
	}
	var num = date.getDate().toString();
	var day = getLastDay().getDate();

	// if (num < 10) {
	// 	day = "0" + num;
	// } else {
	// 	day = num;
	// }
	var start = year + '-' + month + '-01';
	var end = year + '-' + month + '-' + day;
	var dateArr = [start, end];
	return dateArr;
}

// 百度地图
function MP(ak) {
	return new Promise(function(resolve, reject) {
		window.init = function() {
			resolve(BMap)
		}
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://api.map.baidu.com/api?v=2.0&ak=" + ak + "&callback=init";
		script.onerror = reject;
		document.head.appendChild(script);
	})

}



module.exports = {
	getRequest: getRequest,
	getRequests: getRequests,
	postRequest: postRequest,
	postRequests: postRequests,
	Toast: Toast,
	header: header, //请求头部
	objKeySort: objKeySort, //加密排序
	thedefaulttime: thedefaulttime, //加密排序
	MP: MP
}
