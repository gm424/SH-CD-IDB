//切换正式与测试站 HOST
export const isDevelopModel = process.env.NODE_ENV === 'development' ? true : false;
console.log('isDevelopModel', isDevelopModel);
// 测试环境

export const DEVELOP_HOST = `http://sh.api.jiwangyun.com`;

// 正式环境

export const PRODUCT_HOST = `https://api.idbccmg.com`;

// 静态资源
export const IMG_URL = 'https://vspace-1259276655.cos.ap-shanghai.myqcloud.com/vcross';

// 聊天服务
export const CONTACT_SUPPOTT_URL = `https://vcross-im.vlanddigital.com`;
