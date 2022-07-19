const nspayInfoAll = {
  payInfo: {
    payListCnt: 5,
    payList:
    [
      {
        acntRegDttm: '20200701164139',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Flarge%2Facct_1_wb.png',
        wpayToken: 'Vwn5G7w+V66B/eS+LLXiD4XsaQXQyF+uEs9PBLqiPVQ=',
        payMethod: '16',
        bankCardCode: '020',
        cardName: '%EC%9A%B0%EB%A6%AC%EC%9D%80%ED%96%89',
        majYn: 'Y',
        bankCardNo: '*********5785',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Fsmall%2Facct_2_wb.png'
      },
      {
        acntRegDttm: '',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Fcardimg%2Flarge%2Fcard_1_bc.png',
        wpayToken: 'KE8oqtuX0Gl/0tPUyLQ+fkOK6vYRH+zmO59mPXqXacs=',
        payMethod: '01',
        bankCardCode: '11',
        cardName: 'BC%EC%B9%B4%EB%93%9C',
        majYn: 'Y',
        bankCardNo: '5371-02**-****-8215',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Fcardimg%2Fsmall%2Fcard_2_bc.png'
      },
      {
        acntRegDttm: '20200702132658',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Flarge%2Facct_1_pb.png',
        wpayToken: 'Vwn5G7w+V66B/eS+LLXiD4XsaQXQyF+uEs9PBLqiPVQ=',
        payMethod: '16',
        bankCardCode: '071',
        cardName: '%EC%9A%B0%EC%B2%B4%EA%B5%AD',
        majYn: 'N',
        bankCardNo: '**********7177',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Fsmall%2Facct_2_pb.png'
      },
      {
        acntRegDttm: '20200702132437',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Flarge%2Facct_1_sh.png',
        wpayToken: 'Vwn5G7w+V66B/eS+LLXiD4XsaQXQyF+uEs9PBLqiPVQ=',
        payMethod: '16',
        bankCardCode: '088',
        cardName: '%EC%8B%A0%ED%95%9C%EC%9D%80%ED%96%89',
        majYn: 'N',
        bankCardNo: '********3786',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Fsmall%2Facct_2_sh.png'
      },
      {
        acntRegDttm: '',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Fcardimg%2Flarge%2Fcard_1_bc.png',
        wpayToken: 'ZMdOB4kCoY8kj0wV+afj4Mvno/UIkk5BNbrYCt0Yj4Y=',
        payMethod: '01',
        bankCardCode: '11',
        cardName: 'BC%EC%B9%B4%EB%93%9C',
        majYn: 'N',
        bankCardNo: '6253-20**-****-3956',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Fcardimg%2Fsmall%2Fcard_2_bc.png'
      }
    ]
  },
  wpayUserKey: 'Sdk+l4oz3giTcmgvYU2UX/k7tG7Uo8kLfPNNKJv3b1k=',
  userId: ['101928691'],
  langId: ['-9'],
  mileage: {},
  accptPath: ['500'],
  accptPathCd: ['500'],
  catalogId: ['14051'],
  cmdType: ['payInfoAll'],
  storeId: ['13001'],
  mappedCodeList: { 11: 'BC', 12: 'SS', 14: 'LG', 16: 'CH', 17: 'HN', '01': 'WH', '03': 'AM', '04': 'DN', '06': 'KM' },
  isSuccessful: true
}

const nspayInfoAllNull = {
  payInfo: '',
  wpayUserKey: 'Sdk+l4oz3giTcmgvYU2UX/k7tG7Uo8kLfPNNKJv3b1k=',
  userId: ['101928691'],
  langId: ['-9'],
  mileage: {},
  accptPath: ['500'],
  accptPathCd: ['500'],
  catalogId: ['14051'],
  cmdType: ['payInfoAll'],
  storeId: ['13001'],
  mappedCodeList: { 11: 'BC', 12: 'SS', 14: 'LG', 16: 'CH', 17: 'HN', '01': 'WH', '03': 'AM', '04': 'DN', '06': 'KM' },
  isSuccessful: true
}

