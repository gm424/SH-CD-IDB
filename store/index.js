// 页面路径：store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import moduleA from '@/store/modules/moduleA';
import moduleB from '@/store/modules/moduleB';
import cartStore from '@/store/modules/cartStore';
import createPersistedState from 'vuex-persistedstate';
import uniStorage from './storageAdapter';
Vue.use(Vuex); //vue的插件机制
export default new Vuex.Store({
  modules: {
    moduleA,
    moduleB,
    cartStore,
  },
  plugins: [
    createPersistedState({
      storage: uniStorage,
    }),
  ],
});
