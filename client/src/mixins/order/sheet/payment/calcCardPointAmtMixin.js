/**
 * 카드 포인트 적립 금액 계산 -> (ASIS) setCardPreDcList32
 */
const calcCardPointAmtMixin = {
  methods: {
    /**
     * 카드 포인트 적립 금액 계산
     * @param {String} cardCode - 카드 CO코드
     * @param {Object} objCardPreDc - 할인정보
     * @returns {void}
     */
    calcCardPointAmt (cardCode, objCardPreDc) {
      this.globalVal.discountCardChoice.discountList32 = []
      this.globalVal.discountCardChoice.discountList32Info = []

      for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
        // 쿠폰 할인금액 계산에 사용할 상품아이템 정보
        const itemBaseData = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemBaseData
        const cardPreDcList = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemDetailInfo.cardBnftList
        if (cardPreDcList && cardPreDcList.length > 0) {
          for (let j = 0; j < cardPreDcList.length; j++) {
            this.globalVal.discountCardChoice.discountList32[i] = {}
            this.globalVal.discountCardChoice.discountList32[i].couponList = []

            if (cardPreDcList[j].cardCoCd === cardCode || (cardPreDcList[j].cardCoCd === 'LG' && cardCode === 'SH')) {
              // 할인가 계산
              // 최종 결제 금액 기준으로 할인이 적용되도록 수정됨
              const basePrice = this.paymentData.Payment.paymentList[0].FINAL_PAYMENT_AMT

              // 할인 가능 구간 체크
              if ((cardPreDcList[j].amtStartVal === '0' || cardPreDcList[j].amtStartVal === '') && (cardPreDcList[j].amtEndVal === '0' || cardPreDcList[j].amtEndVal === '')) {
                // 별도 처리 하지 않음 - 무조건 통과
              } else {
                if (cardPreDcList[j].amtEndVal === '0' || cardPreDcList[j].amtEndVal === '') { // max 값이 무한대인경우
                  if (Number(cardPreDcList[j].amtStartVal) > Number(basePrice)) { // 결제금액이 시작 금액보다 작은경우
                    return false
                  }
                } else { // max 값이 무한대가 아닌 경우
                  // 결제금액이 시작 금액보다 작거나, 결제금액이 max값보다 큰경우
                  if (Number(cardPreDcList[j].amtStartVal) > Number(basePrice) || Number(basePrice) > Number(cardPreDcList[j].amtEndVal)) {
                    return false
                  }
                }
              }

              let tDiscountPrice = cardPreDcList[j].cardBnftSpr === '1' ? Number(cardPreDcList[j].cardBnftVal) : Number(cardPreDcList[j].cardBnftVal) / 100 * basePrice
              tDiscountPrice = Math.ceil(Math.round(tDiscountPrice) / 10) * 10

              let nDiffAmt = ''
              let nSingDiscountPrice = 0
              if (cardPreDcList[j].cardBnftSpr === '1') { // 정액
                // 절산된 전체 할인될 금액 - 절산된 개별(정액 / 갯수) 할인될 금액 * 갯수
                nSingDiscountPrice = (Math.ceil(Math.round(Number(cardPreDcList[j].cardBnftVal) / itemBaseData.QTY) / 10) * 10)
                nDiffAmt = tDiscountPrice - (nSingDiscountPrice * itemBaseData.QTY)
              } else { // 정률
                // 절산된 전체 할인될 금액 - 절산된 개별 할인될 금액 * 갯수
                nSingDiscountPrice = (Math.ceil(Math.round((basePrice / itemBaseData.QTY) * (Number(cardPreDcList[j].cardBnftVal) / 100)) / 10) * 10)
                nDiffAmt = tDiscountPrice - (nSingDiscountPrice * itemBaseData.QTY)
              }

              const nCountImsi = this.globalVal.discountCardChoice.discountList32Info.length
              this.globalVal.discountCardChoice.discountList32Info[nCountImsi] = {}
              this.globalVal.discountCardChoice.discountList32Info[nCountImsi].index = i
              this.globalVal.discountCardChoice.discountList32Info[nCountImsi].indexDc = this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX

              this.globalVal.discountCardChoice.discountList32[i].orderItemId = this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID
              this.globalVal.discountCardChoice.discountList32[i].CATENTRY_ID = this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.CATENTRY_ID_CHILD

              this.globalVal.discountCardChoice.discountList32[i].couponList[this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX] = {}
              this.globalVal.discountCardChoice.discountList32[i].couponList[this.globalVal.CONST.DISCOUNT_CARD_PRE_DC_INDEX] = {
                ListName: 'cardPreDc_32',
                ImdtDcCpAmt: String(nSingDiscountPrice),
                DiscountPrice: String(nSingDiscountPrice * itemBaseData.QTY),
                PRMT_TYPE_CD: this.paymentData.Discount.getDefineValue('PRMT_TYPE_CD', 'cardPreDc'), // 프로모션타입코드
                DC_TYPE_CD: cardCode === 'NS' ? '10120' : '10130', // 할인타입코드
                WWW_RATE: cardPreDcList[j].cardBnftSpr === '2' ? String(cardPreDcList[j].cardBnftVal) : '0',
                WWW_AMT: cardPreDcList[j].cardBnftSpr === '1' ? String(cardPreDcList[j].cardBnftVal) : '0',
                MAX_USE_NUM: String(itemBaseData.QTY),
                CP_IDFR: cardPreDcList[j].offerIdfr,
                CP_NM: cardPreDcList[j].offerNm,
                USED_COUPON_QTY: String(itemBaseData.QTY),
                USED_COUPON: String(itemBaseData.QTY),
                OFFER_BRCH: objCardPreDc.bnftType,
                DIFF_AMT: String(nDiffAmt)
              }
            }
          }
        }
      }
    }
  }
}
export default calcCardPointAmtMixin
