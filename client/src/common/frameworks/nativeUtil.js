import NATIVE_CONST from '@/common/constants/framework/native'
import cookieUtil from '@frameworks/cookieUtil'
import {
  isNull,
  viewType
} from '@utils/commonutil/commonUtil'

const nativeUtil = {
  /**
   * Home으로 이동
    */
  goHome () {
    if (window.NSHub !== undefined) {
      // Home으로 이동
      try {
        window.NSHub.naGoHome()
      } catch (e) {
      }
    }
  },
  /**
   * Back으로 이동
   */
  goBack () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naBack()
      } catch (e) {
      }
    }
  },
  /**
   * 웹뷰 닫기
   */
  closeWebView () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naCloseWebView()
      } catch (e) {
      }
    }
  },
  /**
   * 로그인페이지 이동
   */
  presentLogin () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naPresentLogin(NATIVE_CONST.NATIVE_URL.LOGIN)
      } catch (e) {
      }
    }
  },
  /**
   * 로그인 후 회원정보 전달
   * @param {Object} memberInfo 회원정보
   */
  setLoginMemberInfo (memberInfo) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetLoginMemberInfo(memberInfo)
      } catch (e) {
      }
    }
  },
  /**
   * 로그아웃
   * @param {String} targetUrl 이동할 url정보
   */
  logOut (targetUrl) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naLogOut(targetUrl)
      } catch (e) {
      }
    }
  },
  /**
   * URL 이동
   * @param {String} url 이동할 URL
   */
  gotoURL (url) {
    if (window.NSHub !== undefined) {
      const APP_MOBILE_HOST = process.env.VUE_APP_MOBILE_HOST
      if (url.indexOf('nsmall.com') > 0) {
        try {
          window.NSHub.naPresentLogin(url)
        } catch (e) {
        }
      } else {
        try {
          window.NSHub.naPresentLogin(APP_MOBILE_HOST + url)
        } catch (e) {
        }
      }
    }
  },
  /**
   * 지정된 URL로 이동(공통웹뷰)
   * @param {String} url full URL
   */
  gotoFullURL (url) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGotoFullURL(url)
      } catch (e) {
      }
    }
  },
  /**
   * Side메뉴 감추기
   */
  lnbHide () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naLnbHide()
      } catch (e) {
      }
    }
  },
  /**
   * 토스트 메시지
   * @param {String} msg 메시지
   */
  showToast (msg) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naShowToast(msg)
      } catch (e) {
      }
    }
  },
  /**
   * 주문화면으로 이동
   * @param {String} jsonString 주문정보 JSON 스트링
   */
  gotoOrderSheet (jsonString) {
    if (window.NSHub !== undefined) {
      cookieUtil.setCookie(NATIVE_CONST.STORAGE_KEY.ORDER_PARAMS, jsonString)
      try {
        window.NSHub.naGoOrderSheet(NATIVE_CONST.NATIVE_URL.ORDER_SHEET, jsonString)
      } catch (e) {
      }
    }
  },
  /**
   * 주문정보 가져오기
   * @return {Object} 주문정보 JSON Object
   */
  getOrderParams () {
    if (window.NSHub !== undefined) {
      const strOrderParams = cookieUtil.getCookie(NATIVE_CONST.STORAGE_KEY.ORDER_PARAMS)
      if (!isNull(strOrderParams)) {
        const orderParams = JSON.parse(strOrderParams)
        cookieUtil.deleteCookie(NATIVE_CONST.STORAGE_KEY.ORDER_PARAMS)
        return orderParams
      }
      return {}
    }
  },
  /**
   * 상담주문화면으로 이동
   * @param {String} jsonString 주문정보 JSON 스트링
   */
  gotoOrderConsult (jsonString) {
    if (window.NSHub !== undefined) {
      cookieUtil.setCookie(NATIVE_CONST.STORAGE_KEY.ORDER_PARAMS, jsonString)
      try {
        window.NSHub.naGoOrderConsult(NATIVE_CONST.NATIVE_URL.ORDER_CONSULT, jsonString)
      } catch (e) {
      }
    }
  },
  /**
   * 검색화면으로 이동
   */
  gotoSearch () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naPresentLogin(NATIVE_CONST.NATIVE_URL.SEARCH)
      } catch (e) {
      }
    }
  },
  /**
   * 장바구니로 이동
   */
  gotoCartList () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naPresentLogin(NATIVE_CONST.NATIVE_URL.CART_LIST)
      } catch (e) {
      }
    }
  },
  /**
   * App 버전 구하기
   * @return {String} appVersion 앱버전
   * @param {String} callbackFunction 콜백함수명
   */
  getAppVersion (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGetAppVersion(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * OS 버전 구하기
   * @param {String} callbackFunction 콜백함수명
   */
  getOSVersion (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGetOSVersion(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * apple로그인 수행
   * @param {String} callbackFunction 콜백함수명
   */
  doAppleLogin (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naDoAppleLogin(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 설정창 오픈
   */
  openConfigWindow () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naOpenConfigWindow()
      } catch (e) {
      }
    }
  },
  /**
   * 쇼핑 알림창 오픈
   */
  openPushHistoryWindow () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naOpenPushHistoryWindow()
      } catch (e) {
      }
    }
  },
  /**
   * Web View All Refresh
   */
  refreshAll () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naRefreshAll()
      } catch (e) {
      }
    }
  },
  /**
   * 해피딜 홈으로 이동
   */
  goHappyDealHome () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGoHappyDealHome()
      } catch (e) {
      }
    }
  },
  /**
   * 편성표 홈으로 이동
   * @param {String} jsonString 파라미터
   */
  goScheduleHome (jsonString) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGoScheduleHome(jsonString)
      } catch (e) {
      }
    }
  },
  /**
   * TV쇼핑 홈으로 이동
   */
  goTVShoppingHome () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGoTVShoppingHome()
      } catch (e) {
      }
    }
  },
  /**
   * SHOP+ 홈으로 이동
   */
  goShopPlusHome () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGoShopPlusHome()
      } catch (e) {
      }
    }
  },
  /**
   * 편성매장 홈으로 이동
   * @param {String} contentsId 매장 ID
   */
  goESpotHome (contentsId) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGoESpotHome(contentsId)
      } catch (e) {
      }
    }
  },
  /**
   * 혜택쿠폰 홈으로 이동
   */
  goBenefitCouponHome () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGoBenefitCouponHome()
      } catch (e) {
      }
    }
  },
  /**
   * 최초 호출시 'Y'리턴 그 외는 'N'리턴(APP 실행시 자동 로그인 체크)
   * @param {String} callbackFunction 콜백함수명
   */
  isAppFirstLogin (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naIsAppFirstLogin(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * wifi 연결상태 확인
   * @param {String} callbackFunction 콜백함수명
   */
  isWifiConnected (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naIsWifiConnected(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 구글 스마트락에 사용자 정보 요청
   * @param {String} jsonString 사용자 정보 JSON 스트링
   * @param {String} callbackFunction 콜백함수명
   */
  requestCredentials (jsonString, callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naRequestCredentials(jsonString, callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 구글 스마트락에 사용자 정보 저장
   * @param {String} id 로그인 ID
   * @param {String} pw 로그인 PW
   */
  saveCredential (id, pw) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSaveCredential(id, pw)
      } catch (e) {
      }
    }
  },
  /**
   * 구글 스마트락에 사용자 정보 저장 시도 2
   * @param {String} id 로그인 ID
   * @param {String} pw 로그인 PW
   */
  saveCredentialExcep (id, pw) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSaveCredentialExcep(id, pw)
      } catch (e) {
      }
    }
  },
  /**
   * 구글 스마트락에 저장된 사용자 아이디 가져옴
   * @param {String} callbackFunction 콜백함수명
   */
  loadHint (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naLoadHint(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 사용자 정보 요청 중단
   */
  stopCredential () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naStopCredential()
      } catch (e) {
      }
    }
  },
  /**
   * PUSH UUID get
   * @param {String} callbackFunction 콜백함수명
   */
  getPushUUID (callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGetPushUUID(callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 구글 스마트락 사용자 정보 삭제
   */
  deleteCredential () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naDeleteCredential()
      } catch (e) {
      }
    }
  },
  /**
   * 스펙트라 상담톡 호출
   * @param {String} loadURL 호출URL
   * @param {String} customerId 고객ID
   */
  openEnomixTalk (loadURL, customerId) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naOpenEnomixTalk(loadURL, customerId)
      } catch (e) {
      }
    }
  },
  /**
   * 네이버 로그인
   * @param {String} action 로그인, 로그아웃 구분
   * @param {String} callbackFunction 콜백함수명
   * @param {Object} params 파라미터
   */
  doNaverLogin (action, callbackFunction, params) {
    if (window.NSHub !== undefined) {
      try {
        if (viewType() === 'android') {
          try {
            window.NSHub.naNaverLogin(action, callbackFunction, params)
          } catch (e) {
          }
        } else {
          try {
            window.NSHub.naNaverLogin(action, callbackFunction)
          } catch (e) {
          }
        }
      } catch (e) {
      }
    }
  },
  /**
   * 페이코 로그인
   * @param {String} action 로그인, 로그아웃 구분
   * @param {String} callbackFunction 콜백함수명
   * @param {Object} params 파라미터
   */
  doPaycoLogin (action, callbackFunction, params) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naPaycoLogin(action, callbackFunction, params)
      } catch (e) {
      }
    }
  },
  /**
   * 카카오 로그인
   * @param {String} action 로그인, 로그아웃 구분
   * @param {String} callbackFunction 콜백함수명
   * @param {Object} params 파라미터
   */
  doKakaoLogin (action, callbackFunction, params) {
    if (window.NSHub !== undefined) {
      if (viewType() === 'android') {
        try {
          window.NSHub.naKakaoLogin(action, callbackFunction, params)
        } catch (e) {
        }
      } else {
        try {
          window.NSHub.naKakaoLogin(action, callbackFunction)
        } catch (e) {
        }
      }
    }
  },
  /**
   * 카카오톡 링크
   * @param {Object} jsonString 파라미터
   */
  doShareLink (jsonString) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naDoShareLink(jsonString)
      } catch (e) {
      }
    }
  },
  /**
   * 최근본 상품 리스트(14일) set
   * @param {String} jsonString 파라미터
   */
  setRecentViewedProducts (jsonString) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetRecentViewedProducts(jsonString)
      } catch (e) {
      }
    }
  },
  /**
   * 백버턴 유무 set
   * @param {String} backBtnYn 백버턴 유무 파라미터
   */
  setBackBtnYn (backBtnYn) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetBackBtnYn(backBtnYn)
      } catch (e) {
      }
    }
  },
  /**
   * 하단 메뉴 유무 set
   * @param {String} bottomNaviYn 하단 메뉴 유무 파라미터
   */
  setBottomNaviYn (bottomNaviYn) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetBottomNaviYn(bottomNaviYn)
      } catch (e) {
      }
    }
  },
  /**
   * confirm 질문 alert
   * @param {String} params 파라미터
   * @param {String} callbackFunction 콜백 함수
   */
  showAlert (params, callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naShowAlert(params, callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 장바구니 카운트 조회 set
   * @param {String} jsonString 파라미터 장바구니 카운트
   */
  setCartCnt (jsonString) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetCartCnt(jsonString)
      } catch (e) {
      }
    }
  },
  /**
   * 상품 장바구니 카운트 담기 결과
   * @param {String} resultYn 파라미터 장바구니 카운트
   */
  setAddCartResult (resultYn) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetAddCartResult(resultYn)
      } catch (e) {
      }
    }
  },
  /**
   * Native에서 체크를 위한 경로 set
   * @param {String}  routePath 경로 파라미터
   */
  setRoutePath (routePath) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetRoutePath(routePath)
      } catch (e) {
      }
    }
  },
  /**
   * 모바일 결제요청
   * @param {String}  url 경로 파라미터
   * @param {String} callbackSuccess 콜백 성공함수
   * @param {String} callbackFail 콜백 실패함수
   */
  openCert (url, callbackSuccess, callbackFail) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naOpenCert(url, callbackSuccess, callbackFail)
      } catch (e) {
      }
    }
  },
  /**
   * 쇼핑알람 카운트
   * @param {String} callbackFunc 콜백 실패함수
   */
  getShoppingAlarmCount (callbackFunc) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGetShoppingAlarmCount(callbackFunc)
      } catch (e) {
      }
    }
  },
  /**
   * 푸시 수신동의 여부
   * @param {String} jsonString 파라미터
   * @param {String} callbackFunc 콜백 함수
   */
  getPushAgreeYn (jsonString, callbackFunc) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGetPushAgreeYn(jsonString, callbackFunc)
      } catch (e) {
      }
    }
  },
  /**
   * URL 웹브라우져 오픈
   * @param {String} url 파라미터
   */
  gotoWebBrowser (url) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGotoWebBrowser(url)
      } catch (e) {
      }
    }
  },
  /**
   * 웹화면 로더 완료시 호출(상품구매옵션)
   * @param {String} dimYn 파라미터
   */
  loadCompleted (dimYn) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naLoadCompleted(dimYn)
      } catch (e) {
      }
    }
  },
  /**
   * 딥링크 URL 이동
   * @param {String} url 파라미터
   */
  gotoDeepLinkUrl (url) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGotoDeepLinkUrl(url)
      } catch (e) {
      }
    }
  },
  /**
   * 음성검색 보이게 호출 (웹 검색소스에 보이게 하기 위해 호출)
   */
  showVoiceSearch () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naShowVoiceSearch()
      } catch (e) {
      }
    }
  },
  /**
   * 광고성 수신동의(PUSH)
   * @param {String} 수신
   */
  setPushAgree (jsonString, callbackFunction) {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetPushAgree(jsonString, callbackFunction)
      } catch (e) {
      }
    }
  },
  /**
   * 앱업데이트
   */
  setAppUpdate () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naSetAppUpdate()
      } catch (e) {
      }
    }
  },
  /**
   * 앱 서버버전 구하기
   */
  getAppServerVersion () {
    if (window.NSHub !== undefined) {
      try {
        window.NSHub.naGetAppServerVersion()
      } catch (e) {
      }
    }
  }
}
export default nativeUtil
