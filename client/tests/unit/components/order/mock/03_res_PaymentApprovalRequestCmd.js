const temp03ResPaymentApprovalRequestCmd = {}
temp03ResPaymentApprovalRequestCmd.get = _val => {
  return {
    vdn_cd: [
      '54102'
    ],
    ordersId: [
      '300011015064'
    ],
    msg: {
      EP_cert_type: '0',
      EP_currency: '00',
      EP_mall_pwd: '1111',
      VAN_CO: '',
      EP_lang_flag: 'KOR',
      resultCode: '0',
      resultMessage: 'Success Message',
      EP_ci_url: 'testgw.easypay.co.kr',
      EP_mall_id: 'T0002493',
      EP_agent_ver: 'JSP',
      EP_mall_nm: '테스트 상점',
      EP_mall_id_free: 'T0002494',
      EP_mall_id_paypin: 'T0002495',
      result: 'success',
      usedcard_code: '',
      RESULTCODE: '',
      TID: '',
      MerchantNo: '',
      IpAddr: ''
    },
    paymentList: [
      '{"paymentList":[{"payType":"100","requestCommand":"RequestInfo","payAmt":"273600"}]}'
    ],
    loginId: [
      'swchang@einz.co.kr'
    ],
    classifyCd: '100',
    originOrdersId: [
      '300011015064'
    ],
    userId: 110548084,
    orderId: [
      '300011015064'
    ],
    langId: [
      '-9'
    ],
    accptPath: [
      '500'
    ],
    userNm: [
      '장성우'
    ],
    accptPathCd: [
      '500'
    ],
    custNum: '30124193',
    catalogId: [
      '14051'
    ],
    co_cd: [
      '110'
    ],
    storeId: 13001,
    dispTypeCd: [
      '15'
    ],
    isSuccessful: true
  }
}

export default temp03ResPaymentApprovalRequestCmd
