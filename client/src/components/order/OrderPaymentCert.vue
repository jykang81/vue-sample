<template>
  <div v-show="isView">
    <iframe id="certView" :src="iframeSrc" title="결제 진행중" name="certView" />
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import messageUtil from '@frameworks/messageUtil'
import {
  objectToQueryString,
  viewType,
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import routerUtil from '@frameworks/routerUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      iframeSrc: '',
      isView: false
    }
  },
  created () {
    const params = this.param.orderPaymentParams
    params.MOB_RET_URL = `${location.origin}/payment/success`
    params.MOB_ERR_URL = `${location.origin}/payment/error`

    /**
     * 모바일 결제
     *
     * payType
     * -신용카드         : 100
     * -실시간계좌이체   : 300
     * -휴대폰소액결제   : 400
     * -페이코          : 1400
     * -네이버페이      : 1500
     */
    let url = ''
    let openUrl = ''
    const parameters = objectToQueryString(params, true)

    // 결제 타입에 따라 요청 Url 분기처리
    // 01. 신용카드
    if (PAY_TYPE_CONST.isCreditCard(params.payType)) {
      // 신한 직승인 추가 및 직승인 구분 변경
      // 직승인
      this.isView = true
      if (params.VAN_CO === '20') {
        if (params.moduleGubun === 'L') { // L : 롯데 직승인
          url = `https:${CONST.API_HOST}/nsmall/mobile/rocomo/smpi_mob_agent01.jsp?${parameters}`
        } else if (params.moduleGubun === 'I') { // I : ISP 직승인 (KB)
          url = `https:${CONST.API_HOST}/nsmall/mobile/isp/isp_mob_request.jsp?${parameters}`
        } else if (params.moduleGubun === 'P') { // P : payline 직승인 (신한)
          url = `https:${CONST.API_HOST}/nsmall/mobile/payline/payline_mob_request.jsp?${parameters}`
        }
      } else { // EasyPay
        url = `https:${CONST.API_HOST}/nsmall/mobile/kicc/easypay_mob_request.jsp?${parameters}`
      }
    } else if (PAY_TYPE_CONST.isRealtimeAccountTransfer(params.payType)) {
    // 실시간계좌이체 공인인증방식 에러 수정(안드로이드 APP에서만 오류) - web일때는 작동하고 android/iOS 구분이 중요해서 ios로 넘김
    // 기존 http로 호출하던것을 https로 수정
      if (viewType() === 'ios') {
        url = `https:${CONST.API_HOST}/nsmall/mobile/lguplus/lguplus_mob_request.jsp?MOB_VIEW_TYPE=ios&${parameters}`
      } else {
        url = `https:${CONST.API_HOST}/nsmall/mobile/lguplus/lguplus_mob_request.jsp?${parameters}`
      }
    } else if (PAY_TYPE_CONST.isMobile(params.payType)) {
      url = `https:${CONST.API_HOST}/nsmall/mobile/kg/kg_mob_request.jsp?${parameters}`
    } else if (PAY_TYPE_CONST.isPayco(params.payType)) {
      url = `https:${CONST.API_HOST}/nsmall/mobile/payco/payco_mob_request.jsp?${parameters}`
    } else if (PAY_TYPE_CONST.isNaverpay(params.payType)) {
      url = `https:${CONST.API_HOST}/nsmall/mobile/naverpay/naverpay_mob_request.jsp?${parameters}`

      if (viewType() !== 'ios' && viewType() !== 'android') {
        params.MOB_PASS = 'WEB'
        params.MOB_VIEW_TYPE = viewType()
        params.NAVERPAY_REQ_URL = `https:${CONST.API_HOST}/nsmall/mobile/naverpay/naverpay_mob_request.jsp?`
        const newParameters = objectToQueryString(params, true)
        const naverpayPopup = window.open(`https:${CONST.API_HOST}/nsmall/mobile/naverpay/naverpay_mob_request.jsp?${newParameters}`)
        if (isNull(naverpayPopup) && !isOsApp() && viewType() === 'iosweb') {
          // safari 팝업차단 안내 팝업을 띄운다.
          messageUtil.alert('팝업이 차단되어 있습니다.<br />팝업차단을 해제하신 후 다시 확인해 주세요.', () => {
            if (!isOsApp()) { // WEB
              this.$store.commit('popup/hide')
            }
          })
        } else {
          if (!isOsApp()) { // WEB
            this.$store.commit('popup/hide')
          }
        }
      } else {
        params.MOB_PASS = 'WEB'
        params.MOB_VIEW_TYPE = viewType()
        params.NAVERPAY_REQ_URL = `https:${CONST.API_HOST}/nsmall/mobile/naverpay/naverpay_mob_request.jsp?`
        const newParameters = objectToQueryString(params, true)
        window.open(`https:${CONST.API_HOST}/nsmall/mobile/naverpay/naverpay_mob_request.jsp?${newParameters}`)
      }
    } else if (PAY_TYPE_CONST.isNSPayCreditCard(params.payType) || PAY_TYPE_CONST.isNSPayAccountTransfer(params.payType)) {
      url = `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_request.jsp?${parameters}`
    }

    if (isNull(params.target)) {
      params.target = 'payment'
    }

    openUrl = isOsApp() ? url : `${url}&MOB_PASS=WEB&MOB_VIEW_TYPE=${viewType()}`

    try {
      if (PAY_TYPE_CONST.isCreditCard(params.payType)) {
        /**
          * NSSR-365286 모바일 삼성카드, isp 결제시 간헐적 부모창 못찾는 이슈 개선
          * 크롬80제약사항 - 다른 사이트 간 이동을 POST로 전환하지 않아야함. 응답 URL은 HTTPS로 처리. 쿠키 생성시 설정 변경 : SameSite=None; Secure
          * window.open 팝업으로 호출 할 경우 크롬80 제약사항은 벗어나지만 opener를 잃어버리는 경우가 생겨 iframe에서 호출하게 수정
          * PG사 header에 'X-Frame-Options : SAMEORIGIN'으로 설정되어 있지 않을 경우 iframe사용 가능함
          */
        this.iframeSrc = openUrl
      } else if (PAY_TYPE_CONST.isNaverpay(params.payType)) {
        /**
          * 네이버페이 결제창은 새창으로 진행되는데 맥OS 사파리일 경우만
          * WL.App.openURL이 정상동작하지 않아서 팝업이 두개 뜨는 현상이 발생해서
          * 주문서 페이지 상단 iframe컨트롤을 제외한다
          */
      } else {
        // Chrome 80으로 update에 따른 PG사 연계 window.open으로 변경
        var popup = window.open(openUrl)
        if (isNull(popup) && !isOsApp() && viewType() === 'iosweb') {
          // safari 팝업차단 안내 팝업을 띄운다.
          messageUtil.alert('팝업이 차단되어 있습니다.<br />팝업차단을 해제하신 후 다시 확인해 주세요.', () => {
            if (!isOsApp()) { // WEB
              this.$store.commit('popup/hide')
            }
          })
        } else {
          if (!isOsApp()) { // WEB
            this.$store.commit('popup/hide')
          }
        }
      }
    } catch (e) {
      messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
        routerUtil.back()
      })
    }
  },
  mounted () {
    this.resize('certView')
    if (isOsApp()) { // WEB
      window.orderCertClose = this.orderCertClose
    }
  },
  methods: {
    /**
     * 닫기
     * @returns {void}
     */
    onclickClose () {
      this.$store.commit('popup/hide')
    },
    /**
     * iframe 사이즈 설정
     * @param {String} id - iframe id
     * @returns {void}
     */
    resize (id) {
      const iframe = document.getElementById(id)
      iframe.style.width = '100%'
      iframe.style.height = `${window.innerHeight}px`
      iframe.style.paddingTop = '48px'
    },
    /**
     * back
     * @returns {void}
     */
    orderCertClose () {
      nativeUtil.goBack()
    }
  }
}
</script>

<style>
  #certView {
    padding-top: 0 !important;
  }
</style>
