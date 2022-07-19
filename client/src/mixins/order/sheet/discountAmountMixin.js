/**
 * DiscountAmountMixin
 */
const discountAmountMixin = {
  methods: {
    /**
    * 할인금액 출력 -> (ASIS) setDiscountAmount
    *  - 쿠폰 선택 박스 처리 (oncheckbox_coupon): OrderSheetDiscount.vue
    *  - 쿠폰할인 select onchange (onchange_discountCoupons): OrderSheetDiscount.vue
    *  - 무료배송쿠폰 select onchange (onchange_deliveryCoupons): OrderSheetDiscount.vue
    *  - 카드일시불할인 checkbox (onchangeSinglePaymentDiscount)
    *  - 신용카드 목록 선택 select onchange (onchangeSelectEpCardCode): OrderSheetPayment.vue
    *  - 결제수단 탭 선택 (onclick_ulPaymentMethodArea): OrderSheetPayment.vue
    * @returns {void}
    */
    setDiscountAmount () {
      // 선택한 쿠폰의 할인금액 계산
      this.globalVal.discountInfo.dcCouponAmt = 0
      this.globalVal.discountInfo.cardDcAmt = 0
      this.globalVal.discountInfo.cardPreDcAmt = 0
      this.globalVal.discountInfo.shipDcAmt = 0

      let tmpdisCntSize = 1
      if (this.globalVal.productInfo.nCountGds < 2) {
        tmpdisCntSize = this.globalVal.productInfo.nCountGds
      } else {
        tmpdisCntSize = this.paymentData.Discount.size()
      }

      for (let i = 0; i < tmpdisCntSize; i++) {
        const savedDiscountItem = this.paymentData.Discount.getItem(i)
        let totalDiscountPrice = 0
        let couponDiscountPrice = 0
        let cardDiscountPrice = 0
        let cardPreDiscountPrice = 0
        let freeDlvryDiscountPrice = 0

        let sigCouponDiscountPrice = 0
        let sigCardDiscountPrice = 0
        let sigCardPreDiscountPrice = 0

        if (savedDiscountItem && savedDiscountItem.couponList && savedDiscountItem.couponList.length > 1) {
          for (let j = 1; j < savedDiscountItem.couponList.length; j++) {
            if (savedDiscountItem.couponList[j] && savedDiscountItem.couponList[j].DiscountPrice) {
              if (savedDiscountItem.couponList[j].ListName === 'LSP') { // 카드할인(일시불할인)
                cardDiscountPrice += Number(savedDiscountItem.couponList[j].DiscountPrice)
                sigCardDiscountPrice += Number(savedDiscountItem.couponList[j].ImdtDcCpAmt)
              } else if (savedDiscountItem.couponList[j].ListName === 'cardPreDc') { // 카드할인(카드선할인)
                cardPreDiscountPrice += Number(savedDiscountItem.couponList[j].DiscountPrice)
                sigCardPreDiscountPrice += Number(savedDiscountItem.couponList[j].ImdtDcCpAmt)
              } else if (savedDiscountItem.couponList[j].ListName === 'freeDlvry') { // 무료배송쿠폰할인
                freeDlvryDiscountPrice += Number(savedDiscountItem.couponList[j].DiscountPrice)
              } else { // 일반쿠폰
                if (savedDiscountItem.couponList[j].ListName !== 'PAD' && savedDiscountItem.couponList[j].ListName !== 'cardPreDc_35') {
                  couponDiscountPrice += Number(savedDiscountItem.couponList[j].DiscountPrice)
                  sigCouponDiscountPrice += Number(savedDiscountItem.couponList[j].ImdtDcCpAmt)
                }
              }
            }
          }

          if (undefined === savedDiscountItem.couponList[0]) {
            totalDiscountPrice += (couponDiscountPrice + cardDiscountPrice + cardPreDiscountPrice + Number(freeDlvryDiscountPrice))
          } else {
            totalDiscountPrice += (Number(savedDiscountItem.couponList[0].DiscountPrice) + couponDiscountPrice + cardDiscountPrice + cardPreDiscountPrice + Number(freeDlvryDiscountPrice))
          }
        }

        this.globalVal.discountInfo.dcCouponAmt += couponDiscountPrice
        this.globalVal.discountInfo.cardDcAmt += cardDiscountPrice
        this.globalVal.discountInfo.cardPreDcAmt += cardPreDiscountPrice
        this.globalVal.discountInfo.shipDcAmt += freeDlvryDiscountPrice

        // 예상적립금이 있을경우 개별 할인금액을 담는다.(배송비 재외)
        if (undefined !== this.paymentData.Discount.getItem(i).couponList.PAD10100) {
          this.paymentData.Discount.setCouponItem(i, 'PAD10100', {
            couponDiscountPrice: sigCouponDiscountPrice,
            cardDiscountPrice: sigCardDiscountPrice,
            cardPreDiscountPrice: sigCardPreDiscountPrice
          })
        }

        // 상품정보 폼 데이터 반영
        this.paymentData.Product.setItem(i, {
          DiscountPrice: String(totalDiscountPrice)
        })

        for (let j = 0; j < this.paymentData.Delivery.deliveryList.length; j++) {
          const objDL = this.paymentData.Delivery.deliveryList

          for (let k = 0; k < objDL[j].ITEMS.length; k++) {
            if (this.paymentData.Product.getItem(i).ORDERITEMS_ID === objDL[j].ITEMS[k].ORDERITEMS_ID) {
              let totalAdjustment = 0

              if (objDL[j].ITEMS[k].ORIGINAL_QUANTITY === objDL[j].ITEMS[k].QUANTITY) {
                totalAdjustment = totalDiscountPrice
              } else {
                totalAdjustment = totalDiscountPrice / Number(objDL[j].ITEMS[k].ORIGINAL_QUANTITY) * Number(objDL[j].ITEMS[k].QUANTITY)
              }
              this.paymentData.Delivery.setProductItem(j, k, {
                TOTALADJUSTMENT: String(totalAdjustment)
              })
            }
          }
        }
      }

      // 폼 데이터에 반영
      this.paymentData.Payment.setItem(0, {
        couponDcAmt: String(this.globalVal.discountInfo.dcCouponAmt + this.globalVal.discountInfo.shipDcAmt),
        cardDcAmt: String(this.globalVal.discountInfo.cardDcAmt + this.globalVal.discountInfo.cardPreDcAmt),
        freeShippingDcAmt: this.globalVal.discountInfo.shipDcAmt
      })

      // 결제할 금액 재계산
      this.setFinalPaymentAmount()
    },
    /**
     * 할인금액 출력_other -> (ASIS) setDiscountAmount_other
     * @returns {void}
     */
    setDiscountAmountOther () {
      // 선택한 쿠폰의 할인금액 계산
      this.globalVal.discountInfo.dcCouponAmt = 0
      this.globalVal.discountInfo.cardDcAmt = 0
      this.globalVal.discountInfo.cardPreDcAmt = 0
      this.globalVal.discountInfo.shipDcAmt = 0

      for (let i = 0; i < this.paymentData.Discount.size(); i++) {
        const savedDiscountItem = this.paymentData.Discount.getItem(i)
        let totalDiscountPrice = 0
        const couponDiscountPrice = 0
        const cardDiscountPrice = 0
        const cardPreDiscountPrice = 0
        const freeDlvryDiscountPrice = 0

        const sigCouponDiscountPrice = 0
        const sigCardDiscountPrice = 0
        const sigCardPreDiscountPrice = 0

        if (savedDiscountItem && savedDiscountItem.couponList && savedDiscountItem.couponList.length > 1) {
          totalDiscountPrice += (Number(savedDiscountItem.couponList[0].DiscountPrice) + couponDiscountPrice + cardDiscountPrice + cardPreDiscountPrice + freeDlvryDiscountPrice)
        }
        this.globalVal.discountInfo.dcCouponAmt += couponDiscountPrice
        this.globalVal.discountInfo.cardDcAmt += cardDiscountPrice
        this.globalVal.discountInfo.cardPreDcAmt += cardPreDiscountPrice
        this.globalVal.discountInfo.shipDcAmt += freeDlvryDiscountPrice

        // 예상적립금이 있을경우 개별 할인금액을 담는다.(배송비 재외)
        if (undefined !== this.paymentData.Discount.getItem(i).couponList.PAD10100) {
          this.paymentData.Discount.setCouponItem(i, 'PAD10100', {
            couponDiscountPrice: sigCouponDiscountPrice,
            cardDiscountPrice: sigCardDiscountPrice,
            cardPreDiscountPrice: sigCardPreDiscountPrice
          })
        }

        // 상품정보 폼 데이터 반영
        this.paymentData.Product.setItem(i, {
          DiscountPrice: String(totalDiscountPrice)
        })

        for (let j = 0; j < this.paymentData.Delivery.deliveryList.length; j++) {
          const objDL = this.paymentData.Delivery.deliveryList

          for (let k = 0; k < objDL[j].ITEMS.length; k++) {
            if (this.paymentData.Product.getItem(i).ORDERITEMS_ID === objDL[j].ITEMS[k].ORDERITEMS_ID) {
              let totalAdjustment = 0

              if (objDL[j].ITEMS[k].ORIGINAL_QUANTITY === objDL[j].ITEMS[k].QUANTITY) {
                totalAdjustment = totalDiscountPrice
              } else {
                totalAdjustment = totalDiscountPrice / Number(objDL[j].ITEMS[k].ORIGINAL_QUANTITY) * Number(objDL[j].ITEMS[k].QUANTITY)
              }

              this.paymentData.Delivery.setProductItem(j, k, {
                TOTALADJUSTMENT: String(totalAdjustment)
              })
            }
          }
        }
      }

      // 폼 데이터에 반영
      this.paymentData.Payment.setItem(0, {
        couponDcAmt: String(this.globalVal.discountInfo.dcCouponAmt + this.globalVal.discountInfo.shipDcAmt),
        cardDcAmt: String(this.globalVal.discountInfo.cardDcAmt + this.globalVal.discountInfo.cardPreDcAmt),
        freeShippingDcAmt: this.globalVal.discountInfo.shipDcAmt
      })

      // 결제할 금액 재계산
      this.setFinalPaymentAmount()
    }
  }
}
export default discountAmountMixin
