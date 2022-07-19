import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 반품신청완료
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  onclickComplete (param, successHandling) {
    return axiosUtil.post('NSChangeOrderCmd', param, successHandling)
  }
}
