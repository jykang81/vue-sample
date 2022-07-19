import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상담원 처리 유무 체크 통신
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkOrderStatus (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * RC DB와 주문 상세가 다른 경우 체크 통신
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  chkRcOrderDtlStats (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 최종 주문상태 변경 체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkFinalOrderStatus (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 주문취소/교환/반품 요청.
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  doModifyOrderCmd (param, successHandling) {
    return axiosUtil.post('NSChangeOrderCmd', param, successHandling)
  }
}
