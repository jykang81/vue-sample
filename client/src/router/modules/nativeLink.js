// native 링크 정의
const nativeLink = {
  path: '/native', // url 정의. 반드시 유니크 해야한다.
  redirect: '/native/app-aside', // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    // LNB (vue가 팝업이라 URL없어 만듬)
    {
      path: 'app-aside',
      name: 'appAside',
      component: () => import(/* webpackChunkName: "appAside" */ '@/components/layouts/items/AppAside'),
      props: route => ({
        activeSnb: true
      }),
      meta: { title: 'LNB', layout: 'LayoutEmpty', depth: '공통>LNB' }
    },
    // 로그인 (Vue와 파라미터 전달 방식이 틀려서 만듬)
    {
      path: 'login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '@/views/customer/login/Login'),
      props: route => ({
        adultFlag: route.query.adultFlag,
        loginType: route.query.loginType,
        loginRedirectPath: route.query.loginRedirectPath
      }),
      meta: { title: '로그인', layout: 'LayoutPageNonFooter', depth: '고객>로그인' }
    },
    // 성인인증 (Vue와 파라미터 전달 방식이 틀려서 만듬)
    {
      path: 'info/adult-certification',
      name: 'adult',
      component: () => import(/* webpackChunkName: "adult" */ '@/components/customer/info/OrderNoMemberCertify'),
      props: route => ({
        adultFlag: route.query.adultFlag
      }),
      meta: { title: '성인인증', layout: 'LayoutPage', depth: '고객>내정보관리>본인인증' }
    },
    // 검색어 (vue가 팝업이라 URL없어 만듬)
    {
      path: 'search',
      name: 'search',
      component: () => import(/* webpackChunkName: "search" */ '@/components/common/SearchLayer'),
      props: route => ({
        tvShopFlag: route.query.tvTableFlag
      }),
      meta: { title: '검색어', layout: 'LayoutEmpty', depth: '검색' }
    },
    // 상품 옵션 선택 (vue가 Layer라 URL없어 만듬)
    {
      path: 'right-order-option',
      name: 'rightOrderOption',
      component: () => import(/* webpackChunkName: "rightOrderOption" */ '@/components/product/RightOrderOption'),
      props: route => ({
        showsLayer: true,
        globalVal: { partNumber: route.query.partNumber, getProductInfoFlag: true, dispTypeCd: route.query.dispTypeCd }
      }),
      meta: { title: '상품 옵션 선택', layout: 'LayoutEmpty', depth: '상품>상품옵션선택' }
    },
    // 성인상품상세 (Vue와 파라미터 전달 방식이 틀려서 만듬)
    {
      path: 'product/:number/:backflag',
      name: 'adultProductDetail',
      component: () => import(/* webpackChunkName: "adultProductDetail" */ '@/views/product/ProductDetail'),
      meta: { layout: 'LayoutProduct', depth: '상품/상품상세' }
    },
    // 이용약관 (Vue와 요구사항이 틀려서 만듬(BottomNavi, 상단 검색))
    {
      path: 'terms-of-use/nsmall',
      name: 'naTermsNsamll',
      component: () => import(/* webpackChunkName: "naTermsNsamll" */ '@/views/common/footer/siteinfo/termsofuse/TermsNsmall'),
      meta: { title: '이용약관', layout: 'LayoutLnb', depth: '기타>사이트정보>이용약관>NS몰및NS모바일' }
    },
    {
      path: 'terms-of-use/tv-and-sb',
      name: 'naTermsTvAndSb',
      component: () => import(/* webpackChunkName: "naTermsTvAndSb" */ '@/views/common/footer/siteinfo/termsofuse/TermsTvAndSb'),
      meta: { title: '이용약관', layout: 'LayoutLnb', depth: '기타>사이트정보>이용약관>TV홈쇼핑및쇼핑북' }
    },
    // 개인정보처리방침 (Vue와 요구사항이 틀려서 만듬(BottomNavi, 상단 검색))
    {
      path: 'privacy-policy',
      name: 'naPrivacyPolicy',
      component: () => import(/* webpackChunkName: "naPrivacyPolicy" */ '@/views/common/footer/siteinfo/PrivacyPolicy'),
      meta: { title: '개인정보처리방침', layout: 'LayoutLnb', depth: '기타>사이트정보>개인정보처리방침' }
    },
    // 청소년 보호정책 (Vue와 요구사항이 틀려서 만듬(BottomNavi, 상단 검색))
    {
      path: 'youth-policy',
      name: 'naYouthPolicy',
      component: () => import(/* webpackChunkName: "naYouthPolicy" */ '@/views/common/footer/siteinfo/YouthPolicy'),
      meta: { title: ' 청소년 보호정책 ', layout: 'LayoutLnb', depth: '기타>사이트정보>청소년보호정책' }
    },
    // 푸터
    {
      path: 'app-footer',
      name: 'naAppFooter',
      component: () => import(/* webpackChunkName: "naYouthPolicy" */ '@/components/layouts/items/AppFooter'),
      meta: { title: ' 푸터 ', layout: 'LayoutEmpty', depth: '기타>사이트정보' }
    },
    // 복수상품일경우 홈브릿지 페이지로 이동
    {
      path: 'store/home-bridge',
      name: 'homeBridge',
      component: () => import(/* webpackChunkName: "homeBridge" */ '@/components/store/HomeBridge'),
      props: route => ({
        param: {
          identify: route.query.identify,
          goodId: route.query.goodId,
          startdtm: route.query.startdtm,
          enddtm: route.query.enddtm,
          nsTalkOnlyFlag: route.query.nsTalkOnlyFlag
        }
      }),
      meta: { title: '', layout: 'LayoutPageNonFooter', depth: '홈브릿지' }
    },
    // 복수상품일경우 홈브릿지 페이지로 이동
    {
      path: 'store/native-home-bridge',
      name: 'nativeHomeBridge',
      component: () => import(/* webpackChunkName: "nativeHomeBridge" */ '@/components/store/NativeHomeBridge'),
      props: route => ({
        paramData: {
          identify: route.query.identify,
          goodId: route.query.goodId,
          startdtm: route.query.startdtm,
          enddtm: route.query.enddtm,
          nsTalkOnlyFlag: route.query.nsTalkOnlyFlag
        }
      }),
      meta: { title: '', layout: 'LayoutPageNonFooter', depth: '홈브릿지' }
    },
    // 상담신청 페이지로 이동
    {
      path: 'order/consult/:number',
      name: 'nativeOrderConsultSheet',
      component: () => import(/* webpackChunkName: "orderConsultSheet" */ '@/views/order/consult/OrderConsultSheet'),
      props: route => ({
        params: {
          backflag: 'home'
        }
      }),
      meta: { title: '상담신청', requiresAuth: true, layout: 'LayoutPageLnb', depth: '주문>상담신청' }
    },
    // 방송알림 페이지로 이동
    {
      path: 'product/shopping-alarm-register',
      name: 'naShoppingAlarmRegister',
      component: () => import(/* webpackChunkName: "naShoppingAlarmRegister" */ '@/components/product/NativeShoppingAlarm'),
      props: route => ({
        paramData: {
          partNumber: route.query.partNumber,
          catentryId: route.query.catentryId,
          goodsName: route.query.goodsName,
          adultItemFlag: route.query.adultItemFlag,
          pgmCD: route.query.pgmCD,
          mediaType: route.query.mediaType,
          nsTalkOnlyFlag: false
        }
      }),
      meta: { layout: 'LayoutEmpty', depth: 'GNB>편성표>TVLIVE' }
    },
    // Native Espot Click
    {
      path: 'native-espot-click',
      name: 'nativeEspotClick',
      component: () => import(/* webpackChunkName: "nativeEspotClick" */ '@/views/store/module/NativeEspotClick'),
      props: route => ({
        paramData: {
          target: route.query.target,
          contentsId: route.query.contentsId,
          clickCode: route.query.clickCode,
          espotId: route.query.espotId,
          mdUrl: route.query.mdUrl,
          catalogId: route.query.catalogId,
          mclksrcdUrl: route.query.clksrc
        }
      }),
      meta: { layout: 'LayoutPageNonFooter', depth: 'Native' }
    },
    // 편성표 API 조회
    {
      path: 'naSetting',
      name: 'naMypageSetting',
      component: () => import(/* webpackChunkName: "mypageSetting" */ '@/views/customer/MypageSetting'),
      props: route => ({
        entFlag: route.query.entFlag
      }),
      meta: { title: '설정', layout: 'LayoutEmpty', depth: 'Native' }
    },
    // 편성표 API 조회
    {
      path: 'tv-schedule-api',
      name: 'nativeTvScheduleApi',
      component: () => import(/* webpackChunkName: "nativeTvScheduleApi" */ '@/views/store/NativeTvScheduleApi'),
      meta: { title: ' 편성표 API 조회 ', layout: 'LayoutEmpty', depth: 'Native' }
    },
    // Native 홈으로 이동
    {
      path: 'customer/info/check-pw',
      name: 'naMemberModifyIntro',
      component: () => import(/* webpackChunkName: "MemberModifyIntro" */ '@/views/customer/info/MemberModifyIntro'),
      props: route => ({
        isNativeSetting: route.query.isNativeSetting
      }),
      meta: { title: '회원정보수정', requiresAuth: true, layout: 'LayoutLnbNonFooter', depth: '고객>내정보관리>회원정보변경비밀번호확인', hideTopButton: true }
    },
    // native test
    {
      path: 'nativeDoing',
      name: 'nativeDoing',
      component: () => import(/* webpackChunkName: "nativeDoing" */ '@/views/test/TestNativeDoing'),
      props: route => ({
        paramData: {
          target: route.query.target,
          contentsId: route.query.contentsId,
          clickCode: route.query.clickCode,
          espotId: route.query.espotId,
          mdUrl: route.query.mdUrl,
          catalogId: route.query.catalogId,
          mclksrcdUrl: route.query.clksrc
        }
      }),
      meta: { title: ' Native Test ', layout: 'LayoutPageNonFooter', depth: 'Native' }
    }

  ]
}

export default nativeLink
