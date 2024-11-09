<template>
	<view class="container">
		<view class="box">
			<view class="box_item shadow" v-for="i in inquiryNoticesList" :key="i.id">
				<view class="box_item_t">
					<text>{{i.title}}</text>
					<text>{{ $u.timeFormat(i.createTime, 'yyyy-mm-dd')  }}</text>
				</view>
				<u-divider></u-divider>
				<view class="box_item_b">
					<text>{{i.content}}</text>
					<text @click="routerManageDetails(i.inquiryId)">查看报价</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const customService = require('../../common/store/customService.js');
	export default {
		data() {
			return{
				inquiryNoticesList: []
			}
		},
		onShow() {
			this.getInquiryNotices()
		},
		methods: {
			getInquiryNotices() {
				let that = this
				customService.getInquiryNotices({
					success(res) {
						if (!uni.$u.test.isEmpty(res.data)) {
							that.inquiryNoticesList = res.data
						}
					},
					fail(err) {},
				})
			},
			routerManageDetails(value) {
				uni.$u.route({
					url: '/pages/inquiry/inquiry_manage_details',
					params: {
						inquiry_id: value
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 16rpx 24rpx 24rpx 24rpx;
		
		.box {
			@include flex(column);
			width: 100%;
			
			&_item {
				width: 100%;
				height: auto;
				padding: 24rpx;
				border-radius: 12rpx;
				margin-bottom: 24rpx;
				
				&_t {
					@include flex();
					justify-content: space-between;
					align-items: center;
					
					text:first-child {
						color: #333;
						font-size: 32rpx;
						font-weight: bold;
					}
					
					text:last-child {
						color: #666;
						font-size: 24rpx;
					}
				}
				
				&_b {
					@include flex();
					justify-content: space-between;
					align-items: center;
					
					text:first-child {
						color: #333;
						font-size: 28rpx;
					}
					
					text:last-child {
						color: #1989FA;
						font-size: 24rpx;
					}
				}
			}
		}
	}
</style>