// AjaxNSWPay, cmdType: payInfoAll
const temp02ResAjaxNSWPayPayInfoAll = {
  wpayUserKey: '3zmBY34LWh45LLvRY24FYLUMYW0Mo/LL57nXZquheWM=',
  isSuccessful: true,
  responseHeaders: {
    Server: 'WebSphere Application Server/7.0',
    'Transfer-Encoding': 'chunked',
    'Content-Language': 'en-US',
    'Content-Type': 'application/json; charset=UTF-8',
    Date: 'Fri, 12 Jun 2020 00:41:09 GMT'
  },
  userId: [
    '000000000'
  ],
  tranId: 'webapp/wcs/stores/servlet/AjaxNSWPay',
  langId: [
    '-9'
  ],
  accptPath: [
    '500'
  ],
  mileage: {},
  accptPathCd: [
    '500'
  ],
  responseTime: 1352,
  totalTime: 1353,
  req_co_cd: [
    '110'
  ],
  cmdType: [
    'payInfoAll'
  ],
  catalogId: [
    '97001'
  ],
  payInfo: {
    payListCnt: 1,
    payList: [
      {
        acntRegDttm: '',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Fcardimg%2Flarge%2Fcard_1_kb.png',
        wpayToken: 'vLfEGXLrQR9xwc7hh5FICdF3SDHiYcvJn2lZ6BRNM28=',
        payMethod: '01',
        bankCardCode: '06',
        cardName: '%EA%B5%AD%EB%AF%BC%EC%B9%B4%EB%93%9C',
        majYn: 'N', // majYn: "Y" - 기본카드 선택하면 등록되고 해당값이 Y 로 변경되어 내려온다.
        bankCardNo: '4673-09**-****-0090',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Fcardimg%2Fsmall%2Fcard_2_kb.png'
      },
      {
        acntRegDttm: '20200701163239',
        bankCardCode: '005',
        bankCardNo: '**********2000',
        cardImgLUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Flarge%2Facct_1_ke.png',
        cardImgSUrl: 'https%3A%2F%2Fwpay.inicis.com%2Facctimg%2Fsmall%2Facct_2_ke.png',
        cardName: '%EC%99%B8%ED%99%98%EC%9D%80%ED%96%89',
        majYn: 'N',
        payMethod: '16',
        wpayToken: 'xfmhg45t42Ah6vYqmoj2xfXFyhn0oC6We20ThTVNfWU='
      }
    ]
  },
  statusReason: 'OK',
  mobAPI: [
    'AjaxNSWPay'
  ],
  uuid: [
    'a55d629a-0bd2-4842-be31-f77bc47d216c'
  ],
  storeId: [
    '13001'
  ],
  accessTm: [
    '20200612094234558'
  ],
  mappedCodeList: {
    11: 'BC',
    12: 'SS',
    14: 'LG',
    16: 'CH',
    17: 'WH',
    '01': 'HN',
    '03': 'AM',
    '04': 'DN',
    '06': 'KM'
  },
  statusCode: 200
}

export default temp02ResAjaxNSWPayPayInfoAll
