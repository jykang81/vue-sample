import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 처음 시/도 정보를 가지고 오는 곳
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getSafeCity (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 시/도 변경 시
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  changeAddrCitySelect (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 검색 버튼 클릭 시
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickSearchDetailAddrBtn (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }
}
