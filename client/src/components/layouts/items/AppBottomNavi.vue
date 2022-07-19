<template>
  <nav
    v-show="bottomNavi"
    :class="tvlive ? 'active' : ''"
    class="app_bottom_navi"
  >
    <div
      class="dimmed_all"
      @click="onTvLiveClose"
    />
    <div
      ref="tvLiveBox"
      class="tv_live_box"
      :style="style"
    >
      <div class="top_bar" @click="onTvLiveClose" />
      <swiper
        v-if="tvLiveAllList.length"
        ref="swiperTvlive"
        :options="swiperTvlive"
        class="swiper_tvlive"
        @slide-change-transition-start="changedSlide"
      >
        <swiper-slide>
          <!-- 띵라이브는 임시로 키값 없애봄. -->
          <live-section-all
            v-if="nsLive && apiCallFinishedThinglive"
            :ref="`live_${0}`"
            :key="reloadKeyThing"
            :what-contents="getTvLiveKey({ THING_LIVE: '띵라이브' })"
            :bottom-navi-index="0"
            :bottom-navi-value="{ THING_LIVE: '띵라이브' }"
            :live-full-data="getWhatData(getTvLiveKey({ THING_LIVE: '띵라이브' }), 0)"
            :video-stop-key="videoStopKey"
            @update="setNewBroadData"
            @close="onTvLiveClose"
          />
        </swiper-slide>
        <swiper-slide>
          <live-section-all
            v-if="nsLive && apiCallFinishedTv"
            :ref="`live_${1}`"
            :key="reloadKeyTv"
            :what-contents="getTvLiveKey({ NS_LIVE: 'NS LIVE' })"
            :bottom-navi-index="1"
            :bottom-navi-value="{ NS_LIVE: 'NS LIVE' }"
            :live-full-data="getWhatData(getTvLiveKey({ NS_LIVE: 'NS LIVE' }), 1)"
            :video-stop-key="videoStopKey"
            @update="setNewBroadData"
            @close="onTvLiveClose"
          />
        </swiper-slide>
        <swiper-slide>
          <live-section-all
            v-if="nsLive && apiCallFinishedShopPlus"
            :ref="`live_${2}`"
            :key="reloadKeyShop"
            :what-contents="getTvLiveKey({ SHOP_PLUS: 'Shop+' })"
            :bottom-navi-index="2"
            :bottom-navi-value="{ SHOP_PLUS: 'Shop+' }"
            :live-full-data="getWhatData(getTvLiveKey({ SHOP_PLUS: 'Shop+' }), 2)"
            :video-stop-key="videoStopKey"
            @update="setNewBroadData"
            @close="onTvLiveClose"
          />
        </swiper-slide>
        <div
          slot="pagination"
          class="swiper-pagination"
        />
      </swiper>
      <p
        class="btn_close"
        @click="onTvLiveClose"
      >
        닫기
      </p>
    </div>
    <div class="navigation">
      <ul>
        <li class="home_link">
          <button
            v-touch
            type="button"
            :class="homeLinkClass"
            @click.prevent="handleClickHome"
          >
            <span>홈</span>
          </button>
        </li>
        <li class="side">
          <button
            v-touch
            type="button"
            @click.prevent="snbCall"
          >
            <span>사이드메뉴</span>
          </button>
        </li>
        <li class="tv_live">
          <button
            v-touch
            type="button"
            @click.prevent="onTvLiveToggle"
          >
            <span>TV LIVE</span>
          </button>
        </li>
        <li class="mypage">
          <router-link
            v-touch
            :active-class="activeIconClassName"
            :to="{ name : 'mypageMain' }"
            @click.native="mypageLogging"
          >
            <span>마이페이지</span>
          </router-link>
        </li>
        <li class="history">
          <router-link
            v-touch
            :to="{ name: 'shoppingHistory' }"
            @click.native="shoppingHistoryLogging"
          >
            <img :src="icon" alt="최근 본 상품" @error="getDefaultIcon">
          </router-link>
        </li>
      </ul>
    </div>
    <app-aside :active-snb="activeSnb" @activeSnb="activeSnb = $event" />
  </nav>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

