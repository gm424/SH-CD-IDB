import Http from './http';
import Api from './api';
import Validate from '../utils/validate';

let that;
that = {};
/**
 * 初始化
 */
const init = (context) => {
  that = context;
};

/**
 * 获取我的积分流水列表
 */
const getRewardsList = (params, callBack) => {
  if (!Validate.checkTokenAndValidity()) {
    uni.hideLoading();
    return;
  }

  Http.request(Api.get_my_rewardsList, 'GET', null, params)
    .then((res) => {
      if (Validate.isJson(res) && res.code === 200) {
        callBack.success(res);
      } else {
        callBack.fail(res);
      }
    })
    .catch((error) => {
      callBack.fail(error);
    });
};

/**
 * 获取我的积分
 */
const getMyPoints = (callBack) => {
  if (!Validate.checkTokenAndValidity()) {
    uni.hideLoading();
    return;
  }

  Http.request(Api.get_my_points, 'GET', null, null)
    .then((res) => {
      if (Validate.isJson(res) && res.code === 200) {
        callBack.success(res);
      } else {
        callBack.fail(res);
      }
    })
    .catch((error) => {
      callBack.fail(error);
    });
};

/**
 * 获取我的积分商城商品列表
 */
const getPointsMallList = (params, callBack) => {
  // if (!Validate.checkTokenAndValidity()) {
  //   uni.hideLoading();
  //   return;
  // }

  Http.request(Api.get_points_mall, 'GET', null, params)
    .then((res) => {
      if (Validate.isJson(res) && res.code === 200) {
        callBack.success(res);
      } else {
        callBack.fail(res);
      }
    })
    .catch((error) => {
      callBack.fail(error);
    });
};

module.exports = {
  init,
  getRewardsList,
  getMyPoints,
  getPointsMallList,
};
