<template>
  <section id="event_popup" class="section_intro_popup">
    <div class="wrapper_intro_popup">
      <div class="swiper-container intro_layer_wrap">
        <div id="eventPopupContents" class="swiper-wrapper" v-html="popupContent" />
        <div id="eventPopupSwipePagination" class="swiper-pagination" />
        <div
          v-if="isSwiperRequired"
          id="eventPopupNextBtn"
          class="swiper-button-next"
        >
          <span class="blind">이전 보기</span>
        </div>
        <div
          v-if="isSwiperRequired"
          id="eventPopupPrevBtn"
          class="swiper-button-prev"
        >
          <span class="blind">다음 보기</span>
        </div>
      </div>

      <div class="wrap_button">
        <a
          id="btnEventToday"
          class="today_close_button"
          role="button"
          @click="handleNoWatchToday"
        >
          <span>{{ okTxt }}</span>
        </a>
        <a
          id="popupBtnEventClose"
          class="close_button"
          role="button"
          @click="handleClose"
        >
          <span>{{ cancelTxt }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import loginUtil from '@utils/loginUtil'
import {
  htmlDecode,
  isNull,
  isOsApp,
  gettingPushStateHandler
} from '@utils/commonutil/commonUtil'
import Swiper from 'swiper'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      DEFAULT_OK_TXT: '오늘 하루 보지 않기',
      DEFAULT_CANCEL_TXT: '닫기',
      popupContent: '', // 팝업 raw html
      popupCount: 0, // 팝업 갯수
      swiperObject: null // swiper 객체
    }
  },
  computed: {
    /**
     * 확인 문구
     * @returns {String}
     */
    okTxt () {
      return this.param.okTxt ? this.param.okTxt : this.DEFAULT_OK_TXT
    },
    /**
     * 취소 문구
     * @returns {String}
     */
    cancelTxt () {
      return this.param.cancelTxt ? this.param.cancelTxt : this.DEFAULT_CANCEL_TXT
    },
    /**
     * swiper 초기화 필요 여부
     * @returns {Boolean}
     */
    isSwiperRequired () {
      return this.popupCount > 1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    /**
     * 오늘 하루 더보지 않기 처리
     */
    handleNoWatchToday () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_팝업',
          eventAction: '팝업',
          eventLabel: '오늘하루닫기',
          params: {
            t1: 'GNB',
            t2: '팝업',
            t3: '',
            t4: ''
          }
        }
      })

      if (!isNull(this.param.okCb) && typeof (this.param.okCb) === 'function') { // 콜백 실행
        this.param.okCb()
      }

      this.$store.commit('popup/hideWithoutBack') // 팝업 닫기
    },
    /**
     * 닫기 처리
     */
    handleClose () {
      // 마케팅 스크립트 적용 부분
      // GA 360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_팝업',
          eventAction: '팝업',
          eventLabel: '닫기',
          params: {
            t1: 'GNB',
            t2: '팝업',
            t3: '',
            t4: ''
          }
        }
      })

      // 팝업 닫은 후 메인 페이지 방문 시 팝업 미노출
      sessionStorage.setItem(COMM_CONST.SESSION_STORAGE_KEY.MAIN_EVENT_POPUP_DISPLAY, 'N')

      if (!isNull(this.param.canCb) && typeof (this.param.canCb) === 'function') {
        this.param.canCb()
      }

      this.$store.commit('popup/hideWithoutBack') // 팝업 닫기
    },
    /**
     * 컴포넌트 초기화
     */
    init () {
      if (isOsApp()) {
        const handlerOptions = {
          callback: this.initHandler,
          name: 'eventPopupInithandler'
        }
        gettingPushStateHandler(handlerOptions)
      } else {
        this.initHandler(JSON.stringify({ pushState: 'N' }))
      }
    },
    /**
     * swiper 초기화
     */
    initSwiper () {
      if (this.popupCount > 1) {
        this.swiperObject = new Swiper('.intro_layer_wrap', {
          slidesPerView: 1,
          loop: true,
          pagination: {
            el: '#eventPopupSwipePagination',
            clickable: true
          },
          navigation: {
            nextEl: '#eventPopupNextBtn',
            prevEl: '#eventPopupPrevBtn'
          }
        })
      }
    },
    /**
     * 초기화 처리기
     * @param {String} stringParams 콜백 매개변수
     */
    initHandler (stringParams) {
      const params = JSON.parse(stringParams)
      const { pushState = 'N' } = params

      const isLogon = loginUtil.checkLogonStatus()

      const msg = this.param.msg

      let checkflag = ''
      let msgMaxCnt = 0

      if (msg !== null && msg.length > 0) {
        msgMaxCnt = msg.length

        if (msg[0].popAreaLv1 === '01') {
          if (msg.length >= 3) {
            msgMaxCnt = 3 // Main 팝업일 경우 최대 3개까지만 팝업을 띄운다.
          } else {
            msgMaxCnt = msg.length
          }
        } else {
          msgMaxCnt = msg.length
        }

        for (let i = 0; i < msg.length; i++) {
          if (msg[i].popTitle.indexOf('PUSH') !== -1) {
            checkflag = 'Y'
            break
          }
        }
      }

      this.popupCount = msgMaxCnt

      if (pushState === 'N' && isLogon === true && msgMaxCnt > 1 && checkflag === 'Y') {
        for (let j = 0; j < msgMaxCnt; j++) {
          if (pushState === 'N' && msg[j].popTitle.indexOf('PUSH') !== -1 && isLogon === true) {
            this.popupContent +=
              `<div class='swiper-slide'>
                ${htmlDecode(msg[j].popCont)}
              </div>`
          }
        }
      } else {
        for (let k = 0; k < msgMaxCnt; k++) {
          if (msgMaxCnt > 1 && msg[k].coCd === COMM_CONST.getCocd() && msg[k].popTitle.indexOf('PUSH') === -1) {
            this.popupContent +=
              `<div class='swiper-slide'>
                ${htmlDecode(msg[k].popCont)}
              </div>`
          } else if (msgMaxCnt === 1) {
            // cocd 데이터가 하나이면 그냥 뿌려주기
            this.popupContent +=
              `<div class='swiper-slide'>
                ${htmlDecode(msg[k].popCont)}
              </div>`
          }
        }
      }

      setTimeout(this.initSwiper, 300)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/common/EventPopup";
</style>