import AppAside from '@components/layouts/items/AppAside'
import LiveSectionAll from '@/views/store/module/LiveSectionAll'
import TVLIVE_CONST from '@/common/constants/media/tvlive'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import {
  isOsApp,
  isNull
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'
import DEFAULT_ICON from '@/assets/images/common/icons_myHistory.png'
import uiUtil from '@utils/uiUtil'

let scrollPosition = 0 // AS-IS 스크롤 위치 (data에 선언 시 뒤로가기 시에 0으로 초기화 되는 문제가 있어서 외부에 선언)

export default {
  name: 'AppBottomNavi',
  components: {
    AppAside,
    LiveSectionAll
  },
  data () {
    return {
      activeSnb: false, // SNB 활성화 여부
      swiperTvlive: {
        observer: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        initialSlide: 1
      },
      tvlive: false, // tvlive 레이어 노출 여부
      hide: false, // 하단 탭바 숨김 여부
      style: { // tvlive 레이어 bottom style
        bottom: ''
      },
      broadcastNowName: null, // 현재 활성중인 LIVE identify.
      tvLiveFullData: {}, // TV 라이브 전체 데이터.
      shopFullData: {}, // 샵플러스 전체 데이터.
      thingFullData: {}, // 띵라이브 전체 데이터.
      apiCallFinishedTv: false, // TV 라이브 데이터 조회 완료여부.
      apiCallFinishedShopPlus: false, // 샵플러스 데이터 조회 완료여부.
      apiCallFinishedThinglive: false, // 띵라이브 데이터 조회 완료여부.
      DATA_MOVE_MAX_COUNT: 3, // 컴포넌트 3회 이상 로드되지 않도록하는 제어 상수.
      viewGubun: '', // 띵라이브 LIVE 아이콘 제어 변수.
      vodPlayGubun: '', // 띵라이브 LIVE 아이콘 제어 변수.
      reloadKeyTv: 0, // TV Live 리로드키.
      reloadKeyShop: 0, // Shop+ 리로드키.
      reloadKeyThing: 0, // Thinglive 리로드키.
      activeIconClassName: 'selected',
      homePath: '/store/home',
      homeLinkClass: '',
      videoStopKey: 0 // 현재 슬라이드가 변경되면 재생중인 모든 비디오 일시정지를 위한 키.
    }
  },
  computed: {
    ...mapState('layouts', ['bottomNavi', 'nsLive', 'canSlideLiveTab']),
    ...mapState('shoppingHistory', ['icon']),
    ...mapGetters('layouts', ['getCanSlideLiveTabFlag']),
    /**
     * root 엘리먼트
     *
      @return {HTMLElement} root 엘리먼트
     */
    rootEl () {
      return this.$root.$el
    },
    /**
     * tvlive 엘리먼트
     *
     * @return {HTMLElement} tvlive 엘리먼트
     */
    tvLiveBox () {
      return this.$refs.tvLiveBox
    },
    /**
     * 상수 객체 배열 반환.
     * @returns {Array}
     */
    tvLiveAllList () {
      return TVLIVE_CONST.TV_LIVE_ALL_LIST
    },
    /**
     * swiper 반환.
     * @returns {Object}
     */
    getTvLiveSwiper () {
      return this.$refs.swiperTvlive.$swiper
    },
    /**
     * swiper 반환.
     * @returns {Object}
     */
    getTvLiveSwiperSlides () {
      return this.$refs.swiperTvlive.$swiper.slides
    }
  },
  watch: {
    // 라우트 이동 시
    '$route' (to, from) {
      // 편성표 예외 처리
      const tvScheduleRouteName = 'tvScheduleTable'
      if (from.name === tvScheduleRouteName && to.name === tvScheduleRouteName) {
        if (!from.hash.startsWith('#popup-') && !to.hash.startsWith('#popup-')) {
          return
        }
      }

      // Tv Live 영역 닫기
      this.onTvLiveClose()

      // 상단 헤더 노출
      this.rootEl.classList.remove('hide')

      // 하단 탭바 노출
      this.showNavigation()

      // 홈 링크 아이콘 설정
      this.setHomeLinkClass(to.path)
    }
  },
  mounted () {
    this.$store.commit('shoppingHistory/setIcon')
    // 이미지 로드 후 tvlive 레이어 영역 위치 설정
    window.addEventListener('load', this.setTvLivePosition)

    this.setScrollEvent()

    // 동영상 재생 레이어가 올라와 있을때에는 슬라이드 기능을 차단하기 위한 watch
    this.$store.watch(() => this.getCanSlideLiveTabFlag.canSlideLiveTab, newFlag => {})

    this.$store.watch(() => this.apiCallFinishedThinglive, newFlag => {
      setTimeout(() => {
        if (newFlag) {
          if (this.vodPlayGubun !== '' && this.vodPlayGubun === 'LIVE') {
            this.getTvLiveSwiper.slideTo(0, 100)
          }
        }
      }, 100)
    })

    this.subscribeScrollTop()
    this.subscribeLayoutScrollEvent()
    this.subscribeTabBarOnlyScrollEvent()

    this.setHomeLinkClass(window.location.pathname)
  },
  beforeDestroy () {
    // 모든 EventListener 제거
    window.removeEventListener('load', this.setTvLivePosition)
    this.unsetScrollEvent()
    this.unsetHandleScrollByTabBarOnly()

    // #app 엘리먼트 hide 클래스 제거
    this.rootEl.classList.remove('hide')
  },
  methods: {
    ...mapActions('layouts', ['toggleLive']),
    ...mapMutations('layouts', ['setIsNativeCss']),
    /**
     *  GA360 하단 GNB 클릭 - 홈
     */
    storeHomeLogging () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: '하단GNB',
          eventLabel: '홈',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  GA360 하단 GNB 클릭 - 마이페이지
     */
    mypageLogging () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: '하단GNB',
          eventLabel: '마이페이지',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     *  GA360 하단 GNB 클릭 - 최근 본 상품
     */
    shoppingHistoryLogging () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: '하단GNB',
          eventLabel: '최근본상품',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 최근본상품 이미지 로드 실패시 기본 아이콘
     * @param {Event} e - 이벤트 객체
     */
    getDefaultIcon (e) {
      e.target.src = DEFAULT_ICON
    },
    /**
     * 스크롤 상향, 하향 스크롤시 GNB 노출 영역 변경
     */
    scrollEvent () {
      const { bodyTop, bodyBottom, bottomCheck } = this.getVerticalInfomationObject()
      const startTopPosition = this.getStartTopPosition()

      if (bodyTop > startTopPosition && bodyBottom < bottomCheck) {
        if (bodyTop < scrollPosition) { // 스크롤 상향
          // 띵라이브 메인 PGM탭이 floating일 때 헤더 미노출
          if (!(this.$route.name === 'thinglive' && document.querySelector('.thinglive_main').classList.contains('floating'))) {
            this.showLayoutElements()
          }
        } else if (bodyTop > scrollPosition) { // 스크롤 하향
          this.hideLayoutElements()
        }
      }

      scrollPosition = bodyTop // 이전 스크롤 위치 저장
    },
    /**
     * TV LIVE 레이어 위치 설정
     */
    setTvLivePosition () {
      if (!this.tvLiveBox) {
        return
      }

      this.style.bottom = `${-this.tvLiveBox.clientHeight}px`
    },
    /**
     * TV LIVE 아이콘 클릭시 토글
     */
    onTvLiveToggle () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_공통영역',
          eventAction: '하단GNB',
          eventLabel: 'TVLIVE',
          params: {
            t1: null
          }
        }
      })
      if (this.tvlive) {
        this.onTvLiveClose()
      } else {
        this.apiCallFinishedTv = false // TV 라이브 데이터 조회 완료여부.
        this.apiCallFinishedShopPlus = false // (띵라이브 + 샵플러스) 데이터 조회 완료여부.
        this.apiCallFinishedThinglive = false
        this.tvLiveInit()
        this.onTvLiveOpen()
      }
    },
    /**
     * TV LIVE 열기
     */
    onTvLiveOpen () {
      this.unsetScrollEvent()
      this.style.bottom = 0
      this.tvlive = true
      uiUtil.disableScroll()
      this.toggleLive(true)
      this.fixSlidesUiBug()
    },
    /**
     * TV LIVE 닫기
     */
    onTvLiveClose () {
      this.setScrollEvent()
      this.setTvLivePosition()
      this.tvlive = false

      uiUtil.enableScroll()
      this.toggleLive(false)
      this.apiCallFinishedTv = false
      this.apiCallFinishedShopPlus = false
      this.apiCallFinishedThinglive = false
    },
    /**
     * TV Live 키값 얻기.
     * @param {Object} param - TVLIVE_CONST.TV_LIVE_ALL_LIST 상수 객체
     * @returns {String}
     */
    getTvLiveKey (param) {
      const key = String(Object.keys(param))
      return key
    },
    /**
     * 하단탭바 라이브 영역 스와이퍼 슬라이드 UI 버그 제어.
     */
    fixSlidesUiBug () {
      const slideLength = Number(this.getTvLiveSwiper.slides.length)
      const limitLength = TVLIVE_CONST.TV_LIVE_ALL_LIST.length
      if (slideLength > limitLength) {
        this.getTvLiveSwiper.removeSlide([0, 4])
      }
    },
    /**
     * 라이브 3종 컴포넌트(LiveSectionAll)에서 슬라이드 감지.
     */
    changedSlide () {
      setTimeout(() => {
        this.fixSlidesUiBug()
      }, 1)
      const broadcastIndex = this.getTvLiveSwiper.activeIndex
      this.broadcastNowName = Object.keys(TVLIVE_CONST.TV_LIVE_ALL_LIST[broadcastIndex])
      // 마케팅 스크립트 적용 부분
      // GA360
      if (broadcastIndex === 0) {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: 'GNB_채널리모컨',
            eventLabel: '띵라이브',
            params: {
              t1: null
            }
          }
        })
      } else if (broadcastIndex === 1) {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: 'GNB_채널리모컨',
            eventLabel: 'NSLIVE',
            params: {
              t1: null
            }
          }
        })
      } else {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_EVENT,
          data: {
            eventCate: 'MOBILE_공통영역',
            eventAction: 'GNB_채널리모컨',
            eventLabel: 'Shop+',
            params: {
              t1: null
            }
          }
        })
      }
      this.stopPlayingAllVideo()
    },
    /**
     * TV Live 정보 호출.
     */
    async tvLiveInit () {
      await this.callNSMobHomeViewLive()
    },
    /**
     * TV Live 정보 호출
     */
    async callNSMobHomeViewLive () {
      const commandName = TVLIVE_CONST.PARAMETERS.COMMAND_NAME
      const parameters = {
        targetEspotId: TVLIVE_CONST.PARAMETERS.TARGET_ESPOT_ID,
        categoryId: TVLIVE_CONST.PARAMETERS.CATEGORY_ID,
        gubun: TVLIVE_CONST.PARAMETERS.TV
      }
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      this.tvLiveFullData = apiData
      this.apiCallFinishedTv = true
      if (!this.apiCallFinishedShopPlus) {
        await this.callShopPlus()
      }
    },
    /**
     * Shop+ 정보 호출 - 데이터량 때문에 shop+와 띵라이브 데이터는 팝업호출뒤에 한다.
     */
    async callShopPlus () {
      const commandName = TVLIVE_CONST.PARAMETERS.COMMAND_NAME
      const parameters = {
        targetEspotId: TVLIVE_CONST.PARAMETERS.TARGET_ESPOT_ID,
        categoryId: TVLIVE_CONST.PARAMETERS.CATEGORY_ID,
        gubun: TVLIVE_CONST.PARAMETERS.SHOPPLUS
      }
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      this.shopFullData = apiData
      this.apiCallFinishedShopPlus = true
      if (!this.apiCallFinishedThinglive) {
        await this.callThingLive()
      }
    },
    /**
     * 띵라이브 정보 호출 - 데이터량 때문에 shop+와 띵라이브 데이터는 팝업호출뒤에 한다.
     */
    async callThingLive () {
      const commandName = TVLIVE_CONST.PARAMETERS.COMMAND_NAME
      const parameters = {
        targetEspotId: TVLIVE_CONST.PARAMETERS.TARGET_ESPOT_ID,
        categoryId: TVLIVE_CONST.PARAMETERS.CATEGORY_ID,
        gubun: TVLIVE_CONST.PARAMETERS.THINGLIVE
      }
      const apiData = await this.$nsaxios.post(
        commandName,
        parameters,
        null
      )
      this.thingFullData = apiData
      const vodInfo = apiData.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[0]._VODINFO[0]
      this.viewGubun = vodInfo.viewGubun
      this.vodPlayGubun = vodInfo._VODLIVE[0].vodPlayGubun
      this.apiCallFinishedThinglive = true
    },
    /**
     * 매체에 맞는 데이터를 반환.
     * @param {String} param - 매체명
     * @param {Number} index - 루프 인덱스
     * @returns {Object}
     */
    getWhatData (param, index) {
      if (TVLIVE_CONST.TV_LIVE_ALL_LIST[index][param] === TVLIVE_CONST.TV_LIVE_ALL_LIST[index].NS_LIVE) {
        return this.tvLiveFullData
      } else if (TVLIVE_CONST.TV_LIVE_ALL_LIST[index][param] === TVLIVE_CONST.TV_LIVE_ALL_LIST[index].SHOP_PLUS) {
        return this.shopFullData
      } else if (TVLIVE_CONST.TV_LIVE_ALL_LIST[index][param] === TVLIVE_CONST.TV_LIVE_ALL_LIST[index].THING_LIVE) {
        return this.thingFullData
      }
    },
    /**
     * 매체에 맞는 api call flag 반환.
     * @param {String} param - 매체명
     * @param {Number} index - 루프 인덱스
     * @returns {Boolean}
     */
    getApiCallFinish (param, index) {
      if (TVLIVE_CONST.TV_LIVE_ALL_LIST[index][param] === TVLIVE_CONST.TV_LIVE_ALL_LIST[index].NS_LIVE) {
        return this.apiCallFinishedTv
      } else if (TVLIVE_CONST.TV_LIVE_ALL_LIST[index][param] === TVLIVE_CONST.TV_LIVE_ALL_LIST[index].SHOP_PLUS) {
        return this.apiCallFinishedShopPlus
      } else if (TVLIVE_CONST.TV_LIVE_ALL_LIST[index][param] === TVLIVE_CONST.TV_LIVE_ALL_LIST[index].THING_LIVE) {
        return this.apiCallFinishedThinglive
      }
    },
    /**
     * 홈 아이콘 클릭 처리
     */
    handleClickHome () {
      this.storeHomeLogging() // GA
      if (isOsApp()) { // APP
        nativeUtil.goHome()
      } else {
        location.href = this.homePath
      }
    },
    /**
     * snb(lnb) 열기
     */
    snbCall () {
      if (isOsApp()) { // APP
        this.setIsNativeCss(false)
      }
      this.activeSnb = true
    },
    /**
     * 레이아웃 요소 보이기
     */
    showLayoutElements () {
      this.rootEl.classList.remove('hide')
      this.showNavigation()
      this.setTvLivePosition()
    },
    /**
     * 레이아웃 요소 숨기기
     */
    hideLayoutElements () {
      this.rootEl.classList.add('hide')
      this.hideNavigation()
      this.style.bottom = `${-this.tvLiveBox.clientHeight - 70}px`
    },
    /**
     * scrollTop action 구독
     */
    subscribeScrollTop () {
      this.$store.subscribeAction((action, state) => {
        if (action.type === 'layouts/scrollTop') {
          this.showLayoutElements()
        }
      })
    },
    /**
     * LiveSectionAll 컴포넌트에서 방송 데이터를 받아서 부모 데이터 갱신.
     * @param {String} identifier - 방송 구분자: isTv - Tv Live, isShopPlus - 샵플러스
     * @param {Object} apiData - LiveSectionAll 컴포넌트에서 재 조회한 데이터.
     */
    setNewBroadData (identifier, apiData) {
      if (isNull(identifier)) { return false }
      if (identifier === 'isTv') {
        this.tvLiveFullData = apiData
        ++this.reloadKeyTv
      } else if (identifier === 'isShopPlus') {
        this.shopFullData = apiData
        ++this.reloadKeyShop
      } else if (identifier === 'isThinglive') {
        this.thingFullData = apiData
        ++this.reloadKeyThing
      }
    },
    /*
     * 스크롤 이벤트 설정
     */
    setScrollEvent () {
      const fullLayer = this.$parent.$refs.fullLayer

      if (fullLayer && fullLayer.length) {
        if (isOsApp()) { // APP
          this.$store.commit('layouts/toggleBottomNavi', false)
        } else {
          this.$store.commit('layouts/toggleBottomNavi', true)
        }
        const lastFullLayer = fullLayer[fullLayer.length - 1]

        lastFullLayer.removeEventListener('scroll', this.scrollEvent) // 중복 리스너 방지
        lastFullLayer.addEventListener('scroll', this.scrollEvent)
      } else {
        window.removeEventListener('scroll', this.scrollEvent) // 중복 리스너 방지
        window.addEventListener('scroll', this.scrollEvent)
      }
    },
    /**
     * 스크롤 이벤트 해제
     */
    unsetScrollEvent () {
      window.removeEventListener('scroll', this.scrollEvent)
    },
    /**
     * layoutScrollEvent action 구독
     */
    subscribeLayoutScrollEvent () {
      this.$store.subscribeAction((action, state) => {
        if (action.type === 'layouts/onLayoutScrollEvent') {
          this.setScrollEvent()
        }

        if (action.type === 'layouts/offLayoutScrollEvent') {
          this.unsetScrollEvent()
        }
      })
    },
    /**
     * 현재 문서의 세로 관련 정보 객체 반환
     * @returns {Object}
     */
    getVerticalInfomationObject () {
      let bodyTop = window.pageYOffset
      let bodyBottom = bodyTop + window.innerHeight
      let bottomCheck = document.body.scrollHeight - 10

      // 현재 하단 탭바가 풀 레이어 안에 존재하면 풀 레이어(멀티 풀 레이어일 때는 가장 마지막 풀 레이어 기준) 내 스크롤 위치를 기준으로 함
      const fullLayer = this.$parent.$refs.fullLayer
      if (fullLayer && fullLayer.length) {
        const lastFullLayer = fullLayer[fullLayer.length - 1]
        bodyTop = lastFullLayer.scrollTop
        bodyBottom = lastFullLayer.clientHeight
        bottomCheck = lastFullLayer.scrollHeight - 10
      }

      return {
        bodyTop,
        bodyBottom,
        bottomCheck
      }
    },
    /**
     * 상단 위치 정보 반환
     * @returns {Number}
     */
    getStartTopPosition () {
      // 검색결과 페이지는 헤더 + 고정영역 높이만큼 스크롤을 내려야 인터렉션 동작하도록 함
      let startTopPosition = 52
      if (this.$route.name === 'searchResult') {
        const fixedEl = this.rootEl.querySelector('.search_fixed')
        const headerEl = this.rootEl.querySelector('.app_header')
        const fixedHeight = fixedEl ? fixedEl.clientHeight : 0
        const headerHeight = headerEl ? headerEl.clientHeight : 0
        startTopPosition = fixedHeight + headerHeight
      }

      return startTopPosition
    },
    /**
     * 스크롤 상향 / 하향에 따라 탭바 노출 영역 변경
     */
    handleScrollByTabBarOnly () {
      this.rootEl.classList.add('hide') // header 가리기

      const { bodyTop, bodyBottom, bottomCheck } = this.getVerticalInfomationObject()
      const startTopPosition = this.getStartTopPosition()

      if (bodyTop > startTopPosition && bodyBottom < bottomCheck) {
        if (bodyTop < scrollPosition) { // 스크롤 상향
          this.showTabBar()
          this.upFloatingTablePosition()
        } else if (bodyTop > scrollPosition) { // 스크롤 하향
          this.hideTabBar()
          this.downFloatingTablePosition()
        }
      }

      scrollPosition = bodyTop // 이전 스크롤 위치 저장
    },
    /**
     * 탭바 표시
     */
    showTabBar () {
      this.showNavigation()
      this.setTvLivePosition()
    },
    /**
     * 탭바 가리기
     */
    hideTabBar () {
      this.hideNavigation()
      this.style.bottom = `${-this.tvLiveBox.clientHeight - 70}px`
    },
    /*
     * 탭바 스크롤 이벤트 설정
     */
    setHandleScrollByTabBarOnly () {
      window.removeEventListener('scroll', this.handleScrollByTabBarOnly) // 중복 리스너 방지
      window.addEventListener('scroll', this.handleScrollByTabBarOnly)
    },
    /**
     * 탭바 스크롤 이벤트 해제
     */
    unsetHandleScrollByTabBarOnly () {
      window.removeEventListener('scroll', this.handleScrollByTabBarOnly)
    },
    /**
     * layout tab bar action 구독
     */
    subscribeTabBarOnlyScrollEvent () {
      this.$store.subscribeAction((action, state) => {
        if (action.type === 'layouts/onTabBarOnlyScrollEvent') {
          this.setHandleScrollByTabBarOnly()
        }

        if (action.type === 'layouts/offTabBarOnlyScrollEvent') {
          this.showLayoutElements()
          this.unsetHandleScrollByTabBarOnly()
        }
      })
    },
    /**
     * 플로팅 테이블 요소 반환
     * @returns {Element|null}
     */
    getFloatingTable () {
      return document.querySelector('.time_table_floating')
    },
    /**
     * 플로팅 테이블 포지션 상향
     */
    upFloatingTablePosition () {
      const floatingTable = this.getFloatingTable()

      if (!floatingTable) {
        return
      }

      floatingTable.classList.add('position')
    },
    /**
     * 플로팅 테이블 포지션 하향
     */
    downFloatingTablePosition () {
      const floatingTable = this.getFloatingTable()

      if (!floatingTable) {
        return
      }

      floatingTable.classList.remove('position')
    },
    /**
     * 네비게이션 표시
     */
    showNavigation () {
      const navigation = document.querySelector('.navigation')

      if (!navigation) {
        return
      }

      navigation.classList.remove('hide')
    },
    /**
     * 네비게이션 숨기기
     */
    hideNavigation () {
      const navigation = document.querySelector('.navigation')

      if (!navigation) {
        return
      }

      navigation.classList.add('hide')
    },
    /**
     * home path <-> input path 일치 시 active icon class 설정
     * @param {String} path 경로
     */
    setHomeLinkClass (path) {
      if (path === this.homePath) {
        this.homeLinkClass = this.activeIconClassName
      } else {
        this.homeLinkClass = ''
      }
    },
    /**
     * 하단탭바 라이브 영역이 슬라이드 될때, 재생중인 모든 동영상을 일시정지 상태로 만든다.
     */
    stopPlayingAllVideo () {
      ++this.videoStopKey
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/layouts/items/AppBottomNavi";
</style>
