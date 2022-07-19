<template>
  <div class="order_sheet_payment_method">
    <!-- 결제수단 선택 -->
    <h3 id="payment_method" class="subject">
      결제수단 선택
    </h3>
    <div class="payment_method" @click="onclickPaymentMethodSelect()">
      <p class="title">
        {{ globalVal.paymentMethodInfo.paymentMethodTitle }}
      </p>
      <p v-show="globalVal.paymentMethodInfo.wrongMessage !== ''" class="wrong">
        <!-- 네이버페이는 일시불할인 적용이 불가능한<br> 결제수단입니다. -->
        {{ globalVal.paymentMethodInfo.wrongMessage }}
      </p>
    </div>

    <!-- 신용카드 할부정보 표시 - 결제선택 출력 -->
    <label v-show="showCardInfo" class="select">
      <select v-model="globalVal.paymentMethodInfo.epQuota" @change="onchangeSelectEpQuota()">
        <template v-for="(dispEpQuotaItem, indexDispEpQuota) in globalVal.paymentMethodInfo.dispEpQuotaList">
          <option
            :key="indexDispEpQuota"
            :value="dispEpQuotaItem.value"
          >{{ dispEpQuotaItem.text }}
          </option>
        </template>
      </select>
    </label>

    <!-- NS페이 신용카드 할부정보 표시 - 결제선택 출력 -->
    <label v-show="showNspayCardInfo" class="select">
      <select ref="floorNspayCardQuota" v-model="globalVal.paymentMethodInfo.selectedNspay.item.quota" @change="onchangeNspaySelectQuota()">
        <template v-for="(dispNspayQuotaItem, indexNspayQuota) in globalVal.paymentMethodInfo.selectedNspay.item.quotaList">
          <option
            :key="indexNspayQuota"
            :value="dispNspayQuotaItem.value"
          >{{ dispNspayQuotaItem.text }}
          </option>
        </template>
      </select>
    </label>

    <!-- 신용카드 포인트 가이드 표시 - 결제선택 출력 -->
    <label v-show="showCardInfo && globalVal.paymentMethodInfo.cardPointGuide.selectedCard.isShow">
      <input v-model="globalVal.paymentMethodInfo.checkedEpPointUseYn" type="checkbox" value="Y" class="checkbox square" @click="checkedPointNonQuota()">
      <span class="check_label">{{ globalVal.paymentMethodInfo.cardPointGuide.selectedCard.pointName }} 사용</span>
    </label>

    <!-- 카드청구할인 안내 추가요구사항 -->
    <div v-if="cardBenefitList.length > 0" class="txt_list_box">
      <strong>카드 청구할인 안내</strong>
      <dl
        v-for="(cardBenefit,index) in cardBenefitList "
        :key="index"
      >
        <dt> {{ cardBenefit.offerNm }}</dt>
        <dd>{{ cardBenefit.advInfoText }}</dd>
      </dl>
      <p>* 상품 상세 페이지에 할인가 노출된 상품만 적용됩니다.</p>
    </div>
  </div>
</template>

<script>
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import popupUtil from '@frameworks/popupUtil'

import doPaymentApprovalRequestMixin from '@/mixins/order/sheet/doPaymentApprovalRequestMixin'
import finalPaymentAmountMixin from '@/mixins/order/sheet/finalPaymentAmountMixin'
import discountAmountMixin from '@/mixins/order/sheet/discountAmountMixin'
import singlePaymentDiscountMixin from '@/mixins/order/sheet/singlePaymentDiscountMixin'
import paymentCreditCardMixin from '@/mixins/order/sheet/payment/paymentCreditCardMixin'
import calcCardPreDcAmtMixin from '@/mixins/order/sheet/payment/calcCardPreDcAmtMixin'
import calcChargeDcAmtMixin from '@/mixins/order/sheet/payment/calcChargeDcAmtMixin'
import calcCardPointAmtMixin from '@/mixins/order/sheet/payment/calcCardPointAmtMixin'
import paymentDepositMixin from '@/mixins/order/sheet/payment/paymentDepositMixin'
import validCashReceiptMixin from '@/mixins/order/sheet/confirm/validCashReceiptMixin'
import paymentNspayMixin from '@/mixins/order/sheet/payment/paymentNspayMixin'
import paymentOtherMixin from '@/mixins/order/sheet/payment/paymentOtherMixin'
import {
  extend,
  isNull,
  getHangulPrice
} from '@utils/commonutil/commonUtil'

