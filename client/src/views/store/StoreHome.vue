<template>
  <main class="store_home">
    <template v-if="apiFirstData.msg.espotList">
      <banner-list
        :espot-data="apiFirstData.msg.espotList[0]._EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND"
        :espot-extend-list="apiFirstData.msg.espotExtendList._EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND"
      />

      <live-section />
      <home-thinglive-slot />
      <!-- 서클 4.5 슬라이드형 -->
      <circle-slide-list
        :espot-data="apiFirstData.msg.espotList[1]._EZ_HOME_TOPD_ESPOT_CNTNTCIRCLESLIDE"
        :espot-extend-list="apiFirstData.msg.espotExtendList._EZ_HOME_TOPD_ESPOT_CNTNTCIRCLESLIDE"
      />

      <!-- 배너 1.5 슬라이드형 -->
      <banner-15-slide-list
        :espot-data="apiFirstData.msg.espotList[2]._EZ_HOME_TOPE_ESPOT_CNTNTSLIDE15W"
        :espot-extend-list="apiFirstData.msg.espotExtendList._EZ_HOME_TOPE_ESPOT_CNTNTSLIDE15W"
      />
    </template>
    <div id="anchor_observer" ref="anchorObserver" />
    <template v-if="apiCount >= 1">
      <section
        v-for="(outerValue, outerIndex) in returnMenuList()"
        v-show="apiCount > 1"
        :id="`${getAnchorMenuName(outerValue)}_${outerIndex}`"
        :key="outerIndex"
      >
        <!-- 앵커 메뉴 생성 및 클릭 이벤트 셋팅 -->
        <swiper
          :ref="`${getAnchorMenuName(outerValue) + outerIndex}`"
          :options="getSwiperOptions(outerIndex)"
          class="categories"
        >
          <swiper-slide
            v-for="(innerValue, innerIndex) in returnMenuList()"
            :key="innerIndex"
            :class="{ active : outerIndex === innerIndex }"
          >
            <span @click="categoryMove(getAnchorMenuName(innerValue), outerIndex, innerIndex)">
              {{ getCutBytes(getHtmlDecode(innerValue.KOR)) }}
            </span>
          </swiper-slide>
          <!-- // 앵커 컨텐츠 영역 데이터 렌더링 -->
        </swiper>
        <!-- 앵커 컨텐츠 영역 데이터 렌더링 (오늘 추천 일때만 유효성검사 없이 바로 호출 - espot 정보 유무 때문.)-->
        <anchor-popular
          v-if="getAnchorMenuName(outerValue) === 'popular' && apiFirstData.msg.espotList"
          :contents-data="apiFirstData.msg.espotList[3]._EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM"
          :contents-extend-data="apiFirstData.msg.espotExtendList._EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM ? apiFirstData.msg.espotExtendList._EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM : {}"
          :products-data="apiFirstData.msg.espotList[4]._EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE"
          :products-extend-data="apiFirstData.msg.espotExtendList._EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE ? apiFirstData.msg.espotExtendList._EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE : {}"
        />
        <template v-else-if="isAfterApiCallFlag">
          <component
            :is="`anchor-${getAnchorMenuName(outerValue)}`"
            v-show="hasEspotData(outerValue)"
            :espot-data="getData(outerValue)"
          />
        </template>
      <!-- // 앵커 메뉴 생성 및 클릭 이벤트 셋팅 -->
      </section>
    </template>
  </main>
</template>

