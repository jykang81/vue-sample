import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 전화번호 받아옴
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getAlarmInfoMobile (param, successHandling) {
    return axiosUtil.post('TVHomeShoppingAjax', param, successHandling)
  },
  /**
   * 티컴상품 방송알림 등록
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  registerTcomAlarmSettings (param, successHandling) {
    return axiosUtil.post('NSShopPlusAlarmReal', param, successHandling)
  },
  /**
   * 방송알람 등록
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  registerTvAlarmSettings (param, successHandling) {
    return axiosUtil.post('TVHomeShoppingAjax', param, successHandling)
  }
}
