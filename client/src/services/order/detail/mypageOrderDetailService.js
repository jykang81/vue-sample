import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 주문 상세정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getOrdersDetailInfo (param, successHandling) {
    return axiosUtil.post('NSMypageCmd', param, successHandling)
  },
  /**
   * 배송지 변경
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  changeAddress (param, successHandling) {
    return axiosUtil.post('NSOrderDeliveryModifyCmdMobile', param, successHandling)
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
   * 상담원 처리 유무 체크 통신
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkOrderStatus (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
