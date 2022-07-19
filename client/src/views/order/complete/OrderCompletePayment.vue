<template>
  <div class="order_complete_payment">
    <h3 class="subject">
      결제정보
    </h3>
    <div class="total_price">
      <dl>
        <dt>총 상품금액</dt>
        <dd><strong>{{ totalProductAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 할인금액</dt>
        <dd><strong>{{ totalSaleAmt }}</strong>원</dd>
      </dl>
      <dl>
        <dt>총 배송비</dt>
        <dd><strong>{{ totalShipAmt }}</strong>원</dd>
      </dl>
      <dl class="total">
        <dt>
          최종 결제금액
        </dt>
        <dd>
          <strong>{{ grandTotalAmt }}</strong>원
        </dd>
      </dl>

      <dl v-if="isNSPayCreditCard() || isCard() || isPayco() || isMobile() || isNSPayAccountTransfer() || isDeposit() || isNaverpay()" class="payment_option">
        <!-- 주 결제수단 -->
        <template v-if="isNSPayCreditCard()">
          <dt>NS페이 카드</dt>
          <dd>{{ displayInfo.card.name }}{{ ',' + displayInfo.card.desc }} <strong>{{ displayInfo.card.amt }}</strong>원</dd>
        </template>
        <template v-if="isCard()">
          <dt>신용카드</dt>
          <dd>{{ displayInfo.card.name }}{{ ',' + displayInfo.card.desc }} <strong>{{ displayInfo.card.amt }}</strong>원</dd>
        </template>
        <template v-if="isPayco()">
          <dt>페이코</dt>
          <dd><strong>{{ displayInfo.payco.amt }}</strong>원</dd>
        </template>
        <template v-if="isMobile()">
          <dt>휴대폰결제</dt>
          <dd><strong>{{ displayInfo.mbile.amt }}</strong>원</dd>
        </template>
        <template v-if="isNSPayAccountTransfer()">
          <dt>NS페이 계좌</dt>
          <dd>{{ displayInfo.deposit.name }} <strong>{{ displayInfo.deposit.amt }}</strong>원</dd>
        </template>
        <template v-if="isDeposit()">
          <dt>무통장 입금</dt>
          <dd>{{ displayInfo.deposit.name }} <strong>{{ displayInfo.deposit.amt }}</strong>원</dd>
        </template>
        <template v-if="isNaverpay()">
          <dt>네이버페이</dt>
          <dd><strong>{{ displayInfo.naverpay.amt }}</strong>원</dd>
        </template>
      </dl>
      <dl class="accumulated_money">
        <dt>예상 적립금</dt>
        <dd><strong>{{ expectAccmAmt }}</strong>원</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import bizUtil from '@utils/bizUtil'
import {
  insertCommas,
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import popupUtil from '@frameworks/popupUtil'
import { PAY_TYPE_CONST, PAY_ASSIST_CONST } from '@/common/constants/order/order'

export default {
  name: 'OrderCompletePayment',
  props: {
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      paymentItem: null,
      discountInfo: null,
      freeShippingDcAmt: 0,
      showFreeShippingDcAmt: false,
      offerAmt: 0,
      showOfferAmt: false,
      couponDcAmt: 0,
      showCouponDcAmt: false,
      cardDcAmt: 0,
      showCardDcAmt: false,

      displayInfo: {
        card: { // 신용카드
          name: '', // 납부방식 - 카드명
          desc: '', // 납부방식 - 무이자,일시불,할부
          num: '', // 카드번호
          amt: '0' // 결제금액
        },
        payco: { // 페이코
          name: '', // 납부방식 - 카드명
          desc: '', // 납부방식 - 무이자,일시불,할부
          amt: '0' // 결제금액
        },
        mbile: { // 휴대폰 소액결제
          commId: '', // 이동통신사
          phoneNum: '', // 휴대폰번호
          mobilId: '', // 거래번호
          amt: '0' // 결제금액
        },
        deposit: {
          name: '', // 입금은행
          accNum: '', // 입금계좌번호
          amt: '0', // 입금하실 금액
          date: '' // 입금마감일
        },
        naverpay: {
          amt: '0' // 결제금액
        }
      }
    }
  },
  computed: {
    /**
     * 총 상품금액
     * @returns {String}
     */
    totalProductAmt () {
      return insertCommas(this.globalVal.paymentInfo.orderPrice.TOTAL_PRODUCT_AMT)
    },
    /**
     * 총 할인금액
     * @returns {String}
     */
    totalSaleAmt () {
      const total = this.globalVal.paymentInfo.orderPrice.TOTAL_SALE_AMT || 0
      return (total > 0 ? '-' : '') + insertCommas(total)
    },
    /**
     * 총 배송비
     * @returns {String}
     */
    totalShipAmt () {
      const shipCharge = Number(this.globalVal.paymentInfo.orderPrice.SHIP_CHARGE)
      return insertCommas(shipCharge)
    },

    /**
     * 추가 배송비
     * @returns {String}
     */
    addShipAmt () {
      return insertCommas(this.globalVal.paymentInfo.orderPrice.RMA_SHIP_CHARGE)
    },

    /**
     * 최종 결제금액
     * @returns {String}
     */
    grandTotalAmt () {
      return insertCommas(this.globalVal.paymentInfo.orderPrice.FINAL_PAYMENT_AMT)
    },

    /**
     * 예상 적립금
     * @returns {String}
     */
    expectAccmAmt () {
      return insertCommas(this.globalVal.paymentInfo.expectAccmAmt)
    }
  },
  created () {
    this.paymentItem = this.globalVal.paymentInfo.paymentList[0]

    this.freeShippingDcAmt = this.globalVal.paymentInfo.orderPrice.freeShippingDcAmt
    this.showFreeShippingDcAmt = this.freeShippingDcAmt > 0

    this.offerAmt = this.globalVal.paymentInfo.orderPrice.OFFER_AMT
    this.showOfferAmt = this.offerAmt > 0

    this.couponDcAmt = Number(this.globalVal.paymentInfo.orderPrice.couponDcAmt) - Number(this.globalVal.paymentInfo.orderPrice.freeShippingDcAmt)
    this.showCouponDcAmt = this.couponDcAmt > 0

    this.cardDcAmt = this.globalVal.paymentInfo.orderPrice.cardDcAmt
    this.showCardDcAmt = this.cardDcAmt > 0

    if (this.isNSPayCreditCard()) {
      this.setNSPayCreditCard()
    } else if (this.isCard()) {
      this.setCard()
    } else if (this.isPayco()) {
      this.setPayco()
    } else if (this.isMobile()) {
      this.setMobile()
    } else if (this.isNSPayAccountTransfer()) {
      this.setNSPayAccountTransfer()
    } else if (this.isDeposit()) {
      this.setDeposit()
    } else if (this.isNaverpay()) {
      this.setNaverpay()
    }
  },
  methods: {
    /**
     * 결제보조수단 확인
     * @param {String} payType - 결제보조수단 코드
     * @returns {Boolean}
     */
    isPayType (payType) {
      return PAY_ASSIST_CONST.isCodes(payType)
    },
    /**
     * 결제보조수단 명
     * @param {String} payType - 결제보조수단 코드
     * @returns {Boolean}
     */
    getPayAssistTitle (payType) {
      return PAY_ASSIST_CONST.getName(payType)
    },
    /**
     * 결제보조수단 금액
     * @param {Number} amt - 금액
     * @returns {Boolean}
     */
    getPayAssistAmt (amt) {
      return insertCommas(amt)
    },
    /**
     * NS페이 신용카드
     * @returns {Boolean}
     */
    isNSPayCreditCard () {
      return PAY_TYPE_CONST.isNSPayCreditCard(this.paymentItem.payType)
    },
    /**
     * NS페이 계좌
     * @returns {Boolean}
     */
    isNSPayAccountTransfer () {
      return PAY_TYPE_CONST.isNSPayAccountTransfer(this.paymentItem.payType)
    },
    /**
     * 카드 여부
     * @returns {Boolean}
     */
    isCard () {
      return PAY_TYPE_CONST.isCreditCard(this.paymentItem.payType)
    },
    /**
     * 페이코 여부
     * @returns {Boolean}
     */
    isPayco () {
      return PAY_TYPE_CONST.isPayco(this.paymentItem.payType)
    },
    /**
     * 모바일 여부
     * @returns {Boolean}
     */
    isMobile () {
      return PAY_TYPE_CONST.isMobile(this.paymentItem.payType)
    },
    /**
     * 무통장입금 여부
     * @returns {Boolean}
     */
    isDeposit () {
      return PAY_TYPE_CONST.isDepositWithoutBankbook(this.paymentItem.payType)
    },
    /**
     * 네이버페이 여부
     * @returns {Boolean}
     */
    isNaverpay () {
      return PAY_TYPE_CONST.isNaverpay(this.paymentItem.payType)
    },
    /**
     * NS페이 신용카드
     * @returns {void}
     */
    setNSPayCreditCard () {
      this.displayInfo.card.amt = insertCommas(this.paymentItem.payAmt)
      this.displayInfo.card.name = this.paymentItem.cardName

      if (this.paymentItem.cardQuota === '00') {
        this.displayInfo.card.desc = '일시불'
      } else {
        if (this.paymentItem.cardInterest === 'Y') {
          this.displayInfo.card.desc = `${this.paymentItem.cardQuota}개월 무이자`
        } else {
          this.displayInfo.card.desc = `${this.paymentItem.cardQuota}개월 할부`
        }
      }
    },
    /**
     * 신용카드
     * @returns {void}
     */
    setCard () {
      // 신용카드 명 설정
      if (this.paymentItem.EP_card_cd === '016' &&
            this.paymentItem.KvpCardCode.substring(6, 8) === '90') {
        this.displayInfo.card.name = '카카오뱅크'
      } else {
        this.displayInfo.card.name = bizUtil.getCreditCardCodeName(this.paymentItem.EP_usedcard_code)
      }

      this.displayInfo.card.amt = insertCommas(this.paymentItem.payAmt)
      this.displayInfo.card.num = bizUtil.formatCardNoWithAsterisk(this.paymentItem.EP_card_no)

      if (this.paymentItem.EP_noinst_flag === 'Y') {
        this.displayInfo.card.desc = `${this.paymentItem.EP_noinst_term}개월 무이자`
      } else if (this.paymentItem.EP_quota === '00') {
        this.displayInfo.card.desc = '일시불'
      } else {
        this.displayInfo.card.desc = `${this.paymentItem.EP_quota}개월 할부`
      }
    },
    /**
     * 페이코
     * @returns {void}
     */
    setPayco () {
      const cnt = this.paymentItem.paymentDetails.length - 1
      const paymentDetails = this.paymentItem.paymentDetails[cnt]

      this.displayInfo.payco.amt = insertCommas(this.paymentItem.payAmt)
      this.displayInfo.payco.name = paymentDetails.CARD_NM

      if (paymentDetails.IR_FREE_YN === 'Y') {
        this.displayInfo.payco.desc = `${paymentDetails.INSTM_MM_CNT}개월 무이자`
      } else if (paymentDetails.INSTM_MM_CNT === '00') {
        this.displayInfo.payco.desc = '일시불'
      } else {
        this.displayInfo.payco.desc = `${paymentDetails.INSTM_MM_CNT}개월 할부`
      }
    },
    /**
     * 모바일
     * @returns {void}
     */
    setMobile () {
      this.displayInfo.mbile.commId = this.paymentItem.Commid
      this.displayInfo.mbile.phoneNum = insertSeparatorPhoneNumber(this.paymentItem.No, '-')
      this.displayInfo.mbile.mobilId = this.paymentItem.Mobilid
      this.displayInfo.mbile.amt = insertCommas(this.paymentItem.payAmt)
    },

    /**
     * NS페이 계좌
     * @returns {void}
     */
    setNSPayAccountTransfer () {
      this.displayInfo.deposit.amt = insertCommas(this.paymentItem.payAmt)
      this.displayInfo.deposit.name = this.paymentItem.cardName
    },
    /**
     * 무통장입금
     * @returns {void}
     */
    setDeposit () {
      this.displayInfo.deposit.amt = insertCommas(this.paymentItem.payAmt)
      this.displayInfo.deposit.name = this.paymentItem.DP_bankName.replace(/ /g, '')
    },
    /**
     * 네이버페이
     * @returns {void}
     */
    setNaverpay () {
      this.displayInfo.naverpay.amt = insertCommas(this.paymentItem.payAmt)
    },
    /**
     * 결제수단 변경
     * @returns {void}
     */
    onclickChangePaymentMethod () {
      const paramPopup = {
        title: '결제수단 변경',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        from: this.$options.name,
        ordersId: this.globalVal.messageInfo.ordersId,
        lastupdateall: null,
        latestOperationId: null
      }
      popupUtil.show('order/OrderPaymentMethodChange', paramPopup)
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/complete/OrderCompletePayment";
</style>
