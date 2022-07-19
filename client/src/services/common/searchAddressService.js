import nsaxios from '@frameworks/axiosUtil'

export default {
  /**
   * 주소 데이터 정제
   * @param {Object} params API 파라미터
   * @param {Function} successHandler API 통신 성공 후처리
   * @param {Function} failureHandler API 에러 후처리
   * @returns {Promise}
   */
  refining (params, successHandler, failureHandler) {
    return nsaxios.post('NSNewPostSearchCmd', params, successHandler, failureHandler)
  }
}
