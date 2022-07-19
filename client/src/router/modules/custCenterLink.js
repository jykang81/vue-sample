
// 고객센터 링크 정의
const custCenterLink = {
  path: '/custcenter', // url 정의. 반드시 유니크 해야한다.
  redirect: { name: 'storeHome' }, // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: '/',
      name: 'custCenterMain',
      component: () => import(/* webpackChunkName: "custCenterMain" */ '@/views/custcenter/CustCenterMain'),
      meta: { title: '고객센터', layout: 'LayoutLnb', depth: '마이페이지>고객센터>홈' }
    },
    {
      path: 'faq',
      name: 'custCenterFaq',
      component: () => import(/* webpackChunkName: "custCenterFaq" */ '@/views/custcenter/CustCenterMain'),
      meta: { title: '고객센터', layout: 'LayoutLnb', depth: '마이페이지>고객센터>FAQ' }
    },
    {
      path: 'faq/search',
      name: 'custCenterFaqSearch',
      component: () => import(/* webpackChunkName: "custCenterFaqSearch" */ '@/views/custcenter/CustCenterFaqSearch'),
      meta: { title: 'FAQ 검색', layout: 'LayoutBottomNavi', depth: '마이페이지>고객센터>검색결과' }
    },
    {
      path: 'board-inquiry/history',
      name: 'custCenterBoardInquiry',
      component: () => import(/* webpackChunkName: "custCenterBoardInquiry" */ '@/views/custcenter/CustCenterMain'),
      meta: { title: '고객센터', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>고객센터>문의내역' }
    },
    {
      path: 'board-inquiry/detail/:type/:id',
      name: 'custCenterBoardInquiryDetail',
      component: () => import(/* webpackChunkName: "custCenterBoardInquiryDetail" */ '@/views/custcenter/CustCenterBoardInquiryDetail'),
      meta: { title: '문의내역상세', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>고객센터>문의내역>문의내역상세' }
    },
    {
      path: 'board-inquiry/inquire',
      name: 'custCenterBoardInquiryWrite',
      component: () => import(/* webpackChunkName: "custCenterBoardInquiryWrite" */ '@/views/custcenter/CustCenterBoardInquiryWrite'),
      meta: { title: '1:1 문의하기', requiresAuth: true, layout: 'LayoutPage', depth: '마이페이지>고객센터>1:1문의하기' }
    },
    {
      path: 'notice',
      name: 'custCenterNotice',
      component: () => import(/* webpackChunkName: "custCenterNotice" */ '@/views/custcenter/CustCenterMain'),
      meta: { title: '고객센터', layout: 'LayoutLnb', depth: '마이페이지>고객센터>공지사항' }
    },
    {
      path: 'notice/:id',
      name: 'custCenterNoticeDetail',
      component: () => import(/* webpackChunkName: "custCenterNoticeDetail" */ '@/views/custcenter/CustCenterNoticeDetail'),
      meta: { title: '공지사항', layout: 'LayoutLnb', depth: '마이페이지>고객센터>공지사항상세보기' }
    },
    {
      path: 'chat-counseling/request',
      name: 'chatCounselingRequest',
      component: () => import(/* webpackChunkName: "chatCounselingRequest" */ '@/views/custcenter/ChatCounselingMain'),
      meta: { title: '채팅상담/내역', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>고객센터>채팅상담/내역>채팅상담' }
    },
    {
      path: 'chat-counseling/history',
      name: 'chatCounselingHistory',
      component: () => import(/* webpackChunkName: "chatCounselingHistory" */ '@/views/custcenter/ChatCounselingMain'),
      meta: { title: '채팅상담/내역', requiresAuth: true, layout: 'LayoutLnb', depth: '마이페이지>주문/배송조회>상담신청내역' }
    }
  ]
}

export default custCenterLink
