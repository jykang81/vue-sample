import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * axios request config (https://github.com/axios/axios#request-config)
   * @typedef {Object} RequestConfig
   * @property {String} url
   * @property {String} method
   * @property {Object} [headers]
   * @property {Object} [data]
   */

  /**
   * 상품평 작성하기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  writeReview (param, successHandling) {
    return axiosUtil.post('NSAjaxCustomerReview', param, successHandling)
  },
  /**
   * 상품평 수정하기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  modifyReview (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  },
  /**
   * 이미지 등록
   * @param {RequestConfig} config
   * @returns {Promise}
   */
  execUploadFiles (config) {
    return axiosUtil.request(config)
  },
  /**
   * 수정일 경우 기존 작성된 리뷰 가져오기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getWirtedReview (param, successHandling) {
    return axiosUtil.post('NSAjaxProductReview', param, successHandling)
  }
}
