/**
 * Http 请求队列
 */
let httpRequestList = [];
/**
 * 获取 Token
 */
const getToken = () => {
	let token = uni.getStorageSync("token");
	return token;
};

/**
 * 获取 语言
 */
const getApplicationLocale = () => {
	let applicationLocale = uni.getStorageSync("applicationLocale");
	return applicationLocale;
};

/**
 * 获取 货币
 */
const getCurrency = () => {
	let currency = 'CNY';
	if (!uni.$u.test.isEmpty(uni.getStorageSync('currency'))) {
		currency = uni.getStorageSync('currency');
	}
	return currency;
};

const request = (url, method, contentType, data, isBuffer) => {
	const startTime = new Date().getTime()
	if (httpRequestList.includes(url)) {
		return new Promise((resolve, reject) => {});
	} else {
		httpRequestList.push(url);
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				method: method,
				data: data,
				timeout: 10 * 6000,
				header: {
					'Authorization': 'Bearer ' + getToken(),
					'Content-Type': contentType === "json" ? "application/json" :
						'application/x-www-form-urlencoded',
					'Accept-Language': getApplicationLocale(),
					'currency': getCurrency()
				},
				responseType: isBuffer ? 'arraybuffer' : "text",
				success(request) {
					resolve(request.data)
				},
				fail(error) {
					reject(error)
				},
				async complete(res) {
					const endTime = new Date().getTime()
					const totalTime = endTime - startTime
					// 当请求大于3s
					if (totalTime > 3000 || res.statusCode !== 200) {}
					// 加载完成
					if (httpRequestList.indexOf(url) > -1) {
						httpRequestList.splice(httpRequestList.indexOf(url), 1);
					}
				}
			})
		});
	}
};

/**
 * 上传文件
 */
const upLoadFiles = (url, filePath, data) => {
	if (httpRequestList.includes(url)) {
		return new Promise((resolve, reject) => {});
	} else {
		httpRequestList.push(url);
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: url,
				filePath: filePath,
				name: "avatarfile",
				timeout: 10 * 1000,
				header: {
					'Authorization': getToken(),
				},
				formData: data,
				success(request) {
					resolve(request.data)
				},
				fail(error) {
					reject(error)
				},
				complete(aaa) {
					// 加载完成
					if (httpRequestList.indexOf(url) > -1) {
						httpRequestList.splice(httpRequestList.indexOf(url), 1);
					}
				}
			})
		});
	}
};

Promise.prototype.finally = function(callback) {
	let Promise = this.constructor;
	return this.then(
		function(value) {
			Promise.resolve(callback()).then(
				function() {
					return value;
				}
			);
		},
		function(reason) {
			Promise.resolve(callback()).then(
				function() {
					throw reason;
				}
			);
		}
	);
};

module.exports = {
	request,
	upLoadFiles
};