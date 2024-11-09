<!-- 组件路径：components/myButton/myButton.vue -->
<template>
	<view>
		<button type="default" @click="updateTime">刷新当前时间</button>
	</view>
</template>
<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {}
		},
		methods: {
			...mapMutations(['updateTime'])
		}
	}
</script>