import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 반품할 상품정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getRefundOrderForm (param, successHandling) {
    return axiosUtil.post('NSChangeOrderCmd', param, successHandling)
  }
}
