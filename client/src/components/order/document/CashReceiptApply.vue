<template>
  <div class="cash_receipt_apply">
    <h3 class="title">
      현금영수증 신청
    </h3>
    <div class="cash_receipt_apply_form">
      <p class="guide">
        2007년 3월 21일부터 ‘현금영수증 자진 발급제’가 시행됨에 따라 현금결제 후 별도로 신청을 하지 않으셔도 현금영수증이 자동 발급됩니다.
      </p>
      <p class="guide">
        별도로 신청하지 않고 자동 발급된 현금영수증을 본인의 것으로 전환하고 싶으실 경우 이후에 국세청 사이트에서 확인 하시기 바랍니다.
      </p>
      <div class="radio_box">
        <p>
          <input
            id="radio1"
            type="radio"
            name="purpose"
            checked
            @click="clickPhone"
          >
          <label for="radio1">개인 소득공제용</label>
        </p>
        <p>
          <input
            id="radio2"
            type="radio"
            name="purpose"
            @click="clickBusiness"
          >
          <label for="radio2">사업자 지출증빙용</label>
        </p>
      </div>
      <template v-if="phoneOrBusiness.phone && !phoneOrBusiness.business">
        <div class="input_field">
          <label for="label_phone">
            휴대폰
          </label>
          <span class="input_group">
            <input
              id="label_phone"
              key="phoneInput"
              type="number"
              pattern="\d*"
              title="휴대폰번호 입력"
              class="form text"
              placeholder="휴대폰 번호('-'없이 입력)"
              @focus="onFoucs($event)"
              @blur="onblurValueApply($event)"
              @keydown="keydownNumber($event)"
              @keyup="keyupNumber($event)"
            >
          </span>
          <p v-if="phoneInputEntered && (phoneErrorNotInput || phoneErrorNotAccurate)" class="error_msg">
            {{ phoneErrorMessage }}
          </p>
        </div>
      </template>
      <template v-else-if="!phoneOrBusiness.phone && phoneOrBusiness.business">
        <div class="input_field">
          <label for="label_business">
            사업자등록번호
          </label>
          <span class="input_group">
            <input
              id="label_business"
              key="businessInput"
              type="number"
              pattern="\d*"
              title="사업자등록번호 입력"
              class="form text"
              placeholder="사업자등록번호('-'없이 입력)"
              @focus="onFoucs($event)"
              @blur="onblurValueApply($event)"
              @keydown="keydownNumber($event)"
              @keyup="keyupNumber($event)"
            >
          </span>
          <p v-if="businessInputEntered && (businessErrorNotInput || businessErrorNotAccurate)" class="error_msg">
            {{ businessErrorMessage }}
          </p>
        </div>
      </template>
    </div>
    <div class="button">
      <button
        type="button"
        class="btn gray"
        @click="onClickCancle"
      >
        취소
      </button>
      <button
        type="button"
        class="btn coral"
        @click="onClickSubmit"
      >
        신청하기
      </button>
    </div>
  </div>
</template>

<script>
import toastUtil from '@frameworks/toastUtil'
import messageUtil from '@frameworks/messageUtil'
import loginUtil from '@utils/loginUtil'
import MEMBER_CONST from '@/common/constants/customer/member'
import COMM_CONST from '@/common/constants/framework/constants'
import cashReceiptApplyService from '@services/order/document/cashReceiptApplyService'

