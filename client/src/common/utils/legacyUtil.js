import COMM_CONST from '@constants/framework/constants'
import nsaxios from '@frameworks/axiosUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import bizUtil from '@utils/bizUtil'
import {
  gettingPushStateHandler,
  isNull,
  isOsApp,
  replaceAll
} from '@utils/commonutil/commonUtil'
import externalUtil from '@utils/externalUtil'
import loginUtil from '@utils/loginUtil'
import router from '@/router'
import EVENT_CONST from '@constants/event/event'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

// function이 DB 조회 결과에 들어있어 legacy 그대로 유지해야만 하는 기능들
const legacyUtil = {
  HUB_INIT: {
    /**
     * 외부 유입경로 체크
     * @param {String} asIsUrl 3.0 개편 이전 URL
     * @param {String} toBeUrl 3.0 개편 이후 URL
     * @param {null|object} marketingScriptData - 마케팅 스크립트 데이터
     */
    checkInflowOutsideChannel: (asIsUrl, toBeUrl, marketingScriptData) => {
      if (!isNull(asIsUrl) && asIsUrl.includes('mw.nsmall.com')) {
        toBeUrl = asIsUrl
      }

      // 마케팅 스크립트관련 데이터가 있을 경우
      if (!isNull(marketingScriptData)) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: marketingScriptData.category,
            eventAction: marketingScriptData.action,
            eventLabel: marketingScriptData.label,
            params: {
              t1: null
            }
          }
        })
      }

      // 절대경로를 상대경로로 변경
      let path = ''
      if (!isNull(toBeUrl) && toBeUrl.includes('.nsmall.com/')) {
        path = `/${toBeUrl.substring(toBeUrl.indexOf('.com/') + 5)}`
      }

      let param = location.search
      if (path) {
        if (path.includes('?')) {
          param = path.substring(path.indexOf('?'))
          path = path.substring(0, path.indexOf('?'))
        }

        // 진입 예외처리
        if (path === 'TC') { // TVPD로 들어올경우 처리
          path = 'ProductDisplay'
          param = replaceAll(param, 'id', 'partNumber')
        }
      }

      const params = externalUtil.getBroadCastParam(param)

      if (path === 'ProductDisplay' && params.partNumber === null) {
        params.partNumber = localStorageUtil.get('SavePartNumber')
        if (params.partNumber !== '') {
          localStorageUtil.del('SavePartNumber')
        }
      }

      if (path === 'VodDetail' && params.vodId === null) {
        params.vodId = localStorageUtil.get('SaveVodId')
        if (params.vodId !== '') {
          localStorageUtil.del('SaveVodId')
        }
      }

      externalUtil.setGA360Values(params) // GA360 관련 값 localStorage 저장

      externalUtil.updateCocd(params) // cocd 체크 및 갱신

      if (params.campainId) {
        COMM_CONST.setCampaignId(params.campainId)
      }

      if (!path) {
        bizUtil.gotoMain()
        return
      }

      if (!path.startsWith('/')) {
        path = `/${path}`
      }

      if (isOsApp()) {
        nativeUtil.gotoDeepLinkUrl(toBeUrl)
      } else {
        router.push({
          path,
          query: params
        })
      }
    },
    /**
     * 쿠폰다운로드 호출 + 응모고객수
     *
     * @param {string} offerid (필수) 이벤트 ID
     * @param {null|object} marketingScriptData - 마케팅 스크립트 데이터
     * @returns {null|Promise}
     */
    doNsTimesEvent: (offerid, marketingScriptData) => {
      // 마케팅 스크립트관련 데이터가 있을 경우
      if (!isNull(marketingScriptData)) {
        // 마케팅 스크립트 적용 부분
        // GA360
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: marketingScriptData.category,
            eventAction: marketingScriptData.action,
            eventLabel: marketingScriptData.label,
            params: {
              t1: null
            }
          }
        })
      }

      // 이벤트 ID 체크
      if (isNull(offerid) || offerid.length === 0) {
        return
      }

      // 로그인 체크
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
        return
      }

      const param = {
        eventIdfr: offerid,
        flag: EVENT_CONST.FLAG_TYPE.USE_OFFER_NUM,
        mediaCd: EVENT_CONST.MEDIA_CD,
        eventDtlYn: 'Y',
        userId: loginUtil.getUserInfo('userId')
      }

      const callback = data => {
        messageUtil.alert(data.msg.root.rtnMsg)
        return data
      }
      return nsaxios.post('NSTimesPrmtEventCmd', param, callback)
    },
    /**
     * 앱 Link 화면 호출
     *
     * @param {*} likUrl
     */
    linkView (likUrl) {
      // if (viewType === 'android') {
      //   // TODO : App 새창 열기, 구현 전 까지는 새창 열기
      //   // Ns.Native.webView(1, likUrl)
      //   window.open(likUrl, '엔에스쇼핑')
      // } else if (viewType === 'ios') {
      //   // TODO : App 새창 열기
      //   // Ns.Native.linkView(2, likUrl)
      //   window.open(likUrl, '엔에스쇼핑')
      // } else {
      //   window.open(likUrl, '엔에스쇼핑')
      // }

      window.open(likUrl, '엔에스쇼핑')
    },
    /**
     * 푸시 수신 동의 쿠폰 다운로드
     *
     * @param {String|Array<String>} offerId 이벤트 ID
     */
    doNsTimesPushEvent (offerId) {
      if (isNull(offerId) || offerId.length === 0) {
        return
      }

      if (isOsApp()) {
        if (loginUtil.checkLogonStatus()) {
          const callback = resultJsonString => {
            if (JSON.parse(resultJsonString).pushState === 'Y') {
              // 응모하기 데이터 설정
              const invoke = {
                mediaCd: 'MOBIL',
                flag: '01',
                eventIdfr: offerId
              }

              // 이벤트 응모하기
              nsaxios.post('NSTimesPrmtEventCmd', invoke, data => {
                messageUtil.alert(data.msg.root.rtnMsg)
              })
            } else {
              messageUtil.alert("쇼핑알림 설정이 'ON' 상태이어야 참여 가능합니다.", () => {
                this.$router.push({ name: 'mypageSetting' })
              })
            }
          }

          // 푸쉬 수신 여부 조회
          gettingPushStateHandler({
            name: 'appPushStateHandler',
            callback
          })
        } else {
          messageUtil.alert('로그인 후 이용하실 수 있습니다.', () => {
            bizUtil.gotoLogin()
          })
        }
      } else {
        messageUtil.alert('앱에서만 참여 가능합니다.</br>앱 다운후 응모해주세요!')
      }
    },
    /**
     * 이벤트 팝업 클릭 시 쿠폰다운로드
     *
     * @param {String} couponId 쿠폰번호
     */
    doDownNsCoupon (couponId) {
      // 클릭 시 팝업을 hide시킨다
      const popupCloseEl = document.getElementById('popupBtnEventClose')
      if (popupCloseEl) {
        popupCloseEl.click()
      }

      // 쿠폰번호
      const coupon = couponId
      if (isNull(coupon) || coupon.length === 0) {
        return
      }

      // 로그인 여부
      if (!loginUtil.checkLogonStatus()) {
        bizUtil.gotoLogin()
        return
      }

      // 쿠폰 정보
      const params = {
        mediaCd: EVENT_CONST.MEDIA_CD,
        flag: EVENT_CONST.FLAG_TYPE.USE_COUPON_NUM,
        eventIdfr: coupon,
        co_cd: coupon
      }

      // 상품 상세 페이지에서만 사용
      const currentRoute = router.currentRoute
      if (currentRoute.name === 'productDetail') {
        params.partNumber = currentRoute.params.number // 상품코드
      }

      return nsaxios.post('NSTimesPrmtEventCmd', params, data => {
        messageUtil.alert(data.msg.root.rtnMsg)
      })
    },
    /**
     * 이벤트 유의사항 접기 / 펼치기
     */
    toggleNotice () {
      const eventNoticeContent = document.querySelector('.wrap_content')
      const eventNoticeArr = document.querySelectorAll('.icon_arr')
      const eventNoticeButton = document.querySelector('.wrap_notice .wrap_button')

      if (eventNoticeContent === null || eventNoticeButton === null) {
        return
      }

      if (eventNoticeContent.classList.contains('close')) {
        eventNoticeContent.classList.remove('close')
        eventNoticeArr.forEach(eventNotice => {
          eventNotice.classList.remove('close')
        })
      } else {
        eventNoticeContent.classList.add('close')
        eventNoticeArr.forEach(eventNotice => {
          eventNotice.classList.add('close')
        })
      }
    }
  }
}

export default legacyUtil
