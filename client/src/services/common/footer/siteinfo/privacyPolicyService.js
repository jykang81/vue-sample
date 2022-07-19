import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 개인정보처리방침 조회
   * @param {Object} param API 요청 파라미터
   * @returns {Promise}
   */
  fetchPrivacyPolicy (param) {
    return axiosUtil.post('PrivateContentGuideReal', param)
  }
}
