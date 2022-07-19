<template>
  <div class="lucky_box_event">
    <figure class="img">
      <img src="~@/assets/images/event/img_luckybox.png" alt="톨포인트 이벤트 LUCKY BOX">
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
        v-if="isLogin"
        class="right_box"
      >
        <button
          type="button"
          @click="onClickGoTollHistory"
        >
          톨 내역 보러가기
        </button>
      </div>
      <p
        v-if="isLogin"
        class="btn_application"
      >
        <button
          type="button"
          @click="onClickToApply"
        >
          응모하기
        </button>
      </p>
    </div>
    <p class="event_guide_title">
      유의사항
    </p>
    <ul class="event_guide_list space">
      <li>이벤트 안내 : 1회 응모시 1천톨 소진되며, 랜덤당첨을 통해 톨이나 적립금으로 교환 (톨 소진시까지 무제한 응모 가능)</li>
      <li>당첨안내 : 당첨즉시 즉시 지급, 마이페이지에서 확인 가능</li>
      <li>톨 유효기간 : 당첨일로부터 1년</li>
      <li>적립금 유효기간 : 당첨일로부터 30일</li>
      <li>본 이벤트는 사정에 의해 사전고지 없이 변경 또는 취소될 수 있음</li>
      <li>부정한 방법으로 참여시 당첨취소 및 법적책임을 물 수 있음</li>
    </ul>
    <p class="toll_point_text">
      <span>톨포인트</span> 모으는 방법
    </p>
    <table class="table_toll_point" summary="톨포인트 모으는 방법">
      <caption><span class="blind">톨포인트 모으는 방법</span></caption>
      <tr>
        <th scope="col">
          구분
        </th>
        <th scope="col">
          활동내용
        </th>
        <th scope="col">
          획득 톨 포인트
        </th>
      </tr>
      <tr>
        <th scope="row" rowspan="4">
          상품평
        </th>
        <td>식품평</td>
        <td><strong>300</strong></td>
      </tr>
      <tr>
        <td>텍스트상품평</td>
        <td><strong>400</strong></td>
      </tr>
      <tr>
        <td>프리미엄 상품평</td>
        <td><strong>500</strong></td>
      </tr>
      <tr>
        <td>매일 출석체크</td>
        <td><strong>10</strong></td>
      </tr>
      <tr>
        <th scope="row" rowspan="2">
          출석이벤트
        </th>
        <td>출석체크 후 2회 구매</td>
        <td><strong>5,000</strong></td>
      </tr>
      <tr>
        <td>한달 출석체크</td>
        <td><strong>365</strong></td>
      </tr>
    </table>
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
  insertCommas,
  toNumeric
} from '@utils/commonutil/commonUtil'
import COMMON_CONST from '@constants/common/common'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import PROMOTION_CONST from '@constants/promotion/toll'

export default {
  data () {
    return {
      // 로그인 여부
      isLogin: false,
      // 나의 톨
      tollPoint: '0',
      // message 메시지 상수
      MESSAGES: {
        FAIL_TO_GET_TOLL: 'TollPoint 가져오기 실패',
        DO_NOT_HAVE_ENOUGH_TOLL: '응모하실 톨이 부족합니다.<br>이벤트 참여 또는 상품평 작성을 통해 톨 적립이 가능합니다.',
        CONFIRM_AGREE_TO_APPLY: '적립금을 응모하는데<br>1,000톨이 소진됩니다.<br>적립금 응모에 참여하시겠습니까?'
      }
    }
  },
  computed: {
    bizUtil () {
      return bizUtil
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
  },
  methods: {
    /**
     * 쇼핑히스토리 저장
     * @returns {void}
     */
    setShoppingHistory () {
      const historyObj = {
        pageParams: this.$route.params,
        offerIdfr: this.$route.name,
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
     * 럭키박스 응모하기 API 호출
     * @returns {void}
     */
    applyLuckyBox () {
      const param = {
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.setApplyLuckyBoxResult(response)
      }
      this.$nsaxios.post('NSMTimesLuckyBoxReal', param, successHandling)
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
     * 럭키박스 응모 결과 세팅
     * @param {object} data - 럭키박스 응모 결과
     * @returns {void}
     */
    setApplyLuckyBoxResult (data) {
      if (data.msg.rtn.rtnCode === '0') {
        // rtnMsg
        // 50000원에 당첨되었습니다.
        // 2000원에 당첨되었습니다.
        // 1000원에 당첨되었습니다.
        // 500원에 당첨되었습니다.
        // 100원에 당첨되었습니다.
        // 500톨에 당첨되었습니다.
        messageUtil.alert(`축하합니다!<br>${data.msg.rtn.rtnMsg}`)
      } else {
        // rtnMsg
        // 신청 가능한 톨포인트는 1000점 이상입니다.
        // 다음기회를 이용하세요. -> 오류
        messageUtil.alert(data.msg.rtn.rtnMsg)
      }
      // 톨포인트 받아오기 API 호출
      this.getTollPoint()
    },

    /**
     * '응모하기' 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickToApply () {
      // 1000톨보다 작으면
      const minimumToll = 1000
      if (toNumeric(this.tollPoint) < minimumToll) {
        messageUtil.alert(this.MESSAGES.DO_NOT_HAVE_ENOUGH_TOLL)
      // 응모
      } else {
        messageUtil.confirm(this.MESSAGES.CONFIRM_AGREE_TO_APPLY, this.applyLuckyBox, null, '확인', '취소')
      }
    },

    /**
     * '톨 내역 보러가기' 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickGoTollHistory () {
      this.$router.push({ path: '/customer/info/benefit/toll' })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/LuckyBoxEvent";
</style>
