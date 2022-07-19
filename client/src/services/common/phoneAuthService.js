import nsaxios from '@frameworks/axiosUtil'

export default {
  /**
   * 인증번호 발송 (아이디 찾기용)
   * @param {Object} apiParams
   * @param {Function} successHandling
   * @param {Function} errorHandling
   */
  async sendVerificationCodeFindID (apiParams, successHandling, errorHandling) {
    apiParams.authnumber = ''
    apiParams.mode = 'S'
    apiParams.type = 'P'
    apiParams.mobAPI = 'NSIDCheckMoblieCmdReal'

    await nsaxios.post('NSIDCheckMoblieCmdReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 비밀번호용 인증코드 발송
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  sendVerificationCodeFindPass (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSPWCheckMoblieCmdReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 회원가입용 인증코드 발송
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  sendVerificationCodeMemberJoin (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NsMobileMemberSignupCmd', apiParams, successHandling, errorHandling)
  },
  /**
   * 회원정보수정용 인증코드 발송
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  sendVerificationCodeMemberModify (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSPhoneChangeReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 주문서용 인증코드 발송
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  sendVerificationCodeOrder (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSPhoneCheckMoblieCmdReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 아이다칮기용 인증번호확인
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  checkVerificationCodeFindID (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSIDCheckMoblieCmdReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 비밀번호찾기용 인증번호확인
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  checkVerificationCodeFindPassword (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSPWCheckMoblieCmdReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 회원가입용 인증번호확인
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  checkVerificationCodeMemberJoin (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NsMobileMemberSignupCmd', apiParams, successHandling, errorHandling)
  },
  /**
   * 회원정보수정용 인증번호확인
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  checkVerificationCodeMemberModify (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSPhoneChangeReal', apiParams, successHandling, errorHandling)
  },
  /**
   * 주문서용 인증번호확인
   * @param {Object} apiParams API 파라미터
   * @param {Function} successHandling API 통신 성공 후처리
   * @param {Function} errorHandling API 에러 후처리
   * @returns {Promise}
   */
  checkVerificationCodeOrder (apiParams, successHandling, errorHandling) {
    return nsaxios.post('NSPhoneCheckMoblieCmdReal', apiParams, successHandling, errorHandling)
  }
}
