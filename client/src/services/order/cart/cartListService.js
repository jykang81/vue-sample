import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 장바구니 상품 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getBasketListInfo (param, successHandling) {
    return axiosUtil.post('NSESBasketMobileCmdReal', param, successHandling)
  },
  /**
   * 수량 변경 API 호출
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  changeQuantity (param, successHandling) {
    return axiosUtil.post('AjaxNSXorderItemAdd4Worklight', param, successHandling)
  },
  /**
   * 상품 삭제
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  deleteProduct (param, successHandling) {
    return axiosUtil.post('AjaxNSXorderItemDelete4Worklight', param, successHandling)
  },
  /**
   * 상품 추천 관련 서비스 호출
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  callNSRcmdCmd (param, successHandling) {
    return axiosUtil.post('NSRcmdCmd', param, successHandling)
  },
  /**
   * 주문서 이동
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  gotoOrderSheet (param, successHandling) {
    return axiosUtil.post('AjaxNSOrderSheet4Worklight', param, successHandling)
  }
}
