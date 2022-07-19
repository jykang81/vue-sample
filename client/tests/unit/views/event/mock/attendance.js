const getAttendanceRecord = {
  msg: {
    root: {
      nMonth: 9,
      attnYn: 'Y',
      calLength: 30,
      weekCnt: 5,
      calData: [
        { Dt: '1', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '3', holidayYn: 'N' },
        { Dt: '2', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '4', holidayYn: 'N' },
        { Dt: '3', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '5', holidayYn: 'N' },
        { Dt: '4', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '6', holidayYn: 'N' },
        { Dt: '5', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '7', holidayYn: 'N' },
        { Dt: '6', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '1', holidayYn: 'Y' },
        { Dt: '7', monthEndDayYn: 'N', userId: '101929676', couponPoint: '1', weekSeq: '2', holidayYn: 'N' },
        { Dt: '8', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '3', holidayYn: 'N' },
        { Dt: '9', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '4', holidayYn: 'N' },
        { Dt: '10', monthEndDayYn: 'N', userId: '101929676', couponPoint: '1', weekSeq: '5', holidayYn: 'N' },
        { Dt: '11', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '6', holidayYn: 'N' },
        { Dt: '12', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '7', holidayYn: 'N' },
        { Dt: '13', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '1', holidayYn: 'Y' },
        { Dt: '14', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '2', holidayYn: 'N' },
        { Dt: '15', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '3', holidayYn: 'N' },
        { Dt: '16', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '4', holidayYn: 'N' },
        { Dt: '17', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '5', holidayYn: 'N' },
        { Dt: '18', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '6', holidayYn: 'N' },
        { Dt: '19', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '7', holidayYn: 'N' },
        { Dt: '20', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '1', holidayYn: 'Y' },
        { Dt: '21', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '2', holidayYn: 'N' },
        { Dt: '22', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '3', holidayYn: 'N' },
        { Dt: '23', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '4', holidayYn: 'N' },
        { Dt: '24', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '5', holidayYn: 'N' },
        { Dt: '25', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '6', holidayYn: 'N' },
        { Dt: '26', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '7', holidayYn: 'N' },
        { Dt: '27', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '1', holidayYn: 'Y' },
        { Dt: '28', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '2', holidayYn: 'N' },
        { Dt: '29', monthEndDayYn: 'N', userId: null, couponPoint: null, weekSeq: '3', holidayYn: 'N' },
        { Dt: '30', monthEndDayYn: 'Y', userId: null, couponPoint: null, weekSeq: '4', holidayYn: 'N' }
      ],
      nYear: 2020,
      nDay: 22
    }
  },
  catalogId: ['14051'],
  userId: ['101929676'],
  chn_gubun: ['Mobile'],
  cmd_gubun: ['Load'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

const checkAttendance =
{
  msg: {
    root: {
      rsltMsg: '출석체크 하셨습니다.'
    }
  },
  attnYn: 'Y',
  catalogId: ['14051'],
  userId: ['101929676'],
  chn_gubun: ['Mobile'],
  cmd_gubun: ['basicAttn'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

const get5000TollPoint =
{
  msg: {
    root: {
      rsltMsg: '전월에 7일 연속 출석한 내역이 없습니다.'
    }
  },
  catalogId: ['14051'],
  userId: ['101929676'],
  chn_gubun: ['Mobile'],
  cmd_gubun: ['weekAttn'],
  langId: ['-9'],
  accptPath: ['500'],
  accptPathCd: ['500'],
  storeId: ['13001'],
  isSuccessful: true
}

export { getAttendanceRecord, checkAttendance, get5000TollPoint }
