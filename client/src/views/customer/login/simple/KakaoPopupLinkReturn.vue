<template>
  <div>
    <form
      name="reqKMCISForm"
    />
  </div>
</template>
<script>

export default {
  data () {
    return {
      retun_url: `${location.origin}/customer/login/simple/kakao`
    }
  },
  mounted () {
    this.onLoad()
  },
  methods: {
    /**
     * Kakao에서 전달받은 정보로 WCS API로 통신한다.
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
          varName = decodeURIComponent(parameters[i].substring(0, parameters[i].indexOf('=')))

          try {
            value = parameters[i].substring(parameters[i].indexOf('=') + 1, parameters[i].length)
          } catch (e) {
            value = parameters[i].substring(parameters[i].indexOf('=') + 1, parameters[i].length)
          }

          param[varName] = value
        }
      }
      param.entFlag = 'KAKAO'
      param.redirect_uri = this.retun_url

      window.opener.vm.snsDataCallBack(param)
      window.close()
    }
  }
}
</script>
