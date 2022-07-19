import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 띠배너
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  nsEspotCommon (param, successHandling) {
    return axiosUtil.post('NSEspotCommon', param, successHandling)
  },
  /**
   * NS ajax 로그아웃처리
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  nsAjaxLogOut (param, successHandling) {
    return axiosUtil.post('NSAjaxLogOutCmd', param, successHandling)
  }
}
