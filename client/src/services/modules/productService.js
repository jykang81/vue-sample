import nsaxios from '@frameworks/axiosUtil'

export default {
  /**
   * 상품정보 조회
   * @param {Object} params API 요청 파라미터
   * @returns {Promise<Object>} 상품조회 결과 객체
   */
  async getProductInfo (params) {
    return await nsaxios.post('NSProductDetailCmd', params)
  }
}
