<template>
  <div>&nbsp;</div>
</template>

<script>
// ASIS nsmall.native.js - showTermsWindows

import CONST from '@constants/framework/framework'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'

import {
  objectToQueryString,
  viewType,
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * init
     * @returns {void}
     */
    init () {
      const params = this.param.orderNspayParams
      params.MOB_RET_URL = `${location.origin}/payment/simple/nspay/success` // (ASIS) /html/common/return_payment.html
      params.MOB_ERR_URL = `${location.origin}/payment/simple/nspay/error` // (ASIS) /html/common/return_error.html
      params.accptPath = '500'

      let url = ''
      const parameters = objectToQueryString(params)

      console.log('ysjoo>>params.sendFlag>>>', params.sendFlag)
      if (params.sendFlag !== undefined && params.sendFlag === 'chgPW') {
        url = `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_chg_pw_req.jsp?${parameters}`
      } else if (params.sendFlag !== undefined && params.sendFlag === 'checkPW') {
        url = `https:${CONST.API_HOST}/nsmall/mobile/wpay/wpay_mob_check_pw_req.jsp?${parameters}`
      } else {
        url = `https:${CONST.API_HOST}/servlet/nsmall/NSOrder/NSOrderWPayTerms.jsp?easyDomainYn=Y&${parameters}`
      }

      if (isNull(params.target)) {
        params.target = 'payment'
      }

      try {
        if (isOsApp()) { // APP
          window.orderCertClose = this.orderCertClose
          if (viewType() === 'android') {
            window.open(`${url}&MOB_PASS=WEB&MOB_VIEW_TYPE=${viewType()}`)
          } else {
            console.log('ysjoo>>url>>>', url)
            window.open(`${url}&MOB_PASS=WEB&MOB_VIEW_TYPE=${viewType()}`)
          }
        } else {
          const popup = window.open(`${url}&MOB_PASS=WEB&MOB_VIEW_TYPE=${viewType()}`)
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
        console.error(e)
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    },
    /**
     * back
     * @returns {void}
     */
    orderCertClose () {
      if (viewType() === 'ios') {
        this.$store.commit('popup/hide')
      } else if (viewType() === 'android') {
        nativeUtil.goBack()
      }
    }
  }
}
</script>
