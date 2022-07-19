<template>
  <section
    v-if="!isEmpty(livePlay) && !liveFinished"
    class="thinglive_live"
    :class="livePlay.vodPlayGubun == 'VIDEO' ? 'preview' : ''"
    :name="espotKeyName"
  >
    <!-- 동영상 썸네일 -->
    <div v-show="livePlay.vodLiveGoodsNm" id="liveWrap" class="photo_wrap">
      <router-link :to="{name: 'thingliveLiveDetail'}">
        <figure>
          <ns-img
            :src="livePlay.vodLiveImg"
            :alt="livePlay.vodLiveGoodsNm"
          />
        </figure>
        <div class="play_button">
          <button
            type="button"
            @click="sendPlayButtonClickLog"
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
      </router-link>
    </div>
    <div class="product_top">
      <div class="title_wrap">
        <strong
          class="title"
          @click="$router.push({name: 'thingliveLiveDetail'})"
        >
          {{ htmlDecode(livePlay.vodLiveGoodsNm) }}
        </strong>
        <button
          type="button"
          class="btn_share"
          @click="onClickShareBtn"
        >
          공유하기
        </button>
      </div>
      <!-- NSTalk -->
      <div
        v-if="nsTalkEnable"
        class="nstalk_line"
      >
        <i class="icons_nstalk" />
        <swiper
          ref="swiperTalk"
          :options="swiperTalk"
          class="swiper_talk"
        >
          <swiper-slide
            v-for="(value, index) in nsTalkMessage"
            :key="index"
          >
            <span>{{ value }}</span>
          </swiper-slide>
        </swiper>
        <a
          class="btn_nstalk"
          @click="goNsTalk"
        >
          <span>NS톡</span>
        </a>
      </div>
    </div>
    <!-- 상품 -->
    <product-list
      v-if="liveProd"
      :parent-info="parentInfo"
      :product-list="liveProd"
      :product-more-btn="true"
      :right-order-btn="true"
      @onClickRightOrderBtn="onClickRightOrderBtn"
    />
  </section>
</template>

<script>
import thingliveMixin from '@/mixins/media/thingliveMixin'
import setNsTalkRollingMixin from '@/mixins/store/home/setNsTalkRollingMixin'
import {
  timerObject,
  isEmpty,
  htmlDecode,
  isNull
} from '@utils/commonutil/commonUtil'
import {
  getPeriodDate
} from '@frameworks/dateutil/dateUtil'
import mediaUtil from '@utils/mediaUtil'
import messageUtil from '@frameworks/messageUtil'
import CONST from '@/common/constants/framework/framework'
import NsImg from '@components/common/NsImg'
import ProductList from '@/components/media/ProductList'

import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'

