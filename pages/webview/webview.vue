<template>
	<view class="content"><web-view :src="path" class="web"></web-view></view>
</template>

<script>
	import Validate from '../../common/utils/validate.js';
	export default {
		data() {
			return {
				path: '',
				title: ''
			};
		},
		onLoad: function(option) {
			this.path = decodeURIComponent(option.path); //注意转码
			this.title = option.title;
			// console.log(this.getRequestParams(this.path))
		},
		onReady() {
			if (!Validate.isEmply(this.title)) {
				this.setTitle(this.title);
			}
			// #ifdef APP-PLUS
			let wv = ''
			var currentWebview = this.$mp.page.$getAppWebview(); //获取当前页面的webview对象
			setTimeout(function() {
				wv = currentWebview.children()[0];
				wv.setStyle({
					scalable: true
				});
			}, 1000); //如果是页面初始化调用时，需要延时一下
			// #endif



		},
		methods: {
			setTitle(title) {
				uni.setNavigationBarTitle({
					title: title
				});
			},
			// 获取utl参数
			getRequestParams(path) {
				let url = this.path;
				let requestParams = {};
				if (url.indexOf('?') !== -1) {
					let str = url.substr(url.indexOf('?') + 1); //截取?后面的内容作为字符串
					// console.log(str, '?后面的内容');
					let strs = str.split('&'); //将字符串内容以&分隔为一个数组
					// console.log(strs, '以&切割的数组');
					for (let i = 0; i < strs.length; i++) {
						requestParams[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
						// 将数组元素中'='左边的内容作为对象的属性名，'='右边的内容作为对象对应属性的属性值
					}
				}
				// console.log(requestParams, '处理后的对象');
				return requestParams;
			}
		}
	};
</script>

<style>
	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.web {
		width: 750rpx;
		flex: 1;
	}
</style>