import uiUtil from '@utils/uiUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'
import nativeUtil from '@frameworks/nativeUtil'
import router from '@/router'

export default {
  namespaced: true,

  state: {
    isShow: false, // 메시지 노출 상태
    param: { // 메시지 컴포넌트를 import 할 때 전달할 파라미터
      msg: ''
    }
  },

  mutations: {
    /**
     * 메시지 관련 파라미터 설정
     * @param {Object} state 상태
     * @param {Object} payload 메시지 관련 파라미터
     */
    setParam (state, payload) {
      state.param = payload
    },
    /**
     * 메시지 열기
     * @param {Object} state 상태
     */
    show (state) {
      // 바닥 페이지 스크롤 금지 설정
      uiUtil.disableScroll()

      state.isShow = true
      if (isOsApp()) {
        nativeUtil.setRoutePath('/modal')
      }
    },
    /**
     * 매시지 닫기
     * @param {Object} state 상태
     */
    hide (state) {
      state.isShow = false

      uiUtil.enableScroll()
      if (isOsApp()) {
        const element = Boolean(document.querySelector('.mt32'))
        if (document.querySelector('.right_order_option.active') && document.querySelector('div.dimmed_all.native_opa')) {
          nativeUtil.setRoutePath('/popup')
        } else if (!element && router.history.current.path.trim() !== '/customer/info' && router.history.current.path.trim() !== '/customer/info/') {
          // nativeUtil.setRoutePath(router.history.current.path)
        }
      }
    }
  }
}
