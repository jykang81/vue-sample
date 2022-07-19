<template>
  <div :class="`thinglive_main ${!isEmpty(responseData.live) && !liveFinished ? 'live' : ''} ${floatingClass}`">
    <!-- 라이브 재생 영역 -->
    <thinglive-live
      :response-data="responseData.live"
      :espot-key-name="espotKeyName.live"
      @onChangeLiveData="onChangeLiveData"
      @onClickShareBtn="onClickShareBtn"
      @onClickRightOrderBtn="onClickRightOrderBtn"
    />
    <!-- 배너 -->
    <thinglive-banner
      :response-data="responseData.banner"
      :espot-key-name="espotKeyName.banner"
    />
    <!-- 다음방송 안내 -->
    <thinglive-before-after
      :response-data="responseData.after"
      :espot-key-name="espotKeyName.after"
      type="next"
    />
    <!-- 이전방송 안내 -->
    <thinglive-before-after
      :response-data="responseData.before"
      :espot-key-name="espotKeyName.before"
      type="prev"
    />
    <!-- 방송 하이라이트 -->
    <thinglive-highlight
      :response-data="responseData.highlight"
      :espot-key-name="espotKeyName.highlight"
      @onClickShareBtn="onClickShareBtn"
    />
    <!-- 띵라이브 모아보기 -->
    <thinglive-pgm
      :response-data="responseData.pgm"
      :espot-key-name="espotKeyName.pgm"
      :pgm-menu-floating="pgmMenuFloating"
      @changePgmMenuFloating="changePgmMenuFloating"
    />
    <!-- 바로구매 레이어 -->
    <right-order-option
      v-if="finishedSetParamFlag"
      :key="finishedSetParamFlag"
      :shows-layer="anchorLayer"
      :global-val="globalVal"
      @layerClose="rightOrderLayerClose"
    />
  </div>
</template>

<script>
import ThingliveLive from '@/views/store/module/ThingliveLive'
import ThingliveBanner from '@/views/store/module/ThingliveBanner'
import ThingliveBeforeAfter from '@/views/store/module/ThingliveBeforeAfter'
import ThingliveHighlight from '@/views/store/module/ThingliveHighlight'
import ThinglivePgm from '@/views/store/module/ThinglivePgm'
import RightOrderOption from '@/components/product/RightOrderOption'
import rightOrderMixin from '@/mixins/product/rightOrderMixin'
import {
  isEmpty,
  isOsApp
} from '@utils/commonutil/commonUtil'
import modalUtil from '@frameworks/modalUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import shareMixin from '@/mixins/common/shareMixin'

