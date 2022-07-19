import Vue from 'vue'
import VueRouter from 'vue-router'

import CONST from '@constants/framework/framework'
import store from '@/vuex/index'
import loginUtil from '@utils/loginUtil'
// import checkUpdateUtil from '@/common/utils/checkUpdateUtil'

import storeLink from '@/router/modules/storeLink' // 매장 링크
import customerLink, { loginLink, memberFindLink, simpleLink, memberJoinLink, memberSettingLink, customerNspayLink, employeeLink } from '@/router/modules/customerLink' // 회원 링크
import orderLink from '@/router/modules/orderLink' // Order 링크
import paymentLink from '@/router/modules/paymentLink' // 결제 링크
import productLink from '@/router/modules/productLink' // 상품 링크
import mypageLink from '@/router/modules/mypageLink' // 마이페이지 링크
import nativeLink from '@/router/modules/nativeLink' // Native 링크
import searchLink from '@/router/modules/searchLink' // 검색결과 페이지 링크
import mediaLink from '@/router/modules/mediaLink' // 미디어 링크
import custCenterLink from '@/router/modules/custCenterLink' // 고객센터 링크
import eventLink from '@/router/modules/eventLink' // 이벤트 링크
import exhibitionLink from '@/router/modules/exhibitionLink' // 기획전 상세 링크
import marketingLink from '@/router/modules/marketingLink' // 마케팅 스크립트
import redirectLink from '@/router/modules/redirectLink'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import externalUtil from '@utils/externalUtil'
import { siteInfoLinks, shoppingHistoryLink, infoLink } from '@/router/modules/commonLink'
import {
  isNull,
  isOsApp
} from '@utils/commonutil/commonUtil'
import NATIVE_CONST from '@constants/framework/native'
import cookieUtil from '@frameworks/cookieUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import uiUtil from '@utils/uiUtil'

Vue.use(VueRouter)

const notFoundLink = { // 에러 페이지 링크
  path: '*',
  component: () => import(/* webpackChunkName: "ErrorPage" */ '@/components/frameworks/ErrorPage'), // 에러 페이지
  name: 'errorPage'
}

// 라우터 객체 생성
const routes = [
  storeLink,
  customerLink,
  loginLink,
  memberFindLink,
  simpleLink,
  memberJoinLink,
  memberSettingLink,
  customerNspayLink,
  employeeLink,
  orderLink,
  paymentLink,
  productLink,
  mypageLink,
  custCenterLink,
  searchLink,
  mediaLink,
  eventLink,
  exhibitionLink,
  notFoundLink,
  nativeLink,
  siteInfoLinks,
  shoppingHistoryLink,
  marketingLink,
  redirectLink,
  infoLink
]

routes.forEach(route => {
  // 기존에 정의된 컴포넌트가 없을때만 기본 레이아웃 컴포넌트 정의
  if (!route.component) {
    route.component = () => import(/* webpackChunkName: "index/BaseLayout" */ '@components/layouts/BaseLayout')
  }
})

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/',

  /**
   * 스크롤 위치 지정 (라우트 변경 시점)
   * 라우트 객체 문서 https://router.vuejs.org/api/#route-object-properties
   * @param {Object} to 라우트 객체 (목적지)
   * @param {Object} from 라우트 객체 (출발지)
   * @param {Object} savedPosition client x, y 좌표 객체
   * @returns {Object} client x, y 좌표 객체
   */
  scrollBehavior (to, from, savedPosition) {
    // 뒤로가기로 왔을 때
    if (savedPosition) {
      if (uiUtil.isItNecessaryForScrollPolyfill() && from.hash.includes('popup')) { // iOS 팝업 뒤로가기 스크롤 오작동 방지
        return
      }

      // iOS에서 scrollBehavior 에 savedPositon.y가 0으로 저장되는 이슈 대응
      if (savedPosition.y === 0) {
        savedPosition = to.meta.savedPosition
      }

      // 저장된 스크롤 위치로 이동
      window.scroll(0, savedPosition.y)

      // 스크롤 위치 보정 시도
      if (savedPosition.y !== window.pageYOffset) {
        let retryCount = 3 // 스크롤 이동 재시도 남은 횟수 (3회 시도)
        const debounceTimer = setInterval(() => {
          if (retryCount > 0) {
            if (savedPosition.y === window.pageYOffset) {
            // 저장된 스크롤 위치에 도달했으면 interval 호출 종료
              clearInterval(debounceTimer)
            } else {
            // 저장된 스크롤 위치에 도달할 때까지 interval 호출로 이동 (무한 스크롤로 다음 데이터를 조회하기 위함)
              window.scroll(0, savedPosition.y)
              retryCount--
            }
          } else {
          // 3회 시도 후에도 저장된 스크롤 위치에 도달하지 못하면 최상단으로 이동
            if (savedPosition.y !== window.pageYOffset) {
              window.scroll(0, 0)
              // 저장된 스크롤 위치에 도달했으면 interval 호출 종료
              clearInterval(debounceTimer)
            }
          }
        }, 300)
      }

      // 스토어에 윈도우 좌표 저장
      store.dispatch('history/setSavedPosition', savedPosition)
    } else {
      window.scroll(0, 0)
    }

    to.meta.hasSavedPosition = Boolean(savedPosition)
  }
})

