import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 주문취소/교환/반품 요청.
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  doModifyOrderCmd (param, successHandling) {
    return axiosUtil.post('NSChangeOrderCmd', param, successHandling)
  },
  /**
   * 변경정보 확인 및 결제 준비 후처리 (2단계)
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  responseOrderPayment (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
