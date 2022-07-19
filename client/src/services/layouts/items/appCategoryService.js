import axiosUtil from '@frameworks/axiosUtil'

export default {
  /**
   * GNB 정보 조회 API
   * @returns {Promise}
   */
  fetchGNBInfomation () {
    const parameters = {
      typeFlag: 'espot',
      espotInfo: 'EZ_GNB|Menu'
    }

    return axiosUtil.post('NSMobHomeView', parameters)
  },
  /**
   * slot 매장의 categoryId가 유효한지 판단하기 위한 데이터 셋팅. - (현업에서 생성한 GNB메뉴(NSMobHomeView : EZ_GNB...)의 유효성 검사.
   */
  setPLCategoryInfo () {
    const param = {
      layoutAppGubun: 'HUB'
    }
    // 카테고리 정보 조회
    return axiosUtil.post('NSmobilePLCategoryInfo', param)
  }
}
