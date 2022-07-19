import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 저장 버튼 클릭
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickSetAddressBtn (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 배송주소록 추가
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  insertShippingAddress (param, successHandling) {
    return axiosUtil.post('NSShippingAddressAccessCmdReal', param, successHandling)
  },
  /**
   * 배송주소록 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getShipAddrList (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
