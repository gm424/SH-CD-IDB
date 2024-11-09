import Http from './http';
import Api from './api';
import Validate from '../utils/validate';
import AppUtil from '../utils/appUtil';
import Constant from '../utils/constant';

let that;
that = {};
/**
 * 初始化
 */
const init = (context) => {
  that = context;
};

/**
 * 账号密码登录
 */

const login = (params, callBack) => {
  if (!that.globalData.isNetConnected) {
    uni.showToast({
      title: Constant.networkError,
      icon: 'none',
      duration: 2500,
    });
    return;
  }
  let loginInfoStr = JSON.stringify(params);

  Http.request(Api.get_auth_login, 'POST', 'json', loginInfoStr)
    .then((res) => {
      if (res.success) {
        console.log('登录成功！1');
        that.globalData.isLogin = true;
        let timestamp = Date.parse(new Date());

        // 有效期 半 小时（两小时过期时间戳：7200000）
        let expiresIn = res.data.expires_in * 1000;
        // let expiration = timestamp + expiresIn;
        let expiration = timestamp + 7200000;
        uni.setStorageSync(Constant.token, res.data.accessToken);
        uni.setStorageSync(Constant.refreshToken, res.data.refreshToken);
        uni.setStorageSync(Constant.tokenExpiration, expiration);
        // uni.setStorageSync(Constant.tenantId, res.data.tenant_id);
        callBack.success(res);

        console.log('登录成功！2');
      } else {
        that.globalData.isLogin = false;
        uni.showToast({
          title: res.msg,
          duration: 2500,
          icon: 'none',
        });
        callBack.fail();
      }
    })
    .catch((error) => {
      console.log('error', error);
      that.globalData.isLogin = false;
      uni.showToast({
        title: '登录失败',
        duration: 2500,
        icon: 'none',
      });
      callBack.fail(error);
    });
};

/*
刷新Token
*/
const refreshToken = (params, callBack) => {
  console.log('刷新token', params);
  Http.request(Api.get_user_refreshToken, 'POST', 'json', params).then((res) => {
    if (res.refresh) {
      callBack.success(res);
    } else {
      callBack.fail(res);
    }
  });
};

/**
 * 获取用户信息
 */
const getUserProfile = (callBack) => {
  if (!that.globalData.isNetConnected) {
    uni.showToast({
      title: Constant.networkError,
      icon: 'none',
      duration: 2500,
    });
    return;
  }

  Http.request(Api.get_user_profile, 'GET', null, null)
    .then((res) => {
      if (res.success) {
        uni.setStorageSync(Constant.userInfo, JSON.stringify(res.data));
        callBack.success(res.data);
      } else {
        uni.clearStorageSync();
        that.globalData.isLogin = false;
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {
      console.log('获取用户信息', error);
      callBack.fail(error);
    });
};

/**
 * 修改用户信息
 */
const putUserProfile = (params, callBack) => {
  if (!that.globalData.isNetConnected) {
    uni.showToast({
      title: Constant.networkError,
      icon: 'none',
      duration: 2500,
    });
    return;
  }

  let paramsStr = JSON.stringify(params);

  Http.request(Api.get_user_profile, 'PUT', 'json', paramsStr)
    .then((res) => {
      if (Validate.isJson(res) && res.code == '200') {
        callBack.success(res);
      } else {
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {
      callBack.fail(error);
    });
};

/**
 * 注册
 */
const registerUser = (params, callBack) => {
  // if (!that.globalData.isNetConnected) {
  //   uni.showToast({
  //     title: Constant.networkError,
  //     icon: 'none',
  //     duration: 2500,
  //   });
  //   return;
  // }

  let paramsStr = JSON.stringify(params);

  Http.request(Api.user_register, 'POST', 'json', paramsStr)
    .then((res) => {
      if (res.code === 200) {
        callBack.success(res);
      } else {
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {});
};
/**
 * 注册
 */
const logoutUser = (params, callBack) => {
  let paramsStr = JSON.stringify(params);
  Http.request(Api.user_logout, 'POST', null, null)
    .then((res) => {
      if (res.code === 200) {
        callBack.success(res);
      } else {
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {});
};
/**
 * 下发邮件短信验证码
 */
const smsCode = (params, callBack) => {
  if (!that.globalData.isNetConnected) {
    uni.showToast({
      title: Constant.networkError,
      icon: 'none',
      duration: 2500,
    });
    return;
  }

  let paramsStr = JSON.stringify(params);

  Http.request(Api.sms_code, 'POST', 'json', paramsStr)
    .then((res) => {
      // Validate.isEmply(res.msg)
      if (res.code === 200) {
        callBack.success(res);
        console.log(res);
      } else {
        console.log(res);
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {
      console.log(error);
      callBack.fail(error);
    });
};

/**
 * 联系客服
 */
const contactSupport = (params, callBack) => {
  if (!that.globalData.isNetConnected) {
    uni.showToast({
      title: Constant.networkError,
      icon: 'none',
      duration: 2500,
    });
    return;
  }

  if (!Validate.checkTokenAndValidity()) {
    uni.hideLoading();
    return;
  }

  let paramsStr = JSON.stringify(params);

  Http.request(Api.contact_support, 'POST', 'json', paramsStr)
    .then((res) => {
      // Validate.isEmply(res.msg)
      if (res.code === 200) {
        callBack.success(res);
        console.log(res);
      } else {
        console.log(res);
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {
      console.log(error);
      callBack.fail(error);
    });
};

/**
 * 找回密码
 */
const resetPwd = (params, callBack) => {
  if (!that.globalData.isNetConnected) {
    uni.showToast({
      title: Constant.networkError,
      icon: 'none',
      duration: 2500,
    });
    return;
  }

  let paramsStr = JSON.stringify(params);

  Http.request(Api.resetPwd, 'PUT', 'json', paramsStr)
    .then((res) => {
      if (Validate.isJson(res) && Validate.isEmply(res.msg)) {
        callBack.success(res);
      } else {
        callBack.fail(res.msg);
      }
    })
    .catch((error) => {
      console.log(error);
      callBack.fail(error);
    });
};

module.exports = {
  init,
  login,
  getUserProfile,
  registerUser,
  smsCode,
  putUserProfile,
  contactSupport,
  resetPwd,
  refreshToken,
  logoutUser,
};