/**
 * view 관련 상태 초기화
 */
const resetViewState = () => {
  store.commit('message/hide') // confirm 또는 alert 창 닫기
  store.commit('animationPopup/hideAtOnce') // animation popup 닫기
}

/**
 * 네비게이션 가드
 * route 이동 전
 * 라우트 객체 문서 https://router.vuejs.org/api/#route-object-properties
 * @param {object} to 라우트 객체 (목적지)
 * @param {object} from 라우트 객체 (출발지)
 * @param {function} next
 * @returns {obejct}
 */
router.beforeEach((to, from, next) => {
  // iOS에서 scrollBehavior 에 savedPositon.y가 0으로 저장되는 이슈 대응
  from.meta.savedPosition = { x: window.pageXOffset, y: window.pageYOffset }

  // 메인으로 리다이렉트 되는 route 이동 경로 정의
  const MAIN_REDIRECT_CASES = [{
    // 주문완료 -> 주문서
    from: 'orderComplete',
    to: 'orderSheet'
  }, {
    // 상담신청 주문완료 -> 상담신청 주문서
    from: 'orderConsultComplete',
    to: 'orderConsultSheet'
  }, {
    // 페이스북 회원가입완료 -> 페이북 회원기입
    from: 'facebookJoinComplete',
    to: 'facebookJoin'
  }]

  // 메인으로 리다이렉트 되는 route 이동이면 메인으로 리다이렉트
  if (MAIN_REDIRECT_CASES.some(route => route.from === from.name && route.to === to.name)) {
    return next({ name: 'storeHome' })
  }

  resetViewState()

  const isLoggedIn = loginUtil.isLoggedIn()
  const hashArr = to.hash.split('#')
  const popupList = store.state.popup.popupList
  const popupCount = popupList.length

  // URL 해시에는 팝업이 있지만 Vuex Store 의 팝업은 존재하지 않는 경우, 해시 삭제된 URL로 이동. ex) #popup-1 해시가 붙은 상태에서 새로고침
  if (hashArr && hashArr.some(hash => hash.startsWith('popup-')) && !popupCount) {
    return next({ path: to.path })
  }

  // 팝업이 닫히는 시점에 실행
  const popupHash = hashArr.filter(hash => hash.startsWith('popup-'))[0]
  const popupHashCount = popupHash ? Number(popupHash.split('-')[1]) : 0
  const popupBackCount = popupCount - popupHashCount // Vuex에 담긴 팝업 개수와 URL Hash의 팝업 개수의 차이
  if (popupBackCount > 0) { // 개수 차이가 있으면 그만큼 Vuex에서 팝업을 꺼낸다.
    for (let i = 0; i < popupBackCount; i++) {
      store.commit('popup/hideWithoutBack')
    }
  }

  if (isLoggedIn) {
    /**
     * 로그인 유저 검증 라우트
     * meta 데이터에서 비밀번호 인증 필요 여부를 체크합니다.
     * ex) meta: { title: '회원정보수정', requiresAuth: true, requiresPasswordAuth: true }
     */
    if (to.matched.some(record => record.meta.forbidsLoginUser)) {
      if (isOsApp()) {
        return next()
      } else {
        return next({ name: 'storeHome' })
      }
    } else if (to.matched.some(record => record.meta.requiresPasswordAuth) && isNull(to.hash)) {
      // 비밀번호 인증 완료 쿠키 검증
      if (cookieUtil.getCookie('securityVerification') !== 'Y') {
        return next({
          name: 'memberModifyIntro',
          replace: true
        })
      }
    }
  } else {
    /**
     * 비로그인 유저 검증 라우트
     * meta 데이터에서 인증 필요 여부를 체크합니다.
     * ex) meta: { title: '마이페이지', requiresAuth: true }
     */
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // 로그인 후 이동할 이전 라우트 저장
      if (isOsApp()) {
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH, to.path)
        window.returnRoute = to
      } else {
        store.commit('login/setReturnRoute', to)
      }

      return next({ name: 'memberLogin' })
    }
  }

  // 업데이트 체크 초기화 작업 (time 및 count 미사용으로 인해 주석 처리)
  // checkUpdateUtil.clearTime()
  // checkUpdateUtil.clearCount()

  // 일반 라우트
  return next()
})

