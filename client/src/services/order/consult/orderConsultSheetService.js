import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 고객정보 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getCustomer (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  },
  /**
   * 배송지정보 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getShippingAddress (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  }
}
