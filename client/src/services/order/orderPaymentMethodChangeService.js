import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 초기화
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  init (param, successHandling) {
    return axiosUtil.post('NSMypageCmd', param, successHandling)
  },
  /**
   * 상품정보 설정
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  setProductInfo (param, successHandling) {
    return axiosUtil.post('NSOrderPaymentModifyMobile', param, successHandling)
  },
  /**
   * 카드 무이자 할부 리스트 호출
   * @param {Object} param
   * @param {Function} successHandling
   * @param {Function} errorHandling
   * @returns {Promise}
   */
  instmMmsListView (param, successHandling, errorHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling, errorHandling)
  },
  /**
   * 결제승인 요청
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  doPaymentApprovalRequest (param, successHandling) {
    return axiosUtil.post('PaymentApprovalRequestCmd', param, successHandling)
  },
  /**
   * 결제 전 인증 전후 값 로그 적재
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  loadPaymentLogJS (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 가맹점 번호 조회
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  fncGetCardChainId (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 최종 결제 정보 통신
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  gotoPaymentComplete (param, successHandling) {
    return axiosUtil.post('PaymentModifyRequestCmd', param, successHandling)
  },
  /**
   * 주문상태 체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkOrderStatus (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  },
  /**
   * 주문상세상태 체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  chkRcOrderDtlStats (param, successHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling)
  }

}
