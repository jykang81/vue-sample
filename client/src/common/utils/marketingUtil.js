
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import {
  isNull,
  isOsApp,
  viewType,
  replaceAll,
  gettingPushStateHandler
} from '@utils/commonutil/commonUtil'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import loginUtil from '@utils/loginUtil'
import externalUtil from '@utils/externalUtil'
import nativeMarketingUtil from '@frameworks/nativeMarketingUtil'

const marketingUtil = {
  /**
   * 마케팅 스크립트 로거
   */
  LOGGER: {
    NAVER: '1', // 네이버 프리미엄 로그
    RECOBELL: '2', // RECOBELL. RECOBELL --> EIGENE으로 이전 사용 중
    EIGENE: '2', // EIGENE
    DTSI: '3', // DTSI
    GA360: '4', // GA 360
    AIQUA: '5', // AIQUA
    HSMOA: '6', // 홈쇼핑 모아
    FBPIXEL: '7', // Facebook Pixel
    AIRBRIDGE: '8' // Airbridge
  },

  /**
   * 마케팅 스크립트 사용 여부
   */
  isMarketingScriptUse: true, // true: 사용, false: 미사용

  /**
   * viewType 구분
   */
  VIEW_TYPE_IOS: 'ios', // iOS 웹뷰
  VIEW_TYPE_ANDROID: 'android', // Android 웹뷰
  VIEW_TYPE_IOSWEB: 'iosweb', // iOS 모바일 웹
  VIEW_TYPE_ANDROIDWEB: 'androidweb', // Android 모바일 웹

  /**
   * 카테고리 정의
   */
  CATEGORY_ADD_LOGIN: 'add_login',
  CATEGORY_ADD_VIEWORDER: 'add_vieworder',
  CATEGORY_ADD_PURCHASE: 'add_purchase',
  CATEGORY_ADD_SUBORDER: 'add_suborder',
  CATEGORY_ADD_PRODUCTVIEW: 'add_productview',
  CATEGORY_ADD_CATEGORY: 'add_category',
  CATEGORY_ADD_SEARCH: 'add_search',
  CATEGORY_QUERY: 'query',
  CATEGORY_VIEW_CATEGORY: 'view_category',
  CATEGORY_VIEW_HOME: 'add_viewhome',
  CATEGORY_ADD_REFOUND: 'add_refound',
  CATEGORY_ADD_CART: 'add_addcart', // 화면에서는 전송하나 마케팅 스크립트단에서는 처리하지 않음

  /**
   * co_cd
   */
  WEB_CO_CD: '110',
  APP_CO_CD: '50000',

  /**
   * 도메인 유형 반환
   *
   * @returns {Object} 서버 정보
   */
  getHostType: () => {
    const hostname = window.location.hostname
    if (process.env.VUE_APP_ENV === 'local') {
      return {
        type: 'LOCAL', // 개발환경
        host: hostname
      }
    } else if (process.env.VUE_APP_ENV === 'dev') {
      return {
        type: 'DEV', // 개발환경
        host: hostname
      }
    } else if (process.env.VUE_APP_ENV === 'unit') {
      return {
        type: 'UNIT', // 테스트 환경
        host: hostname
      }
    } else if (process.env.VUE_APP_ENV === 'test') {
      return {
        type: 'TEST', // 테스트 환경
        host: hostname
      }
    } else if (process.env.VUE_APP_ENV === 'prod') {
      return {
        type: 'PROD', // 운영환경
        host: hostname
      }
    }
    return {
      type: 'UNKNOWN', // 모름
      host: ''
    }
  },

  /**
   * 브라우저 버전
   *
   * @returns {String} 브라우저 버전 정보
   */
  browserVersion: () => {
    let matchList = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
    if (/trident/i.test(matchList[1])) {
      const temp = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || []
      return `IE ${temp[1] || ''}`
    }
    if (matchList[1] === 'Chrome') {
      const temp = navigator.userAgent.match(/\b(OPR|Edge)\/(\d+)/)
      if (!isNull(temp)) {
        return temp.slice(1).join(' ').replace('OPR', 'Opera')
      }
    }
    matchList = matchList[2] ? [matchList[1], matchList[2]] : [navigator.appName, navigator.appVersion, '-?']
    const temp = navigator.userAgent.match(/version\/(\d+)/i)
    if (!isNull(temp)) {
      matchList.splice(1, 1, temp[1])
    }
    return matchList.join(' ')
  },

  /**
   * 키 존재 여부
   *
   * @return {boolean} 키 존재 여부
   */
  isKeyExisted: (obj, searchKey) => {
    if (Object.prototype.hasOwnProperty.call(obj, searchKey)) {
      return true
    }
    return false
  },

  /**
   * 네이버 프리미엄 로그
   */
  naverLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    NAVER_JS_PATH: '//wcs.naver.net/wcslog.js',

    /**
     * Account ID 값
     */
    ACCOUNT_ID: 's_2115fbeeef',

    /**
     * 로그 유형
     */
    TRACE_INFLOW: '1', // 유입 추적
    TRACE_TRANS: '2', // 전환 추적

    /**
     * 초기화
     *
     * @returns {void}
     */
    init: () => {
      if (!window.wcs_add) {
        window.wcs_add = {}
      }
      window.wcs_add.wa = marketingUtil.naverLogger.ACCOUNT_ID // Account ID 적용
    },

    /**
     * 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      if (typeof window.wcs === 'undefined') {
        marketingUtil.naverLogger.init()

        externalUtil.getScript(marketingUtil.naverLogger.NAVER_JS_PATH).then(() => {
          marketingUtil.naverLogger.makeAndSend(param)
        })
      } else {
        marketingUtil.naverLogger.makeAndSend(param)
      }
    },

    /**
     * 데이터 구성 및 전송 처리
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      if (param.type === marketingUtil.naverLogger.TRACE_INFLOW) { // 유입 추적
        window.wcs.inflow()
        window.wcs_do({})
      } else if (param.type === marketingUtil.naverLogger.TRACE_TRANS) { // 전환 추적
        window.wcs.inflow()
        window.wcs_do({
          cnv: window.wcs.cnv(param.data.strTranSoft, param.data.strTranValue)
        })
      } else {
        marketingUtil.log()('param.type unknown...')
      }
    }
  },

  /**
   * 홈쇼핑모아 로그
   */
  hsmoaLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    HSMOA_JS_PATH: '//hsmoa.com/media/buzzni_rt_direct.min.js',

    /**
   * 카테고리 정의
   */
    CATEGORY_LIST: 'list',
    CATEGORY_PRODUCT: 'product',
    CATEGORY_BASKET: 'basket',
    CATEGORY_PURCHASE: 'purchase',
    CATEGORY_QUERY: 'query',
    CATEGORY_BASKET_VIEW: 'basketview',

    /**
     * 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      if (typeof window.buzzni_rt === 'undefined') {
        externalUtil.getScript(marketingUtil.hsmoaLogger.HSMOA_JS_PATH).then(() => {
          /* 홈쇼핑모아 스크립트 호출 */
          const s = document.createElement('script')
          s.src = marketingUtil.hsmoaLogger.HSMOA_JS_PATH
          document.body.appendChild(s)

          marketingUtil.hsmoaLogger.makeAndSend(param)
        })
      } else {
        marketingUtil.hsmoaLogger.makeAndSend(param)
      }
    },

    /**
     * 데이터 구성 및 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      /**
       * 로그 공통 파라미터 선언
       */
      const accountId = '9'
      const site = 'mweb'
      const userId = ''
      const email = ''
      const fromHsmoa = param.data.co_cd === 580
      const action = param.data.action
      const category = param.data.category

      const hostType = marketingUtil.getHostType() // 호스트 정보

      // if (hostType.type === 'PROD') {
      //   try {
      //     if (category === marketingUtil.hsmoaLogger.CATEGORY_LIST) {
      //       window.buzzni_rt.sendList(accountId, site, userId, email, action, fromHsmoa) // 상품 목록 보기, 검색 상품 목록 보기 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_PRODUCT) {
      //       window.buzzni_rt.sendProduct(accountId, site, userId, email, action, fromHsmoa) // 상품 상세보기 페이지 보기 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_BASKET) {
      //       window.buzzni_rt.sendBasket(accountId, site, userId, email, action, fromHsmoa) // 상품 장바구니 담기 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_PURCHASE) {
      //       window.buzzni_rt.sendPurchase(accountId, site, userId, email, action, fromHsmoa) // 상품 구매 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_QUERY) {
      //       window.buzzni_rt.sendQuery(accountId, site, userId, email, action, fromHsmoa) // 사용자 검색 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_BASKET_VIEW) {
      //       window.buzzni_rt.sendBasketView(accountId, site, userId, email, action, fromHsmoa) // 장바구니 페이지 보기 이벤트
      //     }
      //   } catch (e) {
      //     marketingUtil.log()('buzzni_rt:', accountId, site, userId, email, action, fromHsmoa, category)
      //   }
      // } else {
      //   try {
      //     window.buzzni_rt.setDevelop()
      //     if (category === marketingUtil.hsmoaLogger.CATEGORY_LIST) {
      //       window.buzzni_rt.sendList(accountId, site, userId, email, action, fromHsmoa) // 상품 목록 보기, 검색 상품 목록 보기 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_PRODUCT) {
      //       window.buzzni_rt.sendProduct(accountId, site, userId, email, action, fromHsmoa) // 상품 상세보기 페이지 보기 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_BASKET) {
      //       window.buzzni_rt.sendBasket(accountId, site, userId, email, action, fromHsmoa) // 상품 장바구니 담기 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_PURCHASE) {
      //       window.buzzni_rt.sendPurchase(accountId, site, userId, email, action, fromHsmoa) // 상품 구매 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_QUERY) {
      //       window.buzzni_rt.sendQuery(accountId, site, userId, email, action, fromHsmoa) // 사용자 검색 이벤트
      //     } else if (category === marketingUtil.hsmoaLogger.CATEGORY_BASKET_VIEW) {
      //       window.buzzni_rt.sendBasketView(accountId, site, userId, email, action, fromHsmoa) // 장바구니 페이지 보기 이벤트
      //     }
      //   } catch (e) {
      //     marketingUtil.log()('buzzni_rt:', accountId, site, userId, email, action, fromHsmoa, category)
      //   }
      // }
      try {
        if (hostType.type !== 'PROD') {
          window.buzzni_rt.setDevelop()
        }
        if (category === marketingUtil.hsmoaLogger.CATEGORY_LIST) {
          window.buzzni_rt.sendList(accountId, site, userId, email, action, fromHsmoa) // 상품 목록 보기, 검색 상품 목록 보기 이벤트
        } else if (category === marketingUtil.hsmoaLogger.CATEGORY_PRODUCT) {
          window.buzzni_rt.sendProduct(accountId, site, userId, email, action, fromHsmoa) // 상품 상세보기 페이지 보기 이벤트
        } else if (category === marketingUtil.hsmoaLogger.CATEGORY_BASKET) {
          window.buzzni_rt.sendBasket(accountId, site, userId, email, action, fromHsmoa) // 상품 장바구니 담기 이벤트
        } else if (category === marketingUtil.hsmoaLogger.CATEGORY_PURCHASE) {
          window.buzzni_rt.sendPurchase(accountId, site, userId, email, action, fromHsmoa) // 상품 구매 이벤트
        } else if (category === marketingUtil.hsmoaLogger.CATEGORY_QUERY) {
          window.buzzni_rt.sendQuery(accountId, site, userId, email, action, fromHsmoa) // 사용자 검색 이벤트
        } else if (category === marketingUtil.hsmoaLogger.CATEGORY_BASKET_VIEW) {
          window.buzzni_rt.sendBasketView(accountId, site, userId, email, action, fromHsmoa) // 장바구니 페이지 보기 이벤트
        }
      } catch (e) {
        marketingUtil.log()('buzzni_rt:', accountId, site, userId, email, action, fromHsmoa, category)
      }
    }
  },

  /**
   * RecoBell 로그
   */
  recobellLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    RECOBELL_JS_PATH: '//logger.eigene.io/js/logger.min.js',

    /**
     * recobell 추천 cuid
     */
    RECOBELL_PROD_CUID: '513476ef-b9f9-45ab-af3b-52f3ee091c', // 운영cuid
    RECOBELL_DEV_CUID: '5a974769-49fd-4dcb-a097-f9bc572c9e58', // 개발cuid
    RECOBELL_TEST_CUID: 'e4a004ab-5206-4dd5-a9ae-65793e4fad32', // 테스트 cuid

    metaList: [],
    meta: {},
    cuid: '',

    /**
     * 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      if (typeof window.eglc === 'undefined') {
        /* recobell 스크립트 호출 */
        externalUtil.getScript(marketingUtil.recobellLogger.RECOBELL_JS_PATH).then(() => {
          window._eglconf = window._eglconf || {}
          window._eglconf.forceTrackVisit = true

          marketingUtil.recobellLogger.makeAndSend(param)
        })
      } else {
        marketingUtil.recobellLogger.makeAndSend(param)
      }
    },

    /**
     * 데이터 구성 및 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      const hostType = marketingUtil.getHostType() // 호스트 정보

      if (hostType.type === 'LOCAL') {
        marketingUtil.recobellLogger.cuid = marketingUtil.recobellLogger.RECOBELL_DEV_CUID
      } else if (hostType.type === 'DEV' || hostType.type === 'UNIT') {
        marketingUtil.recobellLogger.cuid = marketingUtil.recobellLogger.RECOBELL_DEV_CUID
      } else if (hostType.type === 'PROD') {
        marketingUtil.recobellLogger.cuid = marketingUtil.recobellLogger.RECOBELL_PROD_CUID
      } else if (hostType.type === 'TEST') {
        marketingUtil.recobellLogger.cuid = marketingUtil.recobellLogger.RECOBELL_TEST_CUID
      } else {
        marketingUtil.log()('Unknown Host Type...')
        return
      }

      window.eglc.clearData()
      marketingUtil.recobellLogger.metaList.forEach((item, index) => {
        item.remove()
      })
      marketingUtil.recobellLogger.metaList.splice(0, marketingUtil.recobellLogger.metaList.length)

      if (param.data.initFlag) {
        marketingUtil.recobellLogger.recobCommon() // 공통스크립트
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_PRODUCTVIEW) {
        marketingUtil.recobellLogger.recobProductview(param) // 상품상세
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_PURCHASE) {
        marketingUtil.recobellLogger.recobPurchase(param) // 결제완료
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_SEARCH) {
        marketingUtil.recobellLogger.recobSearch(param) // 검색 페이지
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_LOGIN) {
        marketingUtil.recobellLogger.recobLogin(param) // 로그인완료
      }
    },

    /**
     * 공통
     *
     * @returns {void}
     */
    recobCommon: () => {
      window.eglc.op('setVar', 'cuid', marketingUtil.recobellLogger.cuid)
      if (loginUtil.getUserInfo('custNum')) {
        window.eglc.op('setVar', 'userId', loginUtil.getUserInfo('custNum'))
      }
      // window.eglc.op('setVar', 'device', viewType()) // recobell --> eigene 없어지는 항목
      window.eglc.op('track', 'visit')
    },

    /**
     * 상품 보기
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    recobProductview: param => {
      const itemsInfo = param.data.action
      const params = {
        rcmdGbn: 'PRODUCT',
        rcmdValue: itemsInfo.id
      }

      nsaxios.post('NSRcmdCmd', params, function (data) {
        window.eglc.op('setVar', 'cuid', marketingUtil.recobellLogger.cuid)

        if (loginUtil.getUserInfo('custNum')) {
          window.eglc.op('setVar', 'userId', loginUtil.getUserInfo('custNum'))
        }
        window.eglc.op('setVar', 'itemId', itemsInfo.id)
        if (param.data.searchTerm) {
          window.op('setVar', 'searchTerm', param.data.searchTerm)
        }
        if (param.data.clickUrl) {
          window.eglc.op('setVar', 'rcCode', param.data.clickUrl)
        }
        // meta data 추가
        // 상품의 상세 페이지에서는 사용자의 상품 클릭 이력을 수집하는 view 로그와 상품 메타 정보인 product 로그를 수집한다.
        // 먼저 상품 메타 정보 수집을 위한 meta  태그를 삽입하여야 한다.
        // meta태그의 property는 변수의 이름을 의미, content에 적절한 값을 넣어야한다.
        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:type')
        marketingUtil.recobellLogger.meta.setAttribute('content', 'product')
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:cuid')
        marketingUtil.recobellLogger.meta.setAttribute('content', marketingUtil.recobellLogger.cuid) //  Client Unique Identifier
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:itemId')
        marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.itemId) //  상품ID
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:itemName')
        marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.itemName) //  상품명
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:originalPrice')
        marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.originalPrice) //  제품가격
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:salePrice')
        marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.salePrice) //  판매가격
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:category1')
        marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.category1) //  카테고리(대)
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
        marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
        marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:category2')
        marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.category2) //  카테고리(중)
        document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
        marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)

        if (data.msg.category3) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:category3')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.category3) //  카테고리(소)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.category4) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:category4')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.category4) //  카테고리(세)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.category5) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:category5')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.category5) //  카테고리(세세)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.newcategory1) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:newcategory1')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.newcategory1) //  추천분류
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.newcategory2) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:newcategory2')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.newcategory2) //  상품분류(대)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.newcategory3) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:newcategory3')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.newcategory3) //  상품분류(중)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.newcategory4) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:newcategory4')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.newcategory4) //  상품분류(소)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.newcategory5) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:newcategory5')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.newcategory5) //  상품분류(세)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.newcategory6) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:newcategory6')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.newcategory6) //  상품분류(세세)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.catalogue) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:catalogue')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.catalogue)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.brandId) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:brandId')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.brandId) // 브랜드 ID
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.brandName) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:brandName')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.brandName) // 브랜드명
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.regDate) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:regDate')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.regDate) // 상품등록일
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.regDate) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:updateDate')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.updateDate) // 상품갱신일
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.expireDate) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:expireDate')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.expireDate) // 상품만료일
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.tcomYn) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:tcomYn')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.tcomYn)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.tvYn) {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:tvYn')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.tvYn)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        if (data.msg.tcomYn === 'Y' || data.msg.tvYn === 'Y') {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:broad')
          marketingUtil.recobellLogger.meta.setAttribute('content', data.msg.broad)
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        } else {
          marketingUtil.recobellLogger.meta = document.createElement('meta') || {}
          marketingUtil.recobellLogger.meta.setAttribute('name', 'recobell')
          marketingUtil.recobellLogger.meta.setAttribute('property', 'eg:broad')
          marketingUtil.recobellLogger.meta.setAttribute('content', '')
          document.getElementsByTagName('head')[0].appendChild(marketingUtil.recobellLogger.meta)
          marketingUtil.recobellLogger.metaList.push(marketingUtil.recobellLogger.meta)
        }
        //  meta data 추가 끝

        // meta tag가 append 된 이후 send 이벤트 발생해야됨. 타이밍 문제가 발생할 수도 있으니 지연호출하자
        setTimeout(() => {
          window.eglc.op('track', 'view')
          window.eglc.op('track', 'product')
        }, 200)
      })
    },

    /**
     * 구매하기
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    recobPurchase: param => {
      const orderItems = param.data.action
      orderItems.forEach(function (item, index, array) {
        window.eglc.op('addVar', 'orderItems', {
          itemId: item.productId,
          price: item.price,
          quantity: item.quantity
        })
        // itemId : 구입한 상품ID (상품코드), 이때의 상품ID는 상품상세 페이지(view)에서 추적한 상품ID와 동일
        // price : 결제된 상품의 개당 가격
        // quantity : 결제된 상품의 수
      })

      window.eglc.op('setVar', 'cuid', marketingUtil.recobellLogger.cuid)
      if (loginUtil.getUserInfo('custNum')) {
        window.eglc.op('setVar', 'userId', loginUtil.getUserInfo('custNum'))
      }
      window.eglc.op('setVar', 'orderId', param.data.orderId)
      window.eglc.op('setVar', 'orderPrice', param.data.lastPrice)
      window.eglc.op('track', 'order')
    },

    /**
     * 검색결과
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    recobSearch: param => {
      window.eglc.op('setVar', 'cuid', marketingUtil.recobellLogger.cuid)
      if (loginUtil.getUserInfo('custNum')) {
        window.eglc.op('setVar', 'userId', marketingUtil.recobellLogger.cuid)
      }
      window.eglc.op('setVar', 'searchTerm', param.data.searchTerm) // searchTerm : 현재 검색 결과가 나타난 페이지의 검색어
      window.eglc.op('track', 'search')
    },

    /**
     * 로그인
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    recobLogin: param => {
      window.eglc.op('setVar', 'cuid', marketingUtil.recobellLogger.cuid)
      if (loginUtil.getUserInfo('custNum')) {
        window.eglc.op('setVar', 'userId', loginUtil.getUserInfo('custNum'))
      }
      window.eglc.op('track', 'user')
    }
  },

  /**
   * DTSI 로그
   */
  dtsiLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    DTSI_JS_PATH: '//track.d-light.kr/dlight.min.js',

    BRAND_ID: '3',

    /**
     * 초기화
     *
     * @returns {void}
     */
    init: () => {
      const commFunc = () => {
        if (!window.dlight.l) {
          window.dlight.l = true
        }
      }
      commFunc()
    },

    /**
     * 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      window.brand_id = marketingUtil.dtsiLogger.BRAND_ID // 값 설정

      if (typeof window.dlight === 'undefined') {
        externalUtil.getScript(marketingUtil.dtsiLogger.DTSI_JS_PATH).then(() => {
          marketingUtil.dtsiLogger.init()

          marketingUtil.dtsiLogger.makeAndSend(param)
        })
      } else {
        marketingUtil.dtsiLogger.makeAndSend(param)
      }
    },

    /**
     * 데이터 구성 및 전송 처리
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      if (param.data.initFlag) { //
        marketingUtil.dtsiLogger.init()
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_PURCHASE) { // 'add_purchase'. 구매완료인 경우
        const dlProductName = []
        let dlRevGross = 0
        if (!isNull(param.data.action)) {
          param.data.action.forEach((item, index) => {
            dlProductName.push(item.productName)
            dlRevGross += (item.price * item.quantity)
          })
        }

        window.dlight.sendConversion(
          11, // dl_conv_id
          isNull(param.data.lastPrice) ? 0 : param.data.lastPrice, // dl_rev_net
          dlRevGross, // dl_rev_gross
          param.data.orderId, // dl_tran_id
          dlProductName.join(';'), // dl_product_name
          '', // dl_etc1
          '', // dl_etc2
          '', // dl_etc3
          '', // dl_etc4
          isOsApp() ? 'APP' : 'WEB' // dl_etc5
        )
      } else if (!isNull(param.data.isSignUp) && param.data.isSignUp === true) { // 회원가입 완료인 경우
        window.dlight.sendConversion(
          12, // dl_conv_id
          0, // dl_rev_net
          0, // dl_rev_gross
          '', // dl_tran_id
          '', // dl_product_name
          '', // dl_etc1
          '', // dl_etc2
          '', // dl_etc3
          '', // dl_etc4
          '' // dl_etc5
        )
      }
    }
  },

  /**
   * GA 360 로그
   */
  ga360Logger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    GA360_JS_PATH: '//www.google-analytics.com/analytics.js',
    GA360_GTM_JS_PATH: '//www.googletagmanager.com/gtm.js',

    /**
     * 로그 유형
     */
    LOG_PAGE: '1', // 페이지
    LOG_EVENT: '2', // 이벤트
    LOG_ECOMMERCE: '3', // E-Commerce

    /**
     * 페이지 Path 정의
     */
    PAGE_MYPAGE: 'mypage',
    PAGE_CUSTOMER: 'customer',
    PAGE_MEMBER: 'member',
    PAGE_GUIDE: 'guide',

    /**
     * Hit Type
     */
    HIT_TYPE: {
      PAGE_VIEW: 'pageview',
      EVENT: 'event',
      ECOMMERCE: 'Ecommerce'
    },

    /**
     * 채널 구분
     */
    CHANNEL: {
      APP: 'APP',
      MOBILE_WEB: 'MOBILE_WEB'
    },

    /**
     * e-Commerce 단계
     */
    ECOMMERCE_STEP_01: '1',
    ECOMMERCE_STEP_02: '2',
    ECOMMERCE_STEP_03: '3',
    ECOMMERCE_STEP_04: '4',
    ECOMMERCE_STEP_05: '5',
    ECOMMERCE_STEP_06: '6',
    ECOMMERCE_STEP_07: '7',
    ECOMMERCE_STEP_08: '8',
    ECOMMERCE_STEP_09: '9',
    ECOMMERCE_STEP_10: '10',
    ECOMMERCE_STEP_11: '11',

    /**
     * 변수 정의
     */
    userAge: '', // 나이 구간
    initChannel: '', // 앱 여부. APP/MOBILE_WEB
    isLogin: '', // 로그인 여부
    userEmployeeType: '', // 직원 유형. NS/하림/일반회원/비로그인
    loginType: '',
    title: '',
    dimension2: '',
    tvYn: '',
    liveDataSave: [],
    purchaseCheck: '', // 결제완료 중복 전송 방지
    utm_s: '',
    utm_m: '',
    utm_ca: '',
    utm_co: '',
    utm_t: '',
    ga_re: '',
    ga_url: '',
    co_cd: '',

    /**
     * 변수 정의 - GoogleAnalyticsBuilder.js 관련
     *
     * @param {void}
     * @returns {Object} Query String
     */
    qs: () => {
      const params = window.location.search.substr(1).split('&')
      if (isNull(params)) {
        return {}
      }

      const paramObj = {}
      params.forEach((item, index) => {
        const p = item.split('=', 2)
        if (p.length === 1) {
          paramObj[p[0]] = ''
        } else {
          paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '))
        }
      })
      return paramObj
    },

    gaReferrer: '',
    gaCampaignSource: '',
    gaCampaignMedium: '',
    gaCampaignName: '',
    gaCampaignContent: '',
    gaCampaignKeyword: '',

    /**
     * 키 정의
     */
    GACustomKey: {},
    GAHitKey: {
      cid: 'clientId',
      title: 'title',
      userId: 'userId',
      url: 'location',
      eventCategory: 'eventCategory',
      eventAction: 'eventAction',
      eventLabel: 'eventLabel',
      eventValue: 'eventValue',
      nonInteraction: 'nonInteraction',
      campaignContent: 'campaignContent',
      campaignId: 'campaignId',
      campaignKeyword: 'campaignKeyword',
      campaignMedium: 'campaignMedium',
      campaignSource: 'campaignSource',
      campaignName: 'campaignName',
      currencyCode: 'currencyCode',
      referrer: 'referrer'
    },
    GAActionFieldKey: {
      transactionId: 'id',
      transactionRevenue: 'revenue',
      transactionTax: 'tax',
      transactionShipping: 'shipping',
      transactionCouponCode: 'coupon',
      transactionAffiliation: 'affiliation',
      productActionList: 'list',
      checkoutStep: 'step',
      checkoutOptions: 'option',
      promotionId: 'id',
      promotionName: 'name',
      promotionCreative: 'creative',
      promotionPosition: 'position'
    },
    GAEcommerceStepKey: {
      impression: 'impressions',
      detail: 'detail',
      click: 'click',
      add: 'add',
      remove: 'remove',
      checkout: 'checkout',
      purchase: 'purchase',
      refund: 'refund',
      promotionImpression: 'promoView',
      promotionClick: 'promoClick'
    },
    GAProductKey: {
      productID: 'id',
      productName: 'name',
      productBrand: 'brand',
      productCategory: 'category',
      productVariant: 'variant',
      productPrice: 'price',
      productQuantity: 'quantity',
      productCouponCode: 'coupon',
      productPosition: 'position',
      impressionList: 'list'
    },
    PROD_UA_CODE: 'UA-92946860-5', // NS 홈쇼핑 운영
    DEV_UA_CODE: 'UA-92946860-6', // NS 홈쇼핑 개발
    GTM_CODE: 'GTM-MHM5NWK', // GTM 코드
    uaCode: '', // 개발/운영에 따른 UA Code 값 저장

    customObject: {
      dimension: {},
      metric: {}
    },

    gaLoad: {
      GTM: false,
      GA: true,
      APP: false // 앱인지의 여부
    },
    browserInfo: navigator.userAgent,

    /**
     * 웹뷰의 User-Agent 값에 추가되는 부분.
     */
    ANDROID_WEBVIEW: 'GA_Android', // Android userAgent
    IOS_WEBVIEW_WK: 'GA_iOS_WK', // WKWebView userAgent
    IOS_WEBVIEW_UI: 'GA_iOS_UI',

    /**
     * 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      // 푸쉬 수신 여부 조회 후 전송
      const handlerOptions = {
        callback: stringParams => {
          marketingUtil.log()('pushStateHandler', stringParams)

          const paramObj = JSON.parse(stringParams)
          marketingUtil.log()('pushStateHandler', paramObj)

          if (typeof window.ga === 'undefined') { // GA360_JS_PATH 로딩 체크
            externalUtil.getScript(marketingUtil.ga360Logger.GA360_JS_PATH).then(() => {
              marketingUtil.ga360Logger.makeAndSend(paramObj)
            })
          } else {
            marketingUtil.ga360Logger.makeAndSend(paramObj)
          }
        },
        params: param,
        name: 'ga360MarketingScriptPushStatHandler'
      }
      if (isOsApp()) {
        param.pushState = ''
        gettingPushStateHandler(handlerOptions)
      } else {
        param.pushState = ''
        handlerOptions.callback(JSON.stringify(param))
      }
    },

    /**
     * 데이터 구성 및 전송 처리
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      marketingUtil.ga360Logger.init()

      const hostType = marketingUtil.getHostType() // 호스트 정보
      if (hostType.type === 'LOCAL') {
        marketingUtil.ga360Logger.uaCode = marketingUtil.ga360Logger.DEV_UA_CODE
      } else if (hostType.type === 'DEV' || hostType.type === 'UNIT') {
        marketingUtil.ga360Logger.uaCode = marketingUtil.ga360Logger.DEV_UA_CODE
      } else if (hostType.type === 'TEST') {
        marketingUtil.ga360Logger.uaCode = marketingUtil.ga360Logger.DEV_UA_CODE
      } else if (hostType.type === 'PROD') {
        marketingUtil.ga360Logger.uaCode = marketingUtil.ga360Logger.PROD_UA_CODE
      } else {
        marketingUtil.log()('Unknown Host Type...')
        return
      }

      if (param.type === marketingUtil.ga360Logger.LOG_PAGE) { // 페이지
        marketingUtil.ga360Logger.sendLog(param)
      } else if (param.type === marketingUtil.ga360Logger.LOG_EVENT) { // 이벤트
        marketingUtil.ga360Logger.sendEvent(param)
      } else if (param.type === marketingUtil.ga360Logger.LOG_ECOMMERCE) { // E-Commerce
        marketingUtil.ga360Logger.sendECommerce(param)
      } else {
        marketingUtil.log()('param.type unknown...')
      }
    },

    /**
     * 초기화
     *
     * @returns {void}
     */
    init: () => {
      if (Object.keys(marketingUtil.ga360Logger.GACustomKey).length === 0) {
        for (let i = 1; i < 201; i++) {
          marketingUtil.ga360Logger.GACustomKey[`Dimension${i}`] = `dimension${i}`
          marketingUtil.ga360Logger.GACustomKey[`Metric${i}`] = `metric${i}`
        }

        const qs = marketingUtil.ga360Logger.qs()
        marketingUtil.ga360Logger.gaReferrer = qs.referrer
        marketingUtil.ga360Logger.gaCampaignSource = qs.utm_source
        marketingUtil.ga360Logger.gaCampaignMedium = qs.utm_medium
        marketingUtil.ga360Logger.gaCampaignName = qs.utm_campaign
        marketingUtil.ga360Logger.gaCampaignContent = qs.utm_content
        marketingUtil.ga360Logger.gaCampaignKeyword = qs.utm_term
      }
    },

    /**
     * 지급 유형 반환
     *
     * @param {String} payMthCd 지급유형코드
     * @returns {String} 지급유형명
     */
    getPayTypeName: payMthdCd => {
      const payTypeList = []
      const payTypeNameList = [
        '카드결제', '무통장입금', '실시간계좌이체', '휴대폰결제', '예치금사용', '적립금사용', 'NS상품권', 'OK캐시백',
        '네티웰포인트사용', '해피머니사용', '연간할인권사용', '', '페이코', '네이버페이', 'NS페이카드', 'NS페이실시간계좌이체'
      ]
      payTypeNameList.forEach((item, index) => {
        payTypeList.push({
          code: `${String(index + 1)}00`,
          name: item
        })
      })
      let payTypeName = ''
      payTypeList.forEach((item, index) => {
        if (item.code === payMthdCd) {
          payTypeName = item.name
        }
      })

      return payTypeName
    },

    /**
     * 직원 유형 반환
     *
     * @returns {String} 직원 유형
     */
    getUserEmployeeType: () => {
      let userEmployeeType = ''
      if (loginUtil.checkLogonStatus()) {
        if (loginUtil.getUserInfo('staffInfo') === 'Y') {
          if (loginUtil.getUserInfo('staffBnft') === 'Y') {
            userEmployeeType = 'NS'
          } else {
            userEmployeeType = '하림'
          }
        } else {
          userEmployeeType = '일반회원'
        }
      } else {
        userEmployeeType = '비로그인'
      }

      return userEmployeeType
    },

    /**
     * 로그인 유형 반환
     *
     * @returns {String} 로그인 유형
     */
    getLoginType: () => {
      if (loginUtil.checkLogonStatus()) {
        if (loginUtil.getUserInfo('isAutoLoginCheck')) {
          return 'AUTO'
        } else {
          if (loginUtil.getUserInfo('entFlag') === '') {
            return 'NS'
          }
          return loginUtil.getUserInfo('entFlag')
        }
      }
      return ''
    },

    /**
     * 고객 등급
     *
     * @returns {String} 고객 등급 코드
     */
    getGradeType: () => {
      let gradeCd = ''
      switch (loginUtil.getUserInfo('gradeNm')) {
        case '패밀리':
          gradeCd = 'F'
          break
        case '실버':
          gradeCd = 'S'
          break
        case '골드':
          gradeCd = 'G'
          break
        case '다이아몬드':
          gradeCd = 'D'
          break
        case 'LOVE.N':
          gradeCd = 'L'
          break
        default:
          break
      }
      return gradeCd
    },

    /**
     * 날짜 목록 반환
     *
     * @returns {Object} 현재 월 이전 5개월 목록
     */
    getDateList: () => {
      const dateList = []
      const currDate = new Date()
      let year = currDate.getFullYear()
      let month = currDate.getMonth()
      for (let i = 5; i >= 0; i--) {
        dateList.unshift({
          orderMonth: (String(year) + String(month + 1).padStart(2, '0'))
        })
        currDate.setMonth(currDate.getMonth() - 1)
        year = currDate.getFullYear()
        month = currDate.getMonth()
      }

      return dateList
    },

    /**
     * 월초/월중/월말 구분 반환
     *
     * @param {String} monthDate 년월일자
     * @returns {String} 일자의 월초/월중/월말
     */
    getMonthMidName: monthDate => {
      let monthMidName = ''
      if (Number(monthDate.substring(6, 8)) < 11) {
        monthMidName = '월초'
      } else if (Number(monthDate.substring(6, 8)) < 21) {
        monthMidName = '월중'
      } else {
        monthMidName = '월말'
      }

      return monthMidName
    },

    /**
     * 로그 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    sendLog: param => {
      marketingUtil.log()('sendLog(param)', param)

      if (param.type !== marketingUtil.ga360Logger.LOG_PAGE) { // 페이지
        marketingUtil.log()('type INVALID...')
        return
      }

      let lastOrder = loginUtil.getUserInfo('lastOrder')
      lastOrder = lastOrder.substring(0, 4) + lastOrder.substring(5, 7) + lastOrder.substring(8, 10)

      let regiMember = loginUtil.getUserInfo('registration')
      regiMember = regiMember.substring(0, 4) + regiMember.substring(5, 7) + regiMember.substring(8, 10)

      marketingUtil.ga360Logger.makeDimension(param)

      const sendParam = {} // 전송되는 파라메터

      if (isNull(marketingUtil.ga360Logger.userAge)) {
        marketingUtil.ga360Logger.userAge = ''
      }
      if (isNull(marketingUtil.ga360Logger.isLogin)) {
        marketingUtil.ga360Logger.isLogin = ''
      }
      if (isNull(marketingUtil.ga360Logger.loginType)) {
        marketingUtil.ga360Logger.loginType = ''
      }
      if (isNull(marketingUtil.ga360Logger.initChannel)) {
        marketingUtil.ga360Logger.initChannel = ''
      }
      if (isNull(marketingUtil.ga360Logger.userEmployeeType)) {
        marketingUtil.ga360Logger.userEmployeeType = ''
      }
      if (isNull(param.data.pageDepth3)) {
        param.data.pageDepth3 = ''
      }
      if (isNull(param.data.pageDepth4)) {
        param.data.pageDepth4 = ''
      }

      if (marketingUtil.ga360Logger.initChannel === marketingUtil.ga360Logger.CHANNEL.MOBILE_WEB) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension1] = marketingUtil.ga360Logger.getCid()
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension1] = ''
      }

      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension2] = String(loginUtil.getUserInfo('userId'))
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension3] = ''
      if (!isNull(loginUtil.getUserInfo('birthday'))) {
        const birthYear = Number(loginUtil.getUserInfo('birthday').substring(0, 4))
        const currYear = new Date().getFullYear()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension4] = String(currYear - birthYear + 1).substring(0, 1)
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension4] = ''
      }
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension5] = marketingUtil.ga360Logger.isLogin
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension6] = marketingUtil.ga360Logger.getLoginType()
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension7] = marketingUtil.ga360Logger.initChannel
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension8] = marketingUtil.ga360Logger.getGradeType()
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension9] = regiMember
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension10] = lastOrder

      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension21] = loginUtil.getUserInfo('gender')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension22] = marketingUtil.ga360Logger.userEmployeeType
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension24] = param.pushState // 푸쉬 수신 동의 여부.
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension25] = loginUtil.getUserInfo('userMarketingSMS')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension26] = loginUtil.getUserInfo('userMargetingEmail')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension27] = loginUtil.getUserInfo('userMargetingTM')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = param.data.pageDepth1
      if (!isNull(param.data.pageDepth2)) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.pageDepth1}>${param.data.pageDepth2}`
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = ''
      }
      if (!isNull(param.data.pageDepth3)) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.pageDepth1}>${param.data.pageDepth2}>${param.data.pageDepth3}`
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29]
      }
      if (!isNull(param.data.pageDepth4)) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.pageDepth1}>${param.data.pageDepth2}>${param.data.pageDepth3}>${param.data.pageDepth4}`
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30]
      }

      marketingUtil.ga360Logger.ga_re = localStorageUtil.get('GA.ga_re')
      marketingUtil.ga360Logger.utm_s = localStorageUtil.get('GA.utm_s')
      marketingUtil.ga360Logger.utm_m = localStorageUtil.get('GA.utm_m')
      marketingUtil.ga360Logger.utm_ca = localStorageUtil.get('GA.utm_ca')
      marketingUtil.ga360Logger.utm_co = localStorageUtil.get('GA.utm_co')
      marketingUtil.ga360Logger.utm_t = localStorageUtil.get('GA.utm_t')
      marketingUtil.ga360Logger.co_cd = localStorageUtil.get('GA.co_cd')
      if (isNull(marketingUtil.ga360Logger.co_cd)) {
        marketingUtil.ga360Logger.co_cd = isOsApp() ? marketingUtil.APP_CO_CD : marketingUtil.WEB_CO_CD
      }
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension51] = marketingUtil.ga360Logger.co_cd

      let tempGaUrl = localStorageUtil.get('GA.ga_url')
      if (!isNull(tempGaUrl) && (tempGaUrl.indexOf('#') > -1 || tempGaUrl.indexOf('?') > -1 || tempGaUrl.substring(0, 1) === '#')) {
        tempGaUrl = tempGaUrl.substring(1)
      }
      if (!isNull(tempGaUrl)) {
        marketingUtil.ga360Logger.ga_url = `gadata://sendurl?page=${tempGaUrl}`
      }

      if (!isNull(marketingUtil.ga360Logger.ga_re)) {
        sendParam[marketingUtil.ga360Logger.GAHitKey.referrer] = marketingUtil.ga360Logger.ga_re
      }
      if (!isNull(marketingUtil.ga360Logger.utm_s)) {
        sendParam[marketingUtil.ga360Logger.GAHitKey.campaignSource] = marketingUtil.ga360Logger.utm_s
      }
      if (!isNull(marketingUtil.ga360Logger.utm_m)) {
        sendParam[marketingUtil.ga360Logger.GAHitKey.campaignMedium] = marketingUtil.ga360Logger.utm_m
      }
      if (!isNull(marketingUtil.ga360Logger.utm_ca)) {
        sendParam[marketingUtil.ga360Logger.GAHitKey.campaignName] = marketingUtil.ga360Logger.utm_ca
      }
      if (!isNull(marketingUtil.ga360Logger.utm_co)) {
        sendParam[marketingUtil.ga360Logger.GAHitKey.campaignContent] = marketingUtil.ga360Logger.utm_co
      }
      if (!isNull(marketingUtil.ga360Logger.utm_t)) {
        sendParam[marketingUtil.ga360Logger.GAHitKey.campaignKeyword] = marketingUtil.ga360Logger.utm_t
      }
      if (!isNull(marketingUtil.ga360Logger.ga_url)) {
        sendParam.native_url = marketingUtil.ga360Logger.ga_url
      }

      if (param.data.category === marketingUtil.CATEGORY_ADD_LOGIN) { // 'add_login'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(param.data.action) // loginUtil.getUserInfo('userId')
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_VIEWORDER) { // 'add_vieworder'
        const dateList = marketingUtil.ga360Logger.getDateList()

        let orderSix = ''
        dateList.forEach((item, index) => {
          orderSix += 'X'
        })

        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension32] = '0'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension33] = orderSix.substring(5)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension34] = orderSix.substring(4)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension35] = orderSix.substring(3)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension36] = orderSix
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension38] = loginUtil.getUserInfo('lastOrder').substring(11, 13)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension39] = marketingUtil.ga360Logger.getPayTypeName(param.data.payMthdCd)

        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension43] = marketingUtil.ga360Logger.getMonthMidName(lastOrder)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension44] = lastOrder
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension45] = '0'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension46] = '0'

        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_SEARCH || param.data.category === marketingUtil.CATEGORY_QUERY) { // 'add_search' || 'query'
        let searchResult = 'X'
        if (param.data.action !== undefined) {
          searchResult = 'O'
        }

        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension11] = param.data.searchType
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension12] = param.data.searchTerm
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension13] = searchResult
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_CATEGORY || param.data.category === marketingUtil.CATEGORY_VIEW_CATEGORY) { // 'add_category' || 'view_category'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_PRODUCTVIEW) { // 'add_productview'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        marketingUtil.ga360Logger.tvYn = ''
        marketingUtil.ga360Logger.dimension2 = ''
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_PURCHASE) { // 'add_purchase'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_SUBORDER) { // 'add_suborder'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_VIEW_HOME) { // 'add_viewhome'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_REFOUND) { // 'add_refound'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else if (param.data.category === marketingUtil.CATEGORY_ADD_CART) { // 'add_addcart'
        sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      } else {
        if (param.data.isProductDetail) { // 상품상세 화면인 경우 처리
          const depth1 = '상품상세'
          let depth2 = ''
          let depth3 = ''
          let depth4 = ''

          switch (param.data.referer) {
            case 'storeHome': // 홈
              depth2 = '홈'
              depth3 = param.data.productName // 상품명
              break
            case 'shopPlus': // SHOP+
              depth2 = 'TV쇼핑'
              depth3 = 'NSSHOP+'
              depth4 = param.data.productName // 상품명
              break
            case 'tvShopping': // TV쇼핑
              depth2 = 'TV쇼핑'
              depth3 = 'TVLIVE'
              depth4 = param.data.productName // 상품명
              break
            case 'tvScheduleTable': // 편성표
              depth2 = '편성표'
              depth3 = param.data.scheduleTblName // TVLIVE, NSSHOP+
              depth4 = param.data.productName // 상품명
              break
            case 'happyDeal': // 해피딜
              depth2 = '해피딜'
              depth3 = param.data.productName // 상품명
              break
            case 'thinglive': // 띵라이브
              depth2 = '띵라이브'
              depth3 = param.data.productName // 상품명
              break
            case 'searchResult': // 검색
              depth2 = '검색'
              depth3 = param.data.productName // 상품명
              break
            case 'lnbCategory': // 카테고리매장
              depth2 = param.data.lnbCateName // {{카테고리 매장명}}
              depth3 = param.data.productName // 상품명
              depth4 = '' // null
              break
            case 'shoppingHistory': // 최근본상품
              depth2 = '최근본상품'
              depth3 = param.data.productName // 상품명
              break
            case 'slotStore': // 편성매장
              depth2 = param.data.slotStoreName // {{편성매장}}
              depth3 = param.data.productName // 상품명
              break
            case 'wishList': // 찜
              depth2 = '찜'
              depth3 = param.data.productName // 상품명
              break
            case 'cartList': // 장바구니
              depth2 = '장바구니'
              depth3 = param.data.productName // 상품명
              break
            case 'orderSheet': // 주문서작성
              depth2 = '주문서작성'
              depth3 = param.data.productName // 상품명
              break
            case 'orderComplete': // 주문완료
              depth2 = '주문완료'
              depth3 = param.data.productName // 상품명
              break
            case 'mypageOrderList': // 마이페이지>주문/배송조회
              depth2 = '마이페이지'
              if (param.data.popupId === '#popup-1') { // 주문상세내역 팝업인 경우
                depth3 = '주문상세내역'
              } else {
                depth3 = '주문/배송조회'
              }
              depth4 = param.data.productName // 상품명
              break
            case 'mypageCancelReturnExchangeList': // 주문/반품/교환목록
              depth2 = '마이페이지'
              if (param.data.popupId === '#popup-1') { // 취소상세내역 팝업인 경우
                depth3 = '취소상세내역'
              } else {
                depth3 = '취소/반품/교환목록'
              }
              depth4 = param.data.productName // 상품명
              break
            default:
              break
          }

          if (!isNull(depth4)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${depth1}>${depth2}>${depth3}>${depth4}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${depth1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${depth1}>${depth2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${depth1}>${depth2}>${depth3}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${depth1}>${depth2}>${depth3}>${depth4}`
          } else if (!isNull(depth3)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${depth1}>${depth2}>${depth3}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${depth1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${depth1}>${depth2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${depth1}>${depth2}>${depth3}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${depth1}>${depth2}>${depth3}`
          } else if (!isNull(depth2)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${depth1}>${depth2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${depth1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${depth1}>${depth2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${depth1}>${depth2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${depth1}>${depth2}`
          } else {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = depth1
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${depth1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${depth1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${depth1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${depth1}`
          }
        } else if (param.data.isSnsLoginView) { // SNS 로그인 사이트 페이지 뷰 강제로 전송 처리
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension7] = 'MOBILE_WEB'
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension22] = '비로그인'
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = param.data.snsTypeName
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = param.data.snsTypeName
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = param.data.snsTypeName
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = param.data.snsTypeName
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.snsTypeName}`
          sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = ''
        } else if (!isNull(param.data.subparams)) {
          if (!isNull(param.data.subparams.t4)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`
          } else if (!isNull(param.data.subparams.t3)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          } else if (!isNull(param.data.subparams.t2)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
          } else if (!isNull(param.data.subparams.t1)) {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.subparams.t1}`
            sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.subparams.t1}`
          } else {
            sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
          }
        } else {
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = marketingUtil.ga360Logger.title
        }
        sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      }

      // 테스트 데이터 검증을 위한 부분
      let postfix = ''
      const hostType = marketingUtil.getHostType() // 호스트 정보
      switch (hostType.type) {
        case 'LOCAL':
        case 'UNIT':
        case 'DEV':
          // +9 시간
          postfix = `-${new Date(new Date().setTime(new Date().getTime() + (9 * 60 * 60 * 1000))).toISOString().substring(0, 16).replace(/-/gi, '').replace(/:/gi, '').replace('T', '')}`
          break
        case 'TEST':
        case 'PROD':
          postfix = ''
          break
        default:
          break
      }
      sendParam.title = `${sendParam.title}${postfix}`

      // 전송 처리
      isOsApp() ? marketingUtil.ga360Logger.sendAPPProcess(sendParam) : marketingUtil.ga360Logger.sendWEBProcess(sendParam)
    },

    /**
     * 이벤트 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    sendEvent: param => {
      marketingUtil.log()('sendEvent(param)', param)

      if (param.type !== marketingUtil.ga360Logger.LOG_EVENT) { // 이벤트
        marketingUtil.log()('type INVALID...')
        return
      }

      if (isNull(param.data.eventCate) || param.data.eventCate.length === 0 || isNull(param.data.eventAction) || param.data.eventAction.length === 0) {
        marketingUtil.log()('eventCate or eventAction is NULL...')
        return
      }

      const sendParam = {} // 전송되는 파라메터

      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension2] = String(loginUtil.getUserInfo('userId'))
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension3] = ''
      if (!isNull(loginUtil.getUserInfo('birthday'))) {
        const birthYear = Number(loginUtil.getUserInfo('birthday').substring(0, 4))
        const currYear = new Date().getFullYear()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension4] = String(currYear - birthYear + 1).substring(0, 1)
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension4] = ''
      }

      if (param.autoLoginCheck) {
        marketingUtil.ga360Logger.loginType = 'AUTO'
      }

      if (loginUtil.checkLogonStatus()) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension5] = 'Y'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension6] = marketingUtil.ga360Logger.getLoginType()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension22] = marketingUtil.ga360Logger.getUserEmployeeType()
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension5] = 'N'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension6] = ''
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension22] = '비로그인'
      }

      // 앱 여부
      if (isOsApp()) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension1] = ''
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension7] = marketingUtil.ga360Logger.CHANNEL.APP
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension1] = marketingUtil.ga360Logger.getCid()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension7] = marketingUtil.ga360Logger.CHANNEL.MOBILE_WEB
      }
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension8] = marketingUtil.ga360Logger.getGradeType()

      const regiMember = loginUtil.getUserInfo('registration')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension9] = regiMember.substring(0, 4) + regiMember.substring(5, 7) + regiMember.substring(8, 10)

      const lastOrder = loginUtil.getUserInfo('lastOrder')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension10] = lastOrder.substring(0, 4) + lastOrder.substring(5, 7) + lastOrder.substring(8, 10)

      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension21] = loginUtil.getUserInfo('gender')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension24] = param.pushState // 푸쉬 수신 동의 여부.
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension25] = loginUtil.getUserInfo('userMarketingSMS')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension26] = loginUtil.getUserInfo('userMargetingEmail')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension27] = loginUtil.getUserInfo('userMargetingTM')

      // 페이지의 메뉴 Depth. $route.meta.depth에 정의하기로 함.
      param.data.pageDepth1 = ''
      param.data.pageDepth2 = ''
      param.data.pageDepth3 = ''
      param.data.pageDepth4 = ''
      if (marketingUtil.isKeyExisted(window.marketingRoute, 'meta') && marketingUtil.isKeyExisted(window.marketingRoute.meta, 'depth') && !isNull(window.marketingRoute.meta.depth)) { // 메뉴1>메뉴2>메뉴3>메뉴4
        const [pageDepth1, pageDepth2, pageDepth3, pageDepth4] = window.marketingRoute.meta.depth.split('>')
        param.data.pageDepth1 = isNull(pageDepth1) ? '' : pageDepth1.trim()
        param.data.pageDepth2 = isNull(pageDepth2) ? '' : pageDepth2.trim()
        param.data.pageDepth3 = isNull(pageDepth3) ? '' : pageDepth3.trim()
        param.data.pageDepth4 = isNull(pageDepth4) ? '' : pageDepth4.trim()
      } else {
        marketingUtil.log()('window.marketingRoute.meta.depth is NULL...')
      }

      if (!isNull(param.data.params.t1)) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = param.data.params.t1
        if (!isNull(param.data.params.t2)) {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.params.t1}>${param.data.params.t2}`
        } else {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28]
        }
        if (!isNull(param.data.params.t3)) {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.params.t1}>${param.data.params.t2}>${param.data.params.t3}`
        } else {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29]
        }
        if (!isNull(param.data.params.t4)) {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.params.t1}>${param.data.params.t2}>${param.data.params.t3}>${param.data.params.t4}`
        } else {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30]
        }
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = param.data.pageDepth1
        if (!isNull(param.data.pageDepth2)) {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = `${param.data.pageDepth1}>${param.data.pageDepth2}`
        } else {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28]
        }
        if (!isNull(param.data.pageDepth3)) {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = `${param.data.pageDepth1}>${param.data.pageDepth2}>${param.data.pageDepth3}`
        } else {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29]
        }
        if (!isNull(param.data.pageDepth4)) {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = `${param.data.pageDepth1}>${param.data.pageDepth2}>${param.data.pageDepth3}>${param.data.pageDepth4}`
        } else {
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30]
        }
      }

      sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      sendParam[marketingUtil.ga360Logger.GAHitKey.title] = sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31]

      sendParam[marketingUtil.ga360Logger.GAHitKey.eventCategory] = param.data.eventCate
      sendParam[marketingUtil.ga360Logger.GAHitKey.eventAction] = param.data.eventAction
      sendParam[marketingUtil.ga360Logger.GAHitKey.eventLabel] = param.data.eventLabel

      // 이벤트 전송 처리
      isOsApp() ? marketingUtil.ga360Logger.gaEventDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaEventDataSendWEB(sendParam)
    },

    /**
     * E-Commerce 전송
     *
     * @param {object} param 로그 데이터
     * @returns {void}
     */
    sendECommerce: param => {
      marketingUtil.log()('sendECommerce(param)', param)

      if (param.type !== marketingUtil.ga360Logger.LOG_ECOMMERCE) { // E-Commerce
        marketingUtil.log()('type INVALID...')
        return
      }

      const sendParam = {} // 전송되는 파라메터

      if (param.data.step === marketingUtil.ga360Logger.ECOMMERCE_STEP_09) { // 주문완료인 경우 전송 중복 체크
        if (marketingUtil.ga360Logger.purchaseCheck === param.data.subparams.ordersid) {
          marketingUtil.log()('ordersid is DUP...')
          return
        }
        marketingUtil.ga360Logger.purchaseCheck = param.data.subparams.ordersid
      }

      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension2] = String(loginUtil.getUserInfo('userId'))
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension3] = ''
      if (!isNull(loginUtil.getUserInfo('birthday'))) {
        const birthYear = Number(loginUtil.getUserInfo('birthday').substring(0, 4))
        const currYear = new Date().getFullYear()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension4] = String(currYear - birthYear + 1).substring(0, 1)
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension4] = ''
      }

      if (param.autoLoginCheck) {
        marketingUtil.ga360Logger.loginType = 'AUTO'
      }

      if (loginUtil.checkLogonStatus()) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension5] = 'Y'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension6] = marketingUtil.ga360Logger.getLoginType()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension22] = marketingUtil.ga360Logger.getUserEmployeeType()
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension5] = 'N'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension6] = ''
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension22] = '비로그인'
      }

      // 앱 여부
      if (isOsApp()) {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension1] = ''
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension7] = marketingUtil.ga360Logger.CHANNEL.APP
        marketingUtil.ga360Logger.initChannel = marketingUtil.ga360Logger.CHANNEL.APP
      } else {
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension1] = marketingUtil.ga360Logger.getCid()
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension7] = marketingUtil.ga360Logger.CHANNEL.MOBILE_WEB
        marketingUtil.ga360Logger.initChannel = marketingUtil.ga360Logger.CHANNEL.MOBILE_WEB
      }
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension8] = marketingUtil.ga360Logger.getGradeType()

      const regiMember = loginUtil.getUserInfo('registration')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension9] = regiMember.substring(0, 4) + regiMember.substring(5, 7) + regiMember.substring(8, 10)

      const lastOrder = loginUtil.getUserInfo('lastOrder')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension10] = lastOrder.substring(0, 4) + lastOrder.substring(5, 7) + lastOrder.substring(8, 10)

      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension21] = loginUtil.getUserInfo('gender')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension24] = param.pushState // 푸쉬 수신 동의 여부.
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension25] = loginUtil.getUserInfo('userMarketingSMS')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension26] = loginUtil.getUserInfo('userMargetingEmail')
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension27] = loginUtil.getUserInfo('userMargetingTM')

      if (param.data.step === marketingUtil.ga360Logger.ECOMMERCE_STEP_02) { // 상품상세(SHOP+ || TV)
        if (!isNull(param.data.subparams)) {
          marketingUtil.ga360Logger.liveDataSave[marketingUtil.ga360Logger.liveDataSave.length] = {
            partNumber: param.data.subparams.partNumber,
            brdctDate: param.data.subparams.list.brdctDate,
            formStartDttm: param.data.subparams.list.formStartDttm,
            formEndDttm: param.data.subparams.list.formEndDttm
          }
        }
      }

      if (param.data.step === marketingUtil.ga360Logger.ECOMMERCE_STEP_07 || param.data.step === marketingUtil.ga360Logger.ECOMMERCE_STEP_08) { // 주문서작성/결제(SHOP+ || TV), 주문서작성/결제
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension39] = marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.payMthdCd)

        // AS-IS 소스는 버그가 있다. 202000, 2020-1 처럼 잘못된 데이터를 생산한다.
        const dateList = marketingUtil.ga360Logger.getDateList()

        let orderSix = ''
        dateList.forEach((item, index) => {
          orderSix += 'X'
        })

        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension32] = '0'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension33] = orderSix.substring(5)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension34] = orderSix.substring(4)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension35] = orderSix.substring(3)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension36] = orderSix
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension38] = loginUtil.getUserInfo('lastOrder').substring(11, 13)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension39] = marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.payMthdCd)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension43] = marketingUtil.ga360Logger.getMonthMidName(lastOrder)
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension44] = lastOrder
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension45] = '0'
        sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension46] = '0'
      }

      sendParam[marketingUtil.ga360Logger.GAHitKey.userId] = String(loginUtil.getUserInfo('userId'))
      sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension28] = param.data.subparams.t1

      // 타이틀 및 메뉴 Depth
      let tmpTitle = param.data.subparams.t1
      let tmpDimension29 = param.data.subparams.t1
      let tmpDimension30 = param.data.subparams.t1
      let tmpDimension31 = param.data.subparams.t1
      if (marketingUtil.isKeyExisted(param.data.subparams, 't2') && !isNull(param.data.subparams.t2)) { // t2 값 존재
        tmpTitle += `>${param.data.subparams.t2}`
        tmpDimension29 += `>${param.data.subparams.t2}`
        tmpDimension30 += `>${param.data.subparams.t2}`
        tmpDimension31 += `>${param.data.subparams.t2}`
        if (marketingUtil.isKeyExisted(param.data.subparams, 't3') && !isNull(param.data.subparams.t3)) { // t3 값 존재
          tmpTitle += `>${param.data.subparams.t3}`
          tmpDimension30 += `>${param.data.subparams.t3}`
          tmpDimension31 += `>${param.data.subparams.t3}`
          if (marketingUtil.isKeyExisted(param.data.subparams, 't4') && !isNull(param.data.subparams.t4)) { // t4 값 존재
            tmpTitle += `>${param.data.subparams.t4}`
            tmpDimension31 += `>${param.data.subparams.t4}`
          }
        }
      }

      switch (param.data.step) {
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_01: // 상품상세(e-상품)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension15] = isNull(param.data.params[0].dimension15) ? '' : param.data.params[0].dimension15
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension16] = isNull(param.data.params[0].dimension16) ? '' : param.data.params[0].dimension16
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension17] = isNull(param.data.params[0].dimension17) ? '' : param.data.params[0].dimension17
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension18] = isNull(param.data.params[0].dimension18) ? '' : param.data.params[0].dimension18
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension19] = isNull(param.data.params[0].dimension19) ? '' : param.data.params[0].dimension19
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension20] = isNull(param.data.params[0].dimension20) ? '' : param.data.params[0].dimension20

          sendParam[marketingUtil.ga360Logger.GAHitKey.nonInteraction] = '1'
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.detail
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.productActionList] = param.data.subparams.product_list
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_02: // 상품상세(SHOP+ || TV)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension15] = isNull(param.data.params[0].dimension15) ? '' : param.data.params[0].dimension15
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension16] = isNull(param.data.params[0].dimension16) ? '' : param.data.params[0].dimension16
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension17] = isNull(param.data.params[0].dimension17) ? '' : param.data.params[0].dimension17
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension18] = isNull(param.data.params[0].dimension18) ? '' : param.data.params[0].dimension18
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension19] = isNull(param.data.params[0].dimension19) ? '' : param.data.params[0].dimension19
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension20] = isNull(param.data.params[0].dimension20) ? '' : param.data.params[0].dimension20

          sendParam[marketingUtil.ga360Logger.GAHitKey.nonInteraction] = '1'
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.detail
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.productActionList] = param.data.subparams.product_list
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_03: // 장바구니상품담기
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.add
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.productActionList] = param.data.subparams.product_list
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_04: // 장바구니상품삭제
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.remove
          sendParam.ecommerceAction = null
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_05: // 주문요청(SHOP+ || TV)
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.checkout
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutStep] = '1'
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_06: // 주문요청(e-상품)
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle
          // if (param.data.subparams.t3 === undefined) {
          //   sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.subparams.t1}>${param.data.subparams.t2}`
          // } else {
          //   sendParam[marketingUtil.ga360Logger.GAHitKey.title] = `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          // }
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // sendParam[marketingUtil.ga360Logger.GAHitKey.title]
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // sendParam[marketingUtil.ga360Logger.GAHitKey.title]

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.checkout
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutStep] = '1'
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_07: // 주문서작성/결제(SHOP+ || TV)
          for (let f = 0; f < marketingUtil.ga360Logger.liveDataSave.length; f++) {
            if (param.data.subparams.partNumber === marketingUtil.ga360Logger.liveDataSave[f].partNumber) {
              sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension17] = marketingUtil.ga360Logger.liveDataSave[f].brdctDate
              sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension18] = marketingUtil.ga360Logger.liveDataSave[f].formStartDttm
              sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension19] = marketingUtil.ga360Logger.liveDataSave[f].formEndDttm
            }
          }
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.checkout
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutStep] = '2'
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutOptions] = marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.payMthdCd)
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_08: // 주문서작성/결제
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.checkout
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutStep] = '2'
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutOptions] = marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.payMthdCd)
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_09: // 주문완료
          sendParam[marketingUtil.ga360Logger.GAHitKey.nonInteraction] = '1'
          // if (param.data.subparams.typedetail === '100') {
          //   sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension14] = `${marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.typedetail)}_${param.data.subparams.detailName}`
          // } else if (param.data.subparams.stypedetail === '200') {
          //   sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension14] = `${marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.typedetail)}_${param.data.subparams.detailName.replace(' ', '')}`
          // } else {
          //   sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension14] = marketingUtil.ga360Logger.getPayTypeName(param.data.subparams.typedetail)
          // }
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension14] = param.data.subparams.dimension14
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric1] = String(param.data.subparams.totaldiscount)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric2] = '' // String(param.data.subparams.OKcashbag)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric3] = String(param.data.subparams.nsgift)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric4] = String(param.data.subparams.cash1)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric5] = String(param.data.subparams.cash2)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric6] = String(param.data.subparams.savecash)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric7] = String(param.data.subparams.discountdelivery)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric8] = String(param.data.subparams.discountprice)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric9] = String(param.data.subparams.discountcoupon)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric10] = String(param.data.subparams.discount1)
          sendParam[marketingUtil.ga360Logger.GACustomKey.Metric11] = '' // String(param.data.subparams.discountcard)

          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.purchase
          sendParam.ecommerceAction = {}
          // sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutStep] = '3'- 전자상거래 검수 결과 : Purchase는 Step을 입력하지 않습니다.
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.transactionId] = String(param.data.subparams.ordersid)
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.transactionRevenue] = String(param.data.subparams.revenue)
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.transactionCouponCode] = String(param.data.subparams.coupon)
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.transactionShipping] = String(param.data.subparams.shipping)
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.checkoutOptions] = String(param.data.subparams.checkout_option)
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_10: // 주문취소
          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}>${param.data.subparams.t3}>${param.data.subparams.t4}`

          // e-Commerce 전송 처리
          sendParam.params = null
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.refund
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.transactionId] = String(param.data.subparams.id)
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.productActionList] = param.data.subparams.product_list
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        case marketingUtil.ga360Logger.ECOMMERCE_STEP_11: // 상품리스트클릭
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension16] = isNull(param.data.params[0].dimension16) ? '' : param.data.params[0].dimension16
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension17] = isNull(param.data.params[0].dimension17) ? '' : param.data.params[0].dimension17
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension18] = isNull(param.data.params[0].dimension18) ? '' : param.data.params[0].dimension18
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension19] = isNull(param.data.params[0].dimension19) ? '' : param.data.params[0].dimension19
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension20] = isNull(param.data.params[0].dimension20) ? '' : param.data.params[0].dimension20

          sendParam[marketingUtil.ga360Logger.GAHitKey.title] = tmpTitle // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension29] = tmpDimension29 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension30] = tmpDimension30 // `${param.data.subparams.t1}>${param.data.subparams.t2}`
          sendParam[marketingUtil.ga360Logger.GACustomKey.Dimension31] = tmpDimension31 // `${param.data.subparams.t1}>${param.data.subparams.t2}`

          // e-Commerce 전송 처리
          sendParam.params = param.data.params
          sendParam.ecommerceStep = marketingUtil.ga360Logger.GAEcommerceStepKey.click
          sendParam.ecommerceAction = {}
          sendParam.ecommerceAction[marketingUtil.ga360Logger.GAActionFieldKey.productActionList] = param.data.subparams.product_list
          isOsApp() ? marketingUtil.ga360Logger.gaECommerceDataSendAPP(sendParam) : marketingUtil.ga360Logger.gaECommerceDataSendWEB(sendParam)
          break
        default:
          break
      }
    },

    /**
     * makeDimension
     */
    makeDimension: param => {
      if (isNull(param.data.params)) {
        param.data.params = {}
      }
      if (isNull(param.data.params.pageId)) {
        param.data.params.pageId = marketingUtil.isKeyExisted(window.marketingRoute, 'name') ? window.marketingRoute.name : '' // TO-BE에서 page id를 관리하지 않기 때문에 Unique한 값인 $route.name을 pageId로 설정한다.
      }

      if (param.autoLoginCheck) {
        marketingUtil.ga360Logger.loginType = 'AUTO'
      }
      // 로그인 상태
      if (loginUtil.checkLogonStatus()) {
        marketingUtil.ga360Logger.isLogin = 'Y'
        marketingUtil.ga360Logger.loginType = marketingUtil.ga360Logger.getLoginType()
        marketingUtil.ga360Logger.userEmployeeType = marketingUtil.ga360Logger.getUserEmployeeType()
      } else {
        marketingUtil.ga360Logger.isLogin = 'N'
        marketingUtil.ga360Logger.userEmployeeType = '비로그인'
        marketingUtil.ga360Logger.loginType = ''
        marketingUtil.ga360Logger.userAge = ''
      }

      // 생년월일 - 나이구간 계산
      const birthday = loginUtil.getUserInfo('birthday')
      if (!isNull(birthday)) {
        marketingUtil.ga360Logger.userAge = (String(new Date().getFullYear() - Number(birthday.substring(0, 4)) + 1)).substring(0, 1)
      } else {
        marketingUtil.ga360Logger.userAge = ''
      }

      // 앱 여부
      if (isOsApp()) {
        marketingUtil.ga360Logger.initChannel = marketingUtil.ga360Logger.CHANNEL.APP
      } else {
        marketingUtil.ga360Logger.initChannel = marketingUtil.ga360Logger.CHANNEL.MOBILE_WEB
      }

      // 페이지의 메뉴 Depth. $route.meta.depth에 정의하기로 함.
      param.data.pageDepth1 = ''
      param.data.pageDepth2 = ''
      param.data.pageDepth3 = ''
      param.data.pageDepth4 = ''
      if (marketingUtil.isKeyExisted(window.marketingRoute, 'meta') && marketingUtil.isKeyExisted(window.marketingRoute.meta, 'depth') && !isNull(window.marketingRoute.meta.depth)) { // 메뉴1>메뉴2>메뉴3>메뉴4
        const [pageDepth1, pageDepth2, pageDepth3, pageDepth4] = window.marketingRoute.meta.depth.split('>')
        param.data.pageDepth1 = isNull(pageDepth1) ? '' : pageDepth1.trim()
        param.data.pageDepth2 = isNull(pageDepth2) ? '' : pageDepth2.trim()
        param.data.pageDepth3 = isNull(pageDepth3) ? '' : pageDepth3.trim()
        param.data.pageDepth4 = isNull(pageDepth4) ? '' : pageDepth4.trim()
      } else {
        marketingUtil.log()('window.marketingRoute.meta.depth is NULL...')
      }

      if (!isNull(param.data.pageDepth4)) {
        marketingUtil.ga360Logger.title = `${param.data.pageDepth1}>${param.data.pageDepth2}>${param.data.pageDepth3}>${param.data.pageDepth4}`
      } else if (!isNull(param.data.pageDepth3)) {
        marketingUtil.ga360Logger.title = `${param.data.pageDepth1}>${param.data.pageDepth2}>${param.data.pageDepth3}`
      } else if (!isNull(param.data.pageDepth2)) {
        marketingUtil.ga360Logger.title = `${param.data.pageDepth1}>${param.data.pageDepth2}`
      } else if (!isNull(param.data.pageDepth1)) {
        marketingUtil.ga360Logger.title = `${param.data.pageDepth1}`
      }

      // 타이틀이 없는 경우
      if (isNull(marketingUtil.ga360Logger.title)) {
        marketingUtil.ga360Logger.title = `${marketingUtil.isKeyExisted(window.marketingRoute, 'name') ? window.marketingRoute.name : ''} [${window.marketingRoute.fullPath}]`
      }
    },

    /**
     * CID 값 반환
     *
     * @returns {String} GA의 cid 값 반환
     */
    getCid: () => {
      let clientId = ''
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        if (cookies[i].split('=')[0] === '_ga' || cookies[i].split('=')[0] === ' _ga') {
          clientId = cookies[i].split('=')[1]
        }
      }
      if (clientId !== '') {
        clientId = clientId.substring(6)
      } else {
        window.ga(function (tracker) {
          clientId = tracker.get('clientId')
        })
      }

      return clientId
    },

    /**
     * 전송 처리 - App
     *
     * @param {Object} sendPparam 로그 데이터
     * @returns {void}
     */
    sendAPPProcess: sendParam => {
      nativeMarketingUtil.ga360LoggerNativeSend(marketingUtil.ga360Logger.LOG_PAGE, sendParam)
    },

    /**
     * 전송 처리 - WEB
     *
     * @param {Object} sendPparam 로그 데이터
     * @returns {void}
     */
    sendWEBProcess: sendParam => {
      const browserVersion = marketingUtil.browserVersion()
      if (browserVersion === 'MSIE 5' || browserVersion === 'MSIE 6' || browserVersion === 'MSIE 7' || browserVersion === 'MSIE 8') {
        marketingUtil.ga360Logger.gaLoad.GTM = false
      }

      marketingUtil.ga360Logger.setGTMCustomDimension(sendParam)

      if (marketingUtil.ga360Logger.gaLoad.GTM) {
        marketingUtil.ga360Logger.setGTMCustomDimension(sendParam)

        // GTM 관련 js 로드
        const gtmLoad = (w, d, s, l, i) => {
          w[l] = w[l] || []
          w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          })
          const f = d.getElementsByTagName(s)[0]
          const j = d.createElement(s)
          const dl = l !== 'dataLayer' ? `&l=${l}` : ''
          j.async = true
          j.src = `${marketingUtil.ga360Logger.GA360_GTM_JS_PATH}?id=${i}${dl}`
          f.parentNode.insertBefore(j, f)
        }
        gtmLoad(window, document, 'script', 'dataLayer', marketingUtil.ga360Logger.GTM_CODE)
      }
      if (marketingUtil.ga360Logger.gaLoad.GA) {
        window.ga('create', marketingUtil.ga360Logger.uaCode, 'auto', 'gp')
        window.ga('gp.set', 'anonymizeIp', true)
        window.ga('gp.require', 'ec')
        window.ga('gp.set', 'location', window.location.href)

        for (const key in sendParam) {
          if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
            switch (true) {
              case (key.indexOf('dimension') !== -1):
              case (key.indexOf('metric') !== -1):
              case (key.indexOf('title') !== -1):
              case (key.indexOf('userId') !== -1):
              case (key.indexOf('campaignContent') !== -1):
              case (key.indexOf('campaignId') !== -1):
              case (key.indexOf('campaignKeyword') !== -1):
              case (key.indexOf('campaignMedium') !== -1):
              case (key.indexOf('campaignSource') !== -1):
              case (key.indexOf('campaignName') !== -1):
              case (key.indexOf('referrer') !== -1):
                window.ga('gp.set', key, sendParam[key])
                break
            }
          }
        }

        if (!marketingUtil.ga360Logger.gaLoad.GTM) {
          marketingUtil.ga360Logger.gaPageDataSend(sendParam)
        }
      }
    },

    /**
     * GTM 정보 구성
     *
     * @param {Object} sendParam 로그 데이터
     * @returns {void}
     */
    setGTMCustomDimension: sendParam => {
      const gaInfo = {}
      for (const key in sendParam) {
        if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
          if (key.indexOf('dimension') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('userId') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('location') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('title') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('campaignContent') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('campaignId') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('campaignKeyword') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('campaignMedium') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('campaignName') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('campaignSource') !== -1) {
            gaInfo[key] = sendParam[key]
          }
          if (key.indexOf('referrer') !== -1) {
            gaInfo[key] = sendParam[key]
          }
        }
      }
      window.dataLayer = [gaInfo]
    },

    /**
     * 페이지 로그 전송
     *
     * @param {Object} sendPparam 로그 데이터
     * @returns {void}
     */
    gaPageDataSend: sendParam => {
      const gaInfo = {}
      gaInfo.hitType = marketingUtil.ga360Logger.HIT_TYPE.PAGE_VIEW // 'pageview'
      for (const key in sendParam) {
        if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
          switch (true) {
            case (key.indexOf('dimension') !== -1):
            case (key.indexOf('metric') !== -1):
            case (key.indexOf('title') !== -1):
            case (key.indexOf('userId') !== -1):
            case (key.indexOf('location') !== -1):
              gaInfo[key] = sendParam[key]
              break
            default:
              break
          }
        }
      }
      window.ga('gp.send', gaInfo)

      // 페이지 뷰 로그 전송후 사용된 값 Clear
      // if (localStorageUtil.get('GA.utm_ca') !== '' || localStorageUtil.get('GA.ga_re') !== '') {
      if (!isNull(localStorageUtil.get('GA.utm_ca')) || !isNull(localStorageUtil.get('GA.ga_re'))) {
        localStorageUtil.del('GA.ga_re')
        localStorageUtil.del('GA.utm_s')
        localStorageUtil.del('GA.utm_m')
        localStorageUtil.del('GA.utm_ca')
        localStorageUtil.del('GA.utm_co')
        localStorageUtil.del('GA.utm_t')
        localStorageUtil.del('GA.ga_url')
        localStorageUtil.del('GA.co_cd')
      }
      for (const key in sendParam) {
        if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
          window.ga('gp.set', key, null)
        }
      }
    },

    /**
     * 이벤트 로그 전송 - APP
     *
     * @param {Object} sendParam 로그 데이터
     * @returns {void}
     */
    gaEventDataSendAPP: sendParam => {
      nativeMarketingUtil.ga360LoggerNativeSend(marketingUtil.ga360Logger.LOG_EVENT, sendParam)
    },

    /**
     * 이벤트 로그 전송 - WEB
     *
     * @param {Object} sendParam 로그 데이터
     * @returns {void}
     */
    gaEventDataSendWEB: sendParam => {
      // 테스트 데이터 검증을 위한 부분
      let postfix = ''
      const hostType = marketingUtil.getHostType() // 호스트 정보
      switch (hostType.type) {
        case 'LOCAL':
        case 'UNIT':
        case 'DEV':
          // +9 시간
          postfix = `-${new Date(new Date().setTime(new Date().getTime() + (9 * 60 * 60 * 1000))).toISOString().substring(0, 16).replace(/-/gi, '').replace(/:/gi, '').replace('T', '')}`
          break
        case 'TEST':
        case 'PROD':
          postfix = ''
          break
        default:
          break
      }

      let category = ''
      let action = ''
      const gaInfo = {}
      gaInfo.hitType = marketingUtil.ga360Logger.HIT_TYPE.EVENT // 'event'
      for (const key in sendParam) {
        if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
          if (key.indexOf('dimension') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('metric') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('userId') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('location') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('title') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('eventLabel') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('eventValue') !== -1) {
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('eventCategory') !== -1) {
            category = sendParam[key]
            gaInfo[key] = sendParam[key]
          } else if (key.indexOf('eventAction') !== -1) {
            action = sendParam[key]
            gaInfo[key] = `${sendParam[key]}${postfix}`
          }
        }
      }

      if (category.length > 0 && action.length > 0) {
        window.ga('gp.send', gaInfo)
      } else {
        marketingUtil.log()('category or action is NULL...')
      }

      for (const key in sendParam) {
        if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
          window.ga('gp.set', key, null)
        }
      }
    },

    /**
     * e-Commerce 데이터 전송 - APP
     *
     * @param {Object} sendParam 로그 데이터
     * @returns {void}
     */
    gaECommerceDataSendAPP: sendParam => {
      nativeMarketingUtil.ga360LoggerNativeSend(marketingUtil.ga360Logger.LOG_ECOMMERCE, sendParam)
    },

    /**
     * e-Commerce 데이터 전송 - WEB
     *
     * @param {Object} sendParam 로그 데이터
     * @returns {void}
     */
    gaECommerceDataSendWEB: sendParam => {
      const gaAction = sendParam.ecommerceAction
      const gaProduct = sendParam.params

      let ecommerceAction = {}
      if (sendParam.ecommerceAction != null && sendParam.ecommerceStep !== marketingUtil.ga360Logger.GAEcommerceStepKey.promotionImpression && sendParam.ecommerceStep !== marketingUtil.ga360Logger.GAEcommerceStepKey.promotionClick) {
        ecommerceAction = sendParam.ecommerceAction
      }

      const gaInfo = {}

      for (const key in sendParam) {
        if (Object.prototype.hasOwnProperty.call(sendParam, key)) {
          switch (true) {
            case (key.indexOf('dimension') !== -1):
            case (key.indexOf('metric') !== -1):
            case (key.indexOf('title') !== -1):
            case (key.indexOf('userId') !== -1):
            case (key.indexOf('location') !== -1):
            case (key.indexOf('nonInteraction') !== -1):
              gaInfo[key] = sendParam[key]
              break
            default:
              break
          }
        }
      }

      switch (sendParam.ecommerceStep) {
        case marketingUtil.ga360Logger.GAEcommerceStepKey.impression:
          if (gaAction !== null && gaProduct !== null) {
            for (let i = 0; i < gaProduct.length; i++) {
              gaProduct[i].list = ecommerceAction.list
            }
            marketingUtil.ga360Logger.gaImpressionProduct(gaProduct)
          }
          break
        case marketingUtil.ga360Logger.GAEcommerceStepKey.detail:
        case marketingUtil.ga360Logger.GAEcommerceStepKey.click:
        case marketingUtil.ga360Logger.GAEcommerceStepKey.add:
        case marketingUtil.ga360Logger.GAEcommerceStepKey.remove:
        case marketingUtil.ga360Logger.GAEcommerceStepKey.checkout:
        case marketingUtil.ga360Logger.GAEcommerceStepKey.purchase:
        case marketingUtil.ga360Logger.GAEcommerceStepKey.refund:
          window.ga('gp.ec:setAction', sendParam.ecommerceStep, ecommerceAction)
          if (gaProduct !== null) {
            marketingUtil.ga360Logger.gaProduct(gaProduct)
          }
          break
        case marketingUtil.ga360Logger.GAEcommerceStepKey.promotionImpression:
          if (gaAction !== null) {
            marketingUtil.ga360Logger.gaPromotionWEB(gaAction)
          }
          break
        case marketingUtil.ga360Logger.GAEcommerceStepKey.promotionClick:
          window.ga('gp.ec:setAction', 'promo_click')
          if (gaAction !== null) {
            marketingUtil.ga360Logger.gaPromotionWEB(gaAction)
          }
          break
        default:
          break
      }
      //
      window.ga('gp.set', 'location', window.location.href)

      // 테스트 데이터 검증을 위한 부분
      let postfix = ''
      const hostType = marketingUtil.getHostType() // 호스트 정보
      switch (hostType.type) {
        case 'LOCAL':
        case 'UNIT':
        case 'DEV':
          // +9 시간
          postfix = `-${new Date(new Date().setTime(new Date().getTime() + (9 * 60 * 60 * 1000))).toISOString().substring(0, 16).replace(/-/gi, '').replace(/:/gi, '').replace('T', '')}`
          break
        case 'TEST':
        case 'PROD':
          postfix = ''
          break
        default:
          break
      }
      //
      window.ga('gp.send', marketingUtil.ga360Logger.HIT_TYPE.EVENT, `${marketingUtil.ga360Logger.HIT_TYPE.ECOMMERCE}${postfix}`, sendParam.ecommerceStep.replace(/^\w/, c => c.toUpperCase()), gaInfo)

      for (const key in gaInfo) {
        if (Object.prototype.hasOwnProperty.call(gaInfo, key)) {
          window.ga('gp.set', key, null)
        }
      }
    },

    /**
     * gaImpressionProduct
     *
     * @param {Object} gaProduct 제품정보
     * @returns {void}
     */
    gaImpressionProduct: gaProduct => {
      for (let i = 0; i < gaProduct.length; i++) {
        window.ga('gp.ec:addImpression', gaProduct[i])
      }
    },

    /**
     * gaProduct
     *
     * @param {Object} gaProduct 제품정보
     * @returns {void}
     */
    gaProduct: gaProduct => {
      for (let i = 0; i < gaProduct.length; i++) {
        window.ga('gp.ec:addProduct', gaProduct[i])
      }
    },

    /**
     * gaPromotionWEB
     *
     * @param {Object} gaAction 액션정보
     * @returns {void}
     */
    gaPromotionWEB: gaAction => {
      for (const key in gaAction) {
        if (Object.prototype.hasOwnProperty.call(gaAction, key)) {
          if (key.indexOf('promo') !== -1) {
            window.ga('gp.ec:addPromo', gaAction[key])
          }
        }
      }
    }
  },

  /**
   * AIQUA 로그
   */
  aiquaLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    AIQUA_JS_PATH: '//cdn.qgraph.io/dist/aiqua-wp.js',

    /**
     * 로그 유형
     */
    GET_SCRIPT: '1',
    USER_EVENT: '2',
    USER_PROFILE: '3',

    /**
     * 전송
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      // 푸쉬 수신 여부 조회 후 전송
      const handlerOptions = {
        callback: stringParams => {
          marketingUtil.log()('pushStateHandler', stringParams)

          const paramObj = JSON.parse(stringParams)
          paramObj.data.devicePushAgree = paramObj.pushState
          marketingUtil.log()('pushStateHandler', paramObj)

          // AIQUA WEB SDK script
          const hostType = marketingUtil.getHostType() // 호스트 정보
          let appId = ''
          if (typeof window.qg === 'undefined') {
            if (hostType.type === 'LOCAL' || hostType.type === 'TEST' || hostType.type === 'DEV' || hostType.type === 'UNIT') {
              appId = 'a59140c114660f2ef968'
            } else if (hostType.type === 'PROD') { // 운영
              appId = '966ef26ddcc00f25775f'
            }
            externalUtil.getScript(marketingUtil.aiquaLogger.AIQUA_JS_PATH).then(() => {
              window.AIQUA.init({
                appId,
                timeout: 5000
              })
              marketingUtil.aiquaLogger.makeAndSend(paramObj)
            })
          } else {
            marketingUtil.aiquaLogger.makeAndSend(paramObj)
          }
        },
        params: param,
        name: 'aiquaMarketingScriptPushStatHandler'
      }
      if (isOsApp()) {
        if (param.type === marketingUtil.aiquaLogger.USER_PROFILE) {
          param.pushState = ''
          param.data.devicePushAgree = ''
        }
        gettingPushStateHandler(handlerOptions)
      } else {
        if (param.type === marketingUtil.aiquaLogger.USER_PROFILE) {
          param.pushState = ''
          param.data.devicePushAgree = ''
        }
        handlerOptions.callback(JSON.stringify(param))
      }
    },

    /**
     * 데이터 구성 및 전송
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      if (param.type === marketingUtil.aiquaLogger.USER_PROFILE) {
        marketingUtil.aiquaLogger.userProfileToAIQUA(param.data.userId, param.data.name, param.data.email, param.data.phoneNumber, param.data.birthday, param.data.gender, param.data.loginStatus, param.data.devicePushAgree, param.data.notificationModifiedDate, param.data.isEmployee, param.data.level, param.data.inactiveUser, param.data.coCd, param.data.lastLogin)
      } else if (param.type === marketingUtil.aiquaLogger.USER_EVENT) {
        marketingUtil.aiquaLogger.userEventToAIQUA(param.data.event, param.data.params)
      }
    },

    /**
     * PC Web 상품상세 URL 생성함수
     *
     * @param {String} productId 상품 ID
     * @returns {String} PC WEB 상품상세 URL
     */
    makeWebProdUrl: productId => {
      return `${CONST.PC_HOST}/ProductDisplay?partNumber=${productId}`
    },

    /**
     * 모바일 상품상세 URL 생성 함수 (web일 경우 null)
     *
     * @param {String} productId 상품 ID
     * @returns {String} 모바일 상품상세 URL
     */
    makeMobileProdUrl: productId => {
      const hostType = marketingUtil.getHostType() // 호스트 정보

      if (hostType.type === 'LOCAL') {
        if (viewType() === 'android' || viewType() === 'ios') {
          return `nsmall://sendurl?page=product/${productId}`
        } else {
          return `https://devm2.nsmall.com/product/${productId}`
        }
      } else if (hostType.type === 'DEV' || hostType.type === 'UNIT') {
        if (viewType() === 'android' || viewType() === 'ios') {
          return `nsmall://sendurl?page=product/${productId}`
        } else {
          return `https://devm2.nsmall.com/product/${productId}`
        }
      } else if (hostType.type === 'PROD') {
        if (viewType() === 'android' || viewType() === 'ios') {
          return `nsmall://sendurl?page=product/${productId}`
        } else {
          return `https://m3.nsmall.com/product/${productId}`
        }
      } else if (hostType.type === 'TEST') {
        if (viewType() === 'android' || viewType() === 'ios') {
          return `nsmall://sendurl?page=product/${productId}`
        } else {
          return `https://testm2.nsmall.com/product/${productId}`
        }
      } else {
        marketingUtil.log()('Unknown Host Type...')
      }
    },

    /**
     * AIQUA 솔루션으로 사용자 이벤트 및 이벤트 파라미터 전송
     *
     * @param {string} aiquaEvent (필수) 이벤트 명
     * @param {object} [aiquaEventParameters={}] (필수) 이벤트 파라미터
     */
    userEventToAIQUA: (aiquaEvent, aiquaEventParameters = {}) => {
      marketingUtil.log()(aiquaEvent, aiquaEventParameters)
      if (isNull(aiquaEvent)) {
        return
      }

      // AIQUA로 전송할 파라미터
      const invoke = {
        aiquaEvent,
        aiquaEventParameters
      }

      // 이벤트 공통 파라미터 셋팅
      aiquaEventParameters.dev_mode = CONST.IS_DEV_MODE
      aiquaEventParameters.date = calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd')

      // 상품 정보 이벤트
      const productEvent = [
        'product_viewed',
        'product_added_to_wishlist',
        'product_added_to_cart',
        'product_removed_from_cart',
        'product_purchased'
      ]

      // 결제이벤트 목록 정의
      const checkoutEvent = ['checkout_completed']

      // 이벤트 파라미터 셋팅 및 전송 함수 호출
      // 상품 정보 이벤트일 경우 공통 파라미터(web_product_url, mobile_product_url) 추가
      if (productEvent.includes(invoke.aiquaEvent)) {
        invoke.aiquaEventParameters.web_product_url = marketingUtil.aiquaLogger.makeWebProdUrl(invoke.aiquaEventParameters.product_id)
        invoke.aiquaEventParameters.mobile_product_url = marketingUtil.aiquaLogger.makeMobileProdUrl(invoke.aiquaEventParameters.product_id)
      } else if (checkoutEvent.includes(invoke.aiquaEvent)) { // 결제 이벤트일 경우 공통 파라미터(aiquaValueToSum) 추가
        invoke.aiquaValueToSum = invoke.aiquaEventParameters.order_amount
      } else if (aiquaEvent === 'page_viewed') { // page_viewed
        invoke.aiquaEventParameters.pageId = marketingUtil.isKeyExisted(window.marketingRoute, 'name') ? window.marketingRoute.name : ''
      } else if (aiquaEvent === 'searched') { // searched
        invoke.aiquaEventParameters.searched_keyword = aiquaEventParameters.searched_keyword
      } else if (aiquaEvent === 'category_viewed') { // category_viewed
        invoke.aiquaEventParameters.category_name = aiquaEventParameters.category_name
      }

      if (isOsApp()) {
        nativeMarketingUtil.aiquaLoggerNativeSend(marketingUtil.aiquaLogger.USER_EVENT, invoke)
      } else {
        if (typeof window.qg !== 'undefined') {
          window.qg('event', invoke.aiquaEvent, invoke.aiquaEventParameters, invoke.aiquaValueToSum)
        }
      }
    },

    /**
     * AIQUA 솔루션으로 사용자 이벤트 또는 사용자 프로필 전송
     * '', "", null, undefined가 아닌 파라미터만 전송(기존파라미터를 덮어 씌우지 않도록 하기 위함)
     *
     * @param {number} aiquaUserId (필수) 고객 번호
     * @param {string} aiquaName (선택) 고객 이름
     * @param {string} aiquaEmail (선택) 고객 이메일 주소
     * @param {number} aiquaPhoneNumber (선택) 고객 전화번호
     * @param {string} aiquaBirthday (선택) 고객 생년월일
     * @param {string} aiquaGender (선택) 고객 성별
     * @param {string} aiquaLoginStatus (선택) 고객 로그인 여부
     * @param {string} aiquaDevicePushAgree (선택) 고객 디바이스 기준 푸시 수신동의 여부
     * @param {string} aiquaNotificationModifiedDate (선택) 고객 푸시 수신동의 여부 변경일
     * @param {string} aiquaIsEmployee (선택) 임직원 여부
     * @param {string} aiquaLevel (선택) 고객 등급
     * @param {string} aiquaInactiveUser (선택) 휴면 고객 여부
     * @param {string} aiquaCoCd (선택) 고객 유입 경로
     * @param {string} aiquaLastLogin (선택) qg_filter_last_login 값
     */
    userProfileToAIQUA: (aiquaUserId, aiquaName, aiquaEmail, aiquaPhoneNumber, aiquaBirthday, aiquaGender, aiquaLoginStatus, aiquaDevicePushAgree, aiquaNotificationModifiedDate, aiquaIsEmployee, aiquaLevel, aiquaInactiveUser, aiquaCoCd, aiquaLastLogin) => {
      const invoke = {}
      if (!isNull(aiquaUserId)) {
        invoke.user_id = aiquaUserId
      }
      if (!isNull(aiquaBirthday)) {
        invoke.birthday = aiquaBirthday
      }
      if (!isNull(aiquaGender)) {
        invoke.gender = aiquaGender
      }

      if (!isNull(aiquaLoginStatus)) {
        if (isOsApp()) {
          invoke.login_status = aiquaLoginStatus === 'Y'
          invoke.qg_filter_subscription_push = aiquaDevicePushAgree === 'Y' ? 'true' : 'false'
        }
      }
      if (!isNull(aiquaLastLogin)) {
        invoke.qg_filter_last_login = aiquaLastLogin === 'Y' ? 'true' : 'false'
      }
      if (!isNull(aiquaNotificationModifiedDate)) {
        invoke.notification_modified_date = aiquaNotificationModifiedDate
      }
      if (!isNull(aiquaIsEmployee)) {
        invoke.isEmployee = aiquaIsEmployee
      }
      if (!isNull(aiquaLevel)) {
        invoke.level = aiquaLevel
      }
      if (isNull(aiquaCoCd)) {
        aiquaCoCd = isOsApp() ? marketingUtil.APP_CO_CD : marketingUtil.WEB_CO_CD
      }
      if (isNull(aiquaInactiveUser) || aiquaInactiveUser === 'Y') {
        // invoke.isInactiveUser = aiquaInactiveUser
        // invoke.isInactiveUser = 'N'
        invoke.isInactiveUser = 'Y'
      } else {
        invoke.isInactiveUser = aiquaInactiveUser
      }
      if (!isNull(aiquaCoCd)) {
        invoke.co_cd = aiquaCoCd
      }
      invoke.media = viewType() // 고객 접속 매체

      invoke.dev_mode = CONST.IS_DEV_MODE // 개발/운영 데이터 구분 (true : 개발 / false : 운영)

      if (isOsApp()) {
        nativeMarketingUtil.aiquaLoggerNativeSend(marketingUtil.aiquaLogger.USER_PROFILE, invoke)
      } else {
        if (typeof window.qg !== 'undefined') {
          window.qg('identify', invoke)
        }
      }
    }
  },

  /**
   * Facebook Pixel 로그
   */
  fbpixelLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    FBPIXEL_JS_PATH: '//connect.facebook.net/en_US/fbevents.js',

    /**
     * 픽셀 ID
     */
    PIXEL_ID: '1164815017046073',

    /**
     * track 값
     */
    EVENT: {
      PAGE_VIEW: 'PageView',
      VIEW_CONTENT: 'ViewContent',
      ADD_TO_CART: 'AddToCart',
      COMPLETE_REGISTRATION: 'CompleteRegistration',
      PURCHASE: 'Purchase'
    },

    /**
     * 전송
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      const fbpixelLoadScriptFunc = (f, b, e, v, n, t, s) => {
        if (f.fbq) {
          return
        }
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) {
          f._fbq = n
        }
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        const t1 = b.createElement(e)
        t1.async = !0
        t1.src = v
        const s1 = b.getElementsByTagName(e)[0]
        s1.parentNode.insertBefore(t1, s1)
      }

      if (typeof window.fbq === 'undefined') { // FBPIXEL_JS_PATH 로딩 체크
        fbpixelLoadScriptFunc(window, document, 'script', marketingUtil.fbpixelLogger.FBPIXEL_JS_PATH)

        window.fbq('init', marketingUtil.fbpixelLogger.PIXEL_ID)

        marketingUtil.fbpixelLogger.makeAndSend(param)
      } else {
        marketingUtil.fbpixelLogger.makeAndSend(param)
      }
    },

    /**
     * 데이터 구성 및 전송 처리
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      window.fbq('track', marketingUtil.fbpixelLogger.EVENT.PAGE_VIEW)

      // 전송 처리
      marketingUtil.fbpixelLogger.pixelSendWEB(param)
    },

    /**
     * 전송 처리 - WEB
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    pixelSendWEB: param => {
      if (isNull(param.data)) {
        window.fbq('track', param.type)
      } else {
        window.fbq('track', param.type, param.data)
      }
    }
  },

  /**
   * Airbridge 로그
   */
  airbridgeLogger: {
    /**
     * 추가되는 스크립트 파일 경로
     */
    AIRBRIDGE_JS_PATH: '//static.airbridge.io/sdk/latest/airbridge.min.js',

    /**
     * Airbridge 설정
     */
    DEV_APP_NAME: 'nsmall',
    DEV_WEB_TOKEN: '0806667fb5474393a928b23b8e4d00c0',
    TEST_APP_NAME: 'nsmall',
    TEST_WEB_TOKEN: '0806667fb5474393a928b23b8e4d00c0',
    PROD_APP_NAME: 'nsmall',
    PROD_WEB_TOKEN: '0806667fb5474393a928b23b8e4d00c0',
    appName: '',
    webToken: '',

    /**
     * Event
     */
    EVENT: {
      // 기본 이벤트
      SIGN_UP: 'airbridge.user.signup', // 회원가입
      SIGN_IN: 'airbridge.user.signin', // 로그인
      SIGN_OUT: 'airbridge.user.signout', // 로그아웃
      HOME_VIEW: 'airbridge.ecommerce.home.viewed', // 홈 화면 조회
      PRODUCT_DETAILS_VIEW: 'airbridge.ecommerce.product.viewed', // 상품상세 조회
      PRODUCT_LIST_VIEW: 'airbridge.ecommerce.productList.viewed', // 상품목록 조회
      SEARCH_RESULT_VIEW: 'airbridge.ecommerce.searchResults.viewed', // 검색결과 조회
      ADDED_TO_CART: 'airbridge.ecommerce.product.addedToCart', // 장바구니 담기
      PURCHASED: 'airbridge.ecommerce.order.completed', // 결제
      // 사용자 이벤트
      CANCELED: 'airbridge.ecommerce.order.canceled', // 구매취소
      ADD_WISHLIST: 'add_wishlist', // 찜
      PRODUCT_CHART: 'view_productchart', // 편성표 조회
      ITEM_SHOP: 'view_itemshop___CATEGORY_NM__', // 편성매장 조회. __CATEGORY_NM__: 매장코드명
      APP_START: 'view_appstart' // 앱의 Splash Image 조회시
    },

    /**
     * 전송
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      const airbridgeLoadScriptFunc = (a_, i_, r_, _b, _r, _i, _d, _g, _e) => {
        if (!a_[_b]) {
          const d = {
            queue: []
          }
          _r.concat(_i).forEach(function (a) {
            const i_ = a.split('.')
            const a_ = i_.pop()
            i_.reduce(function (a, i_) {
              a[i_] = a[i_] || {}
              return a[i_]
            }, d)[a_] = function () {
              d.queue.push([a, arguments])
            }
          })
          a_[_b] = d
          a_ = i_.getElementsByTagName(r_)[0]
          i_ = i_.createElement(r_)
          i_.onerror = function () {
            d.queue.filter(function (a) {
              return _i.indexOf(a[0]) >= 0
            }).forEach(function (a) {
              a = a[1]
              a = a[a.length - 1]
              typeof a === 'function' && a('error occur when load airbridge')
            })
          }
          i_.async = 1
          i_.src = marketingUtil.airbridgeLogger.AIRBRIDGE_JS_PATH
          a_.parentNode.insertBefore(i_, a_)
        }
      }

      if (typeof window.airbridge === 'undefined') { // AIRBRIDGE_JS_PATH 로딩 체크
        airbridgeLoadScriptFunc(window, document, 'script', 'airbridge', 'init setBanner setDownload setDownloads setDeeplinks sendSMS sendWeb setUserAgent setUserAlias addUserAlias setMobileAppData setUserId setUserEmail setUserPhone setUserAttributes setDeviceIFV setDeviceIFA setDeviceGAID events.send events.signIn events.signUp events.signOut events.purchased events.addedToCart events.productDetailsViewEvent events.homeViewEvent events.productListViewEvent events.searchResultViewEvent'.split(' '), ['events.wait'])

        const hostType = marketingUtil.getHostType() // 호스트 정보
        if (hostType.type === 'LOCAL') {
          marketingUtil.airbridgeLogger.appName = marketingUtil.airbridgeLogger.DEV_APP_NAME
          marketingUtil.airbridgeLogger.webToken = marketingUtil.airbridgeLogger.DEV_WEB_TOKEN
        } else if (hostType.type === 'DEV' || hostType.type === 'UNIT') {
          marketingUtil.airbridgeLogger.appName = marketingUtil.airbridgeLogger.DEV_APP_NAME
          marketingUtil.airbridgeLogger.webToken = marketingUtil.airbridgeLogger.DEV_WEB_TOKEN
        } else if (hostType.type === 'TEST') {
          marketingUtil.airbridgeLogger.appName = marketingUtil.airbridgeLogger.TEST_APP_NAME
          marketingUtil.airbridgeLogger.webToken = marketingUtil.airbridgeLogger.TEST_WEB_TOKEN
        } else if (hostType.type === 'PROD') {
          marketingUtil.airbridgeLogger.appName = marketingUtil.airbridgeLogger.PROD_APP_NAME
          marketingUtil.airbridgeLogger.webToken = marketingUtil.airbridgeLogger.PROD_WEB_TOKEN
        } else {
          marketingUtil.log()('Unknown Host Type...')
          return
        }

        // 초기화
        window.airbridge.init({
          app: marketingUtil.airbridgeLogger.appName,
          webToken: marketingUtil.airbridgeLogger.webToken
        })

        marketingUtil.airbridgeLogger.makeAndSend(param)
      } else {
        marketingUtil.airbridgeLogger.makeAndSend(param)
      }
    },

    /**
     * 데이터 구성 및 전송 처리
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    makeAndSend: param => {
      // 전송 처리
      isOsApp() ? marketingUtil.airbridgeLogger.eventSendAPP(param) : marketingUtil.airbridgeLogger.eventSendWEB(param)
    },

    /**
     * 전송 처리 - APP
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    eventSendAPP: param => {
      nativeMarketingUtil.airbridgeLoggerNativeSend(param.event, param)
    },

    /**
     * 전송 처리 - WEB
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    eventSendWEB: param => {
      switch (param.event) {
        case marketingUtil.airbridgeLogger.EVENT.SIGN_UP: // 회원가입
          window.airbridge.events.signUp(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.SIGN_IN: // 로그인
          param.data.userID = String(loginUtil.getUserInfo('userId')) // user id
          window.airbridge.events.signIn(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.SIGN_OUT: // 로그아웃
          window.airbridge.events.signOut(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.HOME_VIEW: // 홈 화면 조회
          window.airbridge.events.homeViewEvent(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.PRODUCT_DETAILS_VIEW: // 상품상세 조회
          window.airbridge.events.productDetailsViewEvent(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.PRODUCT_LIST_VIEW: // 상품목록 조회
          window.airbridge.events.productListViewEvent(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.SEARCH_RESULT_VIEW: // 검색결과 조회
          window.airbridge.events.searchResultViewEvent(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.ADDED_TO_CART: // 장바구니 담기
          window.airbridge.events.addedToCart(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.PURCHASED: // 결제
          window.airbridge.events.purchased(param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.CANCELED: // 구매취소
          window.airbridge.events.send(param.event, param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.ADD_WISHLIST: // 찜
          window.airbridge.events.send(param.event, param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.PRODUCT_CHART: // 편성표 조회
          window.airbridge.events.send(param.event, param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP: // 편성매장
          param.event = replaceAll(marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, '__CATEGORY_NM__', param.data.categoryNm)
          window.airbridge.events.send(param.event, param.data)
          break
        case marketingUtil.airbridgeLogger.EVENT.APP_START: // 앱 실행시 Splash 이미지 조회
          window.airbridge.events.send(param.event, param.data)
          break
        default:
          break
      }
    }
  },

  /**
   * 공통 로그 - 한번 호출하여 N개의 로그 전송 (AS-IS의 targeting.sendLogging())
   */
  commonLogger: {
    /**
     * 전송
     *
     * @param {Object} param 로그 데이터
     * @returns {void}
     */
    send: param => {
      // 마케팅 스크립트 사용 여부
      if (!marketingUtil.isMarketingScriptUse) {
        return
      }

      marketingUtil.log()('send(param)', param)

      // Recobell
      marketingUtil.recobellLogger.send(param)

      // DTSI
      marketingUtil.dtsiLogger.send(param)

      // GA 360
      param.type = marketingUtil.ga360Logger.LOG_PAGE
      marketingUtil.ga360Logger.send(param)
    }
  },

  /**
   * 마케팅 스크립트 로거
   *
   * @returns {Object} 로깅 함수
   */
  log () {
    const hostType = marketingUtil.getHostType() // 호스트 정보
    if (hostType.type === 'UNIT' || hostType.type === 'PROD') { // 유닛 테스트, 운영
      return () => {}
    }
    // LOCAL/DEV/UNIT/TEST
    const args = Array.prototype.slice.call(arguments)
    args.unshift('MARKETING-SCRIPT')
    return Function.prototype.bind.call(console.log, console, args)
  }
}

export default marketingUtil
