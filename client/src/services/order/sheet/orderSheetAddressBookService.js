import axiosUtil from '@frameworks/axiosUtil'

export default {
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
