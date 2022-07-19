const applyLuckyBox = {
  msg: {
    event: {
      cpApplySpr: '',
      lottoType: 'OP',
      bnftVal: '',
      plusSprCd: '',
      lottoCd: '100'
    },
    rtn: {
      rtnMsg: '100원에 당첨되었습니다.',
      rtnCode: '0'
    }
  },
  catalogId: ['14051'],
  userId: ['101929676'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

const applyLuckyBoxFail = {
  msg: {
    rtn: {
      rtnMsg: '신청 가능한 톨포인트는 1000점 이상입니다.',
      rtnCode: '-2'
    }
  },
  catalogId: ['14051'],
  userId: ['101928680'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

const getTollPoint = {
  msg: {
    root: {
      common: {
        expiredAmt: '0',
        amount: '6310',
        totalCount: 3
      },
      usageList: [
        { usage: '출석이벤트', expiryDate: '2021.09.22', useDate: '2020.09.22', usedAmt: '10', sign: 'plus' },
        { usage: '톨포인트 지급_당첨_이지쇼핑_톨포인트 다운로드', expiryDate: '2021.09.18', useDate: '2020.09.18', usedAmt: '1000', sign: 'plus' },
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

export { applyLuckyBox, applyLuckyBoxFail, getTollPoint }
