
// 미디어 링크
const mediaLink = {
  path: '/media',
  children: [
    {
      path: 'thinglive/live-stream',
      name: 'thingliveLiveDetail',
      component: () => import(/* webpackChunkName: "thingliveLiveDetail" */ '@/views/media/ThingliveLiveDetail'),
      meta: { title: '띵라이브 LIVE 보기', layout: 'LayoutLnbNonFooter', depth: '띵라이브>생방송보기', hideTopButton: true }
    },
    {
      path: 'thinglive/vod-stream/:contentId/:vodId',
      name: 'thingliveVodDetail',
      component: () => import(/* webpackChunkName: "thingliveVodDetail" */ '@/views/media/ThingliveVodDetail'),
      meta: { title: '띵라이브 VOD', layout: 'LayoutLnb', depth: '띵라이브>지난방송보기' }
    },
    {
      path: 'alarm',
      name: 'shoppingAlarm',
      component: () => import(/* webpackChunkName: "shoppingAlarm" */ '@/views/media/ShoppingAlarmList'),
      meta: { title: '방송알림', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>기타활동>방송알림' }
    },
    {
      path: 'schedule',
      name: 'tvScheduleTableBase',
      children: [
        {
          path: ':mediaDay',
          name: 'tvScheduleTable',
          component: () => import(/* webpackChunkName: "tvScheduleTable" */ '@/views/store/TvScheduleTable'),
          meta: { layout: 'LayoutDefault', depth: 'GNB>편성표>TVLIVE' }
        }
      ],
      component: () => import(/* webpackChunkName: "tvScheduleTable" */ '@/views/store/TvScheduleTable'),
      meta: { layout: 'LayoutDefault', depth: 'GNB>편성표>TVLIVE', hideTopButton: true }
    }
  ]
}

export default mediaLink
