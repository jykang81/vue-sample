import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 배송주소록 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getShipAddrList (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 도서산간 배송가능 여부 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getShippingCharge (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 도서산간 지역체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getIslandmountain (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 배송비 계산 api 통신
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  doShippingChargeCmd (param, successHandling) {
    return axiosUtil.post('NSShippingChargeCmd', param, successHandling)
  }
}
