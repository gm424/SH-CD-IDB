/**
 * Created by zuozhuo on 2016/12/8.
 */
'use strict';

import _ from 'lodash';

class XEnumItem {
  constructor(value, text, meta = {}) {
    this.value = value;
    this.text = text;
    this.meta = meta;
  }

  getValue() {
    return this.value;
  }

  getText() {
    return this.text;
  }

  equals(value) {
    if (value instanceof XEnumItem) {
      value = value.getValue();
    }
    return this.value === value;
  }
}
class XEnum {
  constructor(enumDict) {
    this.enumItems = Object.values(enumDict);
    Object.keys(enumDict).forEach((key) => {
      this[key] = enumDict[key];
    });
  }

  findItem(itemValue) {
    if (itemValue instanceof XEnumItem) {
      itemValue = itemValue.getValue();
    }
    return this.enumItems.find((e) => e.getValue() === itemValue);
  }

  findItemByText(itemText) {
    if (itemText instanceof XEnumItem) {
      itemText = itemText.getText();
    }
    return this.enumItems.find((e) => e.getText() === itemText);
  }

  toText(value) {
    let item = _.find(this.enumItems, ['value', value]);
    return item === undefined ? null : item.getText();
  }

  parseValueByText(text) {
    let exist = _.find(this.enumItems, (ele) => {
      return ele.getText() === text;
    });
    if (exist === undefined) {
      return null;
    } else {
      return exist.getValue();
    }
  }

  getOptions(excludeIndex) {
    if (!this.options) {
      console.log('excludeIndex: ', this.enumItems);
      return this.enumItems
        .filter((e) => excludeIndex !== e.getValue())
        .map((e) => {
          return {
            value: e.getValue(),
            label: e.getText(),
            text: e.getText(),
          };
        });
    } else {
      return [];
    }
  }
}

const PRODUCT_STATUS = new XEnum({
  DRAFT: new XEnumItem(0, '草稿'),
  WAITING: new XEnumItem(1, '待审核'),
  REJECTED: new XEnumItem(2, '审核失败'),
  ON_SALE: new XEnumItem(3, '已上架'),
  INVALID: new XEnumItem(4, '已下架'),
});
const ORDER_STATUS = new XEnum({
  WAIT_QUOTE: new XEnumItem(1, '待报价'),
  WAIT_PAYMENT: new XEnumItem(2, '待支付'),
  WAIT_AUDIT: new XEnumItem(3, '待审核'),
  WAIT_SHIPMENT: new XEnumItem(4, '待发货'),
  WAIT_RECEIVE: new XEnumItem(5, '待签收'),
  RECEIVED: new XEnumItem(6, '已签收'),
  COMPLETED: new XEnumItem(7, '已完成'),
  CLOSEN: new XEnumItem(8, '已关闭'),
  REFUNDED: new XEnumItem(9, '已退款'),
});
const PAY_METHODS = new XEnum({
  OffLine: new XEnumItem('OffLine', '线下支付'),
  WXPAY: new XEnumItem('WxPay', '微信支付'),
  CICC: new XEnumItem('CICC', '中金支付'),
  PINGPONG: new XEnumItem('PingPong', 'PingPong支付'),
  YIYUNHUI: new XEnumItem('YIYUNHUI', '壹云汇支付'),
});
const PAY_TYPE = new XEnum({
  INDONESIA_PAY: new XEnumItem('INDONESIA_PAY', '印尼收单'),
});
const TRACKING_STATUS = new XEnum({
  NotFound: new XEnumItem('NotFound', '查询不到'),
  InfoReceived: new XEnumItem('InfoReceived', '收到信息，运输商收到下单信息，等待上门取件'),
  InTransit: new XEnumItem('InTransit', '运输途中，包裹正在运输途中'),
  Expired: new XEnumItem('Expired', '运输过久，包裹已经运输了很长时间而仍未投递成功'),
  AvailableForPickup: new XEnumItem('AvailableForPickup', '到达待取，包裹已经到达目的地的投递点，需要收件人自取'),
  OutForDelivery: new XEnumItem('OutForDelivery', '派送途中，包裹正在投递过程中'),
  DeliveryFailure: new XEnumItem('DeliveryFailure', '投递失败，包裹尝试派送但未能成功交付'),
  Delivered: new XEnumItem('Delivered', '成功签收，包裹已妥投'),
  Exception: new XEnumItem('Exception', '可能异常，包裹可能被退回'),
  Subscribed: new XEnumItem('Subscribed', '已订阅'),
});
export default {
  PRODUCT_STATUS,
  ORDER_STATUS,
  PAY_METHODS,
  PAY_TYPE,
  TRACKING_STATUS,
};
