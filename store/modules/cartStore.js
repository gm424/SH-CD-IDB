// 子模块moduleA路径：store/modules/moduleA.js
import _ from 'lodash-es';
export default {
  state: {
    cartList: [],
    selectedCartList: [],
  },
  getters: {},
  mutations: {
    UPDATETOCARTCOUNT(state, data) {
      const index = state.cartList.findIndex((item) => item.id === data.id);
      console.log('找到啦!', data.quantity);
      if (index !== -1) {
        // 直接更新数组中的对象（Vuex 通常能够检测到这种变化）
        state.cartList[index].quantity = data.quantity;
        console.log('找到啦', state.cartList[index].quantity, data.quantity);
      }
    },
    UPDATETOCARTGOODS(state, dataList) {
      state.cartList = [];
      state.cartList = dataList;
      console.log('this.store.cartList', dataList, state.cartList);
    },
    GETCARTGOODSLIST(state, list) {
      state.selectedCartList = [];
      state.selectedCartList = list;
      console.log('state.selectedCartList', state.selectedCartList);
      // let jsinList = jsins.split(',');

      // jsinList.forEach((element) => {
      //   const exitSku = _.findLast(state.cartList, (item) => {
      //     return item.jsin == element;
      //   });
      //   if (exitSku) {
      //     state.selectedCartList.push(exitSku);
      //   }
      // });
    },
    DELETECARTGOODSLIST(state, sku) {
      state.cartList = state.cartList.filter((item) => item.sku !== sku);
    },
    ADDTOCART(state, data) {
      let exitSku = _.findLast(state.cartList, (item) => {
        return item.id === data.id;
      });
      console.log('exitSku', exitSku);
      if (exitSku) {
        exitSku.quantity = exitSku.quantity + data.quantity;
      } else {
        state.cartList.push(data);
      }

      console.log('this.store.cartList', state.cartList);
    },
  },
  actions: {
    async updateCount({ commit }, data) {
      commit('UPDATETOCARTCOUNT', data);
    },
    //加入购物车
    async addToCart({ commit }, data) {
      commit('ADDTOCART', data);
    },
    //更新购物车数据
    updateGoods({ commit }, dataList) {
      console.log('dataList', dataList);
      commit('UPDATETOCARTGOODS', dataList);
    },
    //获取勾选的购物车商品列表
    async getCartGoodsList({ commit }, list) {
      commit('GETCARTGOODSLIST', list);
    },
    //删除某个sku
    async deleteCartGoodsList({ commit }, sku) {
      commit('DELETECARTGOODSLIST', sku);
    },
  },
};
