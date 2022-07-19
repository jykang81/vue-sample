import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * 협력사 목록 조회
   * @returns {Promise}
   */
  fetchCooperativeCompanies () {
    return axiosUtil.post('CnsgnmntBizPrtnrM', {})
  }
}