export default {
  name: 'ThingliveLive',
  components: {
    NsImg,
    ProductList
  },
  mixins: [
    thingliveMixin,
    setNsTalkRollingMixin
  ],
  props: {
    responseData: {
      type: Object,
      required: true
    },
    espotKeyName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      // 띵라이브 라이브 방송 남은 시간
      remainingTime: '00:00:00',
      // 띵라이브 라이브 방송 정보
      livePlay: {},
      // 띵라이브 라이브 상품 목록
      liveProd: [],
      parentInfo: 'ThingLive',
      swiperTalk: { // ns talk 롤링 세로 스와이프.
        direction: 'vertical',
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        loop: true
      },
      // 메시지 상수
      MESSAGES: {
        PLEASE_LOG_IN_AND_USE: '로그인 후 이용해 주세요.'
      },
      isLivePlayApiCalled: false, // API 호출완료 여부
      liveFinished: false // 라이브 방송 종료 여부
    }
  },
  watch: {
    responseData () {
      this.setThingliveLivePlay(this.responseData)
    },
    remainingTime () {
      // 라이브가 종료되었으면
      if (this.remainingTime === '00:00:00') {
        this.onChangeLiveData()
      }
    }
  },
  deactivated () {
    if (!isNull(this.nsTalkInterval)) { clearInterval(this.nsTalkInterval) }
    if (!isNull(this.nsTalkInfoInterval)) { clearInterval(this.nsTalkInfoInterval) }
  },
  activated () {
    if (this.isLivePlayApiCalled) {
      this.setNsTalk()
    }
  },
  methods: {
    isEmpty,
    htmlDecode,

    /**
     * 라이브 재생 영역 세팅
     * @param {object} livePlayData - 라이브 재생 영역 데이터
     * @returns {void}
     */
    setThingliveLivePlay (livePlayData) {
      if (!this.isLivePlayApiCalled) {
        this.isLivePlayApiCalled = true
      }
      // 동영상 영역 세팅
      this.livePlay = livePlayData

      // 'VIDEO':예고, 'LIVE':라이브
      if (this.livePlay.vodPlayGubun === 'LIVE') {
        this.livePlay.remainingDttm = this.livePlay.vodLiveEndDttm

        // 타이머 세팅
        this.setTimer()
      }

      // 상품 영역 세팅
      this.setProdArea(this.liveProd, livePlayData._vod_main_product, 'main')
      this.setProdArea(this.liveProd, livePlayData._vod_relation_product, 'rel')

      // NsTalk 세팅
      this.setNsTalk()
    },

    /**
     * 라이브 방송 남은 시간 설정
     * @returns {void}
     */
    setTimer () {
      timerObject.checkTimerObject()
      timerObject.m_timer = setInterval(this.setRemainingTime, 1000)
    },
    /**
     * 라이브 방송 남은 시간 설정
     * @returns {void}
     */
    setRemainingTime () {
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

        if (Number(timeLimit.hour) === 23 && Number(min) === 59 && Number(second) > 55) {
          // 라이브 재생 영역 데이터 호출
          this.getThingliveLivePlay()
        }
      // 방송중이면
      } else {
        this.remainingTime = `${mediaUtil.makeTwoDigits(hour)}:${min}:${second}`
      }
    },
    /**
     * 라이브 재생 영역 데이터 호출
     * @returns {void}
     */
    getThingliveLivePlay () {
      const param = {
        espotInfo: 'EZ_THING_LIVE|CATEVOD_VODLIVE|1|9999|0'
      }

      const successHandling = response => {
        this.setThingliveLivePlay(response.msg[0]._EZ_THING_LIVE[0])
      }

      this.$nsaxios.post('NSFixedShopNoCacheCmd', param, successHandling)
    },
    /**
     * 공유하기 버튼 클릭
     * @returns {void}
     */
    onClickShareBtn () {
      const param = {
        type: 'thinglive',
        title: this.livePlay.vodLiveGoodsNm,
        description: '',
        imageUrl: this.livePlay.vodLiveImg,
        likeCount: 0,
        viewCount: 0,
        shareUrl: `https://${CONST.MOBILE_NSMALL_PATH}/media/thinglive/live-stream`
      }
      this.$emit('onClickShareBtn', param)

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: '라이브',
          eventLabel: '라이브공유하기',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * 바로구매 버튼 클릭
     * @param {string} partNumber - 상품 번호
     * @returns {void}
     */
    onClickRightOrderBtn (partNumber) {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: '라이브',
          eventLabel: `바로구매_${partNumber}`,
          params: {
            t1: null
          }
        }
      })
      this.$emit('onClickRightOrderBtn', partNumber)
    },

    /**
     * 라이브 방송이 종료되면 호출된다.
     * @param {}
     * @returns {}
     */
    onChangeLiveData () {
      this.liveFinished = true
      this.$emit('onChangeLiveData', true)
    },
    /**
     * 재생 버튼 클릭 로그 전송
     */
    sendPlayButtonClickLog () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: '라이브',
          eventLabel: '재생',
          params: {
            t1: null
          }
        }
      })
    },
    /**
     * NS Talk 클릭
     */
    goNsTalk () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_띵라이브',
          eventAction: '라이브',
          eventLabel: 'NS톡',
          params: {
            t1: null
          }
        }
      })
      if (!loginUtil.checkLogonStatus()) {
        messageUtil.alert(this.MESSAGES.PLEASE_LOG_IN_AND_USE, () => {
          // 로그인 페이지로 이동
          bizUtil.gotoLogin()
        })
      } else {
        this.$router.push({ name: 'thingliveLiveDetail' })
      }
    },

    /**
     * NSTalk 데이터 세팅
     */
    setNsTalk () {
      const { vodLiveId, startDttm, endDttm } = this.setNsTalkBaseDataForTalkInfo()
      this.setNsTalkInfo('ting', vodLiveId, startDttm, endDttm)
      this.setNsTalkRolling()
    },

    /**
     * NSTalk 롤링 관련 데이터 세팅
     */
    setNsTalkBaseDataForTalkInfo () {
      const livePlay = this.livePlay
      const { vodPlayGubun, vodLiveId } = livePlay
      let startDttm = ''
      let endDttm = ''
      switch (vodPlayGubun) {
        case 'LIVE':
          startDttm = livePlay.vodLiveStartDttm
          endDttm = livePlay.vodLiveEndDttm
          break
        case 'VIDEO':
          startDttm = livePlay.vodVideoStartDttm
          endDttm = livePlay.vodVideoEndDttm
          break
        default:
          break
      }
      return { vodLiveId, startDttm, endDttm }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/store/module/ThingliveLive";
</style>
