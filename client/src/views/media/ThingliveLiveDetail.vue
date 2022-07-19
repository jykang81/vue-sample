<template>
  <div class="thinglive_live_detail">
    <div class="fixed">
      <!-- 라이브 -->
      <div v-if="checkPlayerUrl" class="photo_wrap">
        <div class="video_wrap">
          <video-player
            ref="videoPlayer"
            playsinline
            :options="playerOptions"
            :events="events"
            @ready="onPlayerReadied"
            @playing="onPlayerPlaying"
            @fullscreenchange="fullscreenchange"
          />
          <div class="video_thunbnail_img">
            <ns-img
              :src="playerOptions.poster"
              alt="썸네일"
            />
          </div>
        </div>
        <div
          v-show="showPlayButton"
          class="play_button"
        >
          <button
            type="button"
            @click="openDataWarning"
          >
            <span class="icons_play">재생</span>
          </button>
          <p
            v-show="livePlay.vodPlayGubun === 'LIVE'"
            class="copy time"
          >
            {{ remainingTime }}
          </p>
        </div>
        <data-warning
          v-if="showDataWarning"
          @closeDataWarning="closeDataWarning"
          @playVideo="playVideo"
        />
      </div>
      <!-- 바로구매, 상품 더보기 버튼 노출 -->
      <div class="product_live">
        <div :class="`item ${liveProd.length > 1 ? 'double' : 'sinigle'}`">
          <figure>
            <ns-img
              v-if="liveProdFirst"
              :product-number="liveProdFirst.partnumber"
              :alt="liveProdFirst.itncatentrynm"
              :width="88"
              :height="88"
            />
          </figure>
          <div v-if="liveProdFirst" class="price_title">
            <ns-price
              :dc-price="liveProdFirst.dcPrice"
              :dc-rate="liveProdFirst.dcRate"
              :price="liveProdFirst.price"
              :mm-rntal-prc="liveProdFirst.mmRntalPrc"
              :prc-wave-disp="liveProdFirst.prcWaveDisp"
              :buschn-id="liveProdFirst.buschnId"
              :disp-type-cd="liveProdFirst.dispTypeCd"
            />
            <p class="title">
              {{ htmlDecode(livePlay.vodLiveGoodsNm) }}
            </p>
          </div>
          <div v-if="liveProdFirst" class="button_box">
            <button
              v-if="!checkIntangibleGood(liveProdFirst.dispTypeCd)"
              type="button"
              class="btn_buy"
              @click="onClickRightOrderBtnAndPause(liveProdFirst.partnumber)"
            >
              <span>바로구매</span>
            </button>
            <button
              v-else
              type="button"
              class="btn_buy"
              @click="onClickConsultationRequestBtn(liveProdFirst.partnumber)"
            >
              <span>상담신청</span>
            </button>
            <button
              v-if="liveProd.length > 1"
              type="button"
              class="btn_more"
              @click="productLayerOpen"
            >
              <span>상품<br>더보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <ns-talk
      v-if="showNsTalk"
      :talk-info="talkInfo"
    />
    <!-- 상품더보기 레이어 -->
    <product-layer
      v-show="showProductLayer"
      :live-prod="liveProd"
      @layerClose="productLayerClose"
      @clickRightOrderBtn="onClickRightOrderBtnAndPause"
      @clickConsultationRequestBtn="onClickConsultationRequestBtn"
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
import {
  getPeriodDate
} from '@frameworks/dateutil/dateUtil'
import {
  timerObject,
  htmlDecode,
  isEmpty,
  isOsApp
} from '@utils/commonutil/commonUtil'
import {
  checkIntangibleGood
} from '@utils/productutil/productUtil'
import uiUtil from '@utils/uiUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import nativeUtil from '@frameworks/nativeUtil'
import mediaUtil from '@utils/mediaUtil'
import NsImg from '@components/common/NsImg'
import NsTalk from '@/components/media/NsTalk' // NS TALK 팝업
import NsPrice from '@components/common/NsPrice'
import ProductLayer from '@/components/media/ProductLayer' // 상품더보기 팝업
import DataWarning from '@/components/product/DataWarning' // 데이터 안내 팝업
import RightOrderOption from '@/components/product/RightOrderOption'
import rightOrderMixin from '@/mixins/product/rightOrderMixin'
import consultationMixin from '@/mixins/product/consultationMixin'
import CONST from '@constants/framework/framework'
import NO_IMAGE_WIDE from '@/assets/images/common/img_noImage_wide.png'
import router from '@/router'

