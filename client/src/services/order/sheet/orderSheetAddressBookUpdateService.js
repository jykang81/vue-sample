import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 저장 버튼
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickSaveBtn (param, successHandling) {
    return axiosUtil.post('NSShippingAddressAccessCmdReal', param, successHandling)
  },
  /**
   * 삭제 버튼
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickDeleteBtn (param, successHandling) {
    return axiosUtil.post('NSShippingAddressAccessCmdReal', param, successHandling)
  }
}
