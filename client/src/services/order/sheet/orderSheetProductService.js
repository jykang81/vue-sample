import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 배송지정일 날짜 출력
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  deliveryDateView (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
