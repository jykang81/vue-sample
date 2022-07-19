<template>
  <div />
</template>

<script>
import {
  isOsApp,
  viewType
} from '@utils/commonutil/commonUtil'

export default {
  created () {
    this.onLoad()
  },
  methods: {
    /**
     * url get parameter 인증정보를 Object형식으로 변환하여 부모창에 전달
     *
     * @returns {void}
     */
    onLoad () {
      const nowAddress = window.location.href
      const param = {}
      let varName = ''
      let value = ''
      let parameters = ''

      if (nowAddress.indexOf('?') !== -1) {
        parameters = (nowAddress.slice(nowAddress.indexOf('?') + 1, nowAddress.length)).split('&')
        for (let i = 0; i < parameters.length; i++) {
          varName = decodeURIComponent(parameters[i].split('=')[0])
          value = decodeURIComponent(parameters[i].split('=')[1])
          param[varName] = value
        }
      }

      if (isOsApp() && viewType() === 'android') { // APP
        window.vm.certSuccess(param)
      } else {
        window.opener.vm.certSuccess(param)
        window.close()
      }
    }
  }
}
</script>
