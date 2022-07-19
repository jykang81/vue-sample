// 이벤트 링크
const eventLink = {
  path: '/event',
  children: [
    {
      path: 'attendance',
      name: 'attendanceEvent',
      component: () => import(/* webpackChunkName: "attendanceEvent" */ '@/views/event/AttendanceEvent'),
      meta: { title: '출석체크', layout: 'LayoutLnb', depth: '이벤트>출석체크' }
    },
    {
      path: 'roulette/:offerId',
      name: 'rouletteEvent',
      component: () => import(/* webpackChunkName: "rouletteEvent" */ '@/views/event/RouletteEvent'),
      meta: { title: '행운의룰렛', layout: 'LayoutLnb', depth: '이벤트>행운의룰렛' }
    },
    {
      path: 'lucky-box',
      name: 'luckyBox',
      component: () => import(/* webpackChunkName: "luckyBox" */ '@/views/event/LuckyBoxEvent'),
      meta: { title: '럭키박스', layout: 'LayoutLnb', depth: '이벤트>럭키박스' }
    },
    {
      path: 'random-coupon/:offerId',
      name: 'randomCoupon',
      component: () => import(/* webpackChunkName: "randomCoupon" */ '@/views/event/RandomCouponEvent'),
      meta: { title: '랜덤쿠폰', layout: 'LayoutLnb', depth: '이벤트>랜덤쿠폰' }
    },
    {
      path: 'coupon-register',
      name: 'couponRegister',
      component: () => import(/* webpackChunkName: "couponRegister" */ '@/views/event/CouponRegister'),
      meta: { title: '쿠폰등록', layout: 'LayoutLnb', depth: '이벤트>쿠폰등록' }
    },
    {
      path: 'agree-receive-push/:offerId',
      name: 'agreeReceivePush',
      component: () => import(/* webpackChunkName: "agreeReceivePush" */ '@/views/event/AgreeReceivePushEvent'),
      meta: { title: 'PUSH 수신동의', layout: 'LayoutLnb', depth: '이벤트>push수신동의' }
    },
    {
      path: 'time-events-twice-a-day',
      name: 'timeEventsTwiceADay',
      component: () => import(/* webpackChunkName: "timeEventsTwiceADay" */ '@/views/event/TimeEventsTwiceADay'),
      meta: { title: '타임쿠폰', layout: 'LayoutLnb', depth: '이벤트>하루두번타임쿠폰' }
    },
    {
      path: 'application/:offerId',
      name: 'applicationEvent',
      component: () => import(/* webpackChunkName: "applicationEvent" */ '@/views/event/ApplicationEvent'),
      meta: { title: '이벤트', layout: 'LayoutLnb', depth: '이벤트>응모형이벤트' }
    },
    {
      path: 'month-coupon-event/:offerId',
      name: 'monthCouponEvent',
      component: () => import(/* webpackChunkName: "monthCouponEvent" */ '@/views/event/MonthCouponEvent'),
      meta: { title: '이벤트', layout: 'LayoutLnb', depth: '이벤트>한달에1번등급쿠폰' }
    },
    // 참여한 이벤트
    {
      path: 'participation/history',
      name: 'participationHistory',
      component: () => import(/* webpackChunkName: "participationHistory" */ '@/views/event/ParticipationHistory'),
      meta: { title: '참여한 이벤트', layout: 'LayoutLnb', depth: '마이페이지>기타활동>참여이벤트' }
    },
    // 당첨자 발표
    {
      path: 'participation/winner',
      name: 'participationWinner',
      component: () => import(/* webpackChunkName: "participationWinner" */ '@/views/event/ParticipationWinner'),
      meta: { title: '참여한 이벤트', layout: 'LayoutLnb', depth: '이벤트>참여한이벤트>당첨자>발표' }
    },
    {
      path: 'participation/winner/search',
      name: 'participationWinnerSearch',
      component: () => import(/* webpackChunkName: "participationWinnerSearch" */ '@/views/event/ParticipationWinnerSearch'),
      meta: { title: '참여한 이벤트', layout: 'LayoutSearchLnb', depth: '이벤트>참여한이벤트>당첨자>검색' }
    },
    {
      path: 'participation/winner/detail',
      name: 'participationWinnerDetail',
      component: () => import(/* webpackChunkName: "participationWinnerDetail" */ '@/views/event/ParticipationWinnerDetail'),
      meta: { title: '당첨자발표', layout: 'LayoutLnb', depth: '이벤트>참여한이벤트>당첨자>상세' }
    }
  ]
}

export default eventLink
