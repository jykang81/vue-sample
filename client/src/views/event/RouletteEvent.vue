<template>
  <div class="roulette_event">
    <figure class="img">
      <img src="~@/assets/images/event/img_roulette_title.png" alt="톨 이벤트 행운의 룰렛 하루1번 룰렛 돌리고 적립금 받자!">
      <div class="roulette">
        <img
          ref="rouletteImg"
          src="~@/assets/images/event/img_roulette.png"
          alt="톨 이벤트 행운의 룰렛 하루1번 룰렛 돌리고 적립금 받자!"
          @click="onClickStartRoulette"
        >
        <img src="~@/assets/images/event/img_roulette_marker.png" alt="마커" class="marker">
      </div>
    </figure>
    <div class="toll_box">
      <div class="left_box">
        <p class="my_toll">
          나의 톨
        </p>
        <p
          v-if="!isLogin"
          class="text_login"
        >
          로그인 후 톨 확인이 가능합니다.
        </p>
        <p
          v-else
          class="number"
        >
          {{ tollPoint }}
        </p>
      </div>
      <p
        v-if="!isLogin"
        class="btn_login"
      >
        <a @click="bizUtil.gotoLogin()">
          로그인하러 가기
        </a>
      </p>
      <div
        v-else
        class="right_box"
      >
        <button
          type="button"
          @click="onClickGoTollHistory"
        >
          톨 내역 보러가기
        </button>
      </div>
    </div>
    <p class="event_guide_title">
      유의사항
    </p>
    <ul class="event_guide_list space">
      <li>이벤트 안내 : 매일 1회 10톨로 참여</li>
      <li>당첨안내 : 당첨즉시 즉시 지급, 마이페이지에서 확인 가능</li>
      <li>적립금 유효기간 : 당첨일로부터 30일</li>
      <li>본 이벤트는 사정에 의해 사전고지 없이 변경 또는 취소될 수 있음</li>
      <li>부정한 방법으로 참여시 당첨취소 및 법적책임을 물 수 있음</li>
    </ul>
    <p class="toll_point_text">
      톨포인트란?
    </p>
    <ul class="event_guide_list border_none">
      <li>NS홈쇼핑 모바일에서 럭키박스 이벤트 응모를 통해 적립금으로 교환 할 수 있는 포인트입니다.</li>
      <li>상품리뷰 작성, 멤버십 승급 및 등급 유지, 다양한 이벤트 등을 통해 적립됩니다.</li>
      <li>톨 포인트 유효기간은 지급일로부터 1년이며, 이후 자동소멸 됩니다.</li>
    </ul>
  </div>
</template>

<script>
import {
  isNull,
  insertCommas
} from '@utils/commonutil/commonUtil'
import COMMON_CONST from '@constants/common/common'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import externalUtil from '@utils/externalUtil'
import EVENT_CONST from '@constants/event/event'
import PROMOTION_CONST from '@constants/promotion/toll'

