<template>
  <div class="order_sheet_discount_ok_cashbag">
    <div class="contents">
      <p class="title">
        OK캐쉬백 포인트 조회
      </p>
      <div>
        <label class="gift_card_input mb8">
          <input v-model="identity" type="number" maxlength="16" placeholder="카드번호 입력"
                 @blur="onblurValueApply($event)"
                 @keydown="keydownNumber($event)"
                 @keyup="keyupNumber($event)"
          >
        </label>
        <label class="gift_card_input">
          <input v-model="passwd" type="password" placeholder="비밀번호(OK캐쉬백)">
        </label>
      </div>
    </div>
    <div class="button">
      <button type="button" class="btn gray" @click="onclickCancel()">
        취소
      </button>
      <button type="button" class="btn coral" @click="onclickOk()">
        포인트조회
      </button>
    </div>
  </div>
</template>

<script>
import COMM_CONST from '@constants/framework/constants'
import messageUtil from '@frameworks/messageUtil'
import doPaymentApprovalRequestMixin from '@/mixins/order/sheet/doPaymentApprovalRequestMixin'
import { PAY_ASSIST_CONST } from '@/common/constants/order/order'

/**
 * ASIS: 주문서작성-NS상품권 등록
 * ID : M_B1341000L
 */
export default {
  mixins: [
    doPaymentApprovalRequestMixin
  ],
  props: {
    param: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      globalVal: {},
      paymentData: {},
      identity: '',
      passwd: ''
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.paymentData = this.param.paymentData
  },
  methods: {
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
      this.giftCardNo = e.target.value
    },
    /**
     * 취소 버튼
     * @returns {void}
     */
    onclickCancel () {
      this.$store.commit('popup/hideWithoutBack')
    },
    /**
     * 등록 버튼
     * @returns {void}
     */
    onclickOk () {
      if (this.identity.length === 0) {
        messageUtil.alert('카드번호를 정확히 입력 해 주세요.')
        return false
      }
      if (this.passwd.length === 0) {
        messageUtil.alert('OK캐쉬백 비밀번호를 정확히 입력 해 주세요.')
        return false
      }

      const param = {
        payType: PAY_ASSIST_CONST.OK_CASHBAG, // '800',
        requestCommand: 'AuthMember',
        payAmt: '0',
        userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID,
        loginId: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
        enc_identity: this.identit, // cipherUtil.encryptValue(this.identity), // ASIS는 평문으로 보냄. TOBE에서 암호화해서 보내도 되는지 확인필요
        enc_passwd: this.passwd, // cipherUtil.encryptValue(this.passwd), // ASIS는 평문으로 보냄. TOBE에서 암호화해서 보내도 되는지 확인필요
        enc_nidno: '',
        channel: 'mobile',
        srch_cond: '3', // 검색조건 : 1(회원ID로 조회), 2(회원구분1번호로 조회), 3(카드번호로 조회)
        mbr_fg: '1', // 회원구분 : 1(일반), 2(법인), 3(개인사업자), 4(패밀리), 5(단체)
        ordersId: this.globalVal.mInputParams.orderId
      }

      // 상품권 등록
      this.doPaymentApprovalRequest({
        orderCompleteYn: 'N',
        paymentList: JSON.stringify({ paymentList: [param] })
      }, data => {
        this.$store.commit('popup/hideWithoutBack', data)
      })
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetDiscountOkCashbag";
</style>
