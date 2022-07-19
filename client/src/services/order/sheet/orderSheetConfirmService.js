import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 결제하기 After
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  onclickAfterPayment (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  }
}
