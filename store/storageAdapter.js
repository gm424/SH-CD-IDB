const uniStorage = {
  getItem(key) {
    try {
      return uni.getStorageSync(key) || null;
    } catch (e) {
      // Handle error appropriately
      console.error(e);
      return null;
    }
  },
  setItem(key, value) {
    try {
      uni.setStorageSync(key, value);
    } catch (e) {
      // Handle error appropriately
      console.error(e);
    }
  },
  removeItem(key) {
    try {
      uni.removeStorageSync(key);
    } catch (e) {
      // Handle error appropriately
      console.error(e);
    }
  },
};

export default uniStorage;
