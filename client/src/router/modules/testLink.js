
// 샘플 링크 정의
const testLink = {
  path: '/test', // url 정의. 반드시 유니크 해야한다.
  component: () => import(/* webpackChunkName: "LayoutTest" */ '@components/layouts/LayoutTest'), // 사용할 기본 레이아웃 컴포넌트 정의
  redirect: '/test/test-main', // 리다이렉트가 필요할때 사용
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'test-main',
      name: 'testMain',
      component: () => import(/* webpackChunkName: "testMain" */ '@/views/test/TestMain'),
      meta: { title: '테스트 메인', depth: '아키텍처>테스트' }
    },
    {
      path: 'test-error',
      name: 'testError',
      component: () => import(/* webpackChunkName: "testError" */ '@/views/test/TestError'),
      meta: { title: '테스트 에러', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-data',
      name: 'testData',
      component: () => import(/* webpackChunkName: "testData" */ '@/views/test/TestData'),
      meta: { title: '테스트 데이터 전달', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-router',
      name: 'testRouter',
      component: () => import(/* webpackChunkName: "testRouter" */ '@/views/test/TestRouter'),
      meta: { title: '테스트 라우터 사용법', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-router2/:param0',
      name: 'testRouter2',
      component: () => import(/* webpackChunkName: "testRouter2" */ '@/views/test/TestRouter'),
      meta: { title: '테스트 라우터 사용법2', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-router3',
      name: 'testRouter3',
      component: () => import(/* webpackChunkName: "testRouter3" */ '@/views/test/TestRouter2'),
      meta: { title: '테스트 라우터 사용법3', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-checkbox',
      name: 'testCheckbox',
      component: () => import(/* webpackChunkName: "testCheckbox" */ '@/views/test/TestCheckbox'),
      meta: { title: '테스트 체크박스', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-class',
      name: 'testClass',
      component: () => import(/* webpackChunkName: "testClass" */ '@/views/test/TestClass'),
      meta: { title: '테스트 클래스', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-binding',
      name: 'testBinding',
      component: () => import(/* webpackChunkName: "testBinding" */ '@/views/test/TestBinding'),
      meta: { title: '테스트 데이터바인딩', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-pak',
      name: 'testPak',
      component: () => import(/* webpackChunkName: "testPak" */ '@/views/test/TestPak'),
      meta: { title: '테스트 박준배 개인테스트', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-han',
      name: 'testHan',
      component: () => import(/* webpackChunkName: "testHan" */ '@/views/test/TestHan'),
      meta: { title: '테스트 한규철 개인테스트', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-extend',
      name: 'testExtend',
      component: () => import(/* webpackChunkName: "testExtend" */ '@/views/test/TestExtend'),
      meta: { title: '테스트 유틸 extend 사용법', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-input2',
      name: 'testInput2',
      component: () => import(/* webpackChunkName: "testInput2" */ '@/views/test/TestInput2'),
      meta: { title: '테스트 인퓨트 사용', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-popup',
      name: 'testPopup',
      component: () => import(/* webpackChunkName: "testPopup" */ '@/views/test/TestPopup'),
      meta: { title: '테스트 팝업', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-password',
      name: 'testPassword',
      component: () => import(/* webpackChunkName: "testPassword" */ '@/views/test/TestPassword'),
      meta: { title: '테스트 패스워드', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-input-phone',
      name: 'testInputPhone',
      component: () => import(/* webpackChunkName: "testInputPhone" */ '@/views/test/TestPhoneInput'),
      meta: { title: '테스트 input phone', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-quantity-input',
      name: 'testQuantityInput',
      component: () => import(/* webpackChunkName: "testQuantityInput" */ '@/views/test/TestQuantityInput'),
      meta: { title: '테스트 quantity input', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-search-address',
      name: 'testSearchAddress',
      component: () => import(/* webpackChunkName: "testSearchAddress" */ '@/views/test/TestSearchAddress'),
      meta: { title: '테스트 주소찾기', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-img-lazy-load',
      name: 'testImgLazyLoad',
      component: () => import(/* webpackChunkName: "testImgLazyLoad" */ '@/views/test/TestImgLazyLoad'),
      meta: { title: '테스트 이미지 레이지 로딩', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-infinite-scroll',
      name: 'testInfiniteScroll',
      component: () => import(/* webpackChunkName: "testInfiniteScroll" */ '@/views/test/TestInfiniteScroll'),
      meta: { title: '테스트 무한 스크롤', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-iframe-main',
      name: 'testIframeMain',
      component: () => import(/* webpackChunkName: "testIframeMain" */ '@/views/test/TestIframeMain'),
      meta: { title: '테스트 iframe Main', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-iframe-return',
      name: 'testIframeReturn',
      component: () => import(/* webpackChunkName: "testIframeReturn" */ '@/views/test/TestIframeRetrun'),
      meta: { title: '테스트 iframe Retrun', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-intersection-observer',
      name: 'testIntersectionObserver',
      component: () => import(/* webpackChunkName: "testIntersectionObserver" */ '@/views/test/TestIntersectionObserver'),
      meta: { title: '테스트 무한스크롤(intersection observer)', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-intersection-observer2',
      name: 'testIntersectionObserver2',
      component: () => import(/* webpackChunkName: "testIntersectionObserver2" */ '@/views/test/TestIntersectionObserver2'),
      meta: { title: '테스트 뷰포트 체크(intersection observer)', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-picker',
      name: 'testPicker',
      component: () => import(/* webpackChunkName: "testPicker" */ '@/views/test/TestPicker'),
      meta: { title: '테스트 달력', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-naver-captcha',
      name: 'testNaverCaptcha',
      component: () => import(/* webpackChunkName: "testNaverCaptcha" */ '@/views/test/TestNaverCaptcha'),
      meta: { title: '네이버 캡차 테스트', depth: '아키텍처>테스트>네이버캡차' }
    },
    {
      path: 'test-sitemap-visualization',
      name: 'testSitemapVisualization',
      component: () => import(/* webpackChunkName: "testSitemapVisualization" */ '@/views/test/TestSitemapVisualization'),
      meta: { title: '사이트 맵 시각화', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-url',
      name: 'testUrl',
      component: () => import(/* webpackChunkName: "testSitemapVisualization" */ '@/views/test/TestUrl'),
      meta: { title: '사이트 URL 목록', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-nhn-log',
      name: 'testNhnLog',
      component: () => import(/* webpackChunkName: "testNhnLog" */ '@/views/test/TestNhnLog'),
      meta: { title: 'NHN 유입 추적 스크립트', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-ga360-log',
      name: 'testGa360Log',
      component: () => import(/* webpackChunkName: "testGa360Log" */ '@/views/test/TestGa360Log'),
      meta: {
        title: 'GA 360',
        depth: '아키텍처>테스트>GA 360'
      }
    },
    {
      path: 'test-recobell-log',
      name: 'testRecobellLog',
      component: () => import(/* webpackChunkName: "testRecobellLog" */ '@/views/test/TestRecobellLog'),
      meta: { title: 'Recobell 테스트', depth: '아키텍처>테스트>Recobell' }
    },
    {
      path: 'test-common-log',
      name: 'testCommonLog',
      component: () => import(/* webpackChunkName: "testCommonLog" */ '@/views/test/TestCommonLog'),
      meta: { title: '공통 로깅 테스트', depth: '아키텍처>테스트>공통 로깅' }
    },
    {
      path: 'test-common-timer',
      name: 'testCommonTimer',
      component: () => import(/* webpackChunkName: "testCommonTimer" */ '@/views/test/TestCommonTimer'),
      meta: { title: '공용 타이머 테스트', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-aiqua-log',
      name: 'testAiquaLog',
      component: () => import(/* webpackChunkName: "testAiquaLog" */ '@/views/test/TestAiquaLog'),
      meta: { title: 'AIQUA 테스트', depth: '아키텍처>테스트>AIQUA' }
    },
    {
      path: 'test-video-player',
      name: 'testVideoPlayer',
      component: () => import(/* webpackChunkName: "testVideoPlayer" */ '@/views/test/TestVideoPlayer'),
      meta: { title: '비디오 플레이어 테스트' }
    },
    {
      path: 'test-airbridge-log',
      name: 'testAirbridgeLog',
      component: () => import(/* webpackChunkName: "testAirbridgeLog" */ '@/views/test/TestAirbridgeLog'),
      meta: { title: 'Airbridge 테스트', depth: '아키텍처>테스트>Airbridge' }
    },
    {
      path: 'test-naver-log',
      name: 'testNaverLog',
      component: () => import(/* webpackChunkName: "testNaverLog" */ '@/views/test/TestNaverLog'),
      meta: { title: '네이버 로그 테스트', depth: '아키텍처>테스트>Naver' }
    },
    {
      path: 'test-dtsi-log',
      name: 'testDtsiLog',
      component: () => import(/* webpackChunkName: "testDtsiLog" */ '@/views/test/TestDtsiLog'),
      meta: { title: 'DTSI 로그 테스트', depth: '아키텍처>테스트>DTSI' }
    },
    {
      path: 'test-sendHsmoa-log',
      name: 'testsendHsmoaLog',
      component: () => import(/* webpackChunkName: "testsendHsmoaLog" */ '@/views/test/TestsendHsmoaLog'),
      meta: { title: '홈쇼핑 모아 로그 테스트', depth: '테스트>sendHsmoa' }
    },
    {
      path: 'test-fbpixel-log',
      name: 'testFbpixelLog',
      component: () => import(/* webpackChunkName: "testFbpixelLog" */ '@/views/test/TestFbpixelLog'),
      meta: { title: '페이스북 픽셀 로그 테스트', depth: '아키텍처>테스트>페이스북픽셀' }
    },
    {
      path: 'test-app2web-log',
      name: 'testApp2WebLog',
      component: () => import(/* webpackChunkName: "testApp2WebLog" */ '@/views/test/TestApp2WebLog'),
      meta: { title: 'APP --> WEB 로그 테스트', depth: '아키텍처>테스트>APP2WEB' }
    },
    {
      path: 'test-winwheel',
      name: 'testWinwheel',
      component: () => import(/* webpackChunkName: "testWinwheel" */ '@/views/test/TestWinwheel'),
      meta: { title: 'Winwheel 테스트' }
    },
    {
      path: 'test-deeplink',
      name: 'testDeeplink',
      component: () => import(/* webpackChunkName: "testWinwheel" */ '@/views/test/TestDeepLink'),
      meta: { title: '딥링크 테스트' }
    }
  ]
}

const testLink2 = {
  path: '/test',
  children: [ // 자식 페이지가 있을때 사용 설정은 위와 같다. 자식 페이지가 있을 경우 무조건 레이아웃 컴포넌트 정의 필요
    {
      path: 'test-another-layout',
      name: 'testAnotherLayout',
      component: () => import(/* webpackChunkName: "testAnotherLayout" */ '@/views/test/TestMain'),
      meta: { title: '테스트 개별 레이아웃', layout: 'LayoutLnb', depth: '아키텍처>테스트>테스트프로젝트' }
    },
    {
      path: 'test-wish',
      name: 'testWish',
      component: () => import(/* webpackChunkName: "testWish" */ '@/views/test/testWish'),
      meta: { title: '찜하기/찜취소', depth: '아키텍처>테스트>테스트프로젝트' }
    }
  ]
}

export { testLink2 }
export default testLink