export default {
  mixins: [
    doPaymentApprovalRequestMixin,
    finalPaymentAmountMixin,
    discountAmountMixin,
    singlePaymentDiscountMixin,
    paymentNspayMixin,
    paymentCreditCardMixin,
    calcCardPreDcAmtMixin,
    calcChargeDcAmtMixin,
    calcCardPointAmtMixin,
    paymentDepositMixin,
    validCashReceiptMixin,
    paymentOtherMixin
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
      flagCallback: false,
      isFloorMode: true,
      isInitPaymentMethod: true
    }
  },
  computed: {
    /**
     * show 카드정보
     * @returns {Boolean}
     */
    showCardInfo () {
      return PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) &&
            !isNull(this.globalVal.paymentMethodInfo.epCardCode)
    },
    /**
     * show NS페이 카드정보
     * @returns {Boolean}
     */
    showNspayCardInfo () {
      return PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) &&
              (this.globalVal.paymentMethodInfo.paymentMethodTitle.indexOf('은행') < 0 &&
              this.globalVal.paymentMethodInfo.paymentMethodTitle.indexOf('뱅크') < 0)
    },
    /**
     * 신용카드 할인
     */
    cardBenefitList () {
      const returnList = []
      const dispOfferIdfr = []
      let maxBnftLimit = 0
      for (const items of this.globalVal.mOutputDatas.cardPreDcList) {
        if (!dispOfferIdfr.includes(items.offerIdfr)) {
          if ((items.bnftType === '33' || items.bnftType === '31' || items.bnftType === '35')) {
            if (!isNull(items.maxBnftLimit)) {
              maxBnftLimit = items.maxBnftLimit
            }
            if (maxBnftLimit < 0) {
              maxBnftLimit = 0
            }

            let advInfoText = ''

            if (items.cardBnft && items.cardBnftVal) {
            // 추가 정보
              if (items.amtStartVal && items.amtStartVal !== '0') {
                advInfoText = `${getHangulPrice(items.amtStartVal)}원 이상 결제시 `
              }
              if (maxBnftLimit > 0) {
                advInfoText += `최대 ${getHangulPrice(Math.ceil(Math.floor(items.maxBnftLimit) / 10) * 10)}원 할인`
              }

              items.offerNm = items.offerNm.replace('NS페이_', 'NS페이 ').replace('청구할인', ' 청구할인')
              const offerNm = items.offerNm

              returnList.push({ offerNm, advInfoText })
              dispOfferIdfr.push(items.offerIdfr)
            }
          }
        }
      }
      return returnList
    }
  },
  watch: {
    'globalVal.paymentMethodInfo.dispEpQuotaList' (to) {
      if (isNull(to)) {
        this.changeFinalAmtPaymentMethodCard(this.globalVal.paymentMethodInfo.previousGrandTotalAmt)
      }
    },
    'globalVal.paymentMethodInfo.selectedNspay.item.quotaList' (to) {
      if (isNull(to)) {
        this.changeFinalAmtPaymentMethodNspayCard(this.globalVal.paymentMethodInfo.previousGrandTotalAmt)
      }
    }
  },
  created () {
    this.globalVal.paymentMethodInfo.enableDiscountQuota = true
    this.setSavePaymentMethod()
    if (!(this.isPayco && this.globalVal.cat2CategoryIdFlag) &&
        !(this.isNaverpay && this.globalVal.cat2CategoryIdFlag)) {
      this.checkOtherPaymentMethod()
    }
    this.setIsGalleria()
    this.globalVal.completeOrderSheetPayment = true
  },
  mounted () {
    /**
     * 카드사 디폴트 고정
     *  - this.$root.$emit('paymentMethodCardSelectEmit')
     * @returns {void}
     */
    this.$root.$on('paymentMethodCardSelectEmit', () => {
      if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.isInitPaymentMethod = false

        if (!isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
          const cardCd = this.globalVal.paymentMethodInfo.epCardCode.split('_')
          const savedCard = this.useCardList.filter(o => { // 포인트카드 안내 에서도 사용됨 (ASIS) optData
            return o.CARD_CO_CD === cardCd[0] && o.EZPAYCD === cardCd[1] &&
                   o.DIRECT_YN === cardCd[2] && o.CARD_SEQ === cardCd[3]
          })[0] || { CARD_CO_CD: '', CARD_CO_NM: '', DIRECT_YN: '', CARD_SEQ: '' }
          const epCardCode = `${savedCard.CARD_CO_CD}_${savedCard.EZPAYCD}_${savedCard.DIRECT_YN}_${savedCard.CARD_SEQ}`
          this.globalVal.paymentMethodInfo.epCardText = savedCard.CARD_CO_NM
          this.setEpNoinstFlagN() // 카드결제시 일시불이 기본 값
          this.setPaymentCreditCard(this.globalVal.mOutputDatas.msg, epCardCode)
          this.setFloorCardTmplTitle()
        }
      }
    })

    /**
     * 결제수단정보 초기화
     *  - this.$root.$emit('clearPaymentMethodEmit')
     * @returns {void}
     */
    this.$root.$on('clearPaymentMethodEmit', () => {
      this.clearPaymentMethod()
    })

    /**
     * 배송일 지정시 결제수단정보 초기화
     *  - this.$root.$emit('clearPaymentMethodChangeDeliveryDateEmit')
     * @returns {void}
     */
    this.$root.$on('clearPaymentMethodChangeDeliveryDateEmit', () => {
      if (PAY_TYPE_CONST.isDepositWithoutBankbook(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.clearPaymentMethod()
      }
    })

    /**
     * 최종결제 금액 변경시 신용카드 5만원미만->5만원이상으로 변경 시 할부 리스트 재처리
     *  - this.$root.$emit('changeFinalAmtPaymentMethodCardEmit')
     * @returns {void}
     */
    this.$root.$on('changeFinalAmtPaymentMethodCardEmit', previousGrandTotalAmt => {
      this.globalVal.paymentMethodInfo.previousGrandTotalAmt = previousGrandTotalAmt
      this.changeFinalAmtPaymentMethodCard(previousGrandTotalAmt)
    })

    /**
     * 최종결제 금액 변경시 5만원미만->5만원이상으로 변경 시 할부 리스트 재처리
     *  - this.$root.$emit('changeFinalAmtPaymentMethodNspayCardEmit')
     * @returns {void}
     */
    this.$root.$on('changeFinalAmtPaymentMethodNspayCardEmit', previousGrandTotalAmt => {
      this.globalVal.paymentMethodInfo.previousGrandTotalAmt = previousGrandTotalAmt
      this.changeFinalAmtPaymentMethodNspayCard(previousGrandTotalAmt)
    })
  },
  methods: {
    isNull,
    /**
     * 최종결제 금액 변경시 신용카드 5만원미만->5만원이상으로 변경 시 할부 리스트 재처리
     * @param {Number} previousGrandTotalAmt - 이전 총금액
     * @returns {void}
     */
    changeFinalAmtPaymentMethodCard (previousGrandTotalAmt) {
      let lastPayTypeCode = this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode
      if (this.globalVal.completeOrderSheetInfo ||
            this.globalVal.completeLastCashReceiptData ||
            this.globalVal.completeOrderSheetCustomer ||
            this.globalVal.completeOrderSheetDelivery ||
            this.globalVal.completeOrderSheetProduct ||
            this.globalVal.completeOrderSheetPayment ||
            this.globalVal.completeOrderSheetDiscount) {
        lastPayTypeCode = ''
      }

      if (this.$route.name === 'orderSheet' &&
          (!PAY_TYPE_CONST.isNSPayCreditCard(lastPayTypeCode) &&
            !PAY_TYPE_CONST.isNSPayAccountTransfer(lastPayTypeCode) &&
            !this.globalVal.cat2CategoryIdFlag) &&
          PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
        this.globalVal.paymentMethodInfo.changeFinalAmtPaymentMethodCardEmit = true
        this.onchangeSelectEpQuota()
        this.globalVal.paymentMethodInfo.changeFinalAmtPaymentMethodCardEmit = false
        this.setFloorCardTmplTitle()
        this.$forceUpdate()
      }
    },
    /**
     * 최종결제 금액 변경시 5만원미만->5만원이상으로 변경 시 할부 리스트 재처리
     * @param {Number} previousGrandTotalAmt - 이전 총금액
     * @returns {void}
     */
    async changeFinalAmtPaymentMethodNspayCard (previousGrandTotalAmt) {
      if (this.$route.name === 'orderSheet' &&
          this.globalVal.completeOrderSheetDiscount &&
           PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) &&
           !isNull(this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardCode) &&
           this.globalVal.paymentMethodInfo.selectedNspay.item.payMethod === '01') {
        // NSSR-38498 모바일 NS페이 5만원미만->5만원이상으로 변경 시 할부 리스트 재조회 불가 이슈 > NSPaySlider에 최종 결제금액 반영
        if (previousGrandTotalAmt !== this.globalVal.paymentAmtInfo.grandTotalAmt) {
          await this.setNspayFinalPaymentAmt(this.globalVal.paymentAmtInfo.grandTotalAmt)
          this.globalVal.paymentMethodInfo.changeFinalAmtPaymentMethodNspayCardEmit = true
          this.globalVal.paymentMethodInfo.selectedNspay.item.quota = '00'
          this.onchangeNspaySelectQuota()
          this.globalVal.paymentMethodInfo.changeFinalAmtPaymentMethodNspayCardEmit = false
          const bankCardCode = this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardCode
          const quota = this.globalVal.paymentMethodInfo.selectedNspay.item.quota
          const quotaList = this.globalVal.paymentMethodInfo.selectedNspay.item.quotaList
          this.setFloorNspayCardTmplTitle(true, bankCardCode, quota, quotaList)
        }
      }
    },
    /**
      * 갤러리아 여부 설정
      * @returns {void}
      */
    setIsGalleria () {
      if (!this.globalVal.paymentMethodInfo.isGalleria) {
        for (let k = 0; this.globalVal.mOutputDatas.msg.OrderGoodList.length > k; k++) { // 상품 갯수 만큼 반복
          if (this.globalVal.mOutputDatas.msg.OrderGoodList[k].goodsDetail.VENDOR_ID === '109103') { // 제휴사코드가 갤러리아일 때
            this.globalVal.paymentMethodInfo.isGalleria = true
          }
        }
      }
    },
    /**
     * 결제수단 정보 초기화
     * @returns {void}
     */
    clearPaymentMethod () {
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      this.globalVal.paymentMethodInfo.wrongMessage = ''
      this.globalVal.paymentMethodInfo.epCardCode = ''
      this.globalVal.paymentMethodInfo.epQuota = '00'
      this.globalVal.paymentMethodInfo.paymentMethodTitle = '결제수단을 선택해 주세요.'
    },
    /**
     * 결제수단 선택
     * @returns {void}
     */
    onclickPaymentMethodSelect () {
      this.globalVal.paymentMethodInfo.enableDiscountQuota = false
      this.flagCallback = false
      this.isFloorMode = false
      const paymentMethodInfo = extend(true, {}, this.globalVal.paymentMethodInfo)
      const previousPaymentMethodInfo = {
        paymentMethod: this.globalVal.paymentMethodInfo.paymentMethod,
        currentPayType: this.globalVal.paymentMethodInfo.currentPayType,
        wrongMessage: this.globalVal.paymentMethodInfo.wrongMessage,
        cat2CategoryIdFlag: this.globalVal.cat2CategoryIdFlag,
        checkedSinglePaymentDiscount: this.globalVal.discountInfo.checkedSinglePaymentDiscount,
        epQuota: this.globalVal.paymentMethodInfo.epQuota,
        paymentMethodTitle: this.globalVal.paymentMethodInfo.paymentMethodTitle,
        paymentMethodInfo,
        checkedEpPointUseYn: this.globalVal.paymentMethodInfo.checkedEpPointUseYn
      }

      const params = {
        title: '결제수단 선택',
        titleAlign: 'center',
        isShowSearch: false,
        isShowCart: false,
        globalVal: this.globalVal,
        paymentData: this.paymentData
      }

      const callbck = result => {
        this.isFloorMode = true
        if (isNull(result) || !result.success) {
          this.globalVal.paymentMethodInfo = previousPaymentMethodInfo.paymentMethodInfo

          if (isNull(previousPaymentMethodInfo.paymentMethod)) {
            this.globalVal.paymentMethodInfo.paymentMethodTitle = '결제수단을 선택해 주세요.'
            return false
          }

          if ((PAY_TYPE_CONST.isPayco(previousPaymentMethodInfo.currentPayType) && previousPaymentMethodInfo.cat2CategoryIdFlag) ||
              (PAY_TYPE_CONST.isNaverpay(previousPaymentMethodInfo.currentPayType) && previousPaymentMethodInfo.cat2CategoryIdFlag)) {
            this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
            this.onchangeSinglePaymentDiscount()
            return false
          }

          // 1. 이전결제수단이 없을때
          // 2. 이전 결제수단이 페이코/네이버 결제일때 신용카드_일시불 할인이 큰경우 신용카드 설정되었을때
          if (!this.globalVal.paymentMethodInfo.paymentMethod) {
            // 이전결제수단 유지
          } else if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.currentPayType)) {
            if (isNull(this.globalVal.paymentMethodInfo.epCardCode) ||
                  previousPaymentMethodInfo.paymentMethodTitle === '결제수단을 선택해 주세요.') {
              this.clearPaymentMethod()
              return false
            }

            this.globalVal.discountInfo.checkedSinglePaymentDiscount = previousPaymentMethodInfo.checkedSinglePaymentDiscount
            this.globalVal.paymentMethodInfo.checkedEpPointUseYn = previousPaymentMethodInfo.checkedEpPointUseYn
            this.onchangeSinglePaymentDiscount()
            this.setFloorCardTmplTitle()
          }
        }
      }
      popupUtil.show('order/sheet/OrderSheetPaymentMethodSelect', params, callbck)
    },
    /**
     * 저장된 결제수단 Title 설정
     * @returns {void}
     */
    setSavePaymentMethod () {
      if (this.globalVal.mOutputDatas.OrderMethodSave.paySaveFlag === '1') {
        return false
      }

      if (this.isInitPaymentMethod) {
        this.globalVal.paymentMethodInfo.currentPayType = this.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode
      }

      if (this.isNSPayCard || this.isNSPayAccTransfer) {
        if (this.globalVal.cat2CategoryIdFlag) {
          this.clearPaymentMethod()
          this.globalVal.paymentMethodInfo.wrongMessage = '환금성 상품(금, 상품권 등)은 NS페이로 구매하실 수 없습니다.'
        } else {
          this.setSavedNspayInfo()
        }
      } else if (this.isCard && !isNull(this.globalVal.mOutputDatas.OrderMethodSave.cardCd)) {
        const cardCd = this.globalVal.mOutputDatas.OrderMethodSave.cardCd.split('|')
        const savedCard = this.useCardList.filter(o => {
          return o.EZPAYCD === cardCd[0] && o.CARD_CO_NM === cardCd[1]
        })[0]
        const epCardCode = `${savedCard.CARD_CO_CD}_${savedCard.EZPAYCD}_${savedCard.DIRECT_YN}_${savedCard.CARD_SEQ}`
        this.globalVal.paymentMethodInfo.epCardText = savedCard.CARD_CO_NM
        this.setEpNoinstFlagN() // 카드결제시 일시불이 기본 값
        this.setPaymentCreditCard(this.globalVal.mOutputDatas.msg, epCardCode)
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType, savedCard.CARD_CO_NM, '일시불')
      } else if (this.isNaverpay) {
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType)
        if (this.globalVal.cat2CategoryIdFlag) {
          this.clearPaymentMethod()
          this.globalVal.paymentMethodInfo.wrongMessage = '환금성 상품(금, 상품권 등)은 네이버페이로 구매하실 수 없습니다.'
        } else {
          this.setSavedNaverpayInfo()
          this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType)
        }
      } else if (this.isPayco) {
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType)
        if (this.globalVal.cat2CategoryIdFlag) {
          this.clearPaymentMethod()
          this.globalVal.paymentMethodInfo.wrongMessage = '환금성 상품(금, 상품권 등)은 PAYCO로 구매하실 수 없습니다.'
        } else {
          this.setSavedPaycoInfo()
          this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType)
        }
      } else if (this.isMobile) {
        this.setSavedMobileInfo()
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType)
      } else if (this.isDeposit) {
        this.setSavedDepositInfo()
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(this.globalVal.paymentMethodInfo.currentPayType, this.globalVal.paymentMethodInfo.selectedBankInfo.BANKNAME)
      } else {
        this.setPaymentCreditCardApprovalRequest()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/order/sheet/OrderSheetPaymentMethod";
</style>
