<template>
  <div class="event">
    <section class="section">
      <div class="board-read theme-a">
        <article class="">
          <div class="wrap">
            <div class="data-body"
                 style="background: #4d49d1"
            >
              <p>
                <a href="javascript:;" class="ui-link">
                  <img
                    src="http://image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/event/2020/11/(m)1119_event_time_01_375_483_z.jpg"
                    alt="ns모바일전용 하루두번 타임쿠폰 AM 10시 선착순 200명, PM 10시 선착순 200명 AM 10시 앱전용 10% 할인쿠폰"
                    style="display:block" border="0"
                  >
                </a>
              </p>
              <p>
                <a href="javascript:;" class="ui-link" @click="clickDownloadCouponButton('day')">
                  <img
                    src="http://image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/event/2020/11/(m)1119_event_time_02_375_103_z.jpg"
                    alt="10% 쿠폰 다운받기"
                    style="display:block" border="0"
                  >
                </a>
              </p>

              <p>
                <a href="javascript:;" class="ui-link">
                  <img
                    src="http://image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/event/2020/11/(m)1119_event_time_03_375_222_z.jpg"
                    alt="쿠폰 다운로드 받았으니 비밀특가 구경하기"
                    style="display:block" border="0"
                  >
                </a>
              </p>
              <p>
                <a href="javascript:;" class="ui-link" @click="clickDownloadCouponButton('night')">
                  <img
                    src="http://image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/event/2020/11/(m)1119_event_time_04_375_99_z.jpg"
                    alt="PM 10시 앱전용 10% 할인쿠폰"
                    style="display:block" border="0"
                  >
                </a>
              </p>
              <p>
                <a href="javascript:;" class="ui-link" @click="moveToSettings">
                  <img
                    src="http://image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/event/2020/11/(m)1119_event_time_05_375_173_z.jpg"
                    alt="푸시 수신동의 하러가기"
                    style="display:block" border="0"
                  >
                </a>
              </p>
              <p>
                <a href="javascript:;" class="ui-link">
                  <img
                    src="http://image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/event/2020/11/(m)1119_event_time_notice_375_424_z.jpg"
                    alt="이벤트페이지 하단의 유의사항을 꼭 확인해주세요."
                    style="display:block" border="0"
                  >
                </a>
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import CONST from '@constants/framework/framework'
import LOGIN_CONST from '@constants/customer/login'
import { gettingPushStateHandler, isOsApp } from '@utils/commonutil/commonUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  data () {
    return {
      coupon: {}
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
      this.setReceiptTimeCoupon(await this.getReceiptTimeCoupon())
    },
    /**
     * 타임쿠폰 조회 API 호출을 위한 파라미터
     * inde : (mobile:쿠폰가능갯수, ajax1:쿠폰다운로드)
     * @returns {Object}
     */
    timeCouponParams () {
      return {
        userId: loginUtil.userId(),
        inde: 'mobile'
      }
    },
    /**
     * 이벤트 HTML 받아오기 API 호출
     * @returns { Object }
     */
    async getReceiptTimeCoupon () {
      return await this.$nsaxios.post('NSTimesTimeCouponAjax', this.timeCouponParams())
    },
    /**
     * 이벤트 HTML set
     * @param {Object} eventData 이벤트 데이터
     */
    setReceiptTimeCoupon (eventData) {
      const [day, night] = eventData.msg
      this.$set(this.coupon, 'day', day)
      this.$set(this.coupon, 'night', night)
    },
    /**
     * 다운로드 쿠폰 버튼 클릭
     * @param {String} timeSeparator (day,night)
     */
    async clickDownloadCouponButton (timeSeparator) {
      if (CONST.IS_SERVER_STATE === 'REAL') {
        if (!isOsApp()) {
          const alertMsg = '모바일 App에서만 다운로드 가능합니다.'
          messageUtil.alert(alertMsg)
          return
        }
      }

      const isLogon = loginUtil.checkLogonStatus()
      if (!isLogon) {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, null, false)
        return
      }

      const callback = async resultJsonString => {
        console.log('ysjoo>>pushState>>>', JSON.parse(resultJsonString).pushState)
        if (JSON.parse(resultJsonString).pushState === 'Y') {
          if (Number(this.coupon?.[timeSeparator]?.CNT) > 0) {
            const data = await this.downloadCoupon(timeSeparator)
            messageUtil.alert(data.rtnMsg, () => {
              this.getReceiptTimeCoupon()
            })
          } else {
            const msg = '남은 수량이 없습니다.'
            messageUtil.alert(msg)
          }

          let eventLabel = ''
          if (timeSeparator === 'day') {
            eventLabel = '타임쿠폰 > 오전10시 10% 쿠폰'
          } else if (timeSeparator === 'night') {
            eventLabel = '타임쿠폰 > 오후10시 10% 쿠폰'
          }
          // 마케팅 스크립트 적용 부분
          // GA360
          marketingUtil.ga360Logger.send({
            type: marketingUtil.ga360Logger.LOG_EVENT,
            data: {
              eventCate: 'MOBILE_이벤트상세',
              eventAction: '이벤트_혜택',
              eventLabel,
              params: {
                t1: null
              }
            }
          })
        } else {
          const msg = '쇼핑알림(PUSH) 수신동의 고객만 참여 가능합니다.'
          messageUtil.alert(msg, () => {
            this.moveToSettings()
          })
        }
      }

      // 푸시 수신동의 여부 체크
      gettingPushStateHandler({
        name: 'appPushStateHandler',
        callback
      })
    },
    /**
     * 쿠폰 다운로드
     * inde : (mobile:쿠폰가능갯수, ajax1:쿠폰다운로드)
     */
    async downloadCoupon (timeSeparator) {
      const invokeParam = {
        userId: loginUtil.userId(),
        inde: 'ajax1',
        offerid: this.coupon?.[timeSeparator]?.CP_IDFR
      }

      return await this.$nsaxios.post('NSTimesTimeCouponAjax', invokeParam)
    },
    /**
     * 푸시알람동의 설정으로 이동(웹에서는 마이페이지 메인으로 이동)
     *
     */
    moveToSettings () {
      this.$router.push({ name: 'mypageSetting' })

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_이벤트상세',
          eventAction: '이벤트_배너',
          eventLabel: '타임쿠폰 > 푸시수신동의(설정)',
          params: {
            t1: null
          }
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

  }
</style>
