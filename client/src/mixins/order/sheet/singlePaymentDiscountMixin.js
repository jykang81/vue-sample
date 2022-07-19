import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import {
  insertCommas,
  isNull
} from '@utils/commonutil/commonUtil'
import toastUtil from '@frameworks/toastUtil'

/**
 * singlePaymentDiscountMixin
 */
const singlePaymentDiscountMixin = {
  methods: {
    /**
     * 일시불 할인 설정
     * @returns {void}
     */
    setSinglePaymentDiscount () {
      // (NSSR-19278 주문결제페이지 내 일시불할인 자동적용) - 카드선택 시 일시불이 기본이므로 일시불할인 체크해준다.
      if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
        if (!this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
          // 카드일시불할인 항목 사용가능여부 체크
          let totalLspRate = 0
          for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
            const imdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
            totalLspRate += Number(imdtDcCpAmt.PROM_VAL_LSP_RATE)
          }

          if (totalLspRate !== 0 && this.globalVal.mOutputDatas.msg.OrderGoodList[0].itemDetailInfo.lumpsumdcExcptYn !== 'Y') {
            this.globalVal.discountInfo.checkedSinglePaymentDiscount = true
            this.onchangeSinglePaymentDiscount()
          }
        }
      }
    },
    /**
     * 카드일시불할인 checkbox (ASIS: onchange_singlePaymentDiscount)
     * @param {String} mode - 일시불할인 toast 메시지 제외 구분
     * @returns {void}
     */
    onchangeSinglePaymentDiscount (mode) {
      if (this.globalVal.discountInfo.showSinglePaymentDiscount) {
        try {
          if (!this.globalVal.mOutputDatas || !this.globalVal.mOutputDatas.msg) {
            return false
          }
          if (this.globalVal.discountInfo.checkedSinglePaymentDiscount) {
            const singlePaymentDiscountAmt = this.calcSinglePaymentDiscount()
            /*
            * -(NSSR-19278 주문결제페이지 내 일시불할인 자동적용) 일시불 불가한 결제수단(네이버페이)에서 일시불 쿠폰을 선택한 경우
            * 무이자할부의 수수료율이 높아서 일시불쿠폰으로 일시불 유도하는 것으로 신용카드 외의 결제수단도 해당 혜택을 주게 되어 있었음.
            * 간편결제의 경우(페이코,네이버페이) PG창 내에서 할부 선택이 가능하여 제외하고 있었으나 NS의 정산 기준으로는 일시불과 동일하여 일시불쿠폰 적용 허용 (단, 네이버페이의 경우 수수료율이 높아 제외)
            * NSSR-37566 페이코 일시불 불가한 결제수단 추가.
            */
            if (PAY_TYPE_CONST.isNaverpay(this.globalVal.paymentMethodInfo.paymentMethod)) {
              const strConfirmMsg = '네이버페이는 일시불할인 적용이 불가능한 결제수단입니다.' +
                '신용카드를 선택하여 일시불 할인을 받으시겠습니까?'
              messageUtil.confirm(strConfirmMsg, () => {
                // 확인 - 결제수단 초기화
                this.$root.$emit('clearPaymentMethodEmit')
              }, () => {
                // 취소
                this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
                this.onchangeSinglePaymentDiscount()
              }, '확인', '취소')
            } else if (PAY_TYPE_CONST.isPayco(this.globalVal.paymentMethodInfo.paymentMethod)) {
              const strConfirmMsg = 'PAYCO는 일시불할인 적용이 불가능한 결제수단입니다.' +
              '신용카드를 선택하여 일시불 할인을 받으시겠습니까?'
              messageUtil.confirm(strConfirmMsg, () => {
                // 확인 - 결제수단 초기화
                this.$root.$emit('clearPaymentMethodEmit')
              }, () => {
                // 취소
                this.globalVal.discountInfo.checkedSinglePaymentDiscount = false
                this.onchangeSinglePaymentDiscount()
              }, '확인', '취소')
            } else {
              if (mode !== 'checkOtherPaymentMethod') {
                const strConfirmMsg = `일시불할인 ${insertCommas(singlePaymentDiscountAmt)}원이 적용됩니다`
                toastUtil.show(strConfirmMsg)
              }
            }

            if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
              if (!isNull(this.swiperNspay.selectedItem)) {
                const elCardQuota = this.$refs[`nspayCardQuota${this.swiperNspay.selectedItem.activeIndex}`]
                if (!isNull(elCardQuota) && !isNull(elCardQuota[0])) {
                  elCardQuota[0].value = '00'
                }

                this.swiperNspay.selectedItem.quota = '00'
                this.swiperNspay.selectedItem.noinstYn = 'N'
              }
            }
          } else {
            if (this.paymentData.Payment.getItem(0).cardDcAmt !== '0') {
              const strConfirmMsg = `일시불할인 ${insertCommas(this.paymentData.Payment.getItem(0).cardDcAmt)}원이 취소됩니다`
              toastUtil.show(strConfirmMsg)
            }

            this.disabledEpNoinstFlagY = false
            this.disabledEpQuota = false

            // 저장된 일시불할인 쿠폰정보 삭제
            for (let k = 0; k < this.paymentData.Discount.size(); k++) {
              this.paymentData.Discount.removeCouponItem(k, this.globalVal.CONST.DISCOUNT_CARD_LSP_INDEX) // 카드일시불할인 삭제
            }
            this.globalVal.discountCardChoice.discountCardLsp = false
          }

          // 할인금액 정보 출력
          this.setDiscountAmount()

          // 일시불 할인 체크 시에 기존에 셋팅해 놓은 적립금으로 인해 결제금액이 마이너스가 될 수 있음.
          if (this.globalVal.discountInfo.checkedSinglePaymentDiscount &&
                this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT < 0 &&
                this.paymentData.Payment.getItem(0).Additionalpaymentamount > 0) {
            this.$root.$emit('useAmtCancelEmit')
            const strConfirmMsg = '적립금/예치금을 다시 체크해 주세요.'
            toastUtil.show(strConfirmMsg)
          }

          // 쿠폰등의 조건이 변경되면 적립금/예치금등의 모든 셋팅이 취소되는게 기존 프로세스이나 일시불할인에 한하여 취소 해제  - end
        } catch (e) {
          console.error(e)
          messageUtil.alert('일시적인 서비스 장애로 인하여 서비스 이용이 원활하지 않습니다.', () => {
            routerUtil.back()
          })
        }
      }
    },
    /**
     * 일시불할인금액계산 (ASIS: calc_singlePaymentDiscount)
     * @returns {void}
     */
    calcSinglePaymentDiscount () {
      let totalDiscountPrice = 0
      const discountItem = []
      const discountCouponItem = []

      // 카드일시불할인 금액 계산
      for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
        const busChnId = this.globalVal.mOutputDatas.msg.OrderGoodList[i].itemDetailInfo.busChnId
        const goodsDetail = this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail
        const imdtDcCpAmt = this.globalVal.mOutputDatas.msg.ImdtDcCpAmtList[goodsDetail.ORDERITEMS_ID] // 매가할인 리스트
        const tLspRate = Number(imdtDcCpAmt.PROM_VAL_LSP_RATE)

        if (tLspRate !== 0) {
          // 할인 금액 계산
          const savedDiscountPrice = this.paymentData.Discount.getItemDiscountPrice(i) // 주문상품에 적용된 할인금액
          const basePrice = (goodsDetail.ITEMPRICE - Number(imdtDcCpAmt.PROM_VAL_CPC)) - savedDiscountPrice
          let discountPrice = 0

          if (busChnId === 'TV' || busChnId === 'TCOMM' || busChnId === 'CTCOM') { // TV홈쇼핑 상품일 경우 정률로 계산한다.
            discountPrice = tLspRate
          } else {
            discountPrice = basePrice * (tLspRate / 100)
          }
          const singleDiscountPrice = Math.ceil(Math.round(discountPrice) / 10) * 10
          discountPrice = singleDiscountPrice * goodsDetail.QUANTITY

          discountItem.push({
            orderItemId: goodsDetail.ORDERITEMS_ID,
            CATENTRY_ID: goodsDetail.CATENTRY_ID_CHILD
          })

          discountCouponItem.push({
            ListName: 'LSP',
            ImdtDcCpAmt: String(singleDiscountPrice),
            DiscountPrice: String(discountPrice),
            PRMT_TYPE_CD: this.paymentData.Discount.getDefineValue('PRMT_TYPE_CD', 'LSP'), // 프로모션타입코드
            DC_TYPE_CD: this.paymentData.Discount.getDefineValue('DC_TYPE_CD', 'LSP'), // 할인타입코드
            WWW_RATE: String(tLspRate),
            WWW_AMT: '0',
            MAX_USE_NUM: '0',
            USED_COUPON_QTY: String(goodsDetail.QUANTITY)
          })
          totalDiscountPrice += discountPrice
        }
      }

      const currentPayType = this.globalVal.paymentMethodInfo.currentPayType
      if (PAY_TYPE_CONST.isCreditCard(currentPayType) &&
          !isNull(this.globalVal.paymentMethodInfo.epCardCode)) {
        const name = this.globalVal.paymentMethodInfo.epCardText
        this.globalVal.paymentMethodInfo.epQuota = '00'
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(currentPayType, name, '일시불')
      } else if (PAY_TYPE_CONST.isNSPayCreditCard(currentPayType) &&
                  !isNull(this.globalVal.paymentMethodInfo.selectedNspay.item)) {
        const name = this.getNspayCardCiList().getName(this.globalVal.paymentMethodInfo.selectedNspay.item.bankCardCode)
        this.globalVal.paymentMethodInfo.selectedNspay.item.quota = '00'
        this.globalVal.paymentMethodInfo.paymentMethodTitle = PAY_TYPE_CONST.getTmplTitle(currentPayType, name, '일시불')
      }

      // 결제금액 계산 오류 이슈로 수정
      for (let i = 0; i < this.globalVal.mOutputDatas.msg.OrderGoodList.length; i++) {
        for (let j = 0; j < discountItem.length; j++) {
          if (this.paymentData.Discount.getItem(i).orderItemId === discountItem[j].orderItemId) {
            this.paymentData.Discount.setItem(i, discountItem[j])
            this.paymentData.Discount.setCouponItem(i, this.globalVal.CONST.DISCOUNT_CARD_LSP_INDEX, discountCouponItem[j])
          }
        }
      }

      this.globalVal.discountCardChoice.discountCardLsp = true

      return totalDiscountPrice
    },
    /**
     * 이전 결제수단이 페이코/네이버 결제일때 신용카드_일시불 할인이 큰경우 신용카드 설정
     * @returns {void}
     */
    setCardByOtherPaymentMethod () {
      this.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      this.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.CREDIT_CARD
      this.globalVal.paymentMethodInfo.wrongMessage = ''
      this.globalVal.paymentMethodInfo.epQuota = '00'
      this.globalVal.paymentMethodInfo.paymentMethodTitle = '결제수단을 선택해 주세요.'
    }
  }
}
export default singlePaymentDiscountMixin
