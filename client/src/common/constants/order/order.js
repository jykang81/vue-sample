
/**
 * 결제수단 Const
 */
const PAY_TYPE_CONST = {
  CREDIT_CARD: '100',
  DEPOSIT_WITHOUT_BANKBOOK: '200',
  REALTIME_ACCOUNT_TRANSFER: '300',
  MOBILE: '400',
  PAYCO: '1400',
  NAVER_PAY: '1500',
  NS_PAY_CREDIT_CARD: '1600',
  NS_PAY_ACCOUNT_TRANSFER: '1700',
  INFO: {
    CREDIT_CARD: { CODE: '100', EN: 'CREDIT_CARD', KO: '신용카드' },
    DEPOSIT_WITHOUT_BANKBOOK: { CODE: '200', EN: 'DEPOSIT_WITHOUT_BANKBOOK', KO: '무통장입금' },
    REALTIME_ACCOUNT_TRANSFER: { CODE: '300', EN: 'REALTIME_ACCOUNT_TRANSFER', KO: '실시간계좌이체' },
    MOBILE: { CODE: '400', EN: 'MOBILE', KO: '휴대폰' },
    PAYCO: { CODE: '1400', EN: 'PAYCO', KO: '페이코' },
    NAVER_PAY: { CODE: '1500', EN: 'NAVER_PAY', KO: '네이버페이' },
    NS_PAY_CREDIT_CARD: { CODE: '1600', EN: 'NS_PAY_CREDIT_CARD', KO: 'NS페이 신용카드' },
    NS_PAY_ACCOUNT_TRANSFER: { CODE: '1700', EN: 'NS_PAY_ACCOUNT_TRANSFER', KO: 'NS페이 계좌이체' }
  },
  CODES: ['100', '200', '300', '400', '1400', '1500', '1600', '1700'],
  /**
   * 결제 수단 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isCodes (code) {
    return PAY_TYPE_CONST.CODES.includes(code)
  },
  /**
   * 결제수단 별 타이틀 설정
   * @param {String} code - 결제수단 코드
   * @returns {String} 결제수단 타이틀
   */
  getTmplTitle (code, name = '', quota = '') {
    if (code === PAY_TYPE_CONST.INFO.CREDIT_CARD.CODE) {
      return `${name}, ${quota}` // ${카드명}, 일시불
    } else if (code === PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.CODE) {
      return `무통장입금(${name}은행)` // 무통장입금(${은행명})
    } else if (code === PAY_TYPE_CONST.INFO.MOBILE.CODE) {
      return '휴대폰결제'
    } else if (code === PAY_TYPE_CONST.INFO.PAYCO.CODE) {
      return '페이코'
    } else if (code === PAY_TYPE_CONST.INFO.NAVER_PAY.CODE) {
      return '네이버페이'
    } else if (code === PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.CODE) {
      return `NS페이(${name}), ${quota}` // NS페이(${카드명}), 일시불
    } else if (code === PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.CODE) {
      if (name === '케이뱅크') {
        return `NS페이(${name})` // NS페이(${은행명})
      } else {
        return `NS페이(${name}은행)` // NS페이(${은행명})
      }
    } else {
      return ''
    }
  },
  /**
   * 결제수단 명을 가져온다.
   * @param {String} code - 결제수단 코드
   * @param {String} lang - default: ko
   * @returns {String} 결제수단 명
   */
  getName (code, lang = 'ko') {
    const target = 'ko'
    if (code === PAY_TYPE_CONST.INFO.CREDIT_CARD.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.CREDIT_CARD.KO : PAY_TYPE_CONST.INFO.CREDIT_CARD.EN
    } else if (code === PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.KO : PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.EN
    } else if (code === PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.KO : PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.EN
    } else if (code === PAY_TYPE_CONST.INFO.MOBILE.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.MOBILE.KO : PAY_TYPE_CONST.INFO.MOBILE.EN
    } else if (code === PAY_TYPE_CONST.INFO.PAYCO.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.PAYCO.KO : PAY_TYPE_CONST.INFO.PAYCO.EN
    } else if (code === PAY_TYPE_CONST.INFO.NAVER_PAY.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.NAVER_PAY.KO : PAY_TYPE_CONST.INFO.NAVER_PAY.EN
    } else if (code === PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.KO : PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.EN
    } else if (code === PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.CODE) {
      return lang === target ? PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.KO : PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.EN
    } else {
      return ''
    }
  },
  /**
   * 결제수단 신용카드 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isCreditCard (code) {
    return code === PAY_TYPE_CONST.INFO.CREDIT_CARD.CODE
  },
  /**
   * 결제수단 신용카드 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotCreditCard (code) {
    return code !== PAY_TYPE_CONST.INFO.CREDIT_CARD.CODE
  },
  /**
   * 결제수단 무통장 입금 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isDepositWithoutBankbook (code) {
    return code === PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.CODE
  },
  /**
   * 결제수단 무통장 입금 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotDepositWithoutBankbook (code) {
    return code !== PAY_TYPE_CONST.INFO.DEPOSIT_WITHOUT_BANKBOOK.CODE
  },
  /**
   * 결제수단 실시간 계좌이체 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isRealtimeAccountTransfer (code) {
    return code === PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.CODE
  },
  /**
   * 결제수단 실시간 계좌이체 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotRealtimeAccountTransfer (code) {
    return code !== PAY_TYPE_CONST.INFO.REALTIME_ACCOUNT_TRANSFER.CODE
  },
  /**
   * 결제수단 휴대폰 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isMobile (code) {
    return code === PAY_TYPE_CONST.INFO.MOBILE.CODE
  },
  /**
   * 결제수단 휴대폰 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotMobile (code) {
    return code !== PAY_TYPE_CONST.INFO.MOBILE.CODE
  },
  /**
   * 결제수단 페이코 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isPayco (code) {
    return code === PAY_TYPE_CONST.INFO.PAYCO.CODE
  },
  /**
   * 결제수단 페이코 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotPayco (code) {
    return code !== PAY_TYPE_CONST.INFO.PAYCO.CODE
  },
  /**
   * 결제수단 네이버페이 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNaverpay (code) {
    return code === PAY_TYPE_CONST.INFO.NAVER_PAY.CODE
  },
  /**
   * 결제수단 네이버페이 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotNaverpay (code) {
    return code !== PAY_TYPE_CONST.INFO.NAVER_PAY.CODE
  },
  /**
   * 결제수단 NSPay 신용카드 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNSPayCreditCard (code) {
    return code === PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.CODE
  },
  /**
   * 결제수단 NSPay 신용카드 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotNSPayCreditCard (code) {
    return code !== PAY_TYPE_CONST.INFO.NS_PAY_CREDIT_CARD.CODE
  },
  /**
   * 결제수단 NSPay 계좌이체 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNSPayAccountTransfer (code) {
    return code === PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.CODE
  },
  /**
   * 결제수단 NSPay 계좌이체 아닌지 확인
   * @param {String} code - 결제수단 코드
   * @returns {Boolean}
   */
  isNotNSPayAccountTransfer (code) {
    return code !== PAY_TYPE_CONST.INFO.NS_PAY_ACCOUNT_TRANSFER.CODE
  }
}

