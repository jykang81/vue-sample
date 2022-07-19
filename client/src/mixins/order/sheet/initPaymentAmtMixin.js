import { PRODUCT_CONST } from '@/common/constants/product/product'

/**
 * initPaymentAmtMixin
 */
const initPaymentAmtMixin = {
  methods: {
    /**
     * 결제금액 출력
     * @returns {void}
     */
    initPaymentAmt () {
      // data.msg.OrderGoodList
      const data = this.globalVal.mOutputDatas.msg.OrderGoodList
      let totalProductAmt = 0 // 총주문금액
      let offerAmt = 0 // 가격할인
      let finalPaymentAmt = 0 // 결제예정금액
      let totalItemCount = 0 // 주문 제품 총 수량
      let giftDispTypeYn = 'N' // 사은품 존재 여부 (상품권이나 기프트일 경우 복합결제 처리를 사용하지 않게 하기 위해 flag 관리)
      const forecastReservedAmt = 0// 예상 적립금
      let minInstallCnt = 99 // 최소 무이자 개월 수
      let cardPreDcList = [] // 카드즉시할인 정보
      let sigOfferAmt = 0

      for (let i = 0; i < data.length; i++) {
        // 총 주문 수량 계산
        totalItemCount += Number(data[i].goodsDetail.QUANTITY)
        // 총금액 계산
        totalProductAmt += (data[i].goodsDetail.PRICE * data[i].goodsDetail.QUANTITY)

        let itemOfferAmt = 0 // (ASIS) setProductItem 설정 - 상품 개별 가격할인 정보

        // 매가할인
        // 할인쿠폰, 더할인쿠폰, 가격할인은 별도 계산식에 따라 처리
        const strXCatentryDispXmdMinCntrbPfrate = data[i].goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE // MD 이익률(문자열)
        if (undefined === strXCatentryDispXmdMinCntrbPfrate || strXCatentryDispXmdMinCntrbPfrate === null || strXCatentryDispXmdMinCntrbPfrate === '') {
          // 계정계에서 무슨짓을 했는지 PROM_VAL_CPC는 정재안된 data라 하여 key 변경
          offerAmt += data[i].goodsDetail.IMDTDCCPAMT * data[i].goodsDetail.QUANTITY
          itemOfferAmt += data[i].goodsDetail.IMDTDCCPAMT * data[i].goodsDetail.QUANTITY
          sigOfferAmt = data[i].goodsDetail.IMDTDCCPAMT * data[i].goodsDetail.QUANTITY
        } else {
          const nPrice = Number(data[i].goodsDetail.PRICE) // 매가 - data[i].goodsDetail.PRICE
          const nDcPrice = Number(data[i].goodsDetail.IMDTDCCPAMT) // 할인금액 - data[i].goodsDetail.PROM_VAL_CPC
          const nXPriceDtlCostVatPerdo = Number(data[i].goodsDetail._XPriceDtl_COST_VAT_PERDO) // 원가 VAT 별도금액 - data[i].goodsDetail._XPriceDtl_COST_VAT_PERDO
          const nXPriceDtlVatAmt = Number(data[i].goodsDetail._XPriceDtl_VAT_AMT) // 부과세액 - data[i].goodsDetail._XPriceDtl_VAT_AMT
          const nXCatentryDispXmdMinCntrbPfrate = Number(strXCatentryDispXmdMinCntrbPfrate) // MD 이익률 - data[i].goodsDetail.XCATENTRY_DISP_XMD_MIN_CNTRB_PFRATE

          // (매가 - 할인금액 - 원가 VAT 별도금액 - 부과세액) / 매가  >= MD 이익률
          if ((nPrice - nDcPrice - nXPriceDtlCostVatPerdo - nXPriceDtlVatAmt) / nPrice >= nXCatentryDispXmdMinCntrbPfrate / 100) {
            offerAmt += data[i].goodsDetail.IMDTDCCPAMT * data[i].goodsDetail.QUANTITY
            itemOfferAmt += data[i].goodsDetail.IMDTDCCPAMT
            sigOfferAmt = data[i].goodsDetail.IMDTDCCPAMT * data[i].goodsDetail.QUANTITY
          } else {
            offerAmt += 0
            itemOfferAmt += 0
            sigOfferAmt = 0
          }
        }

        const strBusChnId = data[i].goodsDetail.XBUSCHN_ID
        if ((strBusChnId === 'TV' || strBusChnId === 'TCOMM' ||
              strBusChnId === 'SB' || strBusChnId === 'CTCOM') &&
                undefined !== data[i].goodsDetail.PROM_VAL_ARS) {
          offerAmt += Number(data[i].goodsDetail.PROM_VAL_ARS) * data[i].goodsDetail.QUANTITY
          itemOfferAmt = Number(data[i].goodsDetail.PROM_VAL_ARS)
          sigOfferAmt = Number(data[i].goodsDetail.PROM_VAL_ARS) * data[i].goodsDetail.QUANTITY
        }

        finalPaymentAmt = Number(totalProductAmt) - Number(offerAmt) // + Number(shipCharge)
        const discountPrice = itemOfferAmt * Number(data[i].goodsDetail.QUANTITY)
        const dcTypeCd = (strBusChnId === 'TV' || strBusChnId === 'TCOMM' || strBusChnId === 'SB' || strBusChnId === 'CTCOM') &&
                            undefined !== data[i].goodsDetail.PROM_VAL_ARS ? '200' : this.paymentData.Discount.getDefineValue('DC_TYPE_CD', 'CPC') // 할인타입코드

        // (ASIS) setProductItem 설정 - START
        // 매가할인 리스트
        const imdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[data[i].goodsDetail.ORDERITEMS_ID]
        // 쿠폰 할인금액 계산에 사용할 상품아이템 정보
        this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemBaseData = {
          Price: data[i].goodsDetail.ITEMPRICE * data[i].goodsDetail.QUANTITY,
          QTY: Number(data[i].goodsDetail.QUANTITY),
          COST_PRICE: (Number(data[i].goodsDetail._XPriceDtl_COST_VAT_PERDO) + Number(data[i].goodsDetail._XPriceDtl_VAT_AMT)),
          COST_VAT_PERDO: Number(data[i].goodsDetail._XPriceDtl_COST_VAT_PERDO),
          VAT_AMT: Number(data[i].goodsDetail._XPriceDtl_VAT_AMT),
          BasePrice: (data[i].goodsDetail.ITEMPRICE - Number(imdtDcCpAmt.PROM_VAL_CPC)) * data[i].goodsDetail.QUANTITY,
          MIN_CMSSN_RATE_SCOPE: Number(data[i].goodsDetail.XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE),
          MIN_CMSSN_RATE_SCOPE_PRICE: (data[i].goodsDetail.XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE / 100) * data[i].goodsDetail.ITEMPRICE,
          MargPrice: (data[i].goodsDetail.ITEMPRICE - ((data[i].goodsDetail.XCATENTRY_DISP_MIN_CMSSN_RATE_SCOPE / 100) * data[i].goodsDetail.ITEMPRICE))
        }

        // (ASIS) setProductItem 설정 - 가격할인 폼 데이터에 반영
        this.paymentData.Discount.setItem(i, {
          orderItemId: data[i].goodsDetail.ORDERITEMS_ID,
          CATENTRY_ID: data[i].goodsDetail.CATENTRY_ID_CHILD
        })

        this.paymentData.Discount.setCouponItem(i, this.globalVal.CONST.DISCOUNT_PRODUCT_CPC_INDEX, {
          ListName: 'CPC',
          ImdtDcCpAmt: String(Number(itemOfferAmt)),
          DiscountPrice: String(discountPrice),
          PRMT_TYPE_CD: this.paymentData.Discount.getDefineValue('PRMT_TYPE_CD', 'CPC'), // 프로모션타입코드
          DC_TYPE_CD: dcTypeCd,
          WWW_RATE: String(0),
          WWW_AMT: String(itemOfferAmt * Number(data[i].goodsDetail.QUANTITY)),
          MAX_USE_NUM: String(0),
          CP_IDFR: (data[i].goodsDetail.OFFER_ITEM_CD || '-9999'),
          USED_COUPON_QTY: data[i].goodsDetail.QUANTITY
        })
        // (ASIS) setProductItem 설정 - END

        // 사은품 여부 체크
        if (data[i].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_GIFTISHOW ||
            data[i].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.MOBILE_GIFTCARD ||
            data[i].goodsDetail.DISP_TYPE_CD === PRODUCT_CONST.GOODS_DISP_TYPE_CD.PAPER_GIFTCARD) {
          giftDispTypeYn = 'Y'
        }

        // 최소 무이자 개월 체크
        if (minInstallCnt > Number(data[i].itemDetailInfo.ifiValue)) {
          minInstallCnt = Number(data[i].itemDetailInfo.ifiValue)
        }
        // 카드 선할인 정보
        if (data[i].itemDetailInfo.cardBnftList && data[i].itemDetailInfo.cardBnftList.length > 0) {
          cardPreDcList = cardPreDcList.concat(data[i].itemDetailInfo.cardBnftList)
        }

        // 예상 적립금 기초data 적재
        if (data[i].goodsDetail.PROM_DC_WAY_PAD === 'AMT' || data[i].goodsDetail.PROM_DC_WAY_PAD === 'RTO') {
          if (data[i].goodsDetail.PROM_VAL_PAD && data[i].goodsDetail.PROM_VAL_PAD !== '') {
            this.paymentData.Discount.setCouponItem(i, 'PAD10100', {
              ListName: 'PAD',
              ImdtDcCpAmt: '', // "개당 적립 예정 금액"
              DiscountPrice: '', // "총 적립 예정 금액" (= ImdtDcCpAmt x 수량)
              PRMT_TYPE_CD: 'PAD', // "PAD" //고정
              WWW_AMT: data[i].goodsDetail.PROM_DC_WAY_PAD === 'AMT' ? data[i].goodsDetail.PROM_VAL_PAD : '0', // "정률일경우 금액"
              WWW_RATE: data[i].goodsDetail.PROM_DC_WAY_PAD === 'RTO' ? data[i].goodsDetail.PROM_VAL_PAD : '0', // "정액일경우 적립율"
              MAX_USE_NUM: '0', // "0" //고정
              DC_TYPE_CD: '10100', // "10100"
              USED_COUPON_QTY: data[i].goodsDetail.QUANTITY, // "수량"
              PRICE: data[i].goodsDetail.PRICE, // 상품 금액
              PROM_VAL_PAD: data[i].goodsDetail.PROM_DC_WAY_PAD, // 정액, 정률 구분
              OFFER_AMT: String(sigOfferAmt) // 가격할인 금액
            })
          }
        }
      } // end for

      // 주문하실상품 주문금액 등 json 데이터에 임시 저장
      this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT = totalProductAmt
      this.globalVal.mOutputDatas.orderPrice.OFFER_AMT = offerAmt
      this.globalVal.mOutputDatas.orderPrice.FINAL_PAYMENT_AMT = finalPaymentAmt
      this.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = totalItemCount
      this.globalVal.mOutputDatas.giftDispTypeYn = giftDispTypeYn
      this.globalVal.mOutputDatas.forecastReservedAmt = forecastReservedAmt
      this.globalVal.mOutputDatas.minInstallCnt = minInstallCnt
      this.globalVal.mOutputDatas.cardPreDcList = cardPreDcList
      // sfinalPaymentAmtSaveExclude 부가결제 수단을 재외한 화면에 뿌려지는 값 세팅
      this.globalVal.mOutputDatas.sfinalPaymentAmtSaveExclude = finalPaymentAmt

      // 결제 금액 정보 노출
      this.globalVal.paymentAmtInfo.totalProductAmt = totalProductAmt // 총 상품금액

      // 폼 데이터에 반영
      this.paymentData.Payment.setItem(0, {
        TOTAL_PRODUCT_AMT: this.globalVal.mOutputDatas.orderPrice.TOTAL_PRODUCT_AMT,
        OFFER_AMT: this.globalVal.mOutputDatas.orderPrice.OFFER_AMT
      })

      this.setFinalPaymentAmount()
    }
  }
}
export default initPaymentAmtMixin
