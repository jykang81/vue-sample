import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상품목록 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getDCDeliveryProducts (param, successHandling) {
    return axiosUtil.post('NSSearchDCDeliveryWrapper', param, successHandling)
  }
}