/**
 * route 이동 후
 * Global After Hooks
 * 라우트 객체 문서 https://router.vuejs.org/api/#route-object-properties
 * @param {object} to 라우트 객체 (목적지)
 * @param {object} from 라우트 객체 (출발지)
 */
router.afterEach((to, from) => {
  window.marketingRoute = to // window 객체에 route 정보 갱신
  // 리퍼러 라우트 이름
  to.meta.refer = from.name

  // 라우트 이동 시 마케팅 스크립트가 파라미터에 있으면 실행
  const marketingScript = to.params.marketing
  if (typeof marketingScript === 'function') {
    marketingScript()
  }

  // 페이지 뷰 로깅
  // GA 360
  // 상품상세 화면인 경우에는 상품상세 화면 로딩시 페이지 뷰 로그를 전송한다. <-- 이전 화면에 따른 상품상세 화면의 타이틀이 변경되어야 함
  if (window.marketingRoute.name && (
    window.marketingRoute.name !== 'productDetail' && // 상품상세
    window.marketingRoute.name !== 'slotStore' && // 편성매장
    window.marketingRoute.name !== 'lnbCategory' && // 카테고리 상품목록
    window.marketingRoute.name !== 'mypageMain' && // 마이페이지 메인
    window.marketingRoute.name !== 'managementMyReview' && // 상품평관리
    window.marketingRoute.name !== 'mypageBenefit' && // 상품권 등록
    window.marketingRoute.name !== 'mypageOrderList' && // 주문/배송조회
    window.marketingRoute.name !== 'myInfoAdmin' && // 내정보관리
    window.marketingRoute.name !== 'simpleLogin' && // 아이디연결
    window.marketingRoute.name !== 'orderComplete' && // 주문완료
    window.marketingRoute.name !== 'searchResult' && // 검색결과
    window.marketingRoute.name !== 'tvScheduleTable' && // 편성표
    window.marketingRoute.name !== 'exhibitionDetail' && // 기획전
    window.marketingRoute.name !== 'applicationEvent' // 응모형이벤트
  )) {
    marketingUtil.ga360Logger.send({
      type: marketingUtil.ga360Logger.LOG_PAGE,
      data: {
        category: '',
        initFlag: true
      }
    })
  }

  // 레코벨(EIGENE)
  if (window.marketingRoute.name && (
    window.marketingRoute.name !== 'productDetail' && // 상품상세
    window.marketingRoute.name !== 'orderComplete' // 주문완료
  )) {
    marketingUtil.recobellLogger.send({
      data: {
        category: '',
        initFlag: true
      }
    })
  }
  // AIQUA
  marketingUtil.aiquaLogger.send({
    type: marketingUtil.aiquaLogger.USER_EVENT,
    data: {
      event: 'page_viewed'
    }
  })

  if (isOsApp() && to.path.indexOf('app-aside') < 0 && to.path.trim() !== '/customer/info' && to.path.trim() !== '/customer/info/') { // APP
    const element = Boolean(document.querySelector('.mt32'))
    if (!element) {
      nativeUtil.setRoutePath(to.path)
    }
  }

  // cocd 시간 체크
  externalUtil.cocdTimeCheck()
})

/**
 * router 에러 처리
 * @param {object} error 에러 객체
 */
router.onError(error => {
  // 배포에 따른 chunk 불일치 대응
  if (/Loading chunk */i.test(error.message) && window.location.hash !== '#retry') {
    window.location.hash = '#retry'
    window.location.reload()
  }
})

/** 유닛 테스트 환경에서 router.push 재정의 */
if (CONST.IS_TEST_REPORT) {
  router.push = () => new Promise(resolve => {
    resolve()
  })
}

export default router
