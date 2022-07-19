<template>
  <div id="app">
    <router-view />
    <component :is="containerModal" />
    <component :is="containerFullLayer" />
    <component :is="containerMessage" />
    <container-toast />
    <animation-popup />
    <pre-loader />
    <div id="global_io_target" />
  </div>
</template>

<script>
import ContainerToast from '@components/frameworks/ContainerToast'
import PreLoader from '@components/frameworks/PreLoader'
import externalUtil from '@utils/externalUtil'
import CONST from '@constants/framework/framework'
import {
  isNull,
  viewType,
  isOsApp,
  isiOS
} from '@utils/commonutil/commonUtil'
import legacyUtil from '@utils/legacyUtil'
import AnimationPopup from '@components/frameworks/AnimationPopup'
import uiUtil from '@utils/uiUtil'
import { requestDummy } from '@frameworks/axiosUtil'
import META_INFO_CONST from '@constants/framework/metaInfo'

export default {
  components: {
    PreLoader,
    ContainerToast,
    AnimationPopup
  },
  metaInfo: {
    title: 'NS홈쇼핑 모바일',
    titleTemplate: '%s - NS홈쇼핑 모바일',
    meta: [
      { vmid: META_INFO_CONST.META.OG_TITLE, property: 'og:title', content: 'NS 홈쇼핑 모바일 - NS홈쇼핑 모바일' },
      { vmid: META_INFO_CONST.META.AUTHOR, property: 'author', content: 'NS홈쇼핑 모바일' },
      { vmid: META_INFO_CONST.META.DESCRIPTION, property: 'description', content: '언제 어디서나 특별한 가격을 만나 볼 수 있는 이지쇼핑의 공간 NS홈쇼핑' },
      { vmid: META_INFO_CONST.META.OG_IMAGE, property: 'og:image', content: 'https://image.nsmall.com/ec_comimages/nsdesign/images/common/NS_mobile_bi.png' },
      { vmid: META_INFO_CONST.META.OG_SITE_NAME, property: 'og:site_name', content: 'NS홈쇼핑- 건강한 아이디어' },
      { vmid: META_INFO_CONST.META.OG_TYPE, property: 'og:type', content: 'website' }
    ]
  },
  data () {
    return {
      containerModal: '',
      containerFullLayer: '',
      containerMessage: ''
    }
  },
  computed: {
    /**
     * 팝업 배열
     * @returns {Array}
     */
    popupList () {
      return this.$store.state.popup.popupList
    },
    /**
     * 메시지 노출 여부
     * @returns {Boolean}
     */
    isMessageShow () {
      return this.$store.state.message.isShow
    }
  },
  watch: {
    // lazy loading ContainerModal
    'popupList' () {
      if (this.popupList.length && isNull(this.containerModal)) {
        this.containerModal = () => import(/* webpackChunkName: "ContainerModal" */ '@components/frameworks/ContainerModal')
        this.containerFullLayer = () => import(/* webpackChunkName: "ContainerFullLayer" */ '@components/frameworks/ContainerFullLayer')
      }
    },
    // lazy loading ContainerMessage
    'isMessageShow' (isMessageShow) {
      if (isMessageShow && isNull(this.containerMessage)) {
        this.containerMessage = () => import(/* webpackChunkName: "ContainerMessage" */ '@components/frameworks/ContainerMessage')
      }
    }
  },
  mounted () {
    window.HUB_INIT = legacyUtil.HUB_INIT // 전역 변수 선언

    externalUtil.updateCocd() // 외부유입 코드 갱신
    this.addNonProductRoutes()
    this.reviseViewport()
    uiUtil.setPreventFixedElementCracking()

    // 앱일 경우 디바이스에 맞는 클래스 세팅 (디바이스별 화면 이슈를 잡기 위함)
    if (isOsApp()) {
      let className = ''

      if (viewType() === 'ios') {
        className = 'web_view ios_web'
      } else if (viewType() === 'android') {
        className = 'web_view android_web'
      } else {
        className = 'web_view other'
      }
      document.querySelector('#app').className = className
    }
  },
  methods: {
    /**
     * 개발용 link 동적 추가
     * @returns {Promise<void>}
     */
    async addNonProductRoutes () {
      if (CONST.IS_DEV_MODE) {
        const { default: testLink, testLink2 } = await import(/* webpackChunkName: "App/testLink" */ '@/router/modules/testLink') // 테스트 링크

        const nonProductionLinks = [testLink, testLink2]

        nonProductionLinks.forEach(route => {
          // 기존에 정의된 컴포넌트가 없을때만 기본 레이아웃 컴포넌트 정의
          if (!route.component) {
            route.component = () => import(/* webpackChunkName: "App/BaseLayout" */ '@components/layouts/BaseLayout')
          }
        })

        this.$router.addRoutes(nonProductionLinks)
      }
    },
    /**
     * 뷰포트 보정
     */
    reviseViewport () {
      if (isiOS()) {
        const viewport = document.querySelector('meta[name="viewport"]')
        viewport.content = `${viewport.content}, viewport-fit=cover`
      }
    },
    /**
     * visibilitychange 이벤트 바인딩
     */
    setVisibilitychange () {
      document.addEventListener('visibilitychange', this.onVisibilitychange)
    },
    /**
     * visibilitychange 후처리
     */
    onVisibilitychange () {
      if (document.hidden) {
        return
      }

      requestDummy()
    },
    /**
     * API 세션 만료 방지
     */
    preventAPISessionExpiration () {
      const MINUTE = 1000 * 60
      const INTERVAL = MINUTE * 2
      const RENEWAL = MINUTE * 10

      let lastTime = new Date()

      setInterval(() => {
        const currentTime = new Date()
        const elapsed = currentTime - lastTime

        if (elapsed >= RENEWAL) {
          lastTime = currentTime
          requestDummy()
        }
      }, INTERVAL)
    }
  }
}
</script>

<style lang="scss">
@import "~@/assets/styles/common";
</style>
