import COMM_CONST from '@constants/framework/constants'
import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import {
  extend,
  isOsApp
} from '@utils/commonutil/commonUtil'
import nsaxios from '@frameworks/axiosUtil'

/**
 * 결제 승인 요청
 * onclick_btnPayment -> (ASIS) doPaymentApprovalRequest
 */
const doPaymentApprovalRequestMixin = {
  methods: {
    /**
     * 결제 승인 요청
     * @param {Object} param - 결제 승인 요청 파라미터
     * @param {Function} callback - 결제 승인 요청 후 실행 Function
     * @returns {void}
     */
    doPaymentApprovalRequest (param, callback) {
      // NSPAY 원터치 설정 을 위한 주소ID적제
      const selectDlyList = this.paymentData.Delivery.deliveryList
      const addressIdList = []

      for (let i = 0; i < selectDlyList.length; i++) {
        addressIdList.push(selectDlyList[i].ADDRESS_ID)
      }

      // 계정계 수정으로 dispTypeCd 추가
      param = extend({
        userId: this.globalVal.mOutputDatas.msg.UserInfo.USERS_ID,
        orderId: this.globalVal.mInputParams.orderId,
        ordersId: this.globalVal.mInputParams.orderId,
        originOrdersId: this.globalVal.mInputParams.orderId,
        custNum: this.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER,
        userNm: this.paymentData.OrderUserInfo.getItem().LASTNAME,
        loginId: this.globalVal.mOutputDatas.msg.UserInfo.LOGONID,
        co_cd: COMM_CONST.getCocd(),
        dispTypeCd: this.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD,
        payCertAddressList: addressIdList.join(',')
      }, param)

      if (PAY_TYPE_CONST.isNSPayCreditCard(this.globalVal.paymentMethodInfo.paymentMethod) ||
          PAY_TYPE_CONST.isNSPayAccountTransfer(this.globalVal.paymentMethodInfo.paymentMethod)) {
        param = extend({
          discountList: this.paymentData.Discount.toJSON()
        }, param)
      }

      // vdn_cd (모바일 주문 접수 응대 번호) 데이터 다음 API 호출 시 추가
      if (isOsApp()) { // App
        param.vdn_cd = '54101'
      } else { // Web
        param.vdn_cd = '54102'
      }

      nsaxios.post('PaymentApprovalRequestCmd', param, callback)
    }
  }
}
export default doPaymentApprovalRequestMixin
