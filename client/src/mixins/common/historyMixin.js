import { mapState } from 'vuex'

const historyMixin = {
  mounted () {
    this.subscribeHistoryBack()
  },
  data () {
    return {
      hasHistoryBacked: false // 뒤로가기 여부
    }
  },
  computed: {
    ...mapState('history', ['savedPosition'])
  },
  methods: {
    /**
     * 뒤로가기 이벤트 구독
     */
    subscribeHistoryBack () {
      this.$store.subscribeAction((action, state) => {
        if (action.type === 'history/setSavedPosition') {
          this.hasHistoryBacked = true
        }
      })
    },
    /**
     * 저장된 지점으로 스크롤 이동
     */
    scrollToSavedPosition () {
      if (!this.savedPosition) {
        return
      }

      if (!this.hasHistoryBacked) {
        return
      }

      // 바닥으로 이동 (page repaint 대응용 (image lazy loading, scroll event 등등)
      window.scroll(0, document.body.scrollHeight)
      setTimeout(() => {
        // 이전 좌표로 이동
        window.scroll(0, this.savedPosition.y)
      }, 100)
    }
  }
}

export default historyMixin