export default {
  data () {
    return {
      // 로그인 여부
      isLogin: false,
      // 나의 톨
      tollPoint: '0',
      // 룰렛 실행중 여부
      runningRoulette: false,
      // 룰렛결과 메시지
      resultMsg: '',
      // 메시지 상수
      MESSAGES: {
        FAIL_TO_GET_TOLL: 'TollPoint 가져오기 실패',
        CAN_PARTIFIPATE_AFTER_LOGIN: '로그인 후 참여 가능합니다.'
      }
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
    },
    offerId () {
      return this.$route.params.offerId
    }
  },
  mounted () {
    // 쇼핑히스토리 저장
    this.setShoppingHistory()

    // 로그인이 되어있으면
    if (loginUtil.checkLogonStatus()) {
      // 톨포인트 받아오기 API 호출
      this.getTollPoint()
      this.isLogin = true
    }

    // GSAP 라이브러리 받아오기
    externalUtil.getScript('//cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js')
  },
  methods: {
    /**
     * 쇼핑히스토리 저장
     * @returns {void}
     */
    setShoppingHistory () {
      const historyObj = {
        pageParams: this.$route.params,
        offerIdfr: this.$route.params.offerId,
        offerNm: this.$route.meta.title,
        eventPageId: this.$route.name,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.EVENT
      }
      bizUtil.setRecentlyViewedProducts(historyObj)
    },

    /**
     * 톨포인트 받아오기 API 호출
     * @returns {void}
     */
    getTollPoint () {
      const firstDay = calcDate('', 0, 0, -1, 0, 'yyyyMMdd')
      const today = calcDate('', 0, 0, 0, 0, 'yyyyMMdd')

      const param = {
        schFlag: PROMOTION_CONST.SCH_FLAG.FOR_ONE_MONTHS,
        fromDate: firstDay,
        toDate: today,
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.setTollPoint(response)
      }
      this.$nsaxios.post('TolPointReal', param, successHandling)
    },

    /**
     * 룰렛이벤트 참여 API 호출
     * @returns {void}
     */
    startRoulette () {
      // 룰렛 실행중
      this.runningRoulette = true

      const param = {
        mediaCd: EVENT_CONST.MEDIA_CD,
        flag: EVENT_CONST.FLAG_TYPE.USE_OFFER_NUM,
        eventIdfr: this.offerId,
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.setRouletteResult(response)
      }
      this.$nsaxios.post('NSTimesPrmtEventCmd', param, successHandling)
    },

    /**
     * 톨포인트 세팅
     * @param {object} data - 톨포인트 조회 결과
     * @returns {void}
     */
    setTollPoint (data) {
      if (isNull(data.msg.root) || isNull(data.msg.root.common)) {
        messageUtil.alert(this.MESSAGES.FAIL_TO_GET_TOLL)
      } else {
        this.tollPoint = insertCommas(data.msg.root.common.amount)
      }
    },

    /**
     * 룰렛 결과 세팅
     * @param {object} data - 룰렛 결과
     * @returns {void}
     */
    setRouletteResult (data) {
      if (!isNull(data.msg.root)) {
        // 이벤트 실패
        if (data.msg.root.rtnCd !== '0') {
          // rtnMsg
          // 고객님은 이미 신청하셨습니다.&lt;br&gt;내일도 꼭 신청해주세요.
          // 응모하실 톨이 부족합니다.&lt;br/&gt;이벤트 참여 또는 상품평 작성을 통해 톨 적립이 가능합니다.
          messageUtil.alert(data.msg.root.rtnMsg)
          // 룰렛 종료
          this.runningRoulette = false
        // 이벤트 성공
        } else {
          // rtnMsg
          // 이벤트에 당첨되지 않았습니다. 다음기회에 다시 응모하세요.
          // 축하합니다. 적립금 100원에 당첨되었습니다.
          // 축하합니다. 적립금 500원에 당첨되었습니다.
          // 축하합니다. 적립금 2000원에 당첨되었습니다.
          // 축하합니다. 적립금 5000원에 당첨되었습니다.
          // 축하합니다. 적립금 10000원에 당첨되었습니다.
          this.resultMsg = data.msg.root.rtnMsg
          // 당첨된 금액만 추출
          let value = (data.msg.root.rtnMsg).replace(/[^0-9]/gi, '')
          // 꽝인 경우 '0'을 넣어줌
          if (value === '') {
            value = '0'
          }
          // 룰렛 로테이션 에니메이션 실행
          this.spinRoulette(value)
        }
      }
    },

    /**
     * 룰렛 로테이션 에니메이션 실행 - 등수별 멈출 위치 선정 (시계방향)
     * - 1등 : 0˚~60˚
     * - 2등 : 61˚~120˚
     * - 3등 : 121˚~180˚
     * - 4등 : 181˚~240˚
     * - 5등 : 241˚~300˚
     * - 6등 : 301˚~360˚
     * @param {string} value - 당첨 금액
     * @returns {void}
     */
    spinRoulette (value) {
      const GRADE = {
        10000: 1,
        5000: 2,
        1000: 3,
        500: 4,
        100: 5,
        0: 6
      }
      const TOTAL_ROULETTE_ANGLE = 360
      const GRADE_CNT = 6 // 당첨 등급 갯수
      const DEFAULT_ANGLE = TOTAL_ROULETTE_ANGLE / GRADE_CNT // 당첨 목록수별 기본 각도(60˚)
      const ROTATION_CNT = 10 // 룰렛 회전 수
      const RANDOM_NUM = Math.floor(Math.random() * DEFAULT_ANGLE * 0.8) - DEFAULT_ANGLE * 0.4 // 정 가운데가 아닌 양 사이드가 선택 되도록 -20˚~20˚사이의 랜덤 숫자 추출

      const TEMP_ANGLE = (DEFAULT_ANGLE * GRADE[value]) - DEFAULT_ANGLE / 2 + RANDOM_NUM // 등수별 정지 각도 계산
      const FINAL_ANGLE = TEMP_ANGLE - (TOTAL_ROULETTE_ANGLE * ROTATION_CNT) // 총 회전 각도

      const param = {
        rotation: -FINAL_ANGLE,
        duration: 5,
        ease: 'elastic.inOut(0.1, 1)',
        onComplete: () => {
          messageUtil.alert(this.resultMsg)
          // 톨포인트 받아오기 API 호출
          this.getTollPoint()
          // 룰렛 종료
          this.runningRoulette = false
        }
      }

      window.gsap.to(this.$refs.rouletteImg, param)
    },

    /**
     * '톨 내역 보러가기' 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickGoTollHistory () {
      this.$router.push({ path: '/customer/info/benefit/toll' })
    },

    /**
     * '룰렛 이미지' 클릭 이벤트, 룰렛 돌리기 시작
     * @returns {void}
     */
    onClickStartRoulette () {
      // 로그인이 되어있지 않으면
      if (!loginUtil.checkLogonStatus()) {
        messageUtil.alert(this.MESSAGES.CAN_PARTIFIPATE_AFTER_LOGIN, () => {
          bizUtil.gotoLogin()
        })
      // 이미 룰렛이 실행 중이 아니면
      } else if (!this.runningRoulette && !isNull(this.offerId)) {
        // 룰렛이벤트 참여 API 호출
        this.startRoulette()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/RouletteEvent";
</style>
