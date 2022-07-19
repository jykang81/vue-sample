import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상품평 작성 페이지 데이터 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getUnregisteredList (param, successHandling) {
    return axiosUtil.post('NotYetProductReviewedListReal', param, successHandling)
  },
  /**
   * 내 상품평 페이지 데이터 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getRegisteredList (param, successHandling) {
    return axiosUtil.post('ReviewListReal', param, successHandling)
  },
  /**
   * 사진 상품평 리스트 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getPhotoList (param, successHandling) {
    return axiosUtil.post('NSAjaxCustomerReview', param, successHandling)
  }
}
