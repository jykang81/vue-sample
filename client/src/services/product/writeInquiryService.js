import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상품문의 등록
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  registerInquiry (param, successHandling) {
    return axiosUtil.post('NSAjaxQna', param, successHandling)
  }
}
