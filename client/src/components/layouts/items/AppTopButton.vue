<template>
  <button
    class="app_top_button"
    :style="{ display: topButtonDisplay }"
    @click="handleTopbuttonClick"
  >
    <span class="blind">위로</span>
  </button>
</template>

<script>
import throttle from 'lodash/throttle'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import {
  isiOS
} from '@utils/commonutil/commonUtil'

export default {
  name: 'AppTopButton',
  data () {
    return {
      THROTTLE_DELAY: 200, // 스크롤 이벤트 throttle delay
      topButtonDisplay: 'none' // 스크롤탑 toggle
    }
  },
  computed: {
    /**
     * 스크롤 이벤트 throttling
     *
     * @return {function} throttling된 updateScroll function
     */
    throttleFunc () {
      return throttle(this.pageTopToggle, this.THROTTLE_DELAY)
    }
  },
  created () {
    window.addEventListener('scroll', this.throttleFunc)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.throttleFunc)
  },
  methods: {
    /**
     * 스크롤 최상단으로 이동
     */
    scrollTop () {
      window.scrollTo(0, 0)
    },
    /**
     * 스크롤 탑 버튼 toggle
     */
    pageTopToggle () {
      const deviceHeight = isiOS() ? screen.height : document.documentElement.clientHeight // 기기 높이
      const scrollHeight = window.pageYOffset // 스크롤 높이
      this.topButtonDisplay = deviceHeight + scrollHeight > 1000 ? 'block' : 'none'
    },
    /**
     * 상단 이동 버튼 click callback
     */
    handleTopbuttonClick () {
      this.sendTopButtonClickLog()
      this.scrollTop()
      this.$store.dispatch('layouts/scrollTop')
    },
    /**
     * 마케팅 스크립트 로그 전송 (GA360)
     */
    sendTopButtonClickLog () {
      let eventCate = ''

      if (this.$route.name === 'storeHome') {
        eventCate = 'MOBILE_메인'
      } else if (this.$route.name === 'productDetail') {
        eventCate = 'MOBILE_상품상세'
      } else {
        eventCate = `MOBILE_${this.$route.meta.depth}`
      }

      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate,
          eventAction: '고투탑버튼',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/layouts/items/AppTopButton";
</style>
