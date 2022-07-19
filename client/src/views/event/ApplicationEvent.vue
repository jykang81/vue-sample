<template>
  <div class="event">
    <div
      v-html="eventHtml"
    />
    <p v-if="!isBtnOff">
      <button
        v-if="isApplicationCompleted"
        disabled
        type="button"
        class="btn_custom"
      >
        응모완료
      </button>
      <button
        v-else
        type="button"
        class="btn_custom"
        @click="onClickToApply"
      >
        응모하기
      </button>
    </p>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import LOGIN_CONST from '@constants/customer/login'
import EVENT_CONST from '@constants/event/event'
import COMMON_CONST from '@constants/common/common'
import CONST from '@constants/framework/framework'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  data () {
    return {
      offerId: '',
      offerNm: '',
      couponId: '',
      isBtnOff: false, // 버튼 노출 여부
      isApplicationCompleted: false, // 응모완료 여부
      eventHtml: '' // v-html에 추가될 HTML 코드
    }
  },
  watch: {
    /**
     * watching eventHtml
     * @param {String} payload
     */
    eventHtml (payload) {
      if (payload) {
        this.$nextTick(() => {
          this.setEventNoticeEventCallback()
        })
      }
    },
    '$route' (to, from) {
      if (to.name === 'applicationEvent' && from.path !== to.path) {
        this.init()
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * 페이지가 열릴때 기본적으로 실행되어야 할 작업들 정의
     */
    async init () {
      this.setRouteParams()
      this.setEventHtml(await this.getEventHtml())
      this.setShoppingHistory()

      const isLogon = loginUtil.checkLogonStatus()
      if (isLogon) {
        this.setApplyButton(await this.checkIsAlreadyApplied())
      }
    },
    /**
     * 쇼핑히스토리 저장
     * @returns {void}
     */
    setShoppingHistory () {
      const historyObj = {
        pageParams: this.$route.params,
        pageQueries: this.$route.query,
        offerIdfr: this.$route.params.offerId,
        offerNm: this.offerNm,
        eventPageId: this.$route.name,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.EVENT
      }
      bizUtil.setRecentlyViewedProducts(historyObj)
    },
    /**
     * 이전 페이지에서 넘어온 파라미터들 세팅
     */
    setRouteParams () {
      this.offerId = this.$route.params.offerId
      this.couponId = this.$route.query?.couponId
      this.isBtnOff = this.$route.query?.btn === 'off'
    },
    /**
     * 이벤트 HTML 받아오기 API 호출을 위한 파라미터
     * @returns {Object}
     */
    eventHtmlParams (data) {
      return {
        offerIdfr: this.offerId,
        cmdType: 102,
        winConfirmYn: 'N'
      }
    },
    /**
     * 참여여부 받아오기 API 호출을 위한 파라미터
     * @returns {Object}
     */
    isAlreadyAppliedParams () {
      return {
        mediaCd: EVENT_CONST.MEDIA_CD,
        flag: '00',
        eventIdfr: this.offerId
      }
    },
    /**
     * 이벤트 HTML 받아오기 API 호출
     * @returns { Object }
     */
    async getEventHtml () {
      return await this.$nsaxios.post('NSAjaxMTimesEventCmd', this.eventHtmlParams())
    },
    /**
     * 이벤트 HTML set
     * @param {Object} eventData 이벤트 데이터
     */
    setEventHtml (eventData) {
      this.offerNm = eventData.msg.eventDetail.offerNm
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '이벤트',
            t2: eventData.msg.eventDetail.offerNm,
            t3: '',
            t4: ''
          }
        }
      })

      this.eventHtml = htmlDecode(eventData.msg.eventDetail.dweditcont)
    },
    /**
     * '응모하기' 버튼 클릭 이벤트
     * @returns {void}
     */
    async onClickToApply () {
      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, true)
        return
      }

      let response = null

      if (this.couponId) {
        response = await this.downloadCoupon()
      } else {
        response = await this.applyEvent()
      }

      const msg = this.getAlertMessage(response)

      messageUtil.alert(msg, async () => {
        this.setApplyButton(await this.checkIsAlreadyApplied())
      })
    },
    /**
     * 이벤트 참여여부 체크
     * @returns {Object}
     */
    async checkIsAlreadyApplied () {
      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        return
      }
      return await this.$nsaxios.post('NSTimesPrmtEventCmd', this.isAlreadyAppliedParams())
    },
    /**
     * 응모하기 버튼 set
     * @param {Object} alreadyAppliedApiResult 응모 여부 데이터
     */
    setApplyButton (alreadyAppliedApiResult) {
      this.isApplicationCompleted = alreadyAppliedApiResult.msg.root.rtnCd === '1'
    },
    /**
     * 쿠폰 다운로드 API 호출
     * @returns {Object}
     */
    async downloadCoupon () {
      const params = {
        userId: loginUtil.userId(),
        cpNum: this.couponId,
        cmdType: ''
      }
      return await this.$nsaxios.post('CpDownloadReal', params)
    },
    /**
     * 이벤트 응모 API 호출
     * @returns {Object}
     */
    async applyEvent () {
      const params = {
        mediaCd: EVENT_CONST.MEDIA_CD,
        flag: EVENT_CONST.FLAG_TYPE.USE_OFFER_NUM,
        eventIdfr: this.offerId
      }
      return await this.$nsaxios.post('NSTimesPrmtEventCmd', params)
    },
    /**
     * 이벤트에 따른 alert 메시지 생성
     * @param {Object} eventData 이벤트 데이터
     * @returns {String}
     */
    getAlertMessage (eventData) {
      let msg = ''
      if (this.couponId) {
        const chkSuccess = eventData.msg.root.Output.successFlag
        if (chkSuccess?.toUpperCase() === 'Y') {
          msg = '쿠폰 다운로드가 성공하였습니다.'
        } else {
          msg = '쿠폰 다운로드가 실패하였습니다.'
        }
      } else {
        msg = eventData.msg.root.rtnMsg

        // 건강복권 일경우, 서버 메세지 처리
        if (this.offerId === '100000032965' || (this.offerId === '100000027821' && CONST.IS_SERVER_STATE === 'DEV')) {
          if (msg.startsWith('이벤트에 당첨되지 않았습니다')) {
            msg = '아쉽지만  다음기회에~</br>'
            msg += '내일 또 응모해주세요~</br>'
            msg += '(매일 한 ID당 1번씩 응모 가능)'
          } else if (msg.startsWith('축하합니다')) {
            msg = '건강복권 당첨을 축하드립니다.</br>'
            msg += '39,000원 할인쿠폰이 발급되었으니,</br>'
            msg += '유효기간내 꼭 사용해주세요'
          }
        } else if (((this.offerId === '100000037913') ||
                (this.offerId === '100000037915') ||
                (this.offerId === '100000037916') ||
                (this.offerId === '100000037917')) ||
                (this.offerId === '100000028021' && CONST.IS_SERVER_STATE === 'DEV') ||
                (this.offerId === '100000028023' && CONST.IS_SERVER_STATE === 'DEV')) {
          if (msg.startsWith('접속자가 너무 많습니다')) { // 응모하기_접속자 많을 경우
            msg = '현재 접속자 폭주로 이벤트 응모에 불편을 드려 죄송합니다.</br>'
            msg += '다시 접속 부탁드립니다'
          } else if (msg.startsWith('고객님은 이미 응모하셨습니다')) { // 응모하기_응모당첨 후 다시 탭시
            msg = '고객님은 이미 적립금 지급받으셨습니다.</br>'
            msg += '마이페이지에서 확인 후 오늘내로</br>'
            msg += '꼭 사용해주세요~'
          } else if (msg.startsWith('금일 선착순 수량이 마감되었습니다')) { // 응모하기 _응모 후 미당첨  (천개 모두 소진시)
            msg = '금일 선착순 수량이 마감되었습니다</br>'
            msg += '내일 다시 응모해주세요~'
          }
        } else if (this.offerId === '100000069607') { // 세뱃돈 받아야돼지 이벤트(2019.02.01 ~ 2019.02.10)
          if (msg.startsWidth('고객님은 이미 신청하셨습니다.')) {
            msg = '고객님은 이미 신청완료했습니다.'
          }
        }
      }

      return msg
    },
    /**
     * 유의사항 보기/접기 버튼 제어
     */
    setEventNoticeEventCallback () {
      const eventNoticeContent = document.querySelector('.wrap_content')
      const eventNoticeArr = document.querySelectorAll('.icon_arr')

      if (!eventNoticeContent) {
        return
      }

      const eventNoticeButton = document.querySelector('.wrap_notice .wrap_button')

      if (!eventNoticeButton) {
        return
      }

      eventNoticeButton.addEventListener('click', () => {
        if (eventNoticeContent.classList.contains('close')) {
          eventNoticeContent.classList.remove('close')
          eventNoticeArr.forEach(eventNotice => {
            eventNotice.classList.remove('close')
          })
        } else {
          eventNoticeContent.classList.add('close')
          eventNoticeArr.forEach(eventNotice => {
            eventNotice.classList.add('close')
          })
        }
      })
    }
  }
}

</script>

<style lang="scss">
  .event {
    padding: 1.6rem;

    img {
      width: 100%;
    }

    .btn_custom {
      width: 100%;
      height: 5.6rem;
      margin-top: 1.6rem;
      text-align: center;
      background-color: rgb(252, 84, 96);
      border-radius: .5rem;
      font-weight: bold;
      font-size: 1.8rem;
      color: rgb(255, 255, 255);
    }
  }
</style>
