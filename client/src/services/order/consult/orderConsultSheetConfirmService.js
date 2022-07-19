import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상담신청 확인요청
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  requestConsultConfirm (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  },
  /**
   * 상담신청
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  executeCunsult (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  }
}
