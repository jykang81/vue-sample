import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * ESPOT 정보 조회
   * @param {Object} param ESPOT 정보 조회 파라미터
   * @param {Function} successHandler 통신 후처리
   * @returns {Promise} Promise
   */
  getEspotData (param, successHandler) {
    return axiosUtil.post('NSFixedShopCmd', param, successHandler)
  },
  /**
   * ESPOT 정보 조회 (캐쉬를 사용하지 않음.)
   * @param {Object} param ESPOT 정보 조회 파라미터
   * @param {Function} successHandler 통신 후처리
   * @returns {Promise} Promise
   */
  getEspotDataNoCache (param, successHandler) {
    return axiosUtil.post('NSFixedShopNoCacheCmd', param, successHandler)
  }
}
