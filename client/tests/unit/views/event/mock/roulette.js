const startRouletteSuccess = {
  msg: {
    root: {
      rtnMsg: '축하합니다. 적립금 500원에 당첨되었습니다.',
      rtnCd: '0'
    }
  },
  eventIdfr: ['100000030216'],
  catalogId: ['14051'],
  mediaCd: ['MOBIL'],
  userId: ['101929676'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  flag: ['01'],
  isSuccessful: true
}

const startRouletteFail = {
  msg: {
    root: {
      rtnMsg: '고객님은 이미 신청하셨습니다.&lt;br&gt;내일도 꼭 신청해주세요.',
      rtnCd: '1'
    }
  },
  eventIdfr: ['100000030216'],
  catalogId: ['14051'],
  mediaCd: ['MOBIL'],
  userId: ['101929676'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  flag: ['01'],
  isSuccessful: true
}

const getTollPoint = {
  msg: {
    root: {
      common: {
        expiredAmt: '0',
        amount: '6310',
        totalCount: 11
      },
      usageList: [
        { usage: '톨포인트 응모980톨 차감', expiryDate: '2021.09.22', useDate: '2020.09.22', usedAmt: '980', sign: 'minus' },
        { usage: '톨포인트 응모10톨 차감', expiryDate: '2021.09.22', useDate: '2020.09.22', usedAmt: '10', sign: 'minus' },
        { usage: '톨포인트 응모10톨 차감', expiryDate: '2021.09.18', useDate: '2020.09.22', usedAmt: '10', sign: 'minus' },
        { usage: '톨포인트 지급_당첨_이지쇼핑_톨포인트 다운로드', expiryDate: '2021.09.22', useDate: '2020.09.22', usedAmt: '1000', sign: 'plus' },
        { usage: '톨포인트 응모990톨 차감', expiryDate: '2021.09.18', useDate: '2020.09.22', usedAmt: '990', sign: 'minus' },
        { usage: '톨포인트 응모10톨 차감', expiryDate: '2021.09.18', useDate: '2020.09.22', usedAmt: '10', sign: 'minus' },
        { usage: '톨포인트 응모990톨 차감', expiryDate: '2021.09.18', useDate: '2020.09.22', usedAmt: '990', sign: 'minus' },
        { usage: '톨포인트 응모10톨 차감', expiryDate: '2021.09.10', useDate: '2020.09.22', usedAmt: '10', sign: 'minus' },
        { usage: '출석이벤트', expiryDate: '2021.09.22', useDate: '2020.09.22', usedAmt: '10', sign: 'plus' },
        { usage: '톨포인트 지급_당첨_이지쇼핑_톨포인트 다운로드', expiryDate: '2021.09.18', useDate: '2020.09.18', usedAmt: '1000', sign: 'plus' }]
    }
  },
  schFlag: ['1M'],
  catalogId: ['14051'],
  userId: ['101929676'],
  fromDate: ['20200915'],
  toDate: ['20200922'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

export { startRouletteSuccess, startRouletteFail, getTollPoint }
