<template>
  <header class="app_header sub_page">
    <div class="header">
      <button
        type="button"
        class="back_btn"
        @click="goBack"
      >
        뒤로가기
      </button>
      <h1 class="sub_title center">
        {{ htmlDecode(pageTitle) }}
      </h1>
    </div>
  </header>
</template>

<script>
import routerUtil from '@frameworks/routerUtil'
import {
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  name: 'AppHeaderSub',
  data () {
    return {
      pageTitle: ''
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.meta !== null) {
        this.pageTitle = to.meta.title
        if (isOsApp()) { // APP
          nativeUtil.setBackBtnYn('Y')
          if (to.name === 'nativeHomeBridge') {
            nativeUtil.closeWebView()
          } else if (to.name === 'memberLogin' && from.name === 'orderSheet') {
            nativeUtil.closeWebView()
          } else if (to.name === 'memberLogin' && from.name === 'orderConsultSheet') {
            nativeUtil.closeWebView()
          }
        }
      }
    }
  },
  created () {
    if (this.$route.meta !== null) {
      this.pageTitle = this.$route.meta.title
    }
  },
  mounted () {
    if (isOsApp()) { // APP
      nativeUtil.setBackBtnYn('Y')
    }
  },
  methods: {
    htmlDecode,
    /**
     * back 이동(App일때 홈으로 이동의 경우 홈으로 이동)
     */
    goBack () {
      // console.log(':::' + this.$route.name)
      if (isOsApp() && this.$route.name === 'memberComplete') { // 회원가입완료이면 Home으로 이동
        nativeUtil.goHome()
      } else if (isOsApp() && (this.$route.params.backflag === 'home' || this.$route.name === 'orderComplete' || this.$route.name === 'facebookJoinComplete')) {
        nativeUtil.closeWebView()
      } else {
        routerUtil.back()
      }
    }
  }
}
</script>