<script>
import ANCHOR_CONST from '@/common/constants/store/anchor'
import BannerList from '@/views/store/module/BannerList'
import CircleSlideList from '@/views/store/module/CircleSlideList'
import Banner15SlideList from '@/views/store/module/Banner15SlideList'
import LiveSection from '@/views/store/module/LiveSection'
import HomeThingliveSlot from '@/views/store/module/HomeThingliveSlot'
import AnchorPopular from '@/views/store/module/AnchorPopular'
import AnchorTv from '@/views/store/module/AnchorTv'
import AnchorHappydeal from '@/views/store/module/AnchorHappydeal'
import AnchorToday from '@/views/store/module/AnchorToday'
import AnchorFood from '@/views/store/module/AnchorFood'
import AnchorBeauty from '@/views/store/module/AnchorBeauty'
import AnchorLife from '@/views/store/module/AnchorLife'
import uiUtil from '@utils/uiUtil'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import { mapGetters } from 'vuex' // mapState, mapGetters, mapMutations
import {
  isNull,
  isOsApp
} from '@utils/commonutil/commonUtil'
import storeHomeService from '@services/store/storeHomeService'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import COMM_CONST from '@constants/framework/constants'
import animationPopupUtil from '@frameworks/animationPopupUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import getBdDay from '@frameworks/dateutil/getBdDay'
import modalUtil from '@frameworks/modalUtil'
import nativeUtil from '@frameworks/nativeUtil'

