<template>
  <div class="order_sheet_discount_happy_money">
    <div class="contents">
      <p class="title">
        해피머니 조회
      </p>
      <div>
        <label class="gift_card_input mb8">
          <input v-model="happyId" type="text" placeholder="아이디(해피머니)">
        </label>
        <label class="gift_card_input">
          <input v-model="happyPw" type="password" placeholder="비밀번호(해피머니)">
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
import messageUtil from '@frameworks/messageUtil'
import doPaymentApprovalRequestMixin from '@/mixins/order/sheet/doPaymentApprovalRequestMixin'
import { PAY_ASSIST_CONST } from '@/common/constants/order/order'

/**
 * ASIS: 주문서작성-NS상품권 등록
 * ID : M_B1343000L
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
      happyId: '',
      happyPw: ''
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.paymentData = this.param.paymentData
  },
  methods: {
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
      if (this.happyId.length === 0) {
        messageUtil.alert('해피머니 아이디를 정확히 입력 해 주세요.')
        return false
      }
      if (this.happyPw.length === 0) {
        messageUtil.alert('해피머니 비밀번호를 정확히 입력 해 주세요.')
        return false
      }

      const param = {
        payType: PAY_ASSIST_CONST.HAPPY_MONEY, // '1000',
        requestCommand: 'SearchCash',
        payAmt: '0',
        userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID,
        loginId: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
        happyID: this.happyId,
        happyPW: this.happyPw
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
  @import "~@/assets/styles/components/order/sheet/OrderSheetDiscountHappyMoney";
</style>