export default {
  name: 'CardReceiptApply',
  props: {
    param: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      phoneOrBusiness: { phone: true, business: false }, // 휴대폰 번호 혹은 사업자등록번호 선택 여부
      phoneNum: '', // 실제로 전달되는 휴대폰 번호 값
      businessNum: '', // 실제로 전달되는 사업자등록번호 값
      phoneInputEntered: false, // 휴대폰 번호 포커스 여부
      phoneErrorNotInput: true, // 휴대폰 번호 유효성 검증
      phoneErrorNotAccurate: false, // 휴대폰 번호 유효성 검증
      businessInputEntered: false, // 사업자등록번호 포커스 여부
      businessErrorNotInput: true, // 사업자등록번호 유효성 검증
      businessErrorNotAccurate: false, // 사업자등록번호 유효성 검증
      receiptApplyFlag: false // 다중 클릭 방지 플래그
    }
  },
  computed: {
    /**
     * 휴대폰 번호 유효성 검증 에러 메세지 노출용 Computed
     * @returns {String}
     */
    phoneErrorMessage () {
      let resultMsg = ''
      if (this.phoneErrorNotInput && !this.phoneErrorNotAccurate) {
        resultMsg = '휴대폰 번호를 입력해 주세요.'
      } else if (!this.phoneErrorNotInput && this.phoneErrorNotAccurate) {
        resultMsg = '휴대폰 번호를 정확히 입력해 주세요.'
      }
      return resultMsg
    },
    /**
     * 사업자등록번호 유효성 검증 에러 메세지 노출용 Computed
     * @returns {String}
     */
    businessErrorMessage () {
      let resultMsg = ''
      if (this.businessErrorNotInput && !this.businessErrorNotAccurate) {
        resultMsg = '사업자등록번호를 입력해 주세요.'
      } else if (!this.businessErrorNotInput && this.businessErrorNotAccurate) {
        resultMsg = '사업자등록번호를 정확히 입력해 주세요.'
      }
      return resultMsg
    }
  },
  methods: {
    /**
     * Focus 시 Input Type을 Number로 고정
     */
    onFoucs (e) {
      const inputValue = e.target.value
      e.target.type = 'number'
      e.target.value = inputValue.replace(/[^0-9]/g, '')
    },
    /**
     * key down 방향기, 백스페이스, Del키,  숫자 외 입력 금지
     * maxlength (16) 이상은 방향기, 백스페이스, Del키 만 허용
     * @param {object} e - event object
     * @returns {void}
     */
    keydownNumber (e) {
      const code = e.keyCode
      const ALLOW_KEYS = [
        COMM_CONST.KEY_CODE.BACK_SPACE,
        COMM_CONST.KEY_CODE.DELETE,
        COMM_CONST.KEY_CODE.LEFT,
        COMM_CONST.KEY_CODE.RIGHT
      ]

      if (!ALLOW_KEYS.includes(code) && (code < COMM_CONST.KEY_CODE.NUM_0 || code > COMM_CONST.KEY_CODE.NUM_9)) {
        e.preventDefault()
      }

      if (e.target.value.length >= 12) {
        if (!ALLOW_KEYS.includes(code)) {
          e.preventDefault()
        }
      }
    },
    /**
     * 입력시 숫자를 제외한 값 제거 후 재할당
     * @param {object} e - event object
     * @returns {void}
     */
    keyupNumber (e) {
      e.target.value = e.target.value.replace(/[^0-9]/g, '')
    },
    /**
     * 최종 value 적용
     * @param {object} e - event object
     * @returns {void}
     */
    onblurValueApply (e) {
      const targetId = e.target.id.split('_')[1]
      if (!this.phoneInputEntered && targetId && targetId === 'phone') {
        this.phoneInputEntered = true
      } else if (!this.businessInputEntered && targetId && targetId === 'business') {
        this.businessInputEntered = true
      }
      const phoneErrorFlagLength = {
        leastLength: 10,
        maxLength: 11,
        leastBoundaryLength: 9,
        maxBoundaryLength: 12
      }
      const businessErrorFlagLength = {
        targetLength: 10
      }
      const validCheckNum = e.target.value
      /** 휴대폰 번호 검증 */
      if (this.phoneOrBusiness.phone && !this.phoneOrBusiness.business) {
        this.phoneNum = validCheckNum
        if (validCheckNum.length === 0) {
          this.phoneErrorNotInput = true
          this.phoneErrorNotAccurate = false
          return
        } else if (!validCheckNum.startsWith('0') || validCheckNum.length < phoneErrorFlagLength.leastLength || validCheckNum.length > phoneErrorFlagLength.maxLength) {
          this.phoneErrorNotInput = false
          this.phoneErrorNotAccurate = true
          return
        } else if (validCheckNum.startsWith('0') || validCheckNum.length > phoneErrorFlagLength.leastBoundaryLength || validCheckNum.length < phoneErrorFlagLength.maxBoundaryLength) {
          this.phoneErrorNotInput = false
          this.phoneErrorNotAccurate = false
        }
        e.target.type = 'text'
        const firstThree = validCheckNum.substring(0, 3)
        const thirdThree = validCheckNum.substring(3, 6)
        const thirdFour = validCheckNum.substring(3, 7)
        const sixthFour = validCheckNum.substring(6)
        const seventhFour = validCheckNum.substring(7)
        if (validCheckNum.length === 11) {
          e.target.value = `${firstThree}-${thirdFour}-${seventhFour}`
        } else if (validCheckNum.length === 10) {
          e.target.value = `${firstThree}-${thirdThree}-${sixthFour}`
        }
        /** 휴대폰 번호 검증 끝 */
        /** 사업자등록번호 검증 */
      } else if (!this.phoneOrBusiness.phone && this.phoneOrBusiness.business) {
        this.businessNum = validCheckNum
        if (validCheckNum.length === 0) {
          this.businessErrorNotInput = true
          this.businessErrorNotAccurate = false
          return
        } else if (validCheckNum.length < businessErrorFlagLength.targetLength || validCheckNum.length > businessErrorFlagLength.targetLength) {
          this.businessErrorNotInput = false
          this.businessErrorNotAccurate = true
          return
        } else if (validCheckNum.length === businessErrorFlagLength.targetLength) {
          this.businessErrorNotInput = false
          this.businessErrorNotAccurate = false
        }
        e.target.type = 'text'
        const firstThree = validCheckNum.substring(0, 3)
        const thirdTwo = validCheckNum.substring(3, 5)
        const sixthFive = validCheckNum.substring(5)
        if (validCheckNum.length === 10) {
          e.target.value = `${firstThree}-${thirdTwo}-${sixthFive}`
        }
      }
      /** 사업자등록번호 검증 끝 */
    },
    /**
     * 휴대폰 번호 선택시 Call되는 함수
     * @returns {void}
     */
    clickPhone () {
      this.phoneInputEntered = false
      this.phoneOrBusiness.phone = true
      this.phoneOrBusiness.business = false
      this.phoneErrorNotInput = true
      this.phoneErrorNotAccurate = false
    },
    /**
     * 사업자등록번호 선택시 Call되는 함수
     * @returns {void}
     */
    clickBusiness () {
      this.businessInputEntered = false
      this.phoneOrBusiness.phone = false
      this.phoneOrBusiness.business = true
      this.businessErrorNotInput = true
      this.businessErrorNotAccurate = false
    },
    /**
     * 취소 버튼 선택시 Call되는 함수
     * Popup Layer 닫음
     * @returns {void}
     */
    onClickCancle () {
      this.$store.commit('popup/hideWithoutBack')
    },
    /**
     * 신청하기 버튼 선택시 Call되는 함수
     * 휴대폰 번호 혹은 사업자등록번호 선택 기준으로 API Call
     * Success Case일 경우 Popup Layer 닫음
     * @returns {void}
     */
    async onClickSubmit () {
      if (this.receiptApplyFlag) {
        return
      }
      this.receiptApplyFlag = true
      const propObj = this.param
      let relNum = ''
      let reptClssfCd = ''
      if (this.phoneOrBusiness.phone && !this.phoneOrBusiness.business) {
        if (this.phoneErrorNotInput || this.phoneErrorNotAccurate) {
          this.receiptApplyFlag = false
          return
        }
        relNum = this.phoneNum
        reptClssfCd = '100'
      } else if (!this.phoneOrBusiness.phone && this.phoneOrBusiness.business) {
        if (this.businessErrorNotInput || this.businessErrorNotAccurate) {
          this.receiptApplyFlag = false
          return
        }
        relNum = this.businessNum
        reptClssfCd = '200'
      }
      const param = {
        ordersId: propObj.ordersId,
        memberId: loginUtil.custNum(),
        mobileNum: relNum,
        apprAmt: propObj.cashreceiptAmount,
        reptClssfCd
      }
      const invoke = {
        tasknm: COMM_CONST.DEFAULT_PARAMS.receiptApply.tasknm,
        var: JSON.stringify({
          cnm: COMM_CONST.DEFAULT_PARAMS.receiptApply.cnm,
          mnm: COMM_CONST.DEFAULT_PARAMS.receiptApply.mnm,
          args: param
        })
      }
      const successHandling = response => {
        if (response.list.respCd === 'S') {
          toastUtil.show('현금영수증 신청이 완료되었습니다.')
          this.$store.commit('popup/hideWithoutBack', {})
        }
      }
      const errorHandling = error => {
        console.debug(error)
        messageUtil.alert(MEMBER_CONST.ERROR_MESSAGES.SERVER_COMMUNICATION)
      }

      await cashReceiptApplyService.onClickSubmit(invoke, successHandling, errorHandling)
      this.receiptApplyFlag = false
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/document/CashReceiptApply";
</style>
