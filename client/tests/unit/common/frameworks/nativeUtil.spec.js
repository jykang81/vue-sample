import nativeUtil from '@frameworks/nativeUtil'
import cookieUtil from '@frameworks/cookieUtil'
import NATIVE_CONST from '@constants/framework/native'
import TEMP_M_INPUTPARAMS from '@unit/common/frameworks/mock/m_inputParamsTest'
import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
// import { assert } from 'chai'

describe('nativeUtil Native 브리지 함수 테스트', function () {
  before(function () {
    // console.log('블록 범위 내 모든 테스트 전에 실행')
    window.NSHub = {
      naGoHome () {
        console.log('call native naGoHome')
      },
      naBack () {
        console.log('call native naBack')
      },
      naCloseWebView () {
        console.log('call native naCloseWebView')
      },
      naPresentLogin (url) {
        console.log('call native naPresentLogin')
      },
      naSetLoginMemberInfo (memberInfo) {
        console.log('call native naSetLoginMemberInfo')
      },
      naLogOut () {
        console.log('call native naLogOut')
      },
      naGotoFullURL () {
        console.log('call native naGotoFullURL')
      },
      naReplaceURL () {
        console.log('call native naReplaceURL')
      },
      naLnbHide () {
        console.log('call native naLnbHide')
      },
      naShowToast (msg) {
        console.log('call native naShowToast')
      },
      naGoOrderSheet (url, jsonString) {
        console.log('call native naGoOrderSheet')
      },
      naGetOrderParams (url, jsonString) {
        // 쿠키 설정
        cookieUtil.setCookie(NATIVE_CONST.STORAGE_KEY.ORDER_PARAMS, JSON.stringify(tempMInputParams))
        console.log('call native naGoOrderSheet')
      },
      naGoOrderConsult (url, jsonString) {
        console.log('call native naGoOrderConsult')
      },
      naGetPushUUID () {
        console.log('call native naGetPushUUID')
      },
      naGetAppVersion () {
        console.log('call native naGetAppVersion')
      },
      naGetOSVersion () {
        console.log('call native naGetOSVersion')
      },
      naDoAppleLogin () {
        console.log('call native naDoAppleLogin')
      },
      naOpenConfigWindow () {
        console.log('call native naOpenConfigWindow')
      },
      naOpenPushHistoryWindow () {
        console.log('call native naOpenPushHistoryWindow')
      },
      naRefreshAll () {
        console.log('call native naRefreshAll')
      },
      naGoHappyDealHome () {
        console.log('call native naGoHappyDealHome')
      },
      naGoScheduleHome () {
        console.log('call native naGoScheduleHome')
      },
      naGoTVShoppingHome () {
        console.log('call native naGoTVShoppingHome')
      },
      naGoShopPlusHome () {
        console.log('call native naGoShopPlusHome')
      },
      naGoESpotHome (contentsId) {
        console.log('call native naGoShopPlusHome')
      },
      naGoBenefitCouponHome () {
        console.log('call native naGoShopPlusHome')
      },
      naIsAppFirstLogin (callbackName) {
        console.log('call native naIsAppFirstLogin')
      },
      naIsWifiConnected (callbackName) {
        console.log('call native naIsWifiConnected')
      },
      naRequestCredentials (jsonString, callbackName) {
        console.log('call native naRequestCredentials')
      },
      naSaveCredential (id, pw) {
        console.log('call native naSaveCredential')
      },
      naSaveCredentialExcep (id, pw) {
        console.log('call native naSaveCredentialExcep')
      },
      naLoadHint (callbackName) {
        console.log('call native naLoadHint')
      },
      naStopCredential () {
        console.log('call native naStopCredential')
      },
      naDeleteCredential () {
        console.log('call native naDeleteCredential')
      },
      naOpenEnomixTalk (loadURL, customerId) {
        console.log('call native naOpenEnomixTalk')
      },
      naPaycoLogin (action, callbackFunction, params) {
        console.log('call native naPaycoLogin')
      },
      naKakaoLogin (action, callbackFunction, params) {
        console.log('call native naKakaoLogin')
      },
      naDoShareLink (jsonString) {
        console.log('call native doShareLink')
      },
      naSetRecentViewedProducts (jsonString) {
        console.log('call native naSetRecentViewedProducts')
      },
      naSetBackBtnYn (backBtnYn) {
        console.log('call native naSetBackBtnYn')
      },
      naSetBottomNaviYn (bottomNaviYn) {
        console.log('call native naSetBottomNaviYn')
      },
      naShowAlert (params, callbackFunction) {
        console.log('call native naShowAlert')
      },
      naSetCartCnt (jsonString) {
        console.log('call native naSetCartCnt')
      },
      naSetAddCartResult (resultYn) {
        console.log('call native naSetAddCartResult')
      },
      naSetRoutePath (routePath) {
        console.log('call native naSetRoutePath')
      },
      naOpenCert (url, callbackSuccess, callbackFail) {
        console.log('call native naOpenCert')
      },
      naGetShoppingAlarmCount (callbackFunc) {
        console.log('call native naGetShoppingAlarmCount')
      },
      naGetPushAgreeYn (jsonString, callbackFunc) {
        console.log('call native naGetPushAgreeYn')
      },
      naGotoWebBrowser (url) {
        console.log('call native naGotoWebBrowser')
      },
      naLoadCompleted (dimYn) {
        console.log('call native naLoadCompleted')
      },
      gotoDeepLinkUrl (url) {
        console.log('call native naLoadCompleted')
      }
    }
  })

  after(function () {
    // console.log('블록 범위 내 모든 테스트 후에 실행')
    window.NSHub = undefined
  })

  it('Home 이동', function () {
    nativeUtil.goHome()
  })

  it('back 이동', function () {
    nativeUtil.goBack()
  })

  it('웹뷰 닫기', function () {
    nativeUtil.closeWebView()
  })

  it('presentLogin 로그인페이지 이동', function () {
    nativeUtil.presentLogin()
  })

  it('setLoginMemberInfo 로그인 후 회원정보 전달', function () {
    const userInfo = {
      userId: 111103108,
      userName: '강진영',
      entFlag: 'Y'
    }
    nativeUtil.setLoginMemberInfo(userInfo)
  })

  it('logOut 로그아웃 호출', function () {
    nativeUtil.logOut()
  })

  it('gotoURL URL 이동', function () {
    const url = NATIVE_CONST.NATIVE_URL.LOGIN
    nativeUtil.gotoURL(url)
  })

  it('gotoFullURL 지정된 URL로 이동(공통웹뷰)', function () {
    const url = ''
    nativeUtil.gotoFullURL(url)
  })

  it('lnbHide 사이드 메뉴 감추기', function () {
    nativeUtil.lnbHide()
  })

  it('showToast 토스트 메시지', function () {
    const msg = '로그아웃 되었습니다.'
    nativeUtil.showToast(msg)
  })

  it('gotoOrderSheet 주문화면으로 이동', function () {
    const jsonString = TEMP_M_INPUTPARAMS
    nativeUtil.gotoOrderSheet(jsonString)
  })

  it('getOrderParams 주문정보 파람 받기', function () {
    /*
    const actual = JSON.stringify(nativeUtil.getOrderParams())
    const expected = JSON.stringify(tempMInputParams)
    assert.equal(actual, expected)
    */
  })

  it('gotoOrderConsult 상담주문화면으로 이동', function () {
    nativeUtil.gotoOrderConsult()
  })

  it('gotoSearch 검색화면으로 이동', function () {
    nativeUtil.gotoSearch()
  })

  it('gotoCartList 장바구니화면으로 이동', function () {
    nativeUtil.gotoCartList()
  })

  it('getPushUUID 푸시 UUID 수신', function () {
    const callbackName = 'callbackPushUUID'
    nativeUtil.getPushUUID(callbackName)
  })

  it('getAppVersion App 버전 구하기', function () {
    nativeUtil.getAppVersion()
  })

  it('getOSVersion OS 버전 구하기', function () {
    nativeUtil.getOSVersion()
  })

  it('doAppleLogin App 로그인 하기', function () {
    nativeUtil.doAppleLogin()
  })

  it('openConfigWindow 설정창 오픈', function () {
    nativeUtil.openConfigWindow()
  })

  it('openPushHistoryWindow 쇼핑 알림창 오픈', function () {
    nativeUtil.openPushHistoryWindow()
  })

  it('refreshAll 전체 웹뷰 닫기', function () {
    nativeUtil.refreshAll()
  })

  it('goHappyDealHome 해피딜 홈으로 이동', function () {
    nativeUtil.goHappyDealHome()
  })

  it('goScheduleHome 편성표 홈으로 이동', function () {
    nativeUtil.goScheduleHome()
  })

  it('goTVShoppingHome TV쇼핑 홈으로 이동', function () {
    nativeUtil.goTVShoppingHome()
  })

  it('goShopPlusHome SHOP+ 홈으로 이동', function () {
    nativeUtil.goShopPlusHome()
  })

  it('goESpotHome 편성매장 홈으로 이동', function () {
    const contentsId = '12345678'
    nativeUtil.goESpotHome(contentsId)
  })

  it('goBenefitCouponHome 혜택쿠폰 홈으로 이동', function () {
    nativeUtil.goBenefitCouponHome()
  })

  it('isAppFirstLogin 최초 호출시 Y리턴 그 외는 N 값리턴(APP 실행시 자동 로그인 체크)', function () {
    const callbackName = 'callbackAppFirstLogin'
    nativeUtil.isAppFirstLogin(callbackName)
  })

  it('isWifiConnected wifi 연결상태 확인', function () {
    const callbackName = 'callbackWifiConnected'
    nativeUtil.isWifiConnected(callbackName)
  })

  it('requestCredentials 구글 스마트락에 사용자 정보 요청', function () {
    const callbackName = 'callbackWifiConnected'
    const jsonString = {}
    nativeUtil.requestCredentials(jsonString, callbackName)
  })

  it('saveCredential 구글 스마트락에 사용자 정보 요청', function () {
    const id = ''
    const pw = ''
    nativeUtil.saveCredential(id, pw)
  })

  it('saveCredentialExcep 구글 스마트락에 사용자 정보 요청2', function () {
    const id = ''
    const pw = ''
    nativeUtil.saveCredentialExcep(id, pw)
  })

  it('loadHint wifi 연결상태 확인', function () {
    const callbackName = 'callbackLoadHint'
    nativeUtil.loadHint(callbackName)
  })

  it('stopCredential 사용자 정보 요청 중단', function () {
    nativeUtil.stopCredential()
  })

  it('deleteCredential 구글 스마트락 사용자 정보 삭제', function () {
    nativeUtil.deleteCredential()
  })

  it('openEnomixTalk 스펙트라 상담톡 호출', function () {
    const loadURL = ''
    const customerId = ''
    nativeUtil.openEnomixTalk(loadURL, customerId)
  })

  it('doPaycoLogin 페이코 로그인', function () {
    const action = ''
    const callbackFunction = ''
    const params = ''
    nativeUtil.doPaycoLogin(action, callbackFunction, params)
  })

  it('doKakaoLogin 카카오 로그인', function () {
    const action = ''
    const callbackFunction = ''
    const params = ''
    nativeUtil.doKakaoLogin(action, callbackFunction, params)
  })
})
