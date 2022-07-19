<template>
  <div class="order_sheet_discount_gift_card">
    <div class="contents">
      <p class="title">
        NS상품권 등록
      </p>
      <label class="gift_card_input">
        <input id="giftCardNo" :value="giftCardNo" type="tel" pattern="\d*" maxlength="16" placeholder="NS상품권 번호 16자리 입력"
               @paste="pasteValidChange($event)"
               @blur="onblurValueApply($event)"
               @input="keydownNumber($event)"
        >
      </label>
    </div>
    <div class="button">
      <button type="button" class="btn gray" @click="onclickCancel()">
        취소
      </button>
      <button type="button" class="btn coral" @click="onclickOk()">
        확인
      </button>
    </div>
  </div>
</template>

<script>
import {
  isNull
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import doPaymentApprovalRequestMixin from '@/mixins/order/sheet/doPaymentApprovalRequestMixin'
import giftCardRegisterMixin from '@/mixins/customer/giftCardRegisterMixin'
import { PAY_ASSIST_CONST } from '@/common/constants/order/order'

/**
 * ASIS: 주문서작성-NS상품권 등록
 * ID : M_B1344000L
 */
export default {
  mixins: [
    doPaymentApprovalRequestMixin,
    giftCardRegisterMixin
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
      giftCardNo: ''
    }
  },
  created () {
    this.globalVal = this.param.globalVal
    this.paymentData = this.param.paymentData
  },
  methods: {
    /**
     * 붙여넣기
     * @param {Object} event
     */
    pasteValidChange (event) {
      event.preventDefault()
    },
    /**
     * key down 방향기, 백스페이스, Del키,  숫자 외 입력 금지
     * maxlength (16) 이상은 방향기, 백스페이스, Del키 만 허용
     * @param {object} e - event object
     * @returns {void}
     */
    keydownNumber (e) {
      const reg = /[0-9]/
      if (reg.exec(e.target.value) === null || (!isNull(e.data) && reg.exec(e.data) === null)) {
        if (isNull(e.target.value) || (!isNull(e.data) && reg.exec(e.data) === null)) {
          e.target.value = String(this.giftCardNo).length === 1 ? '' : this.giftCardNo
        }
        e.preventDefault()
        return
      }

      this.giftCardNo = e.target.value
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
      let param

      if (this.giftCardNo.length < 16) {
        messageUtil.alert('NS상품권 번호를 정확히 입력해 주세요.')
        return false
      }

      if (this.globalVal.parent === 'mypage') {
        // 마이페이지 > 나의 혜택에서 호출 시
        param = {
          giftCardNo: this.giftCardNo // NS상품권 번호
        }

        this.giftCardRegisterMypage(param, () => {
          this.$store.commit('popup/hideWithoutBack')
        }, () => {
          this.giftCardNo = ''
        })
      } else {
        // 주문서 >  할인/혜택에서 호출 시
        param = {
          payType: PAY_ASSIST_CONST.NS_GIFT_CARD, // '700',
          requestCommand: 'RegistGiftCard',
          payAmt: '0',
          giftCardNo: this.giftCardNo, // NS상품권 번호
          userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID,
          loginId: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
          authKey: '' // 인증키(7로 시작 하면, PP카드 상품권, 8로 시작하면 모바일 상품권)
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
}
</script>

<style lang="scss">
  @import "~@/assets/styles/components/order/sheet/OrderSheetDiscountGiftCard";
</style>
