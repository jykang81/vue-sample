import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 문의글 목록 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getQAList (param, successHandling) {
    return axiosUtil.post('GoodsQnAReal', param, successHandling)
  }
}
