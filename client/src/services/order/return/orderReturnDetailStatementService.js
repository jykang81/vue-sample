import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상세 정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getDetailData (param, successHandling) {
    return axiosUtil.post('NSChangeOrderCmd', param, successHandling)
  }
}