const nspayOneTouchUse = {
  msg: { useYn: 'Y' },
  cmdType: ['oneTouchUseCheck'],
  catalogId: ['14051'],
  userId: ['101928691'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

const nspayUse = {
  msg: { useYn: 'Y' },
  cmdType: ['checkJoinWpay'],
  catalogId: ['14051'],
  userId: ['101928691'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

const nspaySetMajor = {
  userId: ['101928691'],
  wpayToken: ['Vwn5G7w+V66B/eS+LLXiD4XsaQXQyF+uEs9PBLqiPVQ='],
  langId: ['-9'],
  payMethod: ['16'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  bankCardNo: ['**********7177'],
  cmdType: ['setMajorPayInfo'],
  catalogId: ['14051'],
  acntRegDttm: ['20200702132658'],
  bankCardCode: ['071'],
  storeId: ['13001'],
  isSuccessful: true
}

const nspayDeleteMajor = {
  userId: ['101928691'],
  wpayToken: ['Vwn5G7w+V66B/eS+LLXiD4XsaQXQyF+uEs9PBLqiPVQ='],
  langId: ['-9'],
  payMethod: ['16'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  bankCardNo: ['*********5785'],
  cmdType: ['delMajorPayInfo'],
  catalogId: ['14051'],
  acntRegDttm: ['20200701164139'],
  bankCardCode: ['020'],
  storeId: ['13001'],
  isSuccessful: true
}

// AjaxNSWPay API - cmdType: 'setNSPayOneTouchFlag'
const nspayOneTouchUseFlagChange = {
  // NS페이 회원인 경우
  nspayMember: {
    msg: {
      resultYn: 'Y',
      resultCode: ''
    },
    cmdType: ['setNSPayOneTouchFlag'],
    catalogId: ['14051'],
    userId: ['101928691'],
    langId: ['-9'],
    accptPath: ['500'],
    accptPathCd: ['500'],
    storeId: ['13001'],
    onTouchFlag: ['Y'],
    isSuccessful: true
  },
  // NS페이 회원이 아닐경우
  nspayNonMember: {
    msg: {
      resultYn: 'N',
      resultCode: '9999'
    },
    cmdType: ['setNSPayOneTouchFlag'],
    catalogId: ['14051'],
    userId: ['101928691'],
    langId: ['-9'],
    accptPath: ['500'],
    accptPathCd: ['500'],
    storeId: ['13001'],
    onTouchFlag: ['N'],
    isSuccessful: true
  }
}

// 비밀번호 변경 콜백
const nspayPasswordChangeCallbackResult = {
  success: {
    cmd: 'callbackNspayPasswordChangeResult',
    params: {
      wpayUserKey: 'Sdk+l4oz3giTcmgvYU2UX/k7tG7Uo8kLfPNNKJv3b1k=',
      resultMsg: '%EC%A0%95%EC%83%81+%EC%B2%98%EB%A6%AC%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.',
      catalogId: '14051',
      signature: 'f23bed1ddc745fcd3b570d8c0848cf24eeebd5aa4cfe726a5584815c750d35b4',
      langId: '-9',
      resultCode: '0000',
      storeId: '13001'
    }
  },
  fail: {
    cmd: 'callbackNspayPasswordChangeResult',
    params: {
      wpayUserKey: 'Sdk+l4oz3giTcmgvYU2UX/k7tG7Uo8kLfPNNKJv3b1k=',
      resultMsg: 'WPAY 식별값 누락 또는 오류 : wpayUserKey',
      resultCode: '1003'
    }
  }
}

// 비밀번호 확인 콜백
const nspayPasswordCheckCallbackResult = {
  success: {
    cmd: 'callbackNspayPasswordResult',
    params: {
      wpayUserKey: 'Sdk+l4oz3giTcmgvYU2UX/k7tG7Uo8kLfPNNKJv3b1k=',
      resultMsg: '%EC%A0%95%EC%83%81%EC%A0%81%EC%9C%BC%EB%A1%9C+%EC%B2%98%EB%A6%AC%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4',
      catalogId: '14051',
      signature: 'ef4a1b529f9f4bb68bfe3f50ec001f69a6b16a8ade5a121849e54cd11417cc2e',
      langId: '-9',
      resultCode: '0000',
      storeId: '13001'
    }
  },
  fail: {
    cmd: 'callbackNspayPasswordResult',
    params: {
      wpayUserKey: 'Sdk+l4oz3giTcmgvYU2UX/k7tG7Uo8kLfPNNKJv3b1k=',
      resultMsg: 'WPAY 식별값 누락 또는 오류 : wpayUserKey',
      resultCode: '1003'
    }
  }
}

export { nspayInfoAll, nspayInfoAllNull, nspayOneTouchUse, nspayUse, nspaySetMajor, nspayDeleteMajor, nspayOneTouchUseFlagChange, nspayPasswordChangeCallbackResult, nspayPasswordCheckCallbackResult }
