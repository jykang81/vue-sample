import DEFAULT_ICON from '@/assets/images/common/icons_myHistory.png'
import COMMON_CONST from '@constants/common/common'
import bizUtil from '@/common/utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import {
  getImageUrl
} from '@utils/commonutil/commonUtil'

export default {
  namespaced: true,
  state: {
    icon: DEFAULT_ICON
  },
  mutations: {
    /**
     * 쇼핑 히스토리 아이콘 설정
     *
     *  @param {Object} state 상태
     */
    setIcon (state) {
      const histories = bizUtil.getRecentlyViewedProducts() || []
      state.icon = DEFAULT_ICON
      if (histories) {
        for (const history of histories) {
          if (history.hisGubun === COMMON_CONST.HISTORY_GUBUN.PRODUCT) {
            if (history.adultItemFlag === 'Y' && loginUtil.adultAuthYN() !== 'Y') {
              state.icon = DEFAULT_ICON
            } else {
              state.icon = getImageUrl(history.partNumber, 52, 52, history.adultItemFlag)
            }
            break
          }
        }
      }
    }
  }
}
