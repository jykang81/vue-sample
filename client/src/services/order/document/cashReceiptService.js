import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 현금영수증 목록 API Call 함수
   * @param {Object} param
   * @param {Function} successHandling
   * @param {Function} errorHandling
   * @returns {Promise}
   */
  callCashReceiptList (param, successHandling, errorHandling) {
    return axiosUtil.post('NSIssueReceiptCmd', param, successHandling, errorHandling)
  }
}
