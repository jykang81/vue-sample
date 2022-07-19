import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상품문의 건 수
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getQAList (param, successHandling) {
    return axiosUtil.post('GoodsQnAReal', param, successHandling)
  },
  /**
   * 상품평 요약정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getProductReview (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  },
  /**
   * 상품상세정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getProductDetail (param, successHandling) {
    return axiosUtil.post('DetailProductViewReal', param, successHandling)
  },
  /**
   * 상품기술서 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getMoreGeneralInfo (param, successHandling) {
    return axiosUtil.post('NSItemDetailGoodsGuide', param, successHandling)
  },
  /**
   * 추천영역 api 호출
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getRecommendData (param, successHandling) {
    return axiosUtil.post('RecobellRecommend', param, successHandling)
  }
}
