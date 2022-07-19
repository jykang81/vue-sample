import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import MESSAGES from '@constants/framework/messages'
import {
  getBdDay
} from '@frameworks/dateutil/dateUtil'
import messageUtil from '@frameworks/messageUtil'
import routerUtil from '@frameworks/routerUtil'
import bizUtil from '@utils/bizUtil'
import {
  viewType,
  iOSVersionCheck
} from '@utils/commonutil/commonUtil'
import modalUtil from '@frameworks/modalUtil'
import uiUtil from '@utils/uiUtil'

/**
 * PrecheckPaymentMixin
 * onclick_btnPayment -> (ASIS) ios결제오류 수정, 슈퍼핫딜(플래시세일) 기간 체크
 */
const precheckPaymentMixin = {
  methods: {
    /**
     * 결제전 사전체크 (precheckPayment)
     * @returns {void}
     */
    precheckPayment () {
      if (!this.globalVal.confirmInfo.isCheckAgreePurchage) {
        messageUtil.alert('전자상거래법 제8조 제2항에 동의하셔야 합니다.')
        this.globalVal.activeDoubleClick = false
        return false
      }

      if (this.globalVal.paymentMethodInfo.paymentMethod === '0') {
        this.globalVal.activeDoubleClick = false
        this.globalVal.paymentMethodInfo.wrongMessage = '필수 입력사항입니다. 선택해 주세요.'
        uiUtil.scrollMove('payment_method', uiUtil.EL_SCROLL_MOVE_APP_HEADER)
        return false
      }

      // ios결제오류 수정
      if (PAY_TYPE_CONST.isCreditCard(this.globalVal.paymentMethodInfo.paymentMethod)) {
        if (viewType() === 'ios') {
          const iosVersion = iOSVersionCheck()
          const version = '1.0' // TODO: (ASIS) WL.Client.getAppProperty('APP_VERSION').replace(/\./gi, '')
          const iosNum = iosVersion.replace('.', '').replace('.', '')
          if (Number(version) <= 299) {
            if (Number(iosNum) >= 1031) {
              messageUtil.alert('현재 버전에서는 카드결제가 불가합니다. \n 최신 버전으로 업데이트 해주시기 바랍니다.')
              this.globalVal.activeDoubleClick = false
              return false
            }
          }
        }
      }

      if (this.globalVal.maximumPurchaseQuantityFlag) {
        messageUtil.alert('주문 상품중 구매 수량 제한상품이<br> 주문 가능 수량을 초과하였습니다.', () => {
          routerUtil.back()
        })
        this.globalVal.activeDoubleClick = false
      }

      if (!this.globalVal.mOutputDatas || !this.globalVal.mOutputDatas.msg) {
        messageUtil.alert(MESSAGES.PROCEDURE_ERROR)
        this.globalVal.activeDoubleClick = false
        return false
      }

      if (this.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT < 0) {
        messageUtil.alert('결제금액을 정확히 입력해주시기 바랍니다.')
        this.globalVal.activeDoubleClick = false
        return false
      }

      let nTotalCount = 0
      for (let i = 0; this.globalVal.mOutputDatas.msg.OrderGoodList.length > i; i++) {
        const goodsDetail = this.globalVal.mOutputDatas.msg.OrderGoodList[i].goodsDetail

        // 슈퍼핫딜(플래시세일) 기간 체크
        if (goodsDetail.FLASH_SALE_YN === 'Y') {
          if (this.globalVal.discountInfo.flashSaleEnddd === '' || getBdDay(this.globalVal.discountInfo.flashSaleEnddd)) {
            // true 기간이 남은 경우 별도 동작하지 않음
          } else {
            // 기간이 지난경우 메인 이동
            messageUtil.alert(`${goodsDetail.XCATENTRY_DISP_NAME} 상품의 마감시간이 지났습니다.`, () => {
              bizUtil.gotoMain()
            })
            this.globalVal.activeDoubleClick = false
            return false
          }
        }
        nTotalCount += Number(goodsDetail.QUANTITY)
      }

      // 장바구니 여러개 구매시 제주도/도서산간 상품이 섞여 있을 때 주소에 따라 각 상품 배송 여부를 판단해서
      // 배송지 대비 상품이 배송불가 상품이 포함되어 있으면 배송불가로 변경하는 부분
      // 배송지 개선 - 도서산간 체크
      if (this.globalVal.deliveryInfo.bDeliveryYn === 'N') {
        if (this.globalVal.deliveryInfo.isPopOpenYn === 'Y' && this.globalVal.from === this.globalVal.CONST.FROM_CART) {
          const callback = result => {
            this.$nextTick(() => {
              this.clickAddressBookLink()
            })
          }

          modalUtil.show('order/sheet/OrderSheetRmaCheck', { globalVal: this.globalVal, items: this.paymentData.Delivery.deliveryList[0].ITEMS }, callback)
          this.globalVal.activeDoubleClick = false
          return false
        } else {
          messageUtil.alert('도서산간 지역 배송 안내\n도서산간 지역으로 배송되지 않습니다.', () => {}, '확인')
          this.globalVal.activeDoubleClick = false
          return false
        }
      }

      if (nTotalCount >= 100) {
        messageUtil.alert('1회 최대 구매 가능 수량은 99개 까지입니다.')
        this.globalVal.activeDoubleClick = false
        return false
      }

      return true
    }
  }
}
export default precheckPaymentMixin