export default {
  name: 'ThingliveLiveDetail',
  components: {
    NsImg,
    NsTalk,
    NsPrice,
    ProductLayer,
    DataWarning,
    RightOrderOption
  },
  mixins: [
    rightOrderMixin,
    consultationMixin
  ],
  data () {
    return {
      // 비디오 플레이어 이벤트 추가
      events: ['fullscreenchange'],
      // NSTalk 영역
      showNsTalk: false,
      talkInfo: {
        productCode: '',
        userId: '',
        userTel: ''
      },
      // 라이브 재생 영역
      livePlay: {},
      remainingTime: '00:00:00', // 라이브 방송 남은시간 (hh:mm:ss)
      showPlayButton: false, // 재생버튼 보임 여부
      showRemainingTime: false, // 남은시간 보임 여부
      showDataWarning: false, // 데이터 요금 경고 보임 여부
      playerOptions: {
        muted: false,
        fluid: true,
        language: 'ko',
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: NO_IMAGE_WIDE,
        controlBar: {
          children: [
            'fullscreenToggle',
            'playToggle',
            'remainingTimeDisplay',
            'volumePanel',
            'progressControl'
          ]
        }
      },
      currentPageYOffset: 0, // 현재 스크롤 위치

      // 라이브 상품 영역
      liveProd: [],
      showProductLayer: false,
      MAX_EXPOSE_PRODUCT_CNT: 3
    }
  },
  computed: {
    /**
     * 비디오 플레이어 객체 목록을 리턴한다
     * @returns {Array}
     */
    player () {
      return this.$refs.videoPlayer.player
    },
    /**
     * 비디오 플레이어의 영상 URL이 있는지 확인한다 (src 값이 없을 경우 초기 에러를 방지하기 위함)
     * @returns {String}
     */
    checkPlayerUrl () {
      return this.playerOptions.sources[0].src
    },
    liveProdFirst () {
      return this.liveProd[0]
    }
  },
  watch: {
    'showProductLayer' (showProductLayer) {
      if (showProductLayer || this.showNsTalk) {
        if (isOsApp()) {
          nativeUtil.setRoutePath('/popup')
        }
      } else {
        if (isOsApp()) {
          nativeUtil.setRoutePath(router.history.current.path)
        }
      }
    }
  },
  created () {
    if (isOsApp()) { // APP
      if (this.showNsTalk) {
        if (isOsApp()) {
          nativeUtil.setRoutePath('/popup')
        }
      } else {
        if (isOsApp()) {
          nativeUtil.setRoutePath(router.history.current.path)
        }
      }
    }
    // 순차적 API 호출이 필요한 함수
    this.callAPI()
  },
  mounted () {
    document.body.classList.add('live_talk')
  },
  destroyed () {
    document.body.classList.remove('live_talk')
  },
  methods: {
    htmlDecode,
    checkIntangibleGood,
    /**
     * 순차적 API 호출이 필요한 함수
     * @returns {void}
     */
    async callAPI () {
      // 라이브 재생 영역 데이터 호출
      await this.getThingliveVideoData()
    },

    /**
     * 라이브 재생 영역 데이터 호출
     * @returns {void}
     */
    async getThingliveVideoData () {
      const param = {
        viewGubun: 'VODLIVE',
        gubun: 0,
        memberId: loginUtil.custNum()
      }

      const successHandling = response => {
        this.setThingliveVideoData(response.msg.root)
      }

      await this.$nsaxios.post('NSThingLiveCmd', param, successHandling)
    },

    /**
     * 비디오 재생 로그 적재
     * @returns {void}
     */
    setPlayLog () {
      const param = {
        vodLiveId: this.livePlay.vodLiveId,
        viewGubun: 'VODLIVE',
        memberId: loginUtil.custNum(),
        gubun: this.livePlay.logType
      }

      this.$nsaxios.post('NSThingLiveCmd', param)
    },

    /**
     * 라이브 재생 영역 세팅
     *
     * @param {Object} data - 라이브 방송 및 상품 정보
     * @returns {void}
     */
    setThingliveVideoData (data) {
      // 동영상 영역 세팅
      this.livePlay = data

      // 'VIDEO':예고, 'LIVE':라이브
      if (this.livePlay.vodPlayGubun === 'LIVE') {
        this.livePlay.mediaType = 'application/x-mpegURL'
        this.livePlay.remainingDttm = this.livePlay.vodLiveEndDttm // 라이브 방송 종료시간 (YYYYMMDDhhmmss)
        this.livePlay.vodVideoUrl = CONST.LIVE.url.thinglive
        this.livePlay.logType = '2' // 로그 적재용 구분값 - 1 : 예고 , 2 : 본방
        this.playerOptions.controlBar.children.pop() // progressbar 제거

        // 타이머 세팅
        this.setTimer()
      } else {
        this.livePlay.mediaType = 'video/mp4'
        this.livePlay.logType = '1' // 로그 적재용 구분값 - 1 : 예고 , 2 : 본방
      }

      this.playerOptions.poster = this.livePlay.vodLiveImg
      this.playerOptions.sources[0].src = this.livePlay.vodVideoUrl
      this.playerOptions.sources[0].type = this.livePlay.mediaType

      // 상품 영역 세팅
      const vodMainPrd = data._vod_main_product
      const vodRelPrd = data._vod_relation_product
      this.setProdArea(vodMainPrd.concat(vodRelPrd))

      // NSTalk 데이터 세팅
      this.setNSTalkData(data._vod_main_product[0].partnumber)
    },

    /**
     * NSTalk 데이터 세팅
     *
     * @param {String} productCode - 상품 코드
     * @returns {void}
     */
    setNSTalkData (productCode) {
      if (this.livePlay.vodNstalkYn === 'Y' && !isEmpty(this.livePlay.PersonalInfo)) {
        this.$nsaxios.post(`https://${CONST.NSTALK_THINGLIVE_PATH}/api/messages`, {
          code: this.livePlay.vodLiveId
        }).then(response => {
          if (response.data.code === '0' && response.data.talk_enable) {
            this.talkInfo.productCode = productCode
            this.talkInfo.userId = this.livePlay.PersonalInfo.user_id
            this.talkInfo.userTel = this.livePlay.PersonalInfo.user_tel
            this.showNsTalk = true
          }
        })
      }
    },

    /**
     * 상품 영역 세팅
     *
     * @param {Object} prdList - 상품 목록
     * @param {String} type - 상품 구분(main:메인상품, rel:연관상품)
     * @returns {void}
     */
    setProdArea (prdList, type) {
      for (let i = 0; i < prdList.length; i++) {
        // 상품별 데이터
        const item = prdList[i]

        // item 데이터가 있으면
        if (item) {
          // 임시 객체
          const tempObject = {
            dcPrice: item.dcPrice, // 알뜰할인가
            dcRate: item.dcRate, // 할인율
            price: item.price, // 판매가
            mmRntalPrc: item.mmRntalPrc, // 렌탈 금액
            prcWaveDisp: item.prcWaveDisp, // 옵션상품 가격 '~'표시
            partnumber: item.partnumber, // 상품코드(백엔드)
            promIfiVal: item.promIfiVal !== '0', // 무이자여부
            dlvrFreeYn: item.dlvrFreeYn === 'Y', // 무료배송여부
            promPadYn: item.promPadYn === 'Y', // 적립금여부
            itncatentrynm: item.itncatentrynm, // 상품명(브랜드 노출X)
            buschnId: item.buschnId, // 방송 매체
            dispTypeCd: item.dispTypeCd, // 상품 유형
            type // 메인 상품 / 연관 상품 구분 값
          }
          this.liveProd.push(tempObject)
        }
      }
    },

    /**
     * 라이브 방송 남은 시간 설정
     * @returns {void}
     */
    setTimer () {
      // 타이머 초기화
      timerObject.checkTimerObject()
      // 타이머 설정
      timerObject.m_timer = setInterval(this.setRemainingTime, 1000)
    },
    /**
     * 라이브 방송 남은 시간 설정 (1초 마다 실행됨)
     * @returns {void}
     */
    setRemainingTime () {
      if (this.livePlay.remainingDttm === null) {
        timerObject.checkTimerObject()
        return false
      }

      const timeLimit = getPeriodDate(this.livePlay.remainingDttm, 'json')
      const day = timeLimit.day
      const hour = Number(timeLimit.hour) + (day * 24)
      const min = timeLimit.minute
      const second = timeLimit.second

      // 방송 시간이 종료되었으면
      if (Number(day) === -1) {
        this.livePlay.remainingDttm = null
        this.remainingTime = '00:00:00'
        timerObject.checkTimerObject()

        if (this.livePlay.vodPlayGubun === 'VIDEO') {
          messageUtil.alert('해당 방송이 시작되었습니다.')
        }

        if (Number(timeLimit.hour) === 23 && Number(min) === 59 && Number(second) > 30) {
          // 라이브 재생 영역 데이터 호출
          this.getThingliveVideoData()
        }
      } else {
        this.remainingTime = `${mediaUtil.makeTwoDigits(hour)}:${min}:${second}`
      }
    },
    /**
     * 비디오 플레이어 준비됨
     * @returns {void}
     */
    onPlayerReadied () {
      this.showPlayButton = true
      this.showRemainingTime = true
    },
    /**
     * 비디오 플레이어 재생됨
     * @returns {void}
     */
    onPlayerPlaying () {
      this.setPlayLog()
    },
    /**
     * 비디오 재생
     * @returns {void}
     */
    playVideo () {
      this.showDataWarning = false
      this.player.play()
    },
    /**
     * 비디오 정지
     * @returns {void}
     */
    pauseVideo () {
      this.player.pause()
    },
    /**
     * 데이터 요금 안내 레이어 열기
     * @returns {void}
     */
    openDataWarning () {
      this.showDataWarning = true
      this.showPlayButton = false
      this.showRemainingTime = false
    },
    /**
     * 데이터 요금 안내 레이어 닫기
     * @returns {void}
     */
    closeDataWarning () {
      this.showDataWarning = false
      this.showPlayButton = true
      this.showRemainingTime = true
    },
    /**
     * 상품더보기 팝업 열기
     * @returns {void}
     */
    productLayerOpen () {
      uiUtil.disableScroll()
      this.showProductLayer = true
    },
    /**
     * 상품더보기 팝업 닫기
     * @returns {void}
     */
    productLayerClose () {
      this.showProductLayer = false
    },
    /**
     * 바로구매 버튼 클릭 이벤트
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickRightOrderBtnAndPause (partNumber) {
      this.pauseVideo()
      this.onClickRightOrderBtn(partNumber)
    },
    /**
     * 상담신청 버튼 클릭 이벤트
     * @param {String} partNumber - 상품번호
     * @returns {void}
     */
    onClickConsultationRequestBtn (partNumber) {
      this.pauseVideo()
      this.moveConsultationRequest(partNumber)
    },
    /**
     * 전체화면 전환/복구 시 발생하는 이벤트
     *
     * @param {Object} playerObj 비디오 플레이어 object
     */
    fullscreenchange (playerObj) {
      // 전체 화면 전환 시 스크롤 위치 저장 후, 전체 화면 복구 시 스크롤 위치 복구 (App에서 동영상 전체 화면시 바닥 페이지 스크롤 최상단으로 이동하는 버그 대응)
      const isFullSCreen = playerObj.isFullscreen_
      if (isFullSCreen) {
        this.currentPageYOffset = window.pageYOffset
      } else {
        window.scrollTo(0, this.currentPageYOffset)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/media/ThingliveLiveDetail";
</style>
