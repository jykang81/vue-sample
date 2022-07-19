import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 주문서정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getOrderPaymentInfo (param, successHandling) {
    return axiosUtil.post('NSOrderPaymentMobile', param, successHandling)
  },
  /**
   * 회원 비회원 여부에 따른 월 주문 금액 조회 후 처리
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  shoppingAmtLimitCheck (param, successHandling) {
    return axiosUtil.post('ShoppingAmtLimitCheckCmd', param, successHandling)
  },
  /**
   * 월 한도금액 이상 주문하려고 할 경우 주문 불가 체크 통신
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  shoppingLimitCheck (param, successHandling) {
    return axiosUtil.post('ShoppingLimitCheckCmd', param, successHandling)
  },
  /**
   * 마지막 현금영수증 상태 설정
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  setLastCashReceipt (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
