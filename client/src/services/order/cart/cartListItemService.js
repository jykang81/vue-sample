import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 바로구매
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  orderProductEach (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  }
}
