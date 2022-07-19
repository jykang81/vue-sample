import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 신청하기 버튼 선택시 Call되는 함수
   * @param {Object} param
   * @param {Function} successHandling
   * @param {Function} errorHandling
   * @returns {Promise}
   */
  onClickSubmit (param, successHandling, errorHandling) {
    return axiosUtil.post('NSMypageCommCmd', param, successHandling, errorHandling)
  }
}
