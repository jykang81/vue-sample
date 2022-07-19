import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * RC DB와 주문 상세가 다른 경우 체크 통신 (주문취소)
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  orderCancelChkRcOrderDtlStats (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 상담원 처리 유무 체크 통신 (주문취소)
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  orderCanceclCheckOrderStatus (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 배송지 변경
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  changeAddress (param, successHandling) {
    return axiosUtil.post('NSOrderDeliveryModifyCmdMobile', param, successHandling)
  },
  /**
   * RC DB와 주문 상세가 다른 경우 체크 통신 (배송지 변경)
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  changeAddressChkRcOrderDtlStats (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 상담원 처리 유무 체크 통신 (배송지 변경)
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  changeAddressCheckOrderStatus (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 수취확인
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickDeliveryConfirm (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 배송조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickDeliveryHistory (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 반품신청
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickRefundOrder (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 장바구니 담기
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  clickAddCart (param, successHandling) {
    return axiosUtil.post('NSAjaxMypageCmd', param, successHandling)
  }
}
