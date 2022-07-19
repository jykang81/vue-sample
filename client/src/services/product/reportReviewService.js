import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 신고 등록
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  registerReport (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  }
}
