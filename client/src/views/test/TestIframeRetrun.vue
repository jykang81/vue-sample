<template>
  <div>
    <!-- content-primary -->
    <div class="content-primary">
      <div class="pay_ing">
        <p class="subject2">
          <strong>결제가 진행중입니다. (return)</strong>
        </p>
        <p class="txt">
          본 창이 닫히지 않을 경우 <br>하단 확인 버튼을 터치해 주시기 바랍니다.
        </p>
        <div class="button-area content-fixed">
          <span>
            <a class="btn theme-a rate-a small" href="javascript:;" @click="onclickClose">
              <span>확인</span></a>
          </span>
        </div>
      </div>
    </div>
    <!-- //content-primary -->
  </div>
</template>

<script>
import {
  iframePostMessage
} from '@utils/commonutil/commonUtil'

export default {
  created () {
    const requestParam = this.getBroadCastParam()
    iframePostMessage('callbackPaymentResult', requestParam)
  },
  methods: {
    /**
     * 메인이동
     * @returns {void}
     */
    onclickClose () {
      iframePostMessage('close', '')
    },
    /**
     * getBroadCastParam
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

<style>

</style>
