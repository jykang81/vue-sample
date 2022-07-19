import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 장바구니 담기 전 또는 바로주문 전에 해당 상품의 쿠폰을 다운로드한다.
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  execCouponAutoSave (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  },
  /**
   * 단품의 남아있는 상품 개수를 가져온다.
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getRemainedCatEntry (param, successHandling) {
    return axiosUtil.post('NSItemDetailRemainCntAjax', param, successHandling)
  },
  /**
   * 장바구니 내 같은 상품이 있을 경우 합산 수량을 체크한다.
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  getCartInfoList (param, successHandling) {
    return axiosUtil.post('NSBasketMobileCmdReal', param, successHandling)
  },
  /**
   * 장바구니 담기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  addCartInfo (param, successHandling) {
    return axiosUtil.post('AjaxNSXorderItemAdd4Worklight', param, successHandling)
  },
  /**
   * 최대 구매수량 체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkMaxCount (param, successHandling) {
    return axiosUtil.post('NSItemDetailAjax', param, successHandling)
  },
  /**
   * 바로주문
   * @param {String} tranId
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkLoginStatus (tranId, param, successHandling) {
    return axiosUtil.post(tranId, param, successHandling)
  },
  /**
   * 옵션 선택시 이벤트
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  selectOptionIndex (param, successHandling) {
    return axiosUtil.post('NSItemDetailRemainCntAjax', param, successHandling)
  }
}
