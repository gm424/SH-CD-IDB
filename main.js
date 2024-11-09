import App from './App'
import messages from './locale/index'

let i18nConfig = {
  locale: uni.getLocale(),
  messages
}

// #ifndef VUE3
import Vue from 'vue'
import store from './store'
import './uni.promisify.adaptor'
import uView from '@/uni_modules/uview-ui'
import VueI18n from 'vue-i18n'

Vue.prototype.$store = store

Vue.use(uView)
Vue.use(VueI18n)
uni.$u.config.unit = 'rpx'
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	i18n,
	...App
})


app.$mount()
// #endif