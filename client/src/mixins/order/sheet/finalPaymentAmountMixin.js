import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  onlyNumFormat,
  isNull
} from '@utils/commonutil/commonUtil'

/**
 * FinalPaymentAmountMixin
 */
const finalPaymentAmountMixin = {
  methods: {
    /**
     * 총결제금액 출력
     *   - 할인금액 출력 (setDiscountAmount)
     *   - 할인금액 출력_other (setDiscountAmount_other)
     *   - 결제정보(적립금/예치금) 출력 (setPaymentAmount)
     *   - 배송비 계산 후 출력 (setShippingChargeInfo)
     * @returns {void}
     */
    setFinalPaymentAmount () {
      const previousGrandTotalAmt = this.globalVal.paymentAmtInfo.grandTotalAmt
      const reservesUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.reservesUseAmt)) // 적립금 사용금액
      const happyMoneyUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.happyMoneyUseAmt)) // 해피머니 사용금액
      const nsGiftCardUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.nsGiftCardUseAmt)) // NS상품권 사용금액
      const depositUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.depositUseAmt)) // 예치금 사용금액
      const annualDcUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.annualDcUseAmt)) // 연간할인권 사용금액
      const okCashbagUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.okCashbagUseAmt)) // OK캐쉬백 사용금액
      const netiWellUseAmt = Number(onlyNumFormat(this.globalVal.discountInfo.netiWellUseAmt)) // 네티웰 사용금액
      const couponDiscountPrice = Number(onlyNumFormat(this.paymentData.Payment.getItem(0).couponDcAmt)) // 쿠폰할인
      const cardDiscountPrice = Number(onlyNumFormat(this.paymentData.Payment.getItem(0).cardDcAmt)) // 카드할인

      // 결제할 금액 재계산
      this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT = this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT -
      this.globalVal.mOutputDatas.orderPrice.OFFER_AMT +
      this.globalVal.mOutputDatas.orderPrice.SHIP_CHARGE
      // sfinalPaymentAmtSaveExclude 부가결제 수단을 재외한 화면에 뿌려지는 값 세팅
      this.globalVal.mOutputDatas.sfinalPaymentAmtSaveExclude = this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT - couponDiscountPrice - cardDiscountPrice
      this.globalVal.paymentAmtInfo.grandTotalAmt = this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT - annualDcUseAmt - okCashbagUseAmt - reservesUseAmt - depositUseAmt - nsGiftCardUseAmt - netiWellUseAmt - happyMoneyUseAmt - couponDiscountPrice - cardDiscountPrice
      this.globalVal.mOutputDatas.orderPrice.TOTAL_SALE_AMT = annualDcUseAmt + okCashbagUseAmt + reservesUseAmt + depositUseAmt + nsGiftCardUseAmt + netiWellUseAmt + happyMoneyUseAmt + couponDiscountPrice + cardDiscountPrice + this.globalVal.mOutputDatas.orderPrice.OFFER_AMT
      this.globalVal.paymentAmtInfo.totalSaleAmt = this.globalVal.mOutputDatas.orderPrice.TOTAL_SALE_AMT

      this.setForecastReservedAmt() // 예상 적립금 계산, 적재, 출력

      // 최종 결제금액이 0일 경우 결재수단선택 탭을 표시하지 않음
      if (this.globalVal.paymentAmtInfo.grandTotalAmt > 0) {
        this.globalVal.paymentMethodInfo.showSectionPaymentMethodArea = true
      } else {
        this.globalVal.paymentMethodInfo.showSectionPaymentMethodArea = false
      }

      // 폼 데이터에 반영
      this.paymentData.Payment.setItem(0, {
        FINAL_PAYMENT_AMT: this.globalVal.paymentAmtInfo.grandTotalAmt,
        Additionalpaymentamount: annualDcUseAmt + okCashbagUseAmt + reservesUseAmt + depositUseAmt + nsGiftCardUseAmt + netiWellUseAmt + happyMoneyUseAmt
      })

      if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) &&
           !isNull(this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardCode)) {
        // NSSR-38498 모바일 NS페이 5만원미만->5만원이상으로 변경 시 할부 리스트 재조회 불가 이슈 > NSPaySlider에 최종 결제금액 반영
        if (previousGrandTotalAmt !== this.globalVal.paymentAmtInfo.grandTotalAmt) {
          this.$root.$emit('changeFinalAmtPaymentMethodNspayCardEmit', previousGrandTotalAmt)
        }
      } else if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) &&
            !isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
        // NSSR-38498 모바일 NS페이 5만원미만->5만원이상으로 변경 시 할부 리스트 재조회 불가 이슈
        if (previousGrandTotalAmt !== this.globalVal.paymentAmtInfo.grandTotalAmt) {
          this.$root.$emit('changeFinalAmtPaymentMethodCardEmit', previousGrandTotalAmt)
        }
      }
    },

    /**
     * 예상 적립금 화면 출력(예상 적립금 계산, 적재, 출력)
     *   - 총결제금액 출력 (setFinalPaymentAmount)
     * @returns {void}
     */
    setForecastReservedAmt () {
      this.globalVal.discountInfo.forecastReservedAmt = 0
      let lastStrDiscountPrice = 0 // 모든 상품의 최종 적립액 sum
      const forecastReservedAmtArr = [] // 각 상품별 예상 적립액 결과 배열

      for (let i = 0; i < this.paymentData.Discount.discountList.length; i++) {
        if (undefined !== this.paymentData.Discount.getItem(i).couponList.PAD10100) {
          const objForecastReservedAmt = this.paymentData.Discount.getItem(i).couponList.PAD10100

          let strImdtDcCpAmt = ''
          let strDiscountPrice = ''

          if (objForecastReservedAmt.PROM_VAL_PAD === 'AMT') { // 정액
            this.globalVal.discountInfo.forecastReservedAmt += Number(objForecastReservedAmt.WWW_AMT) * Number(objForecastReservedAmt.USED_COUPON_QTY)

            strImdtDcCpAmt = String(objForecastReservedAmt.WWW_AMT)
            strDiscountPrice = String(Number(objForecastReservedAmt.WWW_AMT) * Number(objForecastReservedAmt.USED_COUPON_QTY))
          } else { // 정률
            // 적립금 계산 수정
            const couponDiscountPriceArr = [] // 각 상품별 쿠폰 할인가 배열
            let disPriceSum = 0 // 쿠폰 할인가 sum
            for (let j = 0; j < this.paymentData.Discount.discountList.length; j++) {
              for (let k = 0; k < this.paymentData.Discount.discountList[j].couponList.length; k++) {
                if (this.paymentData.Discount.discountList[j].couponList[k] !== undefined) {
                  if (!isNull(this.paymentData.Discount.discountList[j].couponList[k])) {
                    disPriceSum += Number(this.paymentData.Discount.discountList[j].couponList[k].DiscountPrice)
                  }
                }
              }
              couponDiscountPriceArr[j] = disPriceSum
              disPriceSum = 0 // 상품별로 쿠폰 할인값을 sum 하고 배열에 담은 다음 다시 초기화 한다.
            }

            // 알뜰 할인가 계산  = (판매가 * 수량) - 가격할인 - 카드선할인 - 각 상품별 쿠폰할인가(일시불할인포함)
            const sigForecastReservedAmt = Number(objForecastReservedAmt.PRICE) * Number(objForecastReservedAmt.USED_COUPON_QTY) -
            Number(objForecastReservedAmt.OFFER_AMT) -
            // - Number(undefined == objForecastReservedAmt.cardDiscountPrice ? "0" : objForecastReservedAmt.cardDiscountPrice)  // 쿠폰할인가에 일시불할인이 포함되어 있어 제거
            Number(undefined === objForecastReservedAmt.cardPreDiscountPrice ? '0' : objForecastReservedAmt.cardPreDiscountPrice) -
            Number(undefined === couponDiscountPriceArr[i] ? '0' : couponDiscountPriceArr[i])

            // 상품의 개당 적립액
            let nSingleImdtDcCpAmt = Number(objForecastReservedAmt.WWW_RATE) / 100 * sigForecastReservedAmt
            nSingleImdtDcCpAmt = Math.ceil(Math.round(nSingleImdtDcCpAmt) / 10) * 10

            forecastReservedAmtArr[i] = nSingleImdtDcCpAmt
            this.globalVal.discountInfo.forecastReservedAmt += forecastReservedAmtArr[i] // 화면에 보여지는 예상 적립액 sum

            const totAccPrice = Math.ceil((Math.ceil(sigForecastReservedAmt / objForecastReservedAmt.USED_COUPON_QTY) * objForecastReservedAmt.WWW_RATE / 100) / 10) * 10

            strImdtDcCpAmt = Math.ceil(nSingleImdtDcCpAmt / objForecastReservedAmt.USED_COUPON_QTY) // 개당 적립액 적재
            strDiscountPrice = String(totAccPrice * Number(objForecastReservedAmt.USED_COUPON_QTY)) // 총 적립액 적재

            lastStrDiscountPrice += Number(strDiscountPrice) //  실제 총 적립액 적재
          }

          this.paymentData.Discount.setCouponItem(i, 'PAD10100', {
            ImdtDcCpAmt: strImdtDcCpAmt,
            DiscountPrice: strDiscountPrice
          })
        }
      }

      this.globalVal.mOutputDatas.forecastReservedAmt = lastStrDiscountPrice
    }
  }
}
export default finalPaymentAmountMixin
