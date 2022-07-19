<template>
  <div class="order_sheet_confirm">
    <!-- 결재하기 버튼 -->
    <div class="buy_box">
      <div class="agree_check">
        <label>
          <input v-model="globalVal.confirmInfo.isCheckAgreePurchage" type="checkbox" class="checkbox square">
          <span id="check_agree_purchage" class="check_label">동의합니다.(전자상거래법 제8조 제2항)</span>
        </label>
      </div>
      <div v-show="showAgreeGuest" class="agree_check">
        <label>
          <input v-model="globalVal.confirmInfo.isCheckAgreeGuest" type="checkbox" class="checkbox square">
          <span class="check_label">비회원 주문 정보 수집에 동의합니다.</span>
        </label>
        <button type="button" class="btn" @click="onclickGuestAgreeView()">
          보기
        </button>
      </div>
      <button
        type="button"
        @click="onclickBeforePayment($event)"
      >
        {{ grandTotalAmt }}원 결제하기
      </button>
    </div>
  </div>
</template>

<script>
import {
  insertCommas,
  iframeReceiveMessage,
  isNull,
  extend,
  isOsApp
} from '@utils/commonutil/commonUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import modalUtil from '@frameworks/modalUtil'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'

import checkStaffOnlyPrdMixin from '@/mixins/order/sheet/confirm/checkStaffOnlyPrdMixin'
import precheckPaymentMixin from '@/mixins/order/sheet/confirm/precheckPaymentMixin'
import validPaymentDeliveryMixin from '@/mixins/order/sheet/confirm/validPaymentDeliveryMixin'
import validPaymentAuthMixin from '@/mixins/order/sheet/confirm/validPaymentAuthMixin'
import validCashReceiptMixin from '@/mixins/order/sheet/confirm/validCashReceiptMixin'
import handlePaymentMethodMixin from '@/mixins/order/sheet/confirm/handlePaymentMethodMixin'
import doPaymentApprovalRequestMixin from '@/mixins/order/sheet/doPaymentApprovalRequestMixin'
import nextValidationMixin from '@/mixins/order/sheet/confirm/nextValidationMixin'
import executePaymentRequestMixin from '@/mixins/order/sheet/confirm/executePaymentRequestMixin'
import loadPaymentLogJSMixin from '@/mixins/order/sheet/confirm/loadPaymentLogJSMixin'
import gotoPaymentCompleteMixin from '@/mixins/order/sheet/confirm/gotoPaymentCompleteMixin'
import shippingChargeMixin from '@/mixins/order/sheet/delivery/shippingChargeMixin'
import paymentNspayMixin from '@/mixins/order/sheet/payment/paymentNspayMixin'
import setPartnershipDataMixin from '@/mixins/order/sheet/setPartnershipDataMixin'
import orderSheetConfirmService from '@services/order/sheet/orderSheetConfirmService'
import uiUtil from '@utils/uiUtil'
import bizUtil from '@utils/bizUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  mixins: [
    checkStaffOnlyPrdMixin,
    precheckPaymentMixin,
    validPaymentDeliveryMixin,
    validPaymentAuthMixin,
    validCashReceiptMixin,
    handlePaymentMethodMixin,
    doPaymentApprovalRequestMixin,
    nextValidationMixin,
    executePaymentRequestMixin,
    loadPaymentLogJSMixin,
    gotoPaymentCompleteMixin,
    shippingChargeMixin,
    paymentNspayMixin,
    setPartnershipDataMixin
  ],
  props: {
    paymentData: {
      type: Object,
      required: true
    },
    globalVal: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      orderSheetRmaCheck: false
    }
  },
  computed: {
    /**
     * 총결제금액
     * @returns {String}
     */
    grandTotalAmt () {
      return insertCommas(this.globalVal.paymentAmtInfo.grandTotalAmt)
    },
    /**
     * 비회원 주문 정보 수집에 동의 보임/숨김
     * @returns {Boolean}
     */
    showAgreeGuest () {
      return this.globalVal.isGuest
    }
  },
  mounted () {
    window.vm = this // 결제완료처리 관련 window.open 의 새창에서 call 하기 위함
    iframeReceiveMessage(this, this.callbackResult)
  },
  beforeDestroy () {
    window.removeEventListener('message', () => {})
  },
  methods: {
    /**
     * 결제하기 Before
     * @param {Event} event - object event
     * @returns {void}
     */
    async onclickBeforePayment (event) {
      if (!this.globalVal.isGuest) {
        await bizUtil.secessionMemberCheker()
      }

      window.vm = this // 결제완료처리 관련 window.open 의 새창에서 call 하기 위함
      iframeReceiveMessage(this, this.callbackResult)
      if (!this.globalVal.completeOrderSheetInfo ||
            !this.globalVal.completeLastCashReceiptData ||
            !this.globalVal.completeOrderSheetCustomer ||
            !this.globalVal.completeOrderSheetDelivery ||
            !this.globalVal.completeOrderSheetProduct ||
            !this.globalVal.completeOrderSheetPayment ||
            !this.globalVal.completeOrderSheetDiscount) {
        messageUtil.alert('고객님의 주문정보를 확인하고 있습니다. 잠시만 기다려 주시기 바랍니다.')
        return false
      }

      if (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT > 0 &&
          ((this.globalVal.cat2CategoryIdFlag && PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.paymentMethod)) ||
          (this.globalVal.cat2CategoryIdFlag && PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.paymentMethod)) ||
          (this.globalVal.paymentMethodInfo.paymentMethodTitle === '결제수단을 선택해 주세요.'))) {
        this.globalVal.paymentMethodInfo.wrongMessage = '필수 입력사항입니다. 선택해 주세요.'
        uiUtil.scrollMove('payment_method', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
        return false
      }

      /*
       * 더블클릭 막기 - 기존 더블클릭 방지가 api 최종 주문 api시에만 중복 막게 되어 있어 인증 api시에는 별 효력이 없었음.
       * App일 경우 인증창을 새로운 웹뷰로 호출하게 되어 중복 호출 시 callback에 문제가 생김.
       * 주문 클릭하자마자 방지하고 오류시 flag 해제하는 방식으로 변경
      */
      if (!this.globalVal.activeDoubleClick) {
        // 더블클릭 막기
        // 회원가입 점유인증 제거 - 회원인증여부 validation check
        // 첫주문이면서 SMS 인증을 받아야 하는 경우
        if (this.globalVal.customerInfo.mHpNoSmsAuthYn !== 'Y') {
          // 인증번호 확인 완료 여부를 체크한다.
          if (!this.globalVal.customerInfo.isCertCheck) {
            // 구매를 위해 본인 인증이 필요합니다.
            this.globalVal.customerInfo.isUserHpnoErrorShow = false // 올바른 휴대폰 번호로 수정해주세요.
            this.globalVal.customerInfo.isConfirmUserAuthInfoShow = true
            uiUtil.scrollMove('customer_subject', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
            return false
          }
        }
        this.globalVal.confirmInfo.enableCallbackResult = true
        this.globalVal.confirmInfo.enableComplete = true
        this.globalVal.activeDoubleClick = true

        if (this.precheckPayment() === false) {
          return false
        }

        // 임직원 상품 체크 -->>> (ASIS) CurrentView.data.chkStaffOnlyPrd
        this.checkStaffOnlyPrd(this.globalVal.mOutputDatas.orderItem, 'payment').then(result => {
          this.callbackStaffOnlyPrdByPaymentType(result, event)
        })
      }
    },

    /**
     * 결제하기 After
     * @param {Object} invoke - API 호출 파라미터
     * @param {Object} invokeOther - 주문 가능 수량 체크 정보
     * @param {Event} event - object event
     * @returns {void}
     */
    onclickAfterPayment (invoke, invokeOther, event) {
      let maxOrderPossQty = 0

      orderSheetConfirmService.onclickAfterPayment(invoke, data => {
        let rtnFlag = ''
        if (data.jsonData !== undefined) {
          rtnFlag = data.jsonData.rtn.flag
        }

        if (rtnFlag === 'Y') {
          if (Number(invoke.custDurSpr) === 1) {
            maxOrderPossQty = data.jsonData.rtn.DAY_P_QTY
          } else if (Number(invoke.custDurSpr) === 2) {
            maxOrderPossQty = data.jsonData.rtn.MONTH_P_QTY
          } else if (Number(invoke.custDurSpr) === 3) {
            maxOrderPossQty = data.jsonData.rtn.DATE_P_QTY
          }
        } if (rtnFlag === 'N') {
          maxOrderPossQty = invokeOther.maxOrderPossQty
        }

        if (invokeOther.custPrchQtyLimitYn === 'Y' &&
              invoke.itemCnt > maxOrderPossQty &&
              rtnFlag === 'Y') {
          messageUtil.alert('주문 상품중 구매 수량 제한상품이<br> 주문 가능 수량을 초과하였습니다.', () => {
            routerUtil.back()
          })
          this.globalVal.activeDoubleClick = false
        } else {
          this.onclickPayment(event)
        }
      })
    },
    /**
     * 결제하기 버튼 클릭
     * @param {Event} event - object event
     * @returns {void}
     */
    onclickPayment (event) {
      try {
        event.preventDefault()

        // NS페이 청구할인 적용.
        if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) &&
            !isNull(this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardNo)) {
          const nsCoCd = this.globalVal.paymentMethodInfo.selectedNspay.item.nsCoCd
          const cardNum = this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardNo.replace(/-/g, '').replace(/\*/g, '').substring(0, 6)
          this.setNspayCardDcCoupon(nsCoCd, cardNum)
        }

        if (this.precheckPayment() === false) {
          return false
        }

        // 배송지 배송불가
        if (this.validNoneDeliveryProduct() === false) {
          return false
        }

        // 비회원일때 처리 예정 할인정보 설정필요
        if (this.validPaymentAuth() === false) {
          return false
        }

        // 배송지
        if (this.validPaymentDelivery() === false) {
          return false
        }

        // 결제 타입별 금액 초기화
        this.globalVal.mOutputDatas.orderPrice = extend(true, {}, this.globalVal.mOutputDatas.orderPrice, {
          CREDITCARD_PAYMENT_AMT: 0, // 신용카드결제 금액
          MOBILE_PAYMENT_AMT: 0, // 핸드폰결제 금액
          ACCOUNT_TRANSFER_PAYMENT_AMT: 0, // 실시간계좌이체 금액
          WITHOUT_BANKBOOK_PAYMENT_AMT: 0 // 무통장입금 금액
        })

        // (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 일시불할인은 신용카드, payco, 휴대폰결제, 무통장입금, 실시간계좌이체에서 가능하나 신용카드에만 제약조건이 걸려있어 밖으로 이동
        // 카드일시불할인은 결제금액이 5만원 이상인 경우에만 가능
        if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
          if ((this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT + this.paymentData.Payment.getItem(0).Additionalpaymentamount +
                this.paymentData.Payment.getItem(0).OFFER_AMT) < 50000 && this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
            messageUtil.alert(this.paymentData.Discount.getDefineValue('message', 'LSP'))
            this.globalVal.activeDoubleClick = false
            return false
          }
        }
        this.handlePaymentMethod()
        this.ga360Ecommerce()
      } catch (e) {
        console.error(e)
        this.globalVal.activeDoubleClick = false
        messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
          routerUtil.back()
        })
      }
    },
    /**
     * 결제완료처리
     * @param {Object} data - 결제완료처리 정보
     * @returns {void}
     */
    callbackResult (data) {
      if (this.globalVal.confirmInfo.enableCallbackResult && data.cmd === 'callbackPaymentResult') {
        this.globalVal.confirmInfo.enableCallbackResult = false

        try {
          if (data.params !== null && data.params.type !== null &&
            (data.params.type === 'naverpay' || data.params.type === 'nswpay') &&
            data.params.resultCode !== null && data.params.resultCode === 'Fail') {
            if (data.params.resultMessage === 'userCancel') {
              if (isOsApp()) { // APP
                messageUtil.alert('사용자에 의해 결제가 취소되었습니다.', () => {
                  this.$store.commit('popup/hide')
                })
              } else { // WEB
                messageUtil.alert('사용자에 의해 결제가 취소되었습니다.')
              }
            } else {
              if (isOsApp()) { // APP
                messageUtil.alert(data.params.resultMessage, () => {
                  this.$store.commit('popup/hide')
                })
              } else { // WEB
                messageUtil.alert(data.params.resultMessage)
              }
            }
            return false
          }

          // 로그 정보 적재 후 외부연동 결제 진행
          const payType = this.paymentData.Payment.paymentList[0].payType
          this.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, payType, data.params)
        } catch (e) {
          console.error(e)
          messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
            routerUtil.back()
          })
        }
      } else if (this.globalVal.confirmInfo.enableCallbackResult && data.cmd === 'close') {
        this.globalVal.confirmInfo.enableCallbackResult = false
        this.$store.commit('popup/hide')
      }
    },
    /**
     * 비회원 개인정보 수집 및 이용 동의 상세내용 팝업
     * @returns {void}
     */
    onclickGuestAgreeView () {
      modalUtil.show('order/sheet/OrderSheetGuestAgree', null, () => {})
    },

    /**
     * GA360 - 전자상거래
     */
    ga360Ecommerce () {
      const productArray = []
      const paymentInfo = []
      if (this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId === 'CTCOM') {
        paymentInfo.partNumber = this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.partNumber
        paymentInfo.type = 'CTCOM'
        paymentInfo.type2 = 'NSSHOP+'
      } else if (this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId === 'TV') {
        paymentInfo.partNumber = this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.partNumber
        paymentInfo.type = 'eTV'
        paymentInfo.type2 = 'TVLIVE'
      } else {
        paymentInfo.type = 'e상품'
        paymentInfo.type2 = ''
      }
      for (let i = 0; i < this.paymentData.Product.productList.length; i++) {
        // 카테고리
        let cate = ''
        if (!isNull(this.globalVal.mInputParams.productCategoryName)) {
          const categoryName = this.globalVal.mInputParams.productCategoryName
          const categoryNum = `partNum_${this.paymentData.Product.productList[i].partNumber}`

          if (!isNull(categoryName)) {
            if (!isNull(categoryName[`${categoryNum}.cate2Nm`])) {
              cate = categoryName[`${categoryNum}.cate1Nm`]
            }
            if (!isNull(categoryName[`${categoryNum}.cate2Nm`])) {
              cate = `${cate}/${categoryName[`${categoryNum}.cate2Nm`]}`
            }
            if (!isNull(categoryName[`${categoryNum}.cate3Nm`])) {
              cate = `${cate}/${categoryName[`${categoryNum}.cate3Nm`]}`
            }
            if (!isNull(categoryName[`${categoryNum}.cate4Nm`])) {
              cate = `${cate}/${categoryName[`${categoryNum}.cate4Nm`]}`
            }
            if (!isNull(categoryName[`${categoryNum}.cate5Nm`])) {
              cate = `${cate}/${categoryName[`${categoryNum}.cate5Nm`]}`
            }
          }
        }
        // 옵션
        let variantName = ''
        if (this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId === 'INT') {
          if (!isNull(this.globalVal.mOutputDatas.msg.OrderGoodList[i].attributes[0].NAME)) {
            variantName = this.globalVal.mOutputDatas.msg.OrderGoodList[i].attributes[0].NAME
          } else {
            variantName = null
          }
        } else {
          if (!isNull(this.globalVal.mOutputDatas.msg.OrderGoodList[i].attributes[0].VALUE)) {
            variantName = this.globalVal.mOutputDatas.msg.OrderGoodList[i].attributes[0].VALUE
          } else {
            variantName = null
          }
        }
        productArray.push({
          id: String(this.paymentData.Product.productList[i].partNumber),
          name: this.paymentData.Product.productList[i].PRODUCT_NAME,
          brand: this.paymentData.Product.productList[i].BRAND_KOR_NM,
          category: cate,
          variant: variantName,
          dimension16: paymentInfo.type,
          dimension20: paymentInfo.type2
        })
      }

      if (this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId === 'CTCOM' || this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.busChnId === 'TV') {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_07,
            params: productArray,
            subparams: {
              t1: '주문/결제',
              t2: '주문서작성/결제',
              payMthdCd: this.paymentData.Payment.paymentList[0].payType
            }
          }
        })
      } else {
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_08,
            params: productArray,
            subparams: {
              t1: '주문/결제',
              t2: '주문서작성/결제',
              payMthdCd: this.paymentData.Payment.paymentList[0].payType
            }
          }
        })
      }
    }

  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetConfirm";
</style>
