<template>
  <loading-page text="처리중입니다." />
</template>

<script>
import {
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
      requestParam: '',
      callbackName: ''
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
      if (isOsApp()) { // APP
        if (viewType() === 'ios') {
          this.callbackName = window.opener.vm.callbackName
        } else {
          this.callbackName = window.vm.callbackName
        }
      } else { // WEB
        this.callbackName = window.opener.vm.callbackName
      }
      console.log('ysjoo>>callbackName', this.callbackName)
      this.requestParam = this.getBroadCastParam()
      if (this.callbackName === 'callbackNspayPasswordChangeResult') {
        if (isOsApp() && viewType() === 'android') { // APP
          window.vm.callbackNspayPasswordChangeResult({ cmd: 'callbackNspayPasswordChangeResult', params: this.requestParam })
        } else { // WEB
          window.opener.vm.callbackNspayPasswordChangeResult({ cmd: 'callbackNspayPasswordChangeResult', params: this.requestParam })
        }
      } else if (this.callbackName === 'callbackNspayPasswordResult') {
        if (isOsApp() && viewType() === 'android') { // APP
          window.vm.callbackNspayPasswordResult({ cmd: 'callbackNspayPasswordResult', params: this.requestParam })
        } else { // WEB
          console.log('ysjoo>>this.requestParam', this.requestParam)
          window.opener.vm.callbackNspayPasswordResult({ cmd: 'callbackNspayPasswordResult', params: this.requestParam })
        }
      } else if (this.callbackName === 'callbackNspayInfoResult') {
        if (isOsApp() && viewType() === 'android') { // APP
          window.vm.callbackNspayInfoResult({ cmd: 'callbackNspayInfoResult', params: this.requestParam })
        } else { // WEB
          window.opener.vm.callbackNspayInfoResult({ cmd: 'callbackNspayInfoResult', params: this.requestParam })
        }
      } else if (this.callbackName === 'callbackNspayRegister') {
        if (isOsApp() && viewType() === 'android') { // APP
          window.vm.callbackNspayRegister({ cmd: 'callbackNspayRegister', params: this.requestParam })
        } else { // WEB
          window.opener.vm.callbackNspayRegister({ cmd: 'callbackNspayRegister', params: this.requestParam })
        }
      }

      if (isOsApp()) { // APP
        if (viewType() === 'ios') {
          window.close()
        } else {
          nativeUtil.closeWebView()
        }
      } else { // WEB
        window.close()
      }
    },
    /**
     * 닫기
     * @returns {void}
     */
    onclickClose () {
      if (this.callbackName === 'callbackNspayPasswordResult') {
        if (isOsApp()) { // APP
          window.vm.callbackNspayPasswordResult({ cmd: 'close', params: '' })
        } else { // WEB
          window.opener.vm.callbackNspayPasswordResult({ cmd: 'close', params: '' })
        }
      } else if (this.callbackName === 'callbackNspayInfoResult') {
        if (isOsApp()) { // APP
          window.vm.callbackNspayInfoResult({ cmd: 'close', params: '' })
        } else { // WEB
          window.opener.vm.callbackNspayInfoResult({ cmd: 'close', params: '' })
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
