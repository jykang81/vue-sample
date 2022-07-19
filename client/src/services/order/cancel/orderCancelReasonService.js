import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 취소사유,교환사유,반품사유 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getReason (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
