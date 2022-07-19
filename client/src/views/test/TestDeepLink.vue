<template>
  <div>
    <h1>2021-01-25</h1>
    <!-- <a @click="onClickDeepLink('web')">Fallback Mobile web</a>
    <br><br>
    <a @click="onClickDeepLink('app')">Fallback App</a> -->
  </div>
</template>

<script>
export default {
  name: 'TestDeepLink',
  data () {
    return {
      mbUrl: '',
      installCheck: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * Created Hook
     */
    init () {
      this.mbUrl = 'mw.nsmall.com' // 운영
      if (location.host === 'devm2.nsmall.com') { // 개발
        this.mbUrl = 'devm2.nsmall.com'
      } else if (location.host === 'testm2.nsmall.com') { // 테스트
        this.mbUrl = 'testm2.nsmall.com'
      }
      setTimeout(() => { this.checkDevice('app') }, 1000)
    },
    /**
     * Onclick 이벤트
     */
    onClickDeepLink (device) {
      setTimeout(() => { this.checkDevice(device) }, 1000)
    },
    /**
     * 테스트용 Param
     */
    getUrlParams () {
      // const params = 'ProductDisplay?partNumber=27260092&co_cd=1234' // 원본 AS-IS
      // const params = window.location.pathname.slice(1) // TO-BE Path 추출
      const params = 'store/theme/happydeal' // 테스트용 임시 Fallback URL
      return params
    },
    /**
     * Fallback (뒤로가기) 모바일 웹으로 URL 연결
     */
    setFallbackURL (params) {
      // 마켓 이동 후 뒤로가기 연결
      let sHidden = 'hidden'
      let sState = 'visibilityState'

      if (document.webkitVisibilityState) {
        sHidden = 'webkitHidden'
        sState = 'webkitVisibilityState'
      }
      // Visibility API를 지원하는 경우, visibilitychange 이벤트 리스너를 등록한다.
      if (document[sState]) {
        document.addEventListener(`${(document.webkitVisibilityState ? 'webkit' : '')}visibilitychange`, e => {
          // 페이지가 숨김 상태가 아닌경우
          if (!document[sHidden] && this.installCheck) {
            location.href = `http://${this.mbUrl}/${params}`
          }
        })
      }
    },
    /**
     * 앱 웹 여부에 따라 딥링크 분기 처리
     * adbrix url 삭제
     */
    checkDevice (device) {
      const appSchema = 'nsmall'
      const params = this.getUrlParams()
      const userAgent = navigator.userAgent.toLowerCase()
      const deepLinkUrl = `${appSchema}://sendurl?page=${params}`
      const AppStoreURL = 'https://itunes.apple.com/kr/app/nshomsyoping/id405015280?mt=8'
      const fallbackUrl = `https://${this.mbUrl}/${params}`
      let intentUrl = null
      if (device === 'web') {
        intentUrl = [
            `intent://sendurl?page=${params}#Intent`,
            `scheme=${appSchema}`,
            'package=com.nsmobilehub',
            `S.browser_fallback_url=${fallbackUrl}`,
            'end'
        ].join(';')
      } else if (device === 'app') {
        intentUrl = [
            `intent://sendurl?page=${params}#Intent`,
            `scheme=${appSchema}`,
            'package=com.nsmobilehub',
            'end'
        ].join(';')
      }
      this.setFallbackURL(params)
      if (userAgent.match('iphone') || userAgent.match('ipad')) { // iOS 딥링크 이동
        if (device === 'web') {
          this.moveApp(fallbackUrl, deepLinkUrl)
        } else if (device === 'app') {
          this.moveApp(AppStoreURL, deepLinkUrl)
        }
      } else if (userAgent.match('android')) { // AOS 딥링크 이동
        this.moveApp(fallbackUrl, intentUrl)
      } else {
        location.href = fallbackUrl
      }
    },
    /**
     * 딥링크 주소로 이동 처리
     */
    moveApp (url, applink) {
      this.installCheck = true
      const visitedAt = +new Date()
      setTimeout(() => {
        if (+new Date() - visitedAt < 2000) {
          location.href = url
        }
      }, 1500)
      location.href = applink
    }
  }
}
</script>
