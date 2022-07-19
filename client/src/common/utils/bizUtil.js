import COMMON_CONST from '@constants/common/common'
import COMM_CONST from '@constants/framework/constants'
import LOGIN_CONST from '@constants/customer/login'
import nsaxios from '@frameworks/axiosUtil'
import {
  calcDate,
  getDateParse
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import popupUtil from '@frameworks/popupUtil'
import toastUtil from '@frameworks/toastUtil'
import {
  isOsApp,
  isNull,
  gotoInternalPage,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import marketingUtil from '@utils/marketingUtil'
import router from '@/router'
import $store from '@/vuex'
import localStorageUtil from '@frameworks/localStorageUtil'
import NATIVE_CONST from '@constants/framework/native'
import MEMBER_CONST from '@constants/customer/member'

const bizUtil = {
  /**
   * 신용카드사 코드의 이름 조회
   *
   * @param {String} cardCode 신용카드사 코드
   * @returns {String} 카드사명
   */
  getCreditCardCodeName: cardCode => {
    if (cardCode !== null && cardCode.length < 3) {
      cardCode = `000${cardCode}`
      cardCode = cardCode.substring(cardCode.length - 3, cardCode.length)
    }
    const paymentCardCode = {
      '029': '신한',
      '027': '현대',
      '031': '삼성',
      '008': '외환',
      '026': '비씨',
      '016': '국민',
      '047': '롯데',
      '045': '(신)롯데',
      '018': 'NH농협',
      '006': '하나SK',
      '022': '씨티',
      '021': '우리',
      '002': '광주',
      '017': '수협',
      '010': '전북',
      '011': '제주',
      '001': '조흥',
      '058': '산업',
      '050 ': '해외 VISA',
      '028': '해외 JCB',
      '048': '동양 다이너스',
      '046': '동양 해외',
      '049': '해외 MASTER',
      '081': '은련'
    }

    return paymentCardCode[cardCode] || ''
  },
  /**
   * 장바구니 상품 개수 가져온 후 상단 장바구니 아이콘 상품 개수 세팅
   * @returns {Promise}
   */
  getCartCount: () => {
    return nsaxios.post('NSBasketCountCmdReal', {}, data => {
      const count = data?.msg?.common ? data.msg.common.basketCnt : 0 // bjw add: communication failure, defence error.
      bizUtil.setCartCount(count)
    })
  },
  /**
   * 상단 장바구니 아이콘 상품 개수 세팅
   *
   * @param {Number} [count=0] 장바구니 상품 개수
   */
  setCartCount: (count = 0) => {
    $store.commit('cart/setCartIconCount', count)
  },
  /**
   * 카드번호 중간 4자리 *표 표시
   * <pre>
   * "1234-5678-****-1234" = formatCardNoWithAsterisk("1234567856781234");
   * "1234-5678-****-1234" = formatCardNoWithAsterisk("1234-5678-5678-1234");
   * </pre>
   *
   * @param {string} cardNo 카드번호
   * @returns {string} 별표 처리된 카드번호
   */
  formatCardNoWithAsterisk: cardNo => {
    if (cardNo !== null && cardNo.length === 16) {
      return `${cardNo.substring(0, 4)}-${cardNo.substring(4, 8)}-****-${cardNo.substring(12, 16)}`
    }
    return cardNo
  },
  /**
   * espot 데이터 공통 클릭 이벤트
   *
   * @param {string} target 이동할 타겟 구분(Product, Category, Internal, External)
   * @param {string} contentsId 컨텐츠 ID
   * @param {string} clickCode 이동할 상품코드 또는 카테고리코드
   * @param {string} espotId ESPOT ID
   * @param {string} mdUrl 이동할 md URL
   * @param {string} [catalogId] 카탈로그 ID
   * @param {String} [clksrc] - 전자상거래코드
   */
  espotClickEvent (target, contentsId, clickCode, espotId, mdUrl, catalogId, clksrc) {
    if (isNull(mdUrl)) {
      return false
    }
    const invoke = {
      p_espotid: espotId,
      p_bannerid: contentsId
    }

    mdUrl = mdUrl.replace(/&amp;/g, '&')

    if (catalogId) {
      invoke.catalogId = catalogId
    }

    if (target === 'Product') {
      bizUtil.gotoProductDetail(clickCode, { clksrc })
    } else if (target === 'Category') {
      const categoryId = Number(clickCode)
      if (categoryId < 0) { // 기획전
        invoke.catgroupId = categoryId
        invoke.via = 'NSMALL'
        router.push({
          name: 'exhibitionDetail',
          query: invoke
        })
      } else {
        const categoryParam = {
          categoryId,
          searchGubun: '01'
        }
        nsaxios.post('NSMobileCategory', categoryParam, data => {
          if (data.msg.categoryInfo && data.msg.categoryInfo.categoryLevelFinal !== '1') { // 카테고리
            router.push({
              name: 'lnbCategory',
              params: {
                categoryNumber: clickCode
              }
            })
          } else { // 편집매장
            router.push({
              name: 'slotStore',
              params: {
                categoryId
              }
            })
          }
        })
      }
    } else if (target === 'Internal') { // 내부 경로
      gotoInternalPage(contentsId, espotId, mdUrl)
    } else if (target === 'External') { // 외부 경로
      // 외부경로가 자기자신(*.nsmall.com)일때는 내부경로로 이동
      if (mdUrl.indexOf('.nsmall.com') > -1) {
        mdUrl = mdUrl.replace(/https?:\/\/[^.]+\.nsmall\.com/gi, '')
        router.push({ path: mdUrl })
      } else {
        window.open(mdUrl, target, 'status=1,toolbar=1,location=1,menubar=1,directories=1,resizable=1,scrollbars=1')
      }
    } else {
      throw new Error(`clickTarget: [${target}] 오류입니다.`)
    }
  },
  /**
   * 메인 화면으로 이동
   */
  gotoMain: () => {
    if (isOsApp()) { // native 이면
      nativeUtil.goHome()
    } else {
      router.push({ name: 'storeHome' })
    }
  },
  /**
   * 로그인 페이지로 이동
   *
   * @param {string} [loginPopupType=LOGIN_CONST.LOGIN_POPUP_TYPE.GLOBAL] 로그인 레이어 팝업 타입 (범용 로그인 / 회원전용 로그인 / 상품구매 로그인)
   * @param {string} [name=null] 로그인 후 이동할 라우트명 (*Link.js 에 정의된 name키의 값). 미입력 시 이전 페이지로 이동
   * @param {boolean} [isAdult=false] 성인 인증 문구 노출 여부
   * @param {object} [loginParam=null] 로그인 페이지에 넘길 파라미터 정보
   */
  gotoLogin: (loginPopupType = LOGIN_CONST.LOGIN_POPUP_TYPE.GLOBAL, name = null, isAdult = false, loginParam = null) => {
    if (isOsApp()) { // APP
      // 로그인 후 이동할 라우트가 있으면 vuex store 에 저장. 없으면 현재 라우트를 저장.
      if (name) {
        $store.commit('login/setReturnRoute', { name })
      } else {
        const currentRoute = router.currentRoute
        const targetRouteName = 'appAside^storeHome^tvScheduleTable^tvShopping^shopPlus^happyDeal^slotStore' // Native Home
        if (!isNull(currentRoute) && targetRouteName.indexOf(currentRoute.name) < 0) {
          $store.commit('login/setReturnRoute', router.currentRoute)
          if (currentRoute.path.indexOf('product/review-list') > -1) {
            localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH, currentRoute.path)
          }
        }
      }

      if (name === 'custCenterBoardInquiryWrite') { // 1:1 문의하기
        localStorageUtil.set(NATIVE_CONST.STORAGE_KEY.LOGIN_REDIRECT_PATH, '/custcenter/board-inquiry/inquire')
      }

      // 로그인 페이지에 필요한 파라미터 Vuex Store에 저장 (router parameter로 넘기면 뒤로가기 시 사라지는 문제 때문에 Vuex Store에 저장)
      $store.commit('login/setLoginPopupType', loginPopupType)
      $store.commit('login/setIsAdultLogin', isAdult)
      $store.commit('login/setLoginParam', loginParam)
      const loginType = localStorageUtil.get(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE)
      if (!isNull(loginType) && loginType === 'general') { // Native 로그인
        localStorageUtil.del(NATIVE_CONST.STORAGE_KEY.LOGIN_TYPE)
        nativeUtil.presentLogin()
        nativeUtil.lnbHide()
      } else {
        if (isAdult) {
          router.replace({
            name: 'memberLogin'
          })
        } else {
          if (router.history.current.path === '/native/right-order-option') {
            router.replace({
              name: 'memberLogin'
            })
          } else {
            router.push({
              name: 'memberLogin'
            })
          }
        }
      }
    } else {
      // 로그인 후 이동할 라우트가 있으면 vuex store 에 저장. 없으면 현재 라우트를 저장.
      if (name) {
        $store.commit('login/setReturnRoute', { name })
      } else {
        $store.commit('login/setReturnRoute', router.currentRoute)
      }

      // 로그인 페이지에 필요한 파라미터 Vuex Store에 저장 (router parameter로 넘기면 뒤로가기 시 사라지는 문제 때문에 Vuex Store에 저장)
      $store.commit('login/setLoginPopupType', loginPopupType)
      $store.commit('login/setIsAdultLogin', isAdult)
      $store.commit('login/setLoginParam', loginParam)

      if (isAdult) {
        router.replace({
          name: 'memberLogin'
        })
      } else {
        router.push({
          name: 'memberLogin'
        })
      }
    }
  },
  /**
   * 상품 상세 페이지로 이동
   *
   * @param {string} partNumber 상품번호
   * @param {Object} [params={}] params
   */
  gotoProductDetail: (partNumber, params = {}) => {
    params.number = partNumber
    router.push({
      name: 'productDetail',
      params
    })
  },
  /**
   * 주문서로 이동
   *
   * @param {Object} params 주문 상품 정보
   */
  gotoOrdersheet: params => {
    // if (isOsApp()) { // APP
    //   nativeUtil.gotoOrderSheet(JSON.stringify(params))
    // } else { // WEB
    $store.commit('orderSheet/setOrderProduct', params)
    // }
  },
  /**
   * 상담신청 주문서로 이동
   *
   * @param {Object} params 주문 상품 정보
   */
  gotoOrderConsult: params => {
    // if (isOsApp()) { // APP
    //   nativeUtil.gotoOrderConsult(JSON.stringify(params))
    // } else { // WEB
    $store.commit('orderSheet/setOrderConsultProduct', params)
  },
  /**
   * 회원정보 수정으로 이동
   *
   */
  gotoMemberSetting: () => {
    router.push({ name: 'memberModifyIntro' })
  },
  /**
   * 찜 하기 / 찜 취소 토글
   *
   * @param {Object} e 클릭 이벤트 오브젝트
   * @param {String} catentryId 상품번호
   * @param {object} productInfo 상품정보
   * @return {Promise}
   */
  wishToggle (e, catentryId, productInfo) {
    // 비로그인시 메세지 없이 로그인 페이지로 이동.
    if (!loginUtil.isLoggedIn()) {
      bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER)
      return
    }

    const target = e.target
    const hasWishClass = target.classList.contains('on')
    const params = {
      catentryId
    }

    const callback = data => {
      if (data.msg.isSuccess) {
        if (hasWishClass) {
          target.classList.remove('on')
          toastUtil.show('찜 취소', 'toast_wish')

          // 마케팅 스크립트 적용 부분
          // GA360
          let eventCate = ''
          let eventAction = ''
          if (router.history.current.name === 'productDetail') {
            eventCate = 'MOBILE_상품상세'
            eventAction = '찜'
          } else if (router.history.current.name === 'shoppingHistory') {
            eventCate = 'MOBILE_최근본상품'
            eventAction = '최근본상품'
          }
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate,
              eventAction,
              eventLabel: '찜취소',
              params: {
                t1: null
              }
            }
          })
        } else {
          target.classList.add('on')
          toastUtil.show('찜 완료', 'toast_wish on')

          // 마케팅 스크립트 적용 부분
          // 데이터 구조 #1 : productInfo.productInfo
          // 데이터 구조 #2 : productInfo
          let tmpProductInfo = {}
          if (marketingUtil.isKeyExisted(productInfo, 'productInfo')) {
            tmpProductInfo = productInfo.productInfo
          } else {
            tmpProductInfo = productInfo
          }
          let prdName = ''
          if (!isNull(tmpProductInfo.prdInfo)) {
            prdName = tmpProductInfo.prdInfo.catentryNm
          } else if (!isNull(tmpProductInfo.productName)) {
            prdName = tmpProductInfo.productName
          } else if (!isNull(tmpProductInfo.subTextName)) {
            prdName = tmpProductInfo.subTextName.sub1
          }

          let prdPrice = Number('0')
          if (!isNull(tmpProductInfo.prdInfo)) {
            prdPrice = Number(String(tmpProductInfo.prdInfo.oriPrice).replaceAll(',', ''))
          } else if (!isNull(tmpProductInfo.offerPrice)) {
            prdPrice = Number(String(tmpProductInfo.offerPrice).replaceAll(',', ''))
          } else if (!isNull(tmpProductInfo.salePrice)) {
            prdPrice = Number(String(tmpProductInfo.salePrice).replaceAll(',', ''))
          }

          let imgPath = ''
          if (!isNull(tmpProductInfo.photoList)) {
            if (Array.isArray(tmpProductInfo.photoList) && tmpProductInfo.photoList.length > 0) {
              imgPath = `https:${tmpProductInfo.photoList[0].photoPath}`
            }
          } else if (!isNull(tmpProductInfo.imageUrl)) {
            imgPath = `https:${tmpProductInfo.imageUrl}`
          } else if (!isNull(tmpProductInfo.prdImgUrlOrCatTitleName)) {
            imgPath = `https:${tmpProductInfo.prdImgUrlOrCatTitleName}`
          }

          const params = {
            rcmdGbn: 'PRODUCT',
            rcmdValue: catentryId
          }
          nsaxios.post('NSRcmdCmd', params, function (data) {
            let channelId = ''
            if (data.msg.tcomYn === 'Y') {
              channelId = 'CTCOM'
            } else if (data.msg.tvYn === 'Y') {
              channelId = 'TV'
            } else {
              channelId = 'INT'
            }

            // AIQUA
            marketingUtil.aiquaLogger.send({
              type: marketingUtil.aiquaLogger.USER_EVENT,
              data: {
                event: 'product_added_to_wishlist',
                params: {
                  category_name: data.msg.catName,
                  product_id: catentryId,
                  product_name: prdName,
                  product_image_url: imgPath,
                  product_price: prdPrice,
                  product_channel: channelId,
                  md_name: data.msg.empNm,
                  md_team_name: data.msg.orgNm
                }
              }
            })
          })

          // GA360
          let eventCate = ''
          let eventAction = ''
          if (router.history.current.name === 'productDetail') {
            eventCate = 'MOBILE_상품상세'
            eventAction = '찜'
          } else if (router.history.current.name === 'shoppingHistory') {
            eventCate = 'MOBILE_최근본상품'
            eventAction = '최근본상품'
          }
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate,
              eventAction,
              eventLabel: '찜하기',
              params: {
                t1: null
              }
            }
          })
          if (!isNull(tmpProductInfo)) {
            let productCategoryName = ''
            if (!isNull(tmpProductInfo.mparam)) {
              if (!isNull(tmpProductInfo.mparam.cate1Nm)) {
                productCategoryName = htmlDecode(tmpProductInfo.mparam.cate1Nm)
              }
              if (!isNull(tmpProductInfo.mparam.cate2Nm)) {
                productCategoryName += `>${htmlDecode(tmpProductInfo.mparam.cate2Nm)}`
              }
              if (!isNull(tmpProductInfo.mparam.cate3Nm)) {
                productCategoryName += `>${htmlDecode(tmpProductInfo.mparam.cate3Nm)}`
              }
              if (!isNull(tmpProductInfo.mparam.cate4Nm)) {
                productCategoryName += `>${htmlDecode(tmpProductInfo.mparam.cate4Nm)}`
              }
              if (!isNull(tmpProductInfo.mparam.cate5Nm)) {
                productCategoryName += `>${htmlDecode(tmpProductInfo.mparam.cate5Nm)}`
              }
            }

            // Airbridge
            marketingUtil.airbridgeLogger.send({
              event: marketingUtil.airbridgeLogger.EVENT.ADD_WISHLIST, // 찜
              data: {
                semanticAttributes: { // 기본 이벤트처럼 전송하면 상품정보가 넘어가지 않는다.
                  products: [
                    {
                      productID: tmpProductInfo.partNumber, // 상품ID
                      name: tmpProductInfo.productName, // 상품명
                      price: Number(String(tmpProductInfo.salePrice).replaceAll(',', '')), // 가격
                      currency: 'KRW', // 통화
                      position: 1 // index
                    }
                  ]
                },
                customAttributes: {
                  categoryNm: productCategoryName,
                  gradeNm: loginUtil.getUserInfo('gradeNm')
                },
                action: '찜하기',
                label: '찜하기' // productCategoryName
              }
            })
          }
        }
      } else {
        let errorcallback = null
        // 성인인증 필요
        if (data.msg.resultCode === '19001') {
          errorcallback = () => {
            bizUtil.openCert(true, data => {
              const adultAuthYN = loginUtil.getUserInfo('adultAuthYN')

              if (!isNull(adultAuthYN) && adultAuthYN === 'Y') {
                bizUtil.wishToggle(e, catentryId)
              }
            })
          }
        }

        messageUtil.alert(data.msg.userMessage || '일시적으로 오류가 발생했습니다. 잠시 후 다시 시도 하시기 바랍니다.', errorcallback)
      }
    }
    return nsaxios.post(
      hasWishClass ? 'RemoveWish' : 'RegisterWish',
      params,
      callback
    )
  },
  /**
   * 본인/성인 인증 팝업 호출
   *
   * @param {boolean} isAdultDiv 성인인증 팝업으로 띄울 것인지 여부
   * @param {function} [callback] callback function
   */
  openCert (isAdultDiv, callback) {
    const param = {
      isAdultDiv,
      titleAlign: 'center',
      isShowSearch: false,
      isShowCart: false,
      title: (isAdultDiv ? '성인인증' : '본인인증')
    }

    popupUtil.show('customer/info/OrderNoMemberCertify', param, callback)
  },
  /**
   * 최근 본 상품 저장
   *
   * @param {object} productInfo 저장할 최근 본 상품 정보
   */
  setRecentlyViewedProducts (productInfo) {
    const recentlyViewedProducts = localStorageUtil.get(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS)

    const products = []
    productInfo.settime = calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss')
    if (recentlyViewedProducts === null || recentlyViewedProducts === '') {
      products.push(productInfo)
    } else {
      let isTrue = false

      for (let i = 0; i < recentlyViewedProducts.length; i++) {
        const info = recentlyViewedProducts[i]

        if (info != null) {
          const msecPerHour = 1000 * 60 * 60
          const writetime = getDateParse(info.settime)
          const readtime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
          const writeMonDay = writetime.getMonth() + writetime.getDate()
          const readMonDay = readtime.getMonth() + readtime.getDate()

          const interval = (readtime.getTime() - writetime.getTime())
          const hours = Math.floor(interval / msecPerHour)

          if (hours <= 30 * 24) { // 30일
            products.push(info)
            if (!isTrue) {
              isTrue = bizUtil.getHistoryPushFlag(productInfo, info, writeMonDay, readMonDay, isTrue)
            }
          }
        }
      }

      if (!isTrue) {
        if (products.length === 100) {
          products.shift()
        }

        products.push(productInfo)
      }
    }
    localStorageUtil.set(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS, JSON.stringify(products))
  },
  /**
   * 최근 본 상품 쌓는 여부 체크
   *
   * @param {object} dataInfo 저장할 최근 본 상품 정보
   * @param {object} hisInfo 저장된 최근 본 상품 정보
   * @param {string} writeMonDay 등록날짜
   * @param {string} readMonDay 현재날짜
   * @returns {boolean} 최근 본 상품 쌓는 여부
   */
  getHistoryPushFlag (dataInfo, hisInfo, writeMonDay, readMonDay) {
    if (writeMonDay === readMonDay) {
      if (hisInfo.hisGubun === COMMON_CONST.HISTORY_GUBUN.PRODUCT && dataInfo.partNumber === hisInfo.partNumber) { // 상품 중복 체크
        return true
      } else if (hisInfo.hisGubun === COMMON_CONST.HISTORY_GUBUN.CATEGORY && dataInfo.categoryId === hisInfo.categoryId) { // 카테고리 중복 체크
        return true
      } else if (hisInfo.hisGubun === COMMON_CONST.HISTORY_GUBUN.EXHIBITION && dataInfo.catgroupId === hisInfo.catgroupId) { // 기획전 중복 체크
        return true
      } else if (hisInfo.hisGubun === COMMON_CONST.HISTORY_GUBUN.EVENT && dataInfo.offerIdfr === hisInfo.offerIdfr) { // 이벤트 중복 체크
        return true
      }
    }

    return false
  },
  /**
   * 최근 본 상품 가져오기
   *
   * @returns {array} 최근 본 상품 목록
   */
  getRecentlyViewedProducts () {
    const recentlyViewedProducts = localStorageUtil.get(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS)
    if (!recentlyViewedProducts) {
      return null
    }

    const products = []
    for (let i = recentlyViewedProducts.length - 1; i >= 0; i--) {
      const info = recentlyViewedProducts[i]

      if (info != null) {
        const msecPerHour = 1000 * 60 * 60

        const settime = getDateParse(info.settime)
        const readtime = getDateParse(calcDate('', 0, 0, 0, 0, 'yyyy-MM-dd HH:mm:ss'))
        const interval = (readtime.getTime() - settime.getTime())
        const hours = Math.floor(interval / msecPerHour)
        info.realIndex = i

        if (hours <= 30 * 24) { // 30일
          products.push(info)
        }
      }
    }

    return products
  },
  /**
   * 최근 본 상품 삭제
   *
   * @param {number} index 삭제할 최근 본 상품 인덱스
   * @returns {array} 삭제 후 최근 본 상품 목록
   */
  delHistoryList (index) {
    const recentlyViewedProducts = localStorageUtil.get(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS)
    if (recentlyViewedProducts) {
      recentlyViewedProducts.splice(index, 1)

      localStorageUtil.set(COMM_CONST.STORAGE_KEY.USER_VISIT_HIS, JSON.stringify(recentlyViewedProducts))
    }

    return bizUtil.getRecentlyViewedProducts()
  },
  /**
   * Native 장바구니 카운트
   * @returns {void}
   */
  getNativeCartCount: () => {
    nsaxios.post('NSBasketCountCmdReal', {}, data => {
      const count = data.msg.common ? data.msg.common.basketCnt : 0
      nativeUtil.setCartCnt(JSON.stringify({ cartCnt: count }))
    })
  },
  /**
   * Native 장바구니 카운트
   * @param {String} jsonString 장바구니에 담을 상품정보
   * @returns {void}
   */
  setAddCart (jsonString) {
    const invokeParams = jsonString
    const successHandling = response => {
      const orderId = response.orderId
      if (orderId == null || orderId === '') {
        messageUtil.alert(response.errorMessageKey)
      } else {
        nativeUtil.setAddCartResult('Y')
      }
    }
    nsaxios.post('AjaxNSXorderItemAdd4Worklight', invokeParams, successHandling)
  },
  /**
   * 검색 레이어 팝업 호출
   *
   * @param {Object} param 검색 레이어 파라미터
   */
  openSearchLayer (param) {
    popupUtil.show('common/SearchLayer', param, null, false)
    if (isOsApp()) {
      nativeUtil.showVoiceSearch()
    }
  },
  /**
   * 사용자 탈퇴 여부 (필요한곳에서 호출할것)
   *
   * @returns {void}
   */
  async secessionMemberCheker () {
    let returnBoolean = false
    const invoke = {
      processFlag: 'List'
    }
    const successHandling = response => {
      if (!isNull(response.msg.root)) {
        const logonId = response.msg.root.PersonalInfo.logonId
        console.log('logonId >> ', logonId)

        if (isNull(logonId) || logonId.indexOf('DEL_') > -1) {
          if (isOsApp()) {
            const params = {
              msg: MEMBER_CONST.SECESSION,
              ok: '확인'
            }
            nativeUtil.lnbHide()
            loginUtil.logout('')
            nativeUtil.showAlert(JSON.stringify(params), '')
          } else {
            messageUtil.alert(MEMBER_CONST.SECESSION, () => {
              loginUtil.logout('')
            })
          }
        } else {
          returnBoolean = true
        }
      } else {
        returnBoolean = true
      }
    }

    if (loginUtil.getUserInfo('logonType') !== 'simple') {
      await nsaxios.post('MobilePersonalInfoManageCmdReal', invoke, successHandling)
    } else {
      returnBoolean = true
    }
    return returnBoolean
  }
}

export default bizUtil
