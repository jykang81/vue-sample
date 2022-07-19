import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 상품문의 상세 조회
   * @param {Object} param API 요청 매개변수
   * @returns {Promise}
   */
  fetchProductQnaDetail (param) {
    return axiosUtil.post('QuestionItemDetailCmd', param)
  },
  /**
   * 1:1 문의 상세 조회
   * @param {Object} param API 요청 매개변수
   * @returns {Promise}
   */
  fetchBoardQnaDetail (param) {
    return axiosUtil.post('QnaDetailReal', param)
  }
}
