<template>
  <div v-show="globalVal.showStep2" id="orderReturnArea" class="order_return_step2">
    <ol class="return_step">
      <li>
        사유/수거지 선택
      </li>
      <li class="active">
        환불정보확인
      </li>
      <li>
        반품신청완료
      </li>
    </ol>
    <h3 class="subject line">
      환불정보
    </h3>
    <div class="total_price">
      <dl>
        <dt>총 상품금액</dt>
        <dd><strong>{{ totalProductAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 할인금액</dt>
        <dd><strong>{{ offerAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 배송비</dt>
        <dd><strong>{{ shipCharge }}</strong>원</dd>
      </dl>
      <dl class="total">
        <dt>환불 예상금액</dt>
        <dd><strong>{{ finalPaymentAmt }}</strong>원</dd>
      </dl>
      <dl class="payment_option">
        <template v-for="(paymentInfoItem, indexPaymentInfo) in paymentInfo">
          <dt :key="`dtOp${indexPaymentInfo}`">
            {{ paymentInfoItem.label }}
          </dt>
          <dd :key="`ddOp${indexPaymentInfo}`">
            {{ paymentInfoItem.text }}
            <span><strong>{{ paymentInfoItem.amt }}</strong>원</span>
          </dd>
        </template>
      </dl>
    </div>
    <h3 v-show="globalVal.showRefundMethodArea" class="subject line">
      환불수단 선택
    </h3>
    <div v-show="globalVal.showRefundMethodArea" class="payment_change_wrap refund">
      <ul class="payment_tab" :class="globalVal.showRefundTypeDepositAmt ? '' : 'single'">
        <li
          :class="globalVal.refundType === globalVal.REFUND_TYPE.ACCOUNT ? 'active' : ''"
          @click="onclickRefundType(globalVal.REFUND_TYPE.ACCOUNT)"
        >
          내 계좌로 받기
        </li>
        <li
          v-show="globalVal.showRefundTypeDepositAmt"
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
              <input id="label_name" v-model="globalVal.refundAccntOwner" type="text" class="form text" :disabled="globalVal.disabledRefundAccntOwner">
            </span>
          </div>
          <div class="input_field">
            <label for="label_account_number" class="label_text">
              계좌번호
            </label>
            <span class="input_group">
              <input id="label_account_number" v-model="globalVal.refundAccntNo" type="number" class="form text"
                     :disabled="globalVal.disabledRefundAccntNo"
                     @blur="onblurValueApply($event)"
                     @keydown="keydownNumber($event)"
                     @keyup="keyupNumber($event)"
              >
            </span>
          </div>
        </div>
      </div>
      <div v-show="globalVal.refundType === globalVal.REFUND_TYPE.DEPOSIT_AMT && globalVal.showRefundTypeDepositAmt">
        <div class="delivery_search_guide">
          NSmall에서 적립금처럼 사용이 가능합니다.
        </div>
      </div>
    </div>
    <div class="btn_group">
      <button
        type="button"
        class="btn gray_border"
        @click="onclickPrevStep()"
      >
        <span>이전</span>
      </button>
      <button
        type="button"
        class="btn coral"
        @click="onclickComplete()"
      >
        <span>신청완료</span>
      </button>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'
import {
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import uiUtil from '@utils/uiUtil'

import orderReturnStepMixin from '@/mixins/order/return/orderReturnStepMixin'
import orderReturnStep2Service from '@services/order/return/orderReturnStep2Service'

export default {
  mixins: [
    orderReturnStepMixin
  ],
  props: {
    globalVal: {
      type: Object,
      required: true
    },
    orderReturnInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      totalProductAmt: '',
      shipCharge: '',
      offerAmt: '',
      finalPaymentAmt: '',
      discountList: [],
      paymentInfo: [],
      bankList: []
    }
  },
  mounted () {
    /**
     * 환불정보확인
     *  - this.$root.$emit('orderReturnStep2Emit')
     * @returns {void}
     */
    this.$root.$on('orderReturnStep2Emit', () => {
      this.init()
    })
  },
  methods: {
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      this.setPaymentInfo()
      this.setRefundDisplay()
      this.setBankList()
    },
    /**
     * 환불수단 보임/숨김처리
     * @returns {void}
     */
    setRefundDisplay () {
      const data = this.globalVal.mOutputDatas.orders

      // 환불방법 영역
      if (!isNull(data.refundActSum) && data.refundActSum !== '0') {
        this.globalVal.showRefundMethodArea = true

        // 예치금인 경우 둘다 출력
        if (PAY_ASSIST_CONST.isDepositAmt(data.payms[0].paymentcode)) {
          this.globalVal.showRefundTypeDepositAmt = true
          this.globalVal.showRefundTypeAccount = true
          // 무통장, 실시간, 휴대폰인 경우 계좌만 출력
        } else if ((PAY_TYPE_CONST.isDepositWithoutBankbook(data.payms[0].paymentcode) && data.payms[0].paymdtls.length > 0) ||
                    PAY_TYPE_CONST.isRealtimeAccountTransfer(data.payms[0].paymentcode) ||
                    PAY_TYPE_CONST.isMobile(data.payms[0].paymentcode)) {
          this.globalVal.showRefundTypeDepositAmt = false
          this.globalVal.showRefundTypeAccount = true
        }
      } else { // 무통장, 실시간계좌이체, 휴대폰, 예치금이 아니면 hide(네티웰포인트 등)
        this.globalVal.showRefundMethodArea = false
      }
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
      const refundAccntInfoList = this.globalVal.mOutputDatas.orders.refundAccntList
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
     * 반품신청 이전단계
     * @returns {void}
     */
    onclickPrevStep () {
      this.globalVal.showStep2 = false
      uiUtil.scrollMove('orderReturnArea')
      setTimeout(() => {
        this.globalVal.isPrevStep = true
        this.globalVal.showStep1 = true
      }, 50)
    },
    /**
     * 반품신청완료
     * @returns {void}
     */
    onclickComplete () {
      if (!this.globalVal.executeBtnClicked) {
        this.globalVal.executeBtnClicked = true
        const orders = this.globalVal.mOutputDatas.orders
        const lastRefundInfo = {
          accntNo: '',
          accntOwner: '',
          bankCd: '',
          bankNm: '',
          newHistSeq: orders.newHistSeq,
          ordersId: this.globalVal.mInputParams.ordersId,
          refundAmt: orders.totalpayment,
          type: '',
          typeDesc: ''
        }

        if (!isNull(orders.refundActSum) && orders.refundActSum !== '0') {
          const refundType = this.globalVal.refundType
          const refundTypeName = refundType === this.globalVal.REFUND_TYPE.ACCOUNT ? '계좌' : '예치금'
          lastRefundInfo.type = refundType
          lastRefundInfo.typeDesc = refundTypeName

          if (refundType === this.globalVal.REFUND_TYPE.ACCOUNT) {
            if (isNull(this.globalVal.refundBankCd)) {
              messageUtil.alert('은행을 선택해주세요.')
              this.globalVal.executeBtnClicked = false
              return false
            }

            if (isNull(this.globalVal.refundAccntNo)) {
              messageUtil.alert('계좌번호를 입력해주세요.')
              this.globalVal.executeBtnClicked = false
              return false
            }

            if (isNull(this.globalVal.refundAccntOwner)) {
              messageUtil.alert('예금주를 입력해주세요.')
              this.globalVal.executeBtnClicked = false
              return false
            }

            lastRefundInfo.bankCd = this.globalVal.refundBankCd
            lastRefundInfo.bankNm = this.globalVal.refundBankText
            lastRefundInfo.accntOwner = this.globalVal.refundAccntOwner
            lastRefundInfo.accntNo = this.globalVal.refundAccntNo
          }
        }

        this.globalVal.mOutputDatas.orders.orderitems[0].refundInfo = lastRefundInfo
        this.globalVal.mOutputDatas.orders.refundInfo = lastRefundInfo
        const pageDataset = []
        pageDataset[0] = this.globalVal.mOutputDatas.orders

        const invokeParams = {
          subTasknm: 'execute',
          tasknm: 'RETURN',
          ordsid: this.globalVal.mInputParams.ordersId,
          channel: 'mobile',
          counselorOrderCancel: 'Y',
          pageData: JSON.stringify(pageDataset)
        }

        // 신청완료 단계 정보 조회
        orderReturnStep2Service.onclickComplete(invokeParams, data => {
          if (!data.msg || !data.msg.root || !data.msg.root.orders || data.msg.root.orders.length === 0 ||
              data.msg.root.orders[0] == null || data.msg.root.orders[0] === '') {
            messageUtil.alert('본 상품의 반품은 상담원을 통해서 신청해 주시기 바랍니다.', () => {
              this.orderReturnInfo.result = 'FAIL'
              this.$store.commit('popup/hide', { result: this.orderReturnInfo.result })
            })
          } else {
            this.orderReturnInfo.result = 'SUCCESS'
            this.globalVal.showStep2 = false
            uiUtil.scrollMove('orderReturnArea')
            setTimeout(() => {
              this.globalVal.showStep3 = true
              this.$root.$emit('orderReturnStep3Emit')
            }, 50)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/return/OrderReturnStep2";
</style>
