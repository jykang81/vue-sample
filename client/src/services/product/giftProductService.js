import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 사은품 남은 수량 체크
   * @param {Object} param
   * @param {Function} successHandling
   * @returns {Promise}
   */
  checkRemainedGiftCount (param, successHandling) {
    return axiosUtil.post('NSItemDetailRemainCntAjax', param, successHandling)
  }
}