/**
 * 결제 보조 수단 Const
 */
const PAY_ASSIST_CONST = {
  DEPOSIT_AMT: '500',
  RESERVED_AMT: '600',
  NS_GIFT_CARD: '700',
  OK_CASHBAG: '800',
  NETI_WELL: '900',
  HAPPY_MONEY: '1000',
  ANNUAL_COUPONS: '1100',
  INFO: {
    DEPOSIT_AMT: { CODE: '500', EN: 'DEPOSIT_AMT', KO: '예치금', DEFINE_VALUE_KEY: 'depositAmount' },
    RESERVED_AMT: { CODE: '600', EN: 'RESERVED_AMT', KO: '적립금', DEFINE_VALUE_KEY: 'reservedAmt' },
    NS_GIFT_CARD: { CODE: '700', EN: 'NS_GIFT_CARD', KO: 'NS상품권', DEFINE_VALUE_KEY: 'giftCardAmount' },
    OK_CASHBAG: { CODE: '800', EN: 'OK_CASHBAG', KO: 'OK캐쉬백', DEFINE_VALUE_KEY: 'okCashbag' },
    NETI_WELL: { CODE: '900', EN: 'NETI_WELL', KO: '네티웰', DEFINE_VALUE_KEY: 'netiWell' },
    HAPPY_MONEY: { CODE: '1000', EN: 'HAPPY_MONEY', KO: '해피머니', DEFINE_VALUE_KEY: 'happyMoney' },
    ANNUAL_COUPONS: { CODE: '1100', EN: 'ANNUAL_COUPONS', KO: '연간할인권', DEFINE_VALUE_KEY: 'annualCoupons' }
  },
  CODES: ['500', '600', '700', '800', '900', '1000', '1100'],

  /**
     * 결제 보조 수단 확인
     * @param {String} code - 결제 보조 수단 코드
     * @returns {Boolean}
     */
  isCodes (code) {
    return PAY_ASSIST_CONST.CODES.includes(code)
  },
  /**
   * 결제 보조 수단 명을 가져온다.
   * @param {String} code - 결제 보조 수단 코드
   * @param {String} lang - default: ko
   * @returns {String}
   */
  getName (code, lang = 'ko') {
    const target = 'ko'
    if (code === PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.KO : PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.EN
    } else if (code === PAY_ASSIST_CONST.INFO.RESERVED_AMT.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.RESERVED_AMT.KO : PAY_ASSIST_CONST.INFO.RESERVED_AMT.EN
    } else if (code === PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.KO : PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.EN
    } else if (code === PAY_ASSIST_CONST.INFO.OK_CASHBAG.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.OK_CASHBAG.KO : PAY_ASSIST_CONST.INFO.OK_CASHBAG.EN
    } else if (code === PAY_ASSIST_CONST.INFO.NETI_WELL.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.NETI_WELL.KO : PAY_ASSIST_CONST.INFO.NETI_WELL.EN
    } else if (code === PAY_ASSIST_CONST.INFO.HAPPY_MONEY.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.HAPPY_MONEY.KO : PAY_ASSIST_CONST.INFO.HAPPY_MONEY.EN
    } else if (code === PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.CODE) {
      return lang === target ? PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.KO : PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.EN
    } else {
      return ''
    }
  },
  /**
   * 결제 보조 수단 define value key 가져오기
   * @param {String} code - 결제 보조 수단 코드
   * @returns {String}
   */
  getDefineValueKey (code) {
    if (code === PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.CODE) {
      return PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.DEFINE_VALUE_KEY
    } else if (code === PAY_ASSIST_CONST.INFO.RESERVED_AMT.CODE) {
      return PAY_ASSIST_CONST.INFO.RESERVED_AMT.DEFINE_VALUE_KEY
    } else if (code === PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.CODE) {
      return PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.DEFINE_VALUE_KEY
    } else if (code === PAY_ASSIST_CONST.INFO.OK_CASHBAG.CODE) {
      return PAY_ASSIST_CONST.INFO.OK_CASHBAG.DEFINE_VALUE_KEY
    } else if (code === PAY_ASSIST_CONST.INFO.NETI_WELL.CODE) {
      return PAY_ASSIST_CONST.INFO.NETI_WELL.DEFINE_VALUE_KEY
    } else if (code === PAY_ASSIST_CONST.INFO.HAPPY_MONEY.CODE) {
      return PAY_ASSIST_CONST.INFO.HAPPY_MONEY.DEFINE_VALUE_KEY
    } else if (code === PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.CODE) {
      return PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.DEFINE_VALUE_KEY
    } else {
      return ''
    }
  },
  /**
   * 결제 보조 수단 예치금 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isDepositAmt (code) {
    return code === PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.CODE
  },
  /**
   * 결제 보조 수단 예치금 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotDepositAmt (code) {
    return code !== PAY_ASSIST_CONST.INFO.DEPOSIT_AMT.CODE
  },
  /**
   * 결제 보조 수단 적립금 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isReservedAmt (code) {
    return code === PAY_ASSIST_CONST.INFO.RESERVED_AMT.CODE
  },
  /**
   * 결제 보조 수단 적립금 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotReservedAmt (code) {
    return code !== PAY_ASSIST_CONST.INFO.RESERVED_AMT.CODE
  },
  /**
   * 결제 보조 수단 NS상품권 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNsGiftCard (code) {
    return code === PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.CODE
  },
  /**
   * 결제 보조 수단 NS상품권 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotNsGiftCard (code) {
    return code !== PAY_ASSIST_CONST.INFO.NS_GIFT_CARD.CODE
  },
  /**
   * 결제 보조 수단 OK캐쉬백 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isOkCashbag (code) {
    return code === PAY_ASSIST_CONST.INFO.OK_CASHBAG.CODE
  },
  /**
   * 결제 보조 수단 OK캐쉬백 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotOkCashbag (code) {
    return code !== PAY_ASSIST_CONST.INFO.OK_CASHBAG.CODE
  },
  /**
   * 결제 보조 수단 네티웰 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNetiWell (code) {
    return code === PAY_ASSIST_CONST.INFO.NETI_WELL.CODE
  },
  /**
   * 결제 보조 수단 네티웰 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotNetiWell (code) {
    return code !== PAY_ASSIST_CONST.INFO.NETI_WELL.CODE
  },
  /**
   * 결제 보조 수단 해피머니 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isHappyMoney (code) {
    return code === PAY_ASSIST_CONST.INFO.HAPPY_MONEY.CODE
  },
  /**
   * 결제 보조 수단 해피머니 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotHappyMoney (code) {
    return code !== PAY_ASSIST_CONST.INFO.HAPPY_MONEY.CODE
  },
  /**
   * 결제 보조 수단 연간할인권 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isAnnualCoupons (code) {
    return code === PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.CODE
  },
  /**
   * 결제 보조 수단 연간할인권 아닌지 확인
   * @param {String} code - 결제 보조 수단 코드
   * @returns {Boolean}
   */
  isNotAnnualCoupons (code) {
    return code !== PAY_ASSIST_CONST.INFO.ANNUAL_COUPONS.CODE
  }
}

/**
 * 주문 Const
 */
const ORDER_CONST = {
  // 주문 상태 코드
  STATUS: {
    PAYMENT_WAIT: 'D', // 결제대기
    PAYMENT_COMPLETE: 'M', // 결제완료, 신청완료
    ORDER_SEND: 'T', // 주문전달
    PRODUCT_PREPARE: 'I', // 상품 준비중
    SHIPPING: 'O', // 배송중
    DELIVERY_COMPLETE: 'S' // 배송완료
  }
}

export { PAY_TYPE_CONST, PAY_ASSIST_CONST, ORDER_CONST }
