<template>
  <div class="event">
    <div class="event_mounthcoupon">
      <div class="event_section wrap_hero">
        <img src="https://image.nsmall.com/ec_comimages/nsupload/espot/images/mobile/03_Event/201909/coupon/con1.png" alt="" class="img">
      </div>
      <div class="event_section wrap_con2">
        <img src="https://image.nsmall.com/ec_comimages/nsupload/espot/images/mobile/03_Event/201909/coupon/con2.png" alt="" class="img">
        <div class="info_level login">
          <p v-if="loginUtil.checkLogonStatus()"
             class="wrap_member" :class="gradeThumbnailClass"
          >
            <span class="user_thumb" />
            <strong class="member_info">{{ gradeName ? gradeName : '패밀리' }}</strong>
          </p>
          <p v-else
             class="before_info"
          >
            <img src="https://image.nsmall.com/ec_comimages/nsupload/espot/images/mobile/03_Event/201909/coupon/con2_copy.png" alt="로그인 해주세요"
                 @click="bizUtil.gotoLogin()"
            >
          </p>
        </div>
      </div>
      <div class="event_section wrap_coupon"
           v-html="eventHtml"
      />
    </div>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

export default {
  data () {
    return {
      offerId: '',
      offerNm: '',
      gradeName: '', // 고객등급
      gradeGrd: '', // 고객등급 코드
      gradeThumbnailClass: '', // 고객등급 썸네일
      eventHtml: '' // v-html에 추가될 HTML 코드
    }
  },
  computed: {
    loginUtil () {
      return loginUtil
    },
    bizUtil () {
      return bizUtil
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
      const isLogon = loginUtil.checkLogonStatus()
      if (isLogon) {
        const myMemberShipData = await this.getMyMemberShip()
        const { currentGrd, currentGrdName } = myMemberShipData.msg.root.PurchaseGrd
        this.gradeName = currentGrdName
        this.gradeGrd = currentGrd
      }
      this.setCustomerinfo()
      this.setEventHtml(await this.getEventHtml())
    },
    /**
     * 이전 페이지에서 넘어온 파라미터들 세팅
     */
    setRouteParams () {
      this.offerId = this.$route.params.offerId
    },
    /**
     * 이벤트 HTML 받아오기 API 호출
     * @returns { Object }
     */
    async getMyMemberShip () {
      return await this.$nsaxios.post('NsMembershipReal', {})
    },
    /**
     * 고객등급 UI 세팅
     */
    setCustomerinfo () {
      if (this.gradeGrd === 'R12' || this.gradeGrd === 'LOVE.N') {
        this.gradeThumbnailClass = 'lovens'
      } else if (this.gradeGrd === 'R1' || this.gradeGrd === '다이아몬드') {
        this.gradeThumbnailClass = 'diamond'
      } else if (this.gradeGrd === 'R13' || this.gradeGrd === '골드') {
        this.gradeThumbnailClass = 'gold'
      } else if (this.gradeGrd === 'R2' || this.gradeGrd === '실버') {
        this.gradeThumbnailClass = 'silver'
      } else {
        this.gradeThumbnailClass = 'family'
      }
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
      this.eventHtml = htmlDecode(eventData.msg.eventDetail.dweditcont)
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

      eventNoticeButton.addEventListener('touchstart', () => {
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
@import "~@/assets/styles/common/variables";

$mypage: $images + "/mypage";

  .event {
      padding: 1.6rem;

      .event_mounthcoupon  {
          .event_section {
              position: relative;

              &:nth-last-child(1) {
                  padding-bottom: 8%;
              }

              .img {
                  display: block;
                  position: relative;
                  width: 100%;
              }

              .button {
                  display: block;
                  margin: 0 14%;
              }

              &.wrap_hero {
                  position: relative;
              }

              &.wrap_coupon {
                  background-color: #fff;

                  .coupon {
                      position: relative;
                      margin: 0 14%;

                      .label_model {
                          position: absolute;
                          top: 11%;
                          left: 5%;
                          transform: rotate(-45deg);
                          font-size: 14px;
                          color: #fff;
                      }

                      .text {
                          position: absolute;
                          top: 49%;
                          width: 100%;
                          margin-top: -54px;
                          color: #000;
                          font-size: 12px;
                          text-align: center;
                          line-height: 100%;
                          word-break: break-word;

                          strong {
                              display: block;
                              font-size: 62px;
                              color: #222;
                              line-height: 100%;
                              letter-spacing: -1px;

                              span {
                                  font-size: 40px;
                                  line-height: 100%;
                                  vertical-align: bottom;
                              }
                          }

                          .info {
                              display: inline-block;
                              font-size: 13px;
                              color: #888;
                              line-height: 142%;
                              word-break: keep-all;
                              white-space: nowrap;
                          }
                      }
                  }
              }

              .info_level {
                  position: absolute;
                  left: 0;
                  right: 0;
                  top: 0;
                  bottom: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  padding: 0;
                  background: transparent !important;

                  .wrap_member {
                      display: none;
                      width: 100%;
                      align-items: center;
                      justify-content: center;
                      margin-top: 2%;
                      line-height: 26px;
                      color: #fff;
                  }
              }

              &.wrap_con2 {
                  .info_level {
                      &.login {
                          .wrap_member {
                              display: flex;
                          }

                          .before_info {
                              // display: none;
                          }
                      }

                      .before_info {
                          display: block !important;
                          margin: 2% 27% 0;

                          img {
                              width: 100%;
                          }
                      }

                      .wrap_member {
                          .member_info {
                              margin-left: 7px;
                              font-size: 18px;
                              font-weight: normal;
                              line-height: 25px;
                              vertical-align: top;
                          }

                          .user_thumb {
                              display: inline-block;
                              width: 7%;
                              padding-top: 7%;
                              background-size: contain;
                              background-repeat: no-repeat;
                          }

                          &.silver {
                              .user_thumb {
                                  background-image: url("#{$mypage}/icons_silver.png");
                              }

                              .member_info {
                                  color: #919199;
                              }
                          }

                          &.gold {
                              .user_thumb {
                                  background-image: url("#{$mypage}/icons_gold.png");
                              }

                              .member_info {
                                  color: #eec100;
                              }
                          }

                          &.family {
                              .user_thumb {
                                  background-image: url("#{$mypage}/icons_family.png");
                              }

                              .member_info {
                                  color: #4a76d5;
                              }
                          }

                          &.lovens {
                              .user_thumb {
                                  background-image: url("#{$mypage}/icons_markLoveN.png");
                              }

                              .member_info {
                                  color: #fc645f;
                              }
                          }

                          &.diamond {
                              .user_thumb {
                                  background-image: url("#{$mypage}/icons_diamond.png");
                              }

                              .member_info {
                                  color: #8973d2;
                              }

                          }
                      }
                  }
              }
          }
      }

      .wrap_notice {

          .wrap_button {
              display: block;
              background-color: #000;
              line-height: 32px;
              font-size: 16px;
              font-weight: bold;
              color: #fff;
              text-align: center;

              .acc_button {
                  display: inline-block;
                  position: relative;
                  padding-right: 30px;

                  .icon_arr {
                      position: absolute;
                      right: 0;
                      top: 6px;
                      border: 1.1px solid #fff;
                      width: 19px;
                      height: 19px;
                      border-radius: 100%;
                      text-align: center;

                      &.close {

                          &::after {
                              margin-top: 4px;
                              transform: rotate(45deg);
                          }
                      }

                      &::after {
                          content: "";
                          height: 6px;
                          width: 6px;
                          display: block;
                          margin-left: 6px;
                          margin-top: 7px;
                          border: 2px solid #fff;
                          border-left-width: 0;
                          border-top-width: 0;
                          transform: rotate(225deg);
                      }
                  }
              }
          }

          .wrap_content {
              display: block;

              &.close {
                  display: none;
              }

              .info_group_wrap {

                  &:last-child {
                      padding-bottom: 30px;
                  }

                  .title_wrap {
                      padding: 30px 15px 0;
                      font-size: 16px;
                  }

                  .info_wrap {
                      padding: 10px 15px;
                      font-size: 14px;

                      .row_group {
                          display: flex;
                          line-height: 130%;

                          &+.row_group {
                              padding-top: 8px;
                          }

                          .row_header {
                              position: relative;
                              white-space: nowrap;
                              padding: 0 4px 0 15px;

                              &::before {
                                  content: "";
                                  position: absolute;
                                  left: 3px;
                                  top: 7px;
                                  width: 4px;
                                  height: 4px;
                                  background-color: #000;
                                  border-radius: 4px;
                              }
                          }
                      }
                  }

                  .wrap_legal {
                      padding: 10px 15px;
                      font-size: 12px;

                      p {
                          width: auto !important;
                          position: relative;
                          padding: 0 0 8px 15px;
                          line-height: 130%;

                          &:last-child {
                            padding-bottom: 0;
                          }

                          &::before {
                            content: "※" ;
                            position: absolute;
                            top: -2px;
                            left: 0;
                          }
                      }
                  }

                  .wrap_legal2 {
                      padding: 10px 15px;
                      font-size: 12px;

                      p {
                          width: auto !important;
                          position: relative;
                          padding: 0 0 8px 15px;
                          line-height: 130%;

                          &:last-child {
                              padding-bottom: 0;
                          }

                          &::before {
                              content: "-" ;
                              position: absolute;
                              top: 0;
                              left: 3px;
                          }
                      }
                  }
              }
          }
      }
  }
</style>
