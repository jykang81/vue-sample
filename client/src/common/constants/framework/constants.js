import {
  isOsApp
} from '@utils/commonutil/commonUtil'

// TODO : AS-IS 에 정의돼있던 상수이며 사용하는 상수만 주석 해제하여 사용 합니다.
const COMM_CONST = {
  /**
   * Push에서 들어왔을 때 캠페인 ID 셋팅
   *
   * @param {String} campaignId (필수) 캠페인 ID
   */
  setCampaignId: campaignId => {
    COMM_CONST.DEFAULT_PARAMS.campaignId = campaignId
  },
  /**
   * 캠페인 ID 조회
   *
   * @returns {String} 캠페인 ID
   */
  getCampaignId: () => COMM_CONST.DEFAULT_PARAMS.campaignId,
  /**
   * 제휴사 싸이트로 부터 유입되었을 경우, 외부유입경로 설정
   *
   * @param {String} coCd
   */
  setCocd: coCd => {
    COMM_CONST.DEFAULT_PARAMS.coCd = coCd
  },
  /**
   * 외부유입경로 조회
   *
   * @returns {String} 외부유입경로 코드
   */
  getCocd: () => {
    if (COMM_CONST.DEFAULT_PARAMS.coCd === '110' || COMM_CONST.DEFAULT_PARAMS.coCd === '50000') {
      var defaultCocd = COMM_CONST.getWebAppDefaultCocd(isOsApp())
      if (COMM_CONST.DEFAULT_PARAMS.coCd !== defaultCocd) {
        COMM_CONST.setCocd(defaultCocd)
      }
    }

    return COMM_CONST.DEFAULT_PARAMS.coCd
  },

  /**
   * 기본 카탈로그 ID
   *
   * @returns {string} 기본 카탈로그 ID
   */
  getDefaultCatalogId: () => {
    return COMM_CONST.DEFAULT_PARAMS.catalogId.base
  },

  getAcceptPath: () => {
    return isOsApp() ? 501 : 500
  },

  /**
   * 웹/앱 기본 외부유입경로 코드 조회
   *
   * @param {Boolean|String} isApp 사용자 환경 구분 값. 두 가지 타입. true/false 또는 android/ios 등의 문자열
   * @returns {String} 기본 외부유입경로 코드
   */
  getWebAppDefaultCocd: isApp => {
    if (undefined === isApp || isApp === null) {
      return ''
    } else if (typeof (isApp) === 'boolean') {
      if (isApp) {
        return COMM_CONST.DEFAULT_PARAMS.appCocd
      } else {
        return COMM_CONST.DEFAULT_PARAMS.webCocd
      }
    } else if (typeof (isApp) === 'string') {
      if (isApp === '') {
        return ''
      } else {
        if (isApp === 'android' || isApp === 'ios') {
          return COMM_CONST.DEFAULT_PARAMS.appCocd
        } else {
          return COMM_CONST.DEFAULT_PARAMS.webCocd
        }
      }
    }

    return ''
  },

  // NSMALL에서 사용하는 기본 store id 및 language id, catalog Id
  DEFAULT_PARAMS: {
    storeId: 13001,
    langId: -9,
    catalogId: {
      base: 97001,
      mobile: 11111,
      tv: 18151,
      sbook: 18651,
      departmentstore: 23651,
      editStore: 72001, // 편집매장 카달로그 ID
      happydeal: 78501
    },
    busChnId: 'INT',
    coCd: '110', // default value. 외부유입경로.
    webCocd: '110',
    appCocd: '50000',
    campaignId: null,

    receipt: {
      midx: 'navi_15',
      channel: 'mobile',
      tasknm: 'NSIssueReceiptInfo'
    },

    receiptApply: {
      tasknm: 'alejandro',
      cnm: 'com.ns.commerce.nsmypage.service.WebServiceClient',
      mnm: 'registCashReceipt'
    },

    receiptConfirm: {
      selfDealDateStr: '결제 후 48시간 후 확인가능',
      homeTax: 'https://www.hometax.go.kr/'
    }
  },

  // 로컬 스토리지 키
  STORAGE_KEY: {
    SEARCH_WORD_LIST: 'latelySearchWord', // 최근검색어
    EVENT_POPUP_LOGIN: 'eventPopupLogin', // 이벤트 팝업(로그인시)
    EVENT_POPUP_REGIST: 'eventPopupRegist', // 이벤트 팝업(회원가입시)
    EVENT_POPUP_MAIN: 'eventPopupMain', // 이벤트 팝업(메인화면시)
    EVENT_POPUP_DETAIL: 'eventPopupProductDetail', // 이벤트 팝업(상품상세시)
    EVENT_POPUP_EXHABIT: 'eventPopupExhabition', // 이벤트 팝업(기획전)
    JOIN_TIME: 'jointime', // jihee : 회원가입한 시간(adbrix)
    LNB_LCATEID: 'lnbLcateId', // LNB 쇼핑카테고리
    USER_VISIT_HIS: 'userVistHistory', // 유저 히스토리 데이터
    RVP_VISIT: 'recentlyViewedProductsVisited',
    UUID: 'uuid', // 세션 ID
    APP_RELOAD_CNT: 'appReloadCnt', // 세션 ID
    STORAGE_RESET_REQUIRED: 'storageResetRequired' // 스토리지 갱신 필요 여부
  },
  // 세션 스토리지 키
  SESSION_STORAGE_KEY: {
    MAIN_EVENT_POPUP_DISPLAY: 'MAIN_EVENT_POPUP_DISPLAY',
    ATTRACT_APP_DOWN_BANNER: 'ATTRACT_APP_DOWN_BANNER'
  },
  LOGON_TYPE: {
    NORMAL: 'normal',
    SIMPLE: 'simple',
    TWITTER: 'twitter',
    FACEBOOK: 'facebook',
    NONMEMBER: 'nonmember'
  },
  KEY_CODE: {
    BACK_SPACE: 8,
    LEFT: 37,
    RIGHT: 39,
    DELETE: 46,
    NUM_0: 48,
    NUM_9: 57
  },
  RECEIPT_BUTTON_TEXT: {
    APPLY: '신청하기',
    COMPLETE: '신청완료',
    IMPOSSIBLE: '신청불가',
    CHECK_NUM: '승인번호확인'
  },
  CONFIRM_MESSAGES: {
    PRODUCT_ROW_REMOVE: '선택하신 상품을 삭제하시겠습니까?',
    PRODUCT_ALL_REMOVE: '전체상품을 삭제하시겠습니까?'
  },
  TOAST_MESSAGES: {
    CART_ADD_SUCCESS: '장바구니에 상품이 담겼습니다.',
    CART_ADD_OPTION: '이 상품은 옵션이 있는 상품입니다.\n옵션을 선택해 주세요.'
  },
  // 외부 유입 경로가 기본값이 아닌 케이스.
  BANNER_HIDE_COCD: [
    '580',
    '479',
    '170',
    '481',
    '513',
    '511',
    '514',
    '522',
    '536',
    '476',
    '483',
    '477',
    '475',
    '508',
    '125',
    '130',
    '133',
    '134',
    '497',
    '850'
  ]
}

export default COMM_CONST
