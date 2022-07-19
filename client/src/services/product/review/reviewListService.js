import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상품평 신고 가능 여부 체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkReportable (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  },
  /**
   * 상품평 작성 가능 여부 api 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getCustomerReviewWritable (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  },
  /**
   * 상품평목록 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getCustomerReview (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  },
  /**
   * 상품평 평가
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  setUsefulYn (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  },
  /**
   * 상품평 이미지리스트 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getCustomerReviewPhotoList (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  }
}
