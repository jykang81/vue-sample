<template>
  <div class="coupon_register">
    <div class="gray_box">
      <p class="icon_coupon">
        COUPON
      </p>
      <p class="coupon_title">
        쿠폰을 등록하세요
      </p>
      <p class="coupon_input">
        <label>
          <input
            type="text"
            placeholder="쿠폰번호"
            :value="couponNumber"
            @input="inputEvent"
          >
        </label>
      </p>
      <p class="coupon_regist">
        <button
          type="button"
          @click="onClickCouponRegister"
        >
          등록하기
        </button>
      </p>
      <ul class="event_guide_list">
        <li>유효기간, 발급기회, 할인대상, 할인조건은 쿠폰마다 상이합니다.</li>
        <li>발급방식 : 쿠폰번호를 쿠폰 입력창에 입력 → 등록하기 버튼 누르면 자동발급</li>
      </ul>
    </div>
    <p class="event_guide_title">
      유의사항
    </p>
    <ul class="event_guide_list border_none">
      <li>확인한 쿠폰번호를 정확하게 입력해주셔야 합니다. (대소문자 구별해 입력)</li>
      <li>쿠폰의 혜택은 쿠폰번호를 확인한 페이지에서 확인 가능 혹은 마이페이지 → 쿠폰 페이지에서 확인 가능</li>
      <li>취소/반품 시 혜택 재사용 불가, 유효기간 지난 혜택 사용 불가</li>
      <li>Nsmall앱 구매건에 한해 적용 (G마켓/옥션/11번가 구매건은 적용 불가)</li>
      <li>일부상품은 혜택 적용이 불가할 수 있음 (상품 결제단에서 혜택 적용여부 확인가능)</li>
      <li>쿠폰의 경우, 1회 구매시 상품 옵션 1건에 한정해 적용</li>
      <li>본 이벤트는 사정에 의해 사전고지 없이 변경 또는 취소될 수 있음</li>
      <li>부정한 방법으로 참여시 당첨취소 및 법적책임을 물 수 있음</li>
    </ul>
  </div>
</template>

<script>
import {
  isNull,
  getBytes,
  getCutBytes
} from '@utils/commonutil/commonUtil'
import COMMON_CONST from '@constants/common/common'
import loginUtil from '@utils/loginUtil'
import bizUtil from '@utils/bizUtil'
import messageUtil from '@frameworks/messageUtil'
import EVENT_CONST from '@constants/event/event'

export default {
  data () {
    return {
      // 등록할 쿠폰번호
      couponNumber: '',
      // 메시지 상수
      MESSAGES: {
        PLEASE_ENTER_THE_COUPON_NUMBER: '쿠폰번호를 입력해주세요.',
        PLEASE_LOG_IN_AND_USE: '로그인 후 이용하실 수 있습니다.'
      }
    }
  },
  mounted () {
    // 쇼핑히스토리 저장
    this.setShoppingHistory()
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
     * 쿠폰등록 API를 호출한다
     * @returns {void}
     */
    registerCoupon () {
      const param = {
        mediaCd: EVENT_CONST.MEDIA_CD,
        flag: EVENT_CONST.FLAG_TYPE.USE_COUPON_NUM,
        eventIdfr: '0', // 오퍼번호(0으로 일단 전달)
        couponCode: this.couponNumber, // 입력한 제휴사 쿠폰번호
        regCpYn: 'Y',
        userId: loginUtil.userId()
      }

      const successHandling = response => {
        this.callbackRegisterCoupon(response)
      }
      this.$nsaxios.post('NSTimesPrmtEventCmd', param, successHandling)
    },

    /**
     * 쿠폰등록 API 호출 콜백함수
     * @param {object} data - 쿠폰등록 API response data
     * @returns {void}
     */
    callbackRegisterCoupon (data) {
      if (!isNull(data.msg.root)) {
        // rtnMsg
        // 등록되지 않은 쿠폰번호입니다
        // 쿠폰번호가 없습니다.
        // 쿠폰이 발급되었습니다.
        // 사용할 수 없는 쿠폰입니다.
        // 쿠폰을 발급 받을 수 없습니다.(유입경로)
        // 고객님은 이미 쿠폰을 다운로드 받으셨습니다.
        // 쿠폰 다운로드에 실패하였습니다.
        messageUtil.alert(data.msg.root.rtnMsg)
      }
    },

    /**
     * '등록하기' 버튼 클릭 이벤트
     * @returns {void}
     */
    onClickCouponRegister () {
      // 쿠폰 번호 Validation 체크
      if (isNull(this.couponNumber)) {
        messageUtil.alert(this.MESSAGES.PLEASE_ENTER_THE_COUPON_NUMBER)
      // 로그인이 되어있지 않으면
      } else if (!loginUtil.checkLogonStatus()) {
        messageUtil.alert(this.MESSAGES.PLEASE_LOG_IN_AND_USE)
        bizUtil.gotoLogin()
      } else {
        // 쿠폰등록 API를 호출한다
        this.registerCoupon()
      }
    },

    /**
     * 쿠폰번호 input 이벤트
     * (쿠폰번호는 208byte까지 입력 가능)
     * @param {event} e - 쿠폰번호 입력 input 이벤트
     * @returns {void}
     */
    inputEvent (e) {
      const maximumLength = 208
      this.couponNumber = e.target.value
      this.$nextTick(() => {
        if (getBytes(this.couponNumber) > maximumLength) {
          this.couponNumber = getCutBytes(this.couponNumber, maximumLength)
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/event/CouponRegister";
</style>
