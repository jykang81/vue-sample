<template>
  <div v-show="globalVal.showRefundMethodArea && !globalVal.isOrderComplete" class="order_cancel_refund_method">
    <h3 class="subject line">
      환불수단 선택
    </h3>
    <div class="payment_change_wrap refund">
      <ul class="payment_tab">
        <li
          :class="globalVal.refundType === globalVal.REFUND_TYPE.ACCOUNT ? 'active' : ''"
          @click="onclickRefundType(globalVal.REFUND_TYPE.ACCOUNT)"
        >
          내 계좌로 받기
        </li>
        <li
          :class="globalVal.refundType === globalVal.REFUND_TYPE.DEPOSIT_AMT ? 'active' : ''"
          @click="onclickRefundType(globalVal.REFUND_TYPE.DEPOSIT_AMT)"
        >
          예치금으로 받기
        </li>
      </ul>
      <div v-show="globalVal.refundType === globalVal.REFUND_TYPE.ACCOUNT">
        <div class="form_group gray_box">
          <p class="copy">
            영업일 기준 2일 이내에 환불됩니다.
          </p>
          <div class="input_field">
            <label for="label_bank" class="label_text">
              은행명
            </label>
            <label class="select">
              <select id="label_bank" v-model="globalVal.refundBankCd" :disabled="globalVal.disabledRefundBankCd">
                <template v-for="(bankItem, indexBankItem) in bankList">
                  <option
                    :key="indexBankItem"
                    :value="bankItem.value"
                  >{{ bankItem.text }}
                  </option>
                </template>
              </select>
            </label>
          </div>
          <div class="input_field">
            <label for="label_name" class="label_text">
              예금주명
            </label>
            <span class="input_group">
              <input
                id="label_name"
                v-model="globalVal.refundAccntOwner"
                type="text"
                class="form text"
                :disabled="globalVal.disabledRefundAccntOwner"
                @click="scrollToInput"
              >
            </span>
          </div>
          <div class="input_field">
            <label for="label_account_number" class="label_text">
              계좌번호
            </label>
            <span class="input_group">
              <input
                id="label_account_number"
                v-model="globalVal.refundAccntNo"
                type="number"
                class="form text"
                :disabled="globalVal.disabledRefundAccntNo"
                @blur="onblurValueApply($event)"
                @keydown="keydownNumber($event)"
                @keyup="keyupNumber($event)"
                @click="scrollToInput"
              >
            </span>
          </div>
        </div>
      </div>
      <div v-show="globalVal.refundType === globalVal.REFUND_TYPE.DEPOSIT_AMT">
        <div class="delivery_search_guide">
          NSmall에서 적립금처럼 사용이 가능합니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import uiUtil from '@utils/uiUtil'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      bankList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      // 환불정보 Area 보여주기
      if (this.globalVal.isRefund) {
        this.globalVal.showRefundMethodArea = true
      }

      // 환불 계좌 변경 시작
      this.setBankList() // 은행목록설정
      // 환불 계좌 변경 끝
    },
    /**
     * 환불유형 (ASIS: onclick_radioRefundType)
     * @param {String} type - 환불유형 값
     * @returns {void}
     */
    onclickRefundType (type) {
      if (type === this.globalVal.REFUND_TYPE.DEPOSIT_AMT && !this.globalVal.disabledRefundType1) { // 예치금으로 환불
        this.globalVal.refundType = this.globalVal.REFUND_TYPE.DEPOSIT_AMT
        this.globalVal.disabledRefundBankCd = true
        this.globalVal.disabledRefundAccntOwner = true
        this.globalVal.disabledRefundAccntNo = true
      } else if (type === this.globalVal.REFUND_TYPE.ACCOUNT) { // 내계좌로 환불
        this.globalVal.refundType = this.globalVal.REFUND_TYPE.ACCOUNT
        this.globalVal.disabledRefundBankCd = false
        this.globalVal.disabledRefundAccntOwner = false
        this.globalVal.disabledRefundAccntNo = false
      }
    },
    /**
     * 은행선택
     * 환불계좌 select Box 변경 이벤트 추가 (ASIS: onchange_BanckInfo)
     * @returns {void}
     */
    onchangeBanckInfo () {
      const bankInfo = this.getBankInfo()
      this.globalVal.refundBankCd = bankInfo.value
      this.globalVal.refundBankText = bankInfo.text
      this.globalVal.refundAccntOwner = bankInfo.accntOwner
      this.globalVal.refundAccntNo = bankInfo.accntNo
    },
    /**
     * 은행목록
     * @returns {void}
     */
    setBankList () {
      const refundAccntInfoList = this.globalVal.pageDataset[0].refundAccntList
      this.bankList = [{ value: '', selected: '', text: '은행을 선택하세요.', accntNo: '', accntOwner: '' }]

      if (refundAccntInfoList.length > 0) {
        for (let i = 0; i < refundAccntInfoList.length; i++) {
          const value = refundAccntInfoList[i]

          this.bankList.push({
            value: value.bankCd,
            selected: value.selected,
            text: value.bankNm,
            accntNo: (value.accntNo || ''),
            accntOwner: (value.accntOwner || '')
          })

          if (value.selected === 'selected') {
            this.globalVal.refundBankCd = value.bankCd
            const bankInfo = this.getBankInfo()

            this.globalVal.refundBankText = bankInfo.text
            this.globalVal.refundAccntOwner = bankInfo.accntOwner
            this.globalVal.refundAccntNo = bankInfo.accntNo

            this.onclickRefundType(this.globalVal.REFUND_TYPE.ACCOUNT) // 환불방법을 내계좌로환불로 셋팅
          }
        }
      } else {
        this.onclickRefundType(this.globalVal.REFUND_TYPE.DEPOSIT_AMT) // 환불방법을 예치금으로환불로 셋팅
      }
    },
    /**
     * 은행정보
     * @returns {String}
     */
    getBankInfo () {
      const temp = this.bankList.filter(o => {
        return o.value === this.globalVal.refundBankCd
      })
      return temp.length > 0 ? temp[0] : { value: '', selected: '', text: '', accntNo: '', accntOwner: '' }
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

      if (e.target.value.length >= 16) {
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
      this.globalVal.refundAccntNo = e.target.value
    },
    /**
     * 클릭한 input으로 스크롤 이동 (소프트 키보드가 input을 가리는 버그 대응)
     * @param {object} e - event object
     */
    scrollToInput (e) {
      const headerHeight = document.querySelector('.app_header').clientHeight
      uiUtil.scrollMove(e.target.id, -(headerHeight + 8))
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/cancel/OrderCancelRefundMethod";
</style>