export default {
  name: 'StoreHome',
  components: {
    BannerList,
    CircleSlideList,
    Banner15SlideList,
    LiveSection,
    HomeThingliveSlot,
    AnchorPopular,
    AnchorTv,
    AnchorHappydeal,
    AnchorToday,
    AnchorFood,
    AnchorBeauty,
    AnchorLife
  },
  mixins: [
    anchorMixin
  ],
  props: {
    params: {
      type: Object,
      required: false,
      default: null
    }
  },
  data () {
    return {
      apiFirstData: { // 처음 호출하는 espot 데이터 (네트워크량 감소를 위해 API 조회를 2회로 나눔)
        msg: {}
      },
      apiSecondData: { // 두번째로 호출하는 espot 데이터 (네트워크량 감소를 위해 API 조회를 2회로 나눔)
        msg: {}
      },
      apiCount: 0, // api 제어 목적
      apiCallingFlag: false, // api 제어 목적
      isAfterApiCallFlag: false, // 스크롤 시 api 호출 완료 여부.
      intersectionObserverObj: null, // 스크롤 시 요소 감지를 위한 IntersectionObserver 객체
      liveSectionFlag: false, // 라이브섹션 로딩여부.
      anchorMenuList: [] // 앵커메뉴 배열
    }
  },
  computed: {
    ...mapGetters('home', [
      'getLiveSectionFlag'
    ])
  },
  watch: {
    apiCount: {
      handler (newNumber) {
        if (newNumber === 1) {
          setTimeout(() => {
            this.startPopupEvent()
            this.setObserver()
          }, 300)
        }
      }
    }
  },
  created () {
    if (isOsApp()) {
      nativeUtil.goHome()
    }
    this.getAnchorMenuList()
    // 앵커 영역의 TV 추천 위치까지의 Espot 정보 호출 --> API 개편으로 인해 임시로 빠진 파라메터 : 앵커 메뉴 리스트, 앵커1배너, 앵커1상품
    const FIRST_LOAD_ESPOT_INFO = ANCHOR_CONST.FIRST_PARAMETERS
    this.getEspotData({
      espotInfo: FIRST_LOAD_ESPOT_INFO.join('$')
    })
  },
  mounted () {
    // section 태그 순차적으로 z-index 높은값 적용
    let count = 50
    document.querySelectorAll('section:not(.intro_popup)').forEach(function (item) {
      item.style.zIndex = count
      count--
    })
    this.$store.watch(() => this.getLiveSectionFlag, newFlag => {
      this.liveSectionFlag = newFlag
    })

    // 마케팅 스크립트 적용 부분
    // Airbridge
    marketingUtil.airbridgeLogger.send({
      event: marketingUtil.airbridgeLogger.EVENT.HOME_VIEW, // 홈 화면 조회
      data: {
        action: '모바일 웹 실행',
        label: '홈화면조회'
      }
    })
  },
  activated () {
    this.setObserver()
  },
  methods: {
    isOsApp,
    /**
     * 해당 앵커의 메뉴 이름을 반환.
     * @param {Object} menuName 엥커 메뉴 한글, 영어
     * @returns {String} 해당 앵커의 메뉴 이름
     */
    getAnchorMenuName (menuName) {
      return menuName.ENG
    },
    /**
     * ESPOT 정보 조회
     * @param {object} param (필수) ESPOT 정보 조회 파라미터
     * @returns {Promise} Promise
     */
    getEspotData (param) {
      return storeHomeService.getEspotData(param, response => {
        if (!isNull(response) && !isNull(response.msg)) {
          if (this.apiCount === 0) {
            this.apiFirstData.msg = { ...this.apiFirstData.msg, ...response.msg }
          } else {
            this.apiSecondData.msg = { ...this.apiSecondData.msg, ...response.msg }
          }
          ++this.apiCount
        }
      })
    },
    /**
     * Swiper Option
     * @param {number} initialSlide (필수) Swiper index
     * @returns {object} Swiper Option
     */
    getSwiperOptions (initialSlide) {
      return {
        initialSlide,
        slidesPerView: 'auto',
        spaceBetween: 24,
        centeredSlides: true
      }
    },
    /**
     * 클릭(탭) 동작 시, 선택한 앵커 메뉴로 이동
     * @param {String} contentsId 컨텐츠 ID
     * @param {Number} outerIndex 앵커 index
     * @param {Number} innerIndex 현재 메뉴 index
     */
    categoryMove (category, outerIndex, innerIndex) {
      let eventLabel = ''
      if (category === 'popular') {
        eventLabel = '지금인기'
      } else if (category === 'tv') {
        eventLabel = 'TV추천'
      } else if (category === 'happydeal') {
        eventLabel = '해피딜'
      } else if (category === 'today') {
        eventLabel = '오늘 추천'
      } else if (category === 'food') {
        eventLabel = '푸드/건강'
      } else if (category === 'beauty') {
        eventLabel = '뷰티/패션'
      } else if (category === 'life') {
        eventLabel = '생활/가전'
      }
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_메인',
          eventAction: 'Tab_이동',
          eventLabel,
          params: {
            t1: null
          }
        }
      })
      const isUpScroll = outerIndex > innerIndex // 스크롤 업 / 다운 판단
      const headerHeight = this.$root.$el.querySelector('header').clientHeight // 헤더 높이

      if (isUpScroll) {
        // 스크롤 업일때 AppBottomNavi의 스크롤 이벤트에 의해 헤더가 노출되면서 앵커 메뉴를 가림. 그래서 이동할 앵커 높이에 헤더 높이만큼 보정해 줌.
        uiUtil.scrollMove(`${category}_${innerIndex}`, -headerHeight - 36)
      } else {
        uiUtil.scrollMove(`${category}_${innerIndex}`, -36)
      }
      const targetEl = this.$refs[category + innerIndex]
      if (targetEl) {
        targetEl[0].$swiper.slideTo(innerIndex, 100)
      }
    },
    /**
     * 앵커 메뉴 정보 조회
     */
    async getAnchorMenuList () {
      const anchorMenuList = []
      const params = {
        typeFlag: ANCHOR_CONST.ANCHOR_MENU_PARAMETERS.PARAMETERS.TYPE_FLAG,
        espotInfo: ANCHOR_CONST.ANCHOR_MENU_PARAMETERS.PARAMETERS.ESPOT_INFO
      }
      const apiData = await this.$nsaxios.post(
        ANCHOR_CONST.ANCHOR_MENU_PARAMETERS.COMMAND_NAME,
        params,
        null
      )
      if (!isNull(apiData) && apiData.msg) {
        const menuList = apiData.msg._EZ_HOME_ANCHOR_ESPOT_SLIDE_TITLE
        menuList.forEach((element, index) => {
          const dataSet = {}
          dataSet.ENG = String(element.marketingText).split('|')[0]
          dataSet.KOR = String(element.marketingText).split('|')[1]
          anchorMenuList.push(dataSet)
        })
      }
      this.anchorMenuList = anchorMenuList
    },
    /**
     * 엥커 메뉴의 한글, 영어에 대한 상수 객체를 반환.
     * @returns {Array}
     */
    returnMenuList () {
      return this.anchorMenuList
    },
    /**
     * 엥커 데이터 유무 여부 반환. (첫번째 앵커는 제외 - 홈이 로딩될때 같이 로딩 되어야하기 때문.)
     * @param {String} outerValue
     * @returns {bool}
     */
    hasEspotData (outerValue) {
      let checker = false
      switch (outerValue.ENG) {
        case 'tv':
          checker =
            this.apiSecondData.msg.espotList[0]._EZ_HOME_ANCHOR2A_ESPOT_CNTNTPROM.length > 0 ||
            this.apiSecondData.msg.espotList[1]._EZ_HOME_ANCHOR2B_ESPOT_PRDWIDE.length > 0
          break
        case 'happydeal':
          checker =
            this.apiSecondData.msg.espotList[2]._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM.length > 0 ||
            this.apiSecondData.msg.espotList[3]._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE.length > 0
          break
        case 'today':
          checker = this.apiSecondData.msg.espotList[4]._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE.length > 0
          break
        case 'food':
          checker =
            this.apiSecondData.msg.espotList[7]._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST.length > 0 ||
            this.apiSecondData.msg.espotList[8]._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST.length > 0 ||
            this.apiSecondData.msg.espotList[9]._EZ_HOME_ANCHOR5C_ESPOT_CNTNTPRDLIST.length > 0
          break
        case 'beauty':
          checker =
            this.apiSecondData.msg.espotList[10]._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W.length > 0 ||
            this.apiSecondData.msg.espotList[11]._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDGRID4W.length > 0 ||
            this.apiSecondData.msg.espotList[12]._EZ_HOME_ANCHOR6C_ESPOT_CNTNTPRDGRID4W.length > 0
          break
        case 'life':
          checker =
            this.apiSecondData.msg.espotList[13]._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST.length > 0 ||
            this.apiSecondData.msg.espotList[14]._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDLIST.length > 0 ||
            this.apiSecondData.msg.espotList[15]._EZ_HOME_ANCHOR7C_ESPOT_CNTNTPRDLIST.length > 0
          break
        default:
          checker = false
          break
      }
      return checker
    },
    /**
     * 해당 앵커 데이터 반환.
     * @param {String} outerValue
     * @returns {Object}
     */
    getData (outerValue) {
      const anchorName = this.getAnchorMenuName(outerValue)
      let data = {
        espotList: {},
        espotExtendList: {}
      }
      switch (anchorName) {
        case 'tv':
          data.espotList._EZ_HOME_ANCHOR2A_ESPOT_CNTNTPROM = this.apiSecondData.msg.espotList[0]._EZ_HOME_ANCHOR2A_ESPOT_CNTNTPROM
          data.espotExtendList._EZ_HOME_ANCHOR2A_ESPOT_CNTNTPROM = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR2A_ESPOT_CNTNTPROM

          data.espotList._EZ_HOME_ANCHOR2B_ESPOT_PRDWIDE = this.apiSecondData.msg.espotList[1]._EZ_HOME_ANCHOR2B_ESPOT_PRDWIDE
          data.espotExtendList._EZ_HOME_ANCHOR2B_ESPOT_PRDWIDE = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR2B_ESPOT_PRDWIDE
          break
        case 'happydeal':
          data.espotList._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM = this.apiSecondData.msg.espotList[2]._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM
          data.espotExtendList._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM

          data.espotList._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE = this.apiSecondData.msg.espotList[3]._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE
          data.espotExtendList._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE
          break
        case 'today':
          data.espotList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE = this.apiSecondData.msg.espotList[4]._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE
          data.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR4A_RCMDSEARCH_TEXTSLIDE

          data.espotList._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W = this.apiSecondData.msg.espotList[5]._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W
          data.espotExtendList._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR4B_RCMDCLICK_PRDSLIDESQUARE25W

          data.espotList._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W = this.apiSecondData.msg.espotList[6]._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W
          data.espotExtendList._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR4C_ESPOT_CNTNT4W

          break
        case 'food':
          data.espotList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST = this.apiSecondData.msg.espotList[7]._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST
          data.espotExtendList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST

          data.espotList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST = this.apiSecondData.msg.espotList[8]._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST
          data.espotExtendList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST

          data.espotList._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST = this.apiSecondData.msg.espotList[9]._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST
          data.espotExtendList._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST
          break
        case 'beauty':
          data.espotList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W = this.apiSecondData.msg.espotList[10]._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W
          data.espotExtendList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W

          data.espotList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE = this.apiSecondData.msg.espotList[11]._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE
          data.espotExtendList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE

          data.espotList._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST = this.apiSecondData.msg.espotList[12]._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST
          data.espotExtendList._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST
          break
        case 'life':
          data.espotList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST = this.apiSecondData.msg.espotList[13]._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST
          data.espotExtendList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST

          data.espotList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE = this.apiSecondData.msg.espotList[14]._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE
          data.espotExtendList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE

          data.espotList._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST = this.apiSecondData.msg.espotList[15]._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST
          data.espotExtendList._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST = this.apiSecondData.msg.espotExtendList._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST
          break
        default:
          data = null
          break
      }
      return data
    },
    /**
     * 앱 유도 팝업 열기
     */
    openAppInducer () {
      modalUtil.show('common/AppInducer', null, this.eventPopupCheck)
    },
    /**
     * 이벤트 팝업 조건 검사후 조건이 맞으면 팝업 띄움.
     * @returns {Object || bool}
     */
    async eventPopupCheck () {
      const endDate = localStorageUtil.get(COMM_CONST.STORAGE_KEY.EVENT_POPUP_MAIN)
      if (isNull(endDate) || !getBdDay(endDate)) {
        const coCd = COMM_CONST.getCocd
        const commandName = 'NSEspotCommon'
        const parameters = {
          espotInfo: 'POPUP_MOBILE_HOME|Text',
          req_co_cd: coCd
        }
        const apiData = await this.$nsaxios.post(
          commandName,
          parameters,
          null
        )
        const popupInfo = apiData.msg.root?._POPUP_MOBILE_HOME[0]
        if (popupInfo) { popupInfo.partNumber = popupInfo?.clickCode } // 상품번호 명시
        if (!isNull(popupInfo)) { this.openAnimatePopup(popupInfo) }
      }
    },
    /**
     * 애니메이트 팝업 오픈 메소드.
     * @param {Object} options - 애니메이트 팝업 옵션객체.
     */
    openAnimatePopup (popupInfo) {
      const options = {
        componentPath: 'store/IntroPopup',
        delay: 1,
        param: popupInfo
      }
      animationPopupUtil.openAnimationPopup(options)
    },
    /**
     * 팝업 이벤트 시작
     */
    startPopupEvent () {
      if (!isOsApp() && COMM_CONST.BANNER_HIDE_COCD.indexOf(COMM_CONST.getCocd()) === -1) {
        const hasBannerBeenDown = sessionStorage.getItem(COMM_CONST.SESSION_STORAGE_KEY.ATTRACT_APP_DOWN_BANNER) === 'Y'
        if (!hasBannerBeenDown) {
          this.openAppInducer() // 모바일 유도 팝업. (기획전 유무 체크 포함)
        } else {
          this.eventPopupCheck() // 기획전 유무 체크
        }
      }
    },
    /**
     * 홈 앵커 데이터 두번째 호출을 위한 특정 영역에 옵저버 셋팅.
     */
    setObserver () {
      // 나머지 앵커 영역 Espot 정보 호출
      this.intersectionObserverObj = uiUtil.setInfiniteScroll(this, {
        callback: () => {
          if (this.apiCount === 1 && !this.apiCallingFlag) {
            this.apiCallingFlag = true
            this.getEspotData({
              typeFlag: ANCHOR_CONST.SECOND_PARAMETERS_EXTEND.TYPE_FLAG,
              espotInfo: Object.values(ANCHOR_CONST.PARAMETERS).join('$')
            }).then(() => {
            // 더 조회할 API가 없으므로 무한 스크롤 요소 감지 중지
              this.intersectionObserverObj.disconnect()
              this.isAfterApiCallFlag = true
              this.apiCallingFlag = false
            })
          }
        },
        options: {
          rootMargin: '-20% 0px' // top, right, bottom, left. default: '0px'
        },
        targetElement: this.$refs.anchorObserver
      })
    }
  }
}
</script>

<style lang="scss">
    @import "~@/assets/styles/views/store/StoreHome";
</style>
