const EVENT_CONST = {
  // NSTimesPrmtEventCmd API
  // 이벤트 응모 타입
  FLAG_TYPE: {
    USE_OFFER_NUM: '01', // 01 : 오퍼번호로 이벤트 응모(공통 이벤트)
    USE_COUPON_NUM: '02' // 02 : 쿠폰번호로 이벤트 응모(쿠폰만 다운)
  },
  // 요청 매체
  MEDIA_CD: 'MOBIL'
}

export default EVENT_CONST