export default {
  name: 'ThingliveMain',
  components: {
    ThingliveLive,
    ThingliveBanner,
    ThingliveBeforeAfter,
    ThingliveHighlight,
    ThinglivePgm,
    RightOrderOption
  },
  mixins: [
    rightOrderMixin,
    shareMixin
  ],
  data () {
    return {
      responseData: {
        live: {}, // 라이브 재생
        banner: [], // 라이브 배너
        after: {}, // 다음방송
        before: {}, // 이전방송
        highlight: [], // 띵라이브 하이라이트
        pgm: {} // 띵라이브 pgm
      },
      espotKeyName: {
        live: '', // 라이브 재생
        banner: '', // 라이브 배너
        after: '', // 다음방송
        before: '', // 이전방송
        highlight: '', // 띵라이브 하이라이트
        pgm: '' // 띵라이브 pgm
      },
      // PGM 탭 메뉴 고정 시 Class 추가용
      pgmMenuFloating: false,
      // 라이브 방송 종료 여부
      liveFinished: false
    }
  },
  computed: {
    floatingClass () {
      return this.pgmMenuFloating ? 'floating' : ''
    }
  },
  created () {
    // 마케팅 스크립트 적용 부분
    // Airbridge
    marketingUtil.airbridgeLogger.send({
      event: marketingUtil.airbridgeLogger.EVENT.ITEM_SHOP, // 편성매장 - 띵라이브
      data: {
        action: '편집매장',
        label: '편집매장 조회',
        categoryNm: 'thinglive'
      }
    })

    // 화면에 보이는 순서대로 API 호출
    this.onLoad()
  },
  methods: {
    isEmpty,
    /**
     * 화면에 보이는 순서대로 API 호출
     * @returns {void}
     */
    async onLoad () {
      // NSFixedShopNoCacheCmd 호출
      await this.getNSFixedShopNoCacheCmd1()

      // NSFixedShopCmd 호출
      await this.getNSFixedShopCmd()

      // NSFixedShopNoCacheCmd 호출
      await this.getNSFixedShopNoCacheCmd2()
    },

    /**
     * NSFixedShopNoCacheCmd 호출
     * @returns {void}
     */
    async getNSFixedShopNoCacheCmd1 () {
      const param = {
        espotInfo: 'EZ_THING_LIVE|CATEVOD_VODLIVE|1|9999|0' // 라이브 재생 영역
      }

      const successHandling = response => {
        this.responseData.live = response.msg[0]._EZ_THING_LIVE[0]
        this.espotKeyName.live = 'EZ_THING_LIVE'
      }

      await this.$nsaxios.post('NSFixedShopNoCacheCmd', param, successHandling)
    },

    /**
     * NSFixedShopCmd 호출
     * @returns {void}
     */
    async getNSFixedShopCmd () {
      const espot1 = 'EZ_THING_LIVE_CNTNT|ESPOT_CNTNT|1|10|0' // 라이브 일정 배너
      const espot2 = 'EZ_THING_LIVE_HIGHLIGHT|CATEVOD_VODLIST|1|5|0' // 띵라이브 하이라이트 VOD
      const espot3 = 'EZ_THING_LIVE_VODPGMCATE|CATEVOD_VODPGMCATE|1|8|0' // 라이브 PGM 탭

      const param = {
        espotInfo: `${espot1}$${espot2}$${espot3}`
      }

      const successHandling = response => {
        this.responseData.banner = response.msg.espotList[0]._EZ_THING_LIVE_CNTNT
        this.responseData.highlight = response.msg.espotList[1]._EZ_THING_LIVE_HIGHLIGHT
        this.responseData.pgm = response.msg
        this.espotKeyName.banner = 'EZ_THING_LIVE_CNTNT'
        this.espotKeyName.highlight = 'EZ_THING_LIVE_HIGHLIGHT'
        this.espotKeyName.pgm = 'EZ_THING_LIVE_VODPGMCATE'
      }

      await this.$nsaxios.post('NSFixedShopCmd', param, successHandling)
    },

    /**
     * NSFixedShopNoCacheCmd 호출
     * @returns {void}
     */
    async getNSFixedShopNoCacheCmd2 () {
      const espot = 'EZ_THING_LIVE_VODDUEPROGRAM|CATEVOD_VODDUEPGM|1|9999|0' // 이전 방송 상품/다음 방송 상품

      const param = {
        espotInfo: `${espot}`
      }

      const successHandling = response => {
        this.responseData.after = response.msg[0]._EZ_THING_LIVE_VODDUEPROGRAM[0].nextLive
        this.responseData.before = response.msg[0]._EZ_THING_LIVE_VODDUEPROGRAM[0].preLive
        this.espotKeyName.after = 'EZ_THING_LIVE_VODDUEPROGRAM'
        this.espotKeyName.before = 'EZ_THING_LIVE_VODDUEPROGRAM'
      }

      await this.$nsaxios.post('NSFixedShopNoCacheCmd', param, successHandling)
    },

    /**
     * 공유하기 버튼 클릭
     * @param {Object} param - 공유할 파라미터(title, description, imageUrl, likeCount, viewCount, shareUrl)
     * @returns {void}
     */
    onClickShareBtn (param) {
      if (isOsApp()) {
        this.kakaoShareNative('thinglive', param)
      } else {
        modalUtil.show('common/PopupShare', param, this.sharePopupClose)
      }
    },

    /**
     * 라이브 종료 시 호출됨
     * @param {boolean} param - 라이브 종료 여부(종료 됨: true)
     * @returns {void}
     */
    onChangeLiveData (param) {
      this.liveFinished = param
    },
    /**
     * PGM 탭 메뉴 고정 여부 변경
     * @param {boolean} param - 고정: true, 해제: false
     * @returns {void}
     */
    changePgmMenuFloating (param) {
      this.pgmMenuFloating = param
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/ThingliveMain";
</style>
