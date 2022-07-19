import nsaxios from '@frameworks/axiosUtil'

export default {
  /**
   * 해피딜 카테고리 조회
   * @param {Object} param API 요청 파라미터
   * @param {Function} successHandling API 통신 후처리
   * @returns {Promise}
   */
  getCategory (param, successHandling) {
    return nsaxios.post('NSFixedShopCmd', param, successHandling)
  }
}
