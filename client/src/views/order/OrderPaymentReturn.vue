<template>
  <loading-page text="결제 처리중입니다." />
</template>

<script>
import {
  isNull,
  iframePostMessage,
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@/common/frameworks/nativeUtil'

import LoadingPage from '@components/frameworks/LoadingPage'

export default {
  components: {
    LoadingPage
  },
  data () {
    return {
      requestParam: ''
    }
  },
  created () {
    this.requestParam = this.getBroadCastParam()
    if (this.requestParam.type === 'creditcard' || isNull(window.opener)) {
      iframePostMessage('callbackPaymentResult', this.requestParam)
    } else {
      if (isOsApp() && viewType() === 'android') { // APP
        window.vm.callbackResult({ cmd: 'callbackPaymentResult', params: this.requestParam })
        nativeUtil.closeWebView()
      } else { // WEB
        window.opener.vm.callbackResult({ cmd: 'callbackPaymentResult', params: this.requestParam })
        window.close()
      }
    }
  },
  methods: {
    /**
     * 닫기
     * @returns {void}
     */
    onclickClose () {
      if (this.requestParam.type === 'creditcard' || isNull(window.opener)) {
        iframePostMessage('close', '')
      } else {
        if (isOsApp() && viewType() === 'android') { // APP
          window.vm.callbackResult({ cmd: 'close', params: '' })
          nativeUtil.closeWebView()
        } else { // WEB
          window.opener.vm.callbackResult({ cmd: 'close', params: '' })
          window.close()
        }
      }
    },
    /**
     * 응답 파라미터 설정
     * @returns {void}
     */
    getBroadCastParam () {
      const nowAddress = window.location.href
      const param = {}
      let varName = ''
      let value = ''
      let parameters = ''

      if (nowAddress.indexOf('?') !== -1) {
        parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.length)).split('&')
        for (let i = 0; i < parameters.length; i++) {
          varName = decodeURIComponent(parameters[i].substring(0, parameters[i].indexOf('=')))

          try {
            if (varName !== 'EP_kvp_sessionkey' && varName !== 'EP_kvp_encdata') {
              value = decodeURIComponent(parameters[i].substring(parameters[i].indexOf('=') + 1, parameters[i].length))
            } else {
              value = parameters[i].substring(parameters[i].indexOf('=') + 1, parameters[i].length)
            }
          } catch (e) {
            console.error(e)
            value = parameters[i].substring(parameters[i].indexOf('=') + 1, parameters[i].length)
          }

          param[varName] = value
        }
      }
      return param
    }
  }
}
</script>
