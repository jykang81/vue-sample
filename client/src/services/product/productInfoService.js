import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 방송알리미 페이지로 이동 / 알림 등록 삭제
   * @param {Object} param
   * @param {Function} successHandling
   * @param {Function} errorHandling
   * @returns {Promise}
   */
  clickBroadAlarm (param, successHandling, errorHandling) {
    return axiosUtil.post('DeleteAlarmReal', param, successHandling, errorHandling)
  },
  /**
   * 상품상세정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getProductDetail (param, successHandling) {
    return axiosUtil.post('DetailProductViewReal', param, successHandling)
  },
  /**
   * 샵플러스 라이브 방송 정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  callNSMobHomeViewShpoplusLive (param, successHandling) {
    return axiosUtil.post('NSFixedShopNoCacheCmd', param, successHandling)
  },
  /**
   * 라이브 방송 정보 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  callNSMobHomeViewLive (param, successHandling) {
    return axiosUtil.post('NSFixedShopNoCacheCmd', param, successHandling)
  }
}
