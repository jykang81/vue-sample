import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 최근 배송 메세지 목록 호출
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickGetCustDeliveryMsg (param, successHandling) {
    return axiosUtil.post('NSCustDeliveryMsg', param, successHandling)
  }
}
