import {
  extend
} from '@utils/commonutil/commonUtil'

/* JavaScript content from js/order/M_B1310000M.payment.js in folder common */

/**
 * 주문서 작성 - 결제를 위한 데이터 생성
 */
const PaymentData = {}

/**
 * 주문하실 상품 목록
 */
PaymentData.Product = function () {
  this.defaultItem = {
    INDEX: '',
    IMG: '',
    HEADNAME: '',
    BRAND_KOR_NM: '',
    ITNCATENTRYNM: '',
    QUANTITY: '',
    ORIGINAL_QUANTITY: '',
    ORDERITEMS_ID: '',
    CATENTRY_ID: '',
    ATTRIBUTES: [],
    GIFT: []
  }
  this.productList = []

  this.init()
}

PaymentData.Product.prototype = {
  /**
   * 주문상품정보를 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.productList
    this.productList = []
  },
  /**
   * 배열에 주문상품정보 추가
   * @param {Object} param - 주문상품정보
   * @returns {void}
   */
  addItem (param) {
    this.productList.push(extend(true, {}, this.defaultItem, param))
  },
  /**
   * 저장된 주문상품정보 수정
   * @param {String} index - 수정위치
   * @param {Object} param - 주문상품정보
   * @returns {void}
   */
  setItem (index, param) {
    this.productList[index] = extend(true, {}, this.defaultItem, this.productList[index], param)
  },
  /**
   * 저장된 주문상품정보에 동일하게 모두 수정
   * @param {Object} param - 주문상품정보
   * @returns {void}
   */
  setItems (param) {
    if (this.size() > 0) {
      for (let i = 0; i < this.size(); i++) {
        this.setItem(i, param)
      }
    } else {
      this.addItem(param)
    }
  },
  /**
   * 저장된 주문상품정보 반환
   * @param {String} index - 반환위치
   * @returns {Object}
   */
  getItem (index) {
    return (this.productList.length > index ? this.productList[index] : extend(true, {}, this.defaultItem))
  },
  /**
   * 저장된 주문상품 목록 수
   * @returns {Number}
   */
  size () {
    return this.productList.length
  },

  /**
   * 상품정보를 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    if (this.size() === 0) {
      return ''
    }
    return JSON.stringify({ productList: this.productList })
  }
}

/**
 * 주문서 배송지 목록
 */
PaymentData.Delivery = function () {
  this.addressAttributeNames = {
    ADDRESS_ID: '',
    DELIVERY_SEQ_NM: '',
    RECIPIENT: '',
    DESTINATION: '',

    DLVY_POSTCODE1: '',
    DLVY_POSTCODE2: '',
    DLVY_ADDRESS1: '',
    DLVY_ADDRESS2: '',
    ADDRESS1: '',
    ADDRESS2: '',

    LASTNAME: '',
    NICKNAME: '',
    ZIPCODE: '', // 우편번호(000-000)
    PHONE1TYPE: '', // (휴대폰: K, 일반전화: T)
    PHONE2TYPE: '', // (휴대폰: K, 일반전화: T)
    PHONE1: '', // 휴대폰번호(000-0000-0000)
    PHONE2: '', // 전화번호(000-0000-0000)

    MOBILE_NO11: '',
    MOBILE_NO12: '',
    MOBILE_NO13: '',
    PHONE_NO11: '',
    PHONE_NO12: '',
    PHONE_NO13: '',
    MOBILE_NO21: '',
    MOBILE_NO22: '',
    MOBILE_NO23: '',
    PHONE_NO21: '',
    PHONE_NO22: '',
    PHONE_NO23: '',

    MOBILE_PHONE: '',
    DLVY_MESSAGE: '',
    MESSAGE_CARD: '',
    SHIP_CHARGE: '0',
    RMA_SHIP_CHARGE: '0',

    ORDER_USER_NAME: '',
    MESSAGE_CARD_ORDER_NAME: '',
    MESSAGE_CARD_RECEIVER_NAME: '',

    ITEMS: []
  }
  this.itemTemplete = {}
  this.deliveryList = []

  this.init()
}

PaymentData.Delivery.prototype = {
  /**
   * 배송정보를 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.deliveryList
    this.deliveryList = []
  },
  /**
   * 배열에 배송정보 추가
   * @param {Object} param - 배송정보
   * @returns {void}
   */
  addItem (param) {
    this.deliveryList.push(extend(true, {}, this.addressAttributeNames, param))
  },
  /**
   * 저장된 배송정보 수정
   * @param {String} index - 수정위치
   * @param {Object} param - 배송정보
   * @returns {void}
   */
  setItem (index, param) {
    this.deliveryList[index] = extend(true, {}, this.addressAttributeNames, this.deliveryList[index], param)
  },
  /**
   * 저장된 배송정보에 동일하게 모두 수정
   * @param {String} itemIndex - 배송위치
   * @param {String} productIndex - 상품위치
   * @param {Object} param - 배송정보
   * @returns {void}
   */
  setProductItem (itemIndex, productIndex, param) {
    this.deliveryList[itemIndex].ITEMS[productIndex] = extend(true, {}, this.itemTemplete, this.deliveryList[itemIndex].ITEMS[productIndex], param)
  },
  /**
   * 저장된 배송정보에 동일하게 모두 수정
   * @param {Object} param - 배송정보
   * @returns {void}
   */
  setItems (param) {
    if (this.size() > 0) {
      for (let i = 0; i < this.size(); i++) {
        this.setItem(i, param)
      }
    } else {
      this.addItem(param)
    }
  },
  /**
   * 저장된 배송정보 반환
   * @param {String} index - 반환위치
   * @returns {Object}
   */
  getItem (index) {
    return (this.deliveryList.length > index ? this.deliveryList[index] : extend(true, {}, this.addressAttributeNames))
  },
  /**
   * 저장된 배송정보의 항목 삭제
   * @param {String} index - 삭제위치
   * @returns {void}
   */
  removeItem (index) {
    if (this.size() > index) {
      this.deliveryList.splice(index, 1)
    }
  },
  /**
   * 저장된 배송정보 상품 항목 삭제
   * @param {String} itemIndex - 배송위치
   * @param {String} orderItemsId - 상품위치
   * @returns {void}
   */
  removeProductItem (itemIndex, orderItemsId) {
    if (this.size() > itemIndex && this.deliveryList[itemIndex].ITEMS.length > 0) {
      for (let i = 0; i < this.deliveryList[itemIndex].ITEMS.length; i++) {
        if (this.deliveryList[itemIndex].ITEMS[i].ORDERITEMS_ID === orderItemsId) {
          this.deliveryList[itemIndex].ITEMS.splice(i, 1)
        }
      }
    }
  },
  /**
   * 저장된 배송정보 목록 수
   * @returns {Number}
   */
  size () {
    return this.deliveryList.length
  },

  /**
   * 배송정보를 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    if (this.size() === 0) {
      return ''
    }
    return JSON.stringify({ deliveryList: this.deliveryList })
  }
}

/**
 * 주문서 할인수단 목록
 */
PaymentData.Discount = function () {
  this.defaultItem = {
    orderItemId: '',
    CATENTRY_ID: '',
    couponList: []
  }
  this.couponTemplate = {
    ImdtDcCpAmt: '',
    DiscountPrice: '',
    PRMT_TYPE_CD: '',
    DC_TYPE_CD: '',
    WWW_RATE: '',
    WWW_AMT: '',
    MAX_USE_NUM: '',
    CP_IDFR: ''
  }
  this.discountList = []

  this.defineValue = {
    // 쿠폰 select box 생성 정보
    CouponSelectInfo: {
      selectKeyList: [{ index: '1', title: '할인쿠폰', defaultText: '할인쿠폰 사용 안함' },
        { index: '2', title: '더할인쿠폰', defaultText: '더할인쿠폰 사용 안함' },
        { index: '3', title: '알뜰쿠폰', defaultText: '알뜰쿠폰 사용 안함' },
        { index: '4', title: '더알뜰쿠폰', defaultText: '더알뜰쿠폰 사용 안함' }]
    },
    // 프로모션타입코드
    PRMT_TYPE_CD: {
      CPC: 'CPC', // 즉석할인
      LSP: 'LSP', // 일시불할인
      1: 'CPC', // 할인쿠폰
      2: 'CPC', // 더할인쿠폰
      3: 'CPC', // 알뜰쿠폰
      4: 'CPC', // 더알뜰쿠폰
      cardPreDc: 'CPC', // 카드선할인 쿠폰
      yearDc: 'CPC', // 연간할인 쿠폰
      freeDlvry: 'CPC' // 무료배송 쿠폰
    },
    // 할인타입코드
    DC_TYPE_CD: {
      CPC: '410', // 즉석할인
      LSP: '300', // 일시불할인
      1: '500', // 할인쿠폰
      2: '510', // 더할인쿠폰
      3: '520', // 알뜰쿠폰
      4: '530', // 더알뜰쿠폰
      cardPreDc: '600', // 카드선할인 쿠폰
      yearDc: '540', // 연간할인 쿠폰
      freeDlvry: '550' // 무료배송 쿠폰
    },
    // 에러 메시지
    message: {
      CPC: '즉석 할인 쿠폰을 우선 적용 해야 합니다.', // 즉석할인
      LSP: '일시불할인은 결제금액이 5만원 이상인 경우에만 적용 가능합니다.', // 일시불할인
      1: '할인쿠폰을 우선 적용 해야 합니다.', // 할인쿠폰
      2: '더할인쿠폰을 우선 적용 해야 합니다.', // 더할인쿠폰
      3: '알뜰쿠폰을 우선 적용 해야 합니다.', // 알뜰쿠폰
      4: '더알뜰쿠폰을 우선 적용 해야 합니다.', // 더알뜰쿠폰
      yearDc: '연간할인권과 더알뜰쿠폰은 동시에 사용이 불가합니다.' // 연간할인 쿠폰
    }
  }

  this.init()
}

PaymentData.Discount.prototype = {
  /**
   * 할인수단 목록을 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.discountList
    this.discountList = []
  },
  /**
   * 배열에 할인수단 정보 추가
   * @param {Object} param - 할인수단 정보
   * @returns {void}
   */
  addItem (param) {
    this.discountList.push(extend(true, {}, this.defaultItem, param))
  },
  /**
   * 저장된 할인수단 정보 수정
   * @param {String} index - 수정위치
   * @param {Object} param - 할인수단 정보
   * @returns {void}
   */
  setItem (index, param) {
    this.discountList[index] = extend(true, {}, this.defaultItem, this.discountList[index], param)
  },
  /**
   * 저장된 할인수단 정보 수정
   * @param {Object} itemIndex - 할인수단 위치
   * @param {Object} couponIndex - 쿠폰 위치
   * @param {Object} param - 할인수단 정보
   * @returns {void}
   */
  setCouponItem (itemIndex, couponIndex, param) {
    this.discountList[itemIndex].couponList[couponIndex] = extend(true, {}, this.couponTemplate, this.discountList[itemIndex].couponList[couponIndex], param)
  },
  /**
   * 저장된 할인수단 정보에 동일하게 모두 수정
   * @param {Object} param - 할인수단 정보
   * @returns {void}
   */
  setItems (param) {
    if (this.size() > 0) {
      for (let i = 0; i < this.size(); i++) {
        this.setItem(i, param)
      }
    } else {
      this.addItem(param)
    }
  },
  /**
   * 저장된 할인수단 정보 반환
   * @param {String} index - 반환위치
   * @returns {Object}
   */
  getItem (index) {
    return (this.discountList.length > index ? this.discountList[index] : extend(true, {}, this.defaultItem))
  },
  /**
   * 전체 할인금액을 합산하여 반환
   * @param {String} index - 반환위치
   * @returns {Number}
   */
  getTotalDiscountPrice (index) {
    let totalDiscountPrice = 0
    if (this.size() > index && this.getItem(index).couponList && this.getItem(index).couponList.length > 1) {
      for (let i = 1; i < this.getItem(index).couponList.length; i++) {
        if (this.getItem(index).couponList[i]) {
          totalDiscountPrice += Number(this.getItem(index).couponList[i].DiscountPrice)
        }
      }
    }
    return totalDiscountPrice
  },
  /**
   * 주문상품에 적용되는 할인금액 합산하여 반환
   * @param {String} index - 반환위치
   * @returns {Number}
   */
  getItemDiscountPrice (index) {
    var itemDiscountPrice = 0
    if (this.size() > index && this.getItem(index).couponList && this.getItem(index).couponList.length > 1) {
      for (var i = 1; i < this.getItem(index).couponList.length; i++) {
        if (this.getItem(index).couponList[i]) {
          itemDiscountPrice += Number(this.getItem(index).couponList[i].ImdtDcCpAmt)
        }
      }
    }
    return itemDiscountPrice
  },
  /**
   * 저장된 배송정보의 항목 삭제
   * @param {String} index - 삭제위치
   * @returns {void}
   */
  removeItem (index) {
    if (this.size() > index) {
      this.discountList.splice(index, 1)
    }
  },
  /**
   * 저장된 배송정보의 항목 전체삭제
   * @param {String} itemIndex - 배송정보위치
   * @param {String} couponIndex - 쿠폰위치
   * @returns {void}
   */
  removeCouponItem (itemIndex, couponIndex) {
    if (this.size() > itemIndex && this.discountList[itemIndex] && this.discountList[itemIndex].couponList && this.discountList[itemIndex].couponList.length > couponIndex) {
      this.discountList[itemIndex].couponList[couponIndex] = null
    }
  },
  /**
   * 저장된 할인수단 목록 수
   * @returns {Number}
   */
  size () {
    return this.discountList.length
  },
  /**
   * 할인수단 정의된 값
   * @param {String} key1 - Value key1
   * @param {String} key2 - Value key2
   * @returns {Object}
   */
  getDefineValue (key1, key2) {
    return this.defineValue[key1][key2]
  },

  /**
   * 할인수단 목록을 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    const list = []
    for (let i = 0; i < this.discountList.length; i++) {
      if (this.discountList[i] && this.discountList[i].couponList && this.discountList[i].couponList.length > 0) {
        const item = {
          orderItemId: this.discountList[i].orderItemId,
          CATENTRY_ID: this.discountList[i].CATENTRY_ID,
          couponList: []
        }
        for (let j = 0; j < this.discountList[i].couponList.length; j++) {
          if (this.discountList[i].couponList[j] && Number(this.discountList[i].couponList[j].DiscountPrice) > 0) {
            item.couponList.push(this.discountList[i].couponList[j])
          }
        }
        list.push(item)
      }
    }
    if (list.length === 0) {
      return ''
    }
    return JSON.stringify({ discountList: list })
  }
}

/**
 * 주문서 결제정보 목록
 */
PaymentData.Payment = function () {
  this.paymentCardCode = {
    LG: '029',
    BC: '026',
    국민: '016',
    삼성: '031',
    롯데: '047',
    현대: '027',
    우리: '021',
    하나: '006',
    외환: '008',
    씨티: '022',
    광주: '002',
    전북: '010',
    저축: '',
    산은: '058',
    '1111:252476|252451|252463|111111': ''
  }
  this.defineValue = {
    annualCoupons: { index: 1, payType: '1100', requestCommand: 'payApproval', title: '연간할인권', amountText: '보유 금액' }, // 연간할인권
    okCashbag: { index: 2, payType: '800', requestCommand: 'UsePoint', title: 'OK캐쉬백', amountText: '잔액' }, // OK캐쉬백
    netiWell: { index: 3, payType: '900', requestCommand: 'UsePoint', title: '네티웰', amountText: '잔액' }, // 네티웰
    happyMoney: { index: 4, payType: '1000', requestCommand: 'PayCash', title: '해피머니', amountText: '잔액' }, // 해피머니
    reservedAmt: { index: 5, payType: '600', requestCommand: 'payApproval', title: '적립금', amountText: '보유적립금' }, // 적립금
    depositAmount: { index: 6, payType: '500', requestCommand: 'payApproval', title: '예치금', amountText: '보유예치금' }, // 예치금
    giftCardAmount: { index: 7, payType: '700', requestCommand: 'payApproval', title: 'NS상품권', amountText: 'NS상품권' } // NS상품권
  }
  this.defaultItem = {
  }
  this.paymentList = []

  this.init()
}

PaymentData.Payment.prototype = {
  /**
   * 결제정보를 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.paymentList
    this.paymentList = []
  },
  /**
   * 배열에 결제정보 추가
   * @param {Object} param - 결제정보
   * @returns {void}
   */
  addItem (param) {
    this.paymentList.push(extend(true, {}, this.defaultItem, param))
  },
  /**
   * 저장된 결제정보 수정
   * @param {String} index - 수정위치
   * @param {Object} param - 결제정보
   * @returns {void}
   */
  setItem (index, param) {
    if (param == null) {
      this.paymentList[index] = null
    } else {
      this.paymentList[index] = extend(true, {}, this.defaultItem, this.paymentList[index], param)
    }
  },
  /**
   * 저장된 결제정보에 동일하게 모두 수정
   * @param {Object} param - 결제정보
   * @returns {void}
   */
  setItems (param) {
    if (this.size() > 0) {
      for (let i = 0; i < this.size(); i++) {
        this.setItem(i, param)
      }
    } else {
      this.addItem(param)
    }
  },
  /**
   * 저장된 결제정보 반환
   * @param {String} index - 반환위치
   * @returns {Object}
   */
  getItem (index) {
    return (this.paymentList.length > index ? this.paymentList[index] : extend(true, {}, this.defaultItem))
  },
  /**
   * 저장된 배송정보의 항목 삭제
   * @param {String} index - 삭제위치
   * @returns {void}
   */
  removeItem (index) {
    if (this.size() > index) {
      this.paymentList.splice(index, 1)
    }
  },
  /**
   * 저장된 결제정보 목록 수
   * @returns {Number}
   */
  size () {
    return this.paymentList.length
  },

  /**
   * 결제정보 정의된 값
   * @param {String} key1 - Value key1
   * @param {String} key2 - Value key2
   * @returns {Object}
   */
  getDefineValue (key1, key2) {
    return this.defineValue[key1][key2]
  },

  /**
   * NS의 CardList의 code에 해당하는 결제사의 코드를 반환
   * @param {String} cardCode - 카드코드
   * @returns {Object}
   */
  getCardCode (cardCode) {
    return this.paymentCardCode[cardCode]
  },

  /**
   * 결제정보 목록을 JSON Object로 반환
   * @returns {Object}
   */
  getJSON () {
    const list = []
    for (let i = 0; i < this.paymentList.length; i++) {
      if (this.paymentList[i] && this.paymentList[i].payAmt && this.paymentList[i].payAmt > 0) {
        list.push(this.paymentList[i])
      }
    }
    return list
  },

  /**
   * 결제정보를 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    const list = this.getJSON()
    if (list.length === 0) {
      return ''
    }
    return JSON.stringify({ paymentList: list })
  }
}

/**
 * 제휴사 주문내역
 */
PaymentData.Partnership = function () {
  this.defaultItem = {
    partnerType: '',
    COKEY: '',
    MERCH_ID: '',
    TRACECD: '',
    FEECD: '',
    SETTLECD: ''
  }
  this.partnershipList = []

  this.init()
}

PaymentData.Partnership.prototype = {
  /**
   * 제휴사정보를 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.partnershipList
    this.partnershipList = []
  },
  /**
   * 저장된 제휴사정보 수정
   * @param {Object} param - 제휴사정보
   * @returns {void}
   */
  setItem (param) {
    this.partnershipList[0] = extend(true, {}, this.defaultItem, this.partnershipList[0], param)
  },
  /**
   * 저장된 제휴사정보 반환
   * @returns {Object}
   */
  getItem () {
    return this.partnershipList[0]
  },
  /**
   * 저장된 제휴사정보 목록 수
   * @returns {Number}
   */
  size () {
    return this.partnershipList.length
  },

  /**
   * 제휴사정보를 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    if (this.size() === 0) {
      return ''
    }
    return JSON.stringify({ partnershipList: this.partnershipList })
  }
}

/**
 * 주문서 주문자 정보
 */
PaymentData.OrderUserInfo = function () {
  this.defaultItem = {
    USER_ID: '',
    USER_NAME: '',
    ADDRESS_ID: '',
    DELIVERY_SEQ_NM: '',
    RECIPIENT: '',
    DESTINATION: '',
    DLVY_POSTCODE1: '',
    DLVY_POSTCODE2: '',
    DLVY_ADDRESS1: '',
    DLVY_ADDRESS2: '',
    ADDRESS1: '',
    ADDRESS2: '',
    LASTNAME: '',
    NICKNAME: '',
    ZIPCODE: '',
    PHONE1TYPE: '',
    PHONE2TYPE: '',
    PHONE1: '',
    PHONE2: '',
    MOBILE_NO11: '',
    MOBILE_NO12: '',
    MOBILE_NO13: '',
    PHONE_NO11: '',
    PHONE_NO12: '',
    PHONE_NO13: '',
    MOBILE_NO21: '',
    MOBILE_NO22: '',
    MOBILE_NO23: '',
    PHONE_NO21: '',
    PHONE_NO22: '',
    PHONE_NO23: '',
    EMAIL1: '',
    DI: '',
    CI: '',
    GENDER: '',
    BIRTHDAY: '',
    AGE: '',
    PASSWORD: '',
    MOBILE_PHONE: '',
    DLVY_MESSAGE: '',
    MESSAGE_CARD: '',
    SHIP_CHARGE: '0',
    ORDER_USER_NAME: '',
    MESSAGE_CARD_ORDER_NAME: '',
    MESSAGE_CARD_RECEIVER_NAME: '',
    ITEMS: []
  }
  this.orderUserInfo = []

  this.init()
}

PaymentData.OrderUserInfo.prototype = {
  /**
   * 주문자정보를 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.orderUserInfo
    this.orderUserInfo = [this.defaultItem]
  },
  /**
   * 주문자정보를 최초 생성
   * @param {Object} param - 주문자정보
   * @returns {void}
   */
  setDefault (param) {
    this.defaultItem = extend(true, {}, this.defaultItem, param)
    this.orderUserInfo[0] = this.defaultItem
  },
  /**
   * 저장된 주문자정보 수정
   * @param {Object} param - 주문자정보
   * @returns {void}
   */
  setItem (param) {
    this.orderUserInfo[0] = extend(true, {}, this.defaultItem, this.orderUserInfo[0], param)
  },
  /**
   * 저장된 주문자정보 반환
   * @returns {Object}
   */
  getItem () {
    return this.orderUserInfo[0]
  },
  /**
   * 저장된 주문자정보 목록 수
   * @returns {Number}
   */
  size () {
    return this.orderUserInfo.length
  },

  /**
   * 주문자정보를 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    if (this.size() === 0) {
      return ''
    }
    return JSON.stringify({ orderUserInfo: this.orderUserInfo })
  }
}

/**
 * 최대구매수량
 */

PaymentData.MaxbuyCount = function () {
  this.MaxbuyList = []

  this.init()
}

PaymentData.MaxbuyCount.prototype = {
  /**
   * 최대구매수량 목록을 저장할 공간 초기화
   * @returns {void}
   */
  init () {
    delete this.MaxbuyList
    this.MaxbuyList = []
  },
  /**
   * 배열에 최대구매수량 정보 추가
   * @param {Object} param - 최대구매수량 정보
   * @returns {void}
   */
  addItem (param) {
    this.MaxbuyList.push(extend(true, {}, this.defaultItem, param))
  },
  /**
   * 저장된 최대구매수량 정보 수정
   * @param {String} index - 수정위치
   * @param {Object} param - 최대구매수량 정보
   * @returns {void}
   */
  setItem (index, param) {
    this.MaxbuyList[index] = extend(true, {}, this.defaultItem, this.MaxbuyList[index], param)
  },
  /**
   * 저장된 최대구매수량 정보 모두수정
   * @param {String} itemIndex - 수정위치
   * @param {String} couponIndex - 쿠폰위치
   * @param {Object} param - 최대구매수량 정보
   * @returns {void}
   */
  setCouponItem (itemIndex, couponIndex, param) {
    this.MaxbuyList[itemIndex].couponList[couponIndex] = extend(true, {}, this.couponTemplate, this.MaxbuyList[itemIndex].couponList[couponIndex], param)
  },
  /**
   * 저장된 최대구매수량 정보에 동일하게 모두 수정
   * @param {Object} param - 최대구매수량 정보
   * @returns {void}
   */
  setItems (param) {
    if (this.size() > 0) {
      for (let i = 0; i < this.size(); i++) {
        this.setItem(i, param)
      }
    } else {
      this.addItem(param)
    }
  },
  /**
   * 저장된 최대구매수량 정보 반환
   * @param {String} index - 반환위치
   * @returns {Object}
   */
  getItem (index) {
    return (this.MaxbuyList.length > index ? this.MaxbuyList[index] : extend(true, {}, this.defaultItem))
  },
  /**
   * 전체 최대구매수량 합산하여 반환
   * @param {String} index - 반환위치
   * @returns {Number}
   */
  getTotalDiscountPrice (index) {
    let totalDiscountPrice = 0
    if (this.size() > index && this.getItem(index).couponList && this.getItem(index).couponList.length > 1) {
      for (let i = 1; i < this.getItem(index).couponList.length; i++) {
        if (this.getItem(index).couponList[i]) {
          totalDiscountPrice += Number(this.getItem(index).couponList[i].DiscountPrice)
        }
      }
    }
    return totalDiscountPrice
  },
  /**
   * 저장된 최대구매수량 항목 삭제
   * @param {String} index - 삭제위치
   * @returns {void}
   */
  removeItem (index) {
    if (this.size() > index) {
      this.MaxbuyList.splice(index, 1)
    }
  },
  /**
   * 저장된 최대구매수량 항목 쿠폰삭제
   * @param {String} itemIndex - 삭제위치
   * @param {String} couponIndex - 쿠폰위치
   * @returns {void}
   */
  removeCouponItem (itemIndex, couponIndex) {
    if (this.size() > itemIndex && this.MaxbuyList[itemIndex] && this.MaxbuyList[itemIndex].couponList && this.MaxbuyList[itemIndex].couponList.length > couponIndex) {
      this.MaxbuyList[itemIndex].couponList[couponIndex] = null
    }
  },
  /**
   * 저장된 최대구매수량 목록 수
   * @returns {Number}
   */
  size () {
    return this.MaxbuyList.length
  },
  /**
   * 최대구매수량정보에 정의된 값
   * @param {String} key1 - Value key1
   * @param {String} key2 - Value key2
   * @returns {Object}
   */
  getDefineValue (key1, key2) {
    return this.defineValue[key1][key2]
  },

  /**
   * 최대구매수량 목록을 JSON 문자열로 반환
   * @returns {String}
   */
  toJSON () {
    const list = []
    for (let i = 0; i < this.MaxbuyList.length; i++) {
      if (this.MaxbuyList[i] && this.MaxbuyList[i].couponList && this.MaxbuyList[i].couponList.length > 0) {
        const item = {
          orderItemId: this.MaxbuyList[i].orderItemId,
          CATENTRY_ID: this.MaxbuyList[i].CATENTRY_ID,
          couponList: []
        }
        for (let j = 0; j < this.MaxbuyList[i].couponList.length; j++) {
          if (this.MaxbuyList[i].couponList[j] && Number(this.MaxbuyList[i].couponList[j].DiscountPrice) > 0) {
            item.couponList.push(this.MaxbuyList[i].couponList[j])
          }
        }
        list.push(item)
      }
    }
    if (list.length === 0) {
      return ''
    }
    return JSON.stringify({ MaxbuyList: list })
  }
}

export default PaymentData
