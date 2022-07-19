import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 반품사유 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getReason (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 수거가능지역 여부 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkPickupAddress (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 반품정보 설정
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  setRefundData (param, successHandling) {
    return axiosUtil.post('NSChangeOrderCmd', param, successHandling)
  }
}
