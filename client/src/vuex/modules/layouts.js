import uiUtil from '@utils/uiUtil'

export default {
  namespaced: true,

  state: {
    nsLive: false, // ns live
    canSlideLiveTab: true, // live section all slide can flag.
    bottomNavi: true, // 하단 탭바
    gnbApiFlag: false, // Gnb 데이터 조회 유무.
    requiresReload: false, // router-view 리로드 플래그
    isNativeCss: false // Native css 적용여부
  },

  getters: {
    /**
       * live section all 에서 슬라이드가 가능한지 아닌지 체크후 bool 반환.
       * @param {Object} state 상태
       * @returns {bool}
       */
    getCanSlideLiveTabFlag: state => {
      const canSlideLiveTab = { canSlideLiveTab: state.canSlideLiveTab }
      return canSlideLiveTab
    },
    /**
       * gnb 로딩 완료 여부.
       * @param {Object} state 상태
       * @returns {bool}
       */
    getGnbApiFlag: state => {
      return state.gnbApiFlag
    }
  },

  mutations: {
    /**
     * NS Live 토글
     * @param {Object} state 상태
     * @param {Boolean} payload 노출 여부
     */
    toggleLive (state, payload) {
      state.nsLive = payload // NS Live 토글
    },
    /**
     * 하단 TV LIVE 탭에서 슬라이드 가능 여부 변경.
     * @param {Object} state 상태
     * @param {Boolean} payload 노출 여부
     */
    toggleCanSlide (state, payload) {
      state.canSlideLiveTab = payload
    },
    /**
     * 하단 탭바 토글
     *
     * @param {Objet} state 상태
     * @param {Boolean} payload 노출 여부
     */
    toggleBottomNavi (state, payload) {
      // 하단 탭바 토글
      state.bottomNavi = payload
    },
    /**
     * GNB 데이터 조회 유무 - API 동시 호출을 방지하려는 의도.
     *
     * @param {Object} state 상태
     * @param {Boolean} payload 노출 여부
     */
    setGnbApiFlag (state, payload) {
      // 하단 탭바 토글
      state.gnbApiFlag = payload
    },
    /**
     * GNB 데이터 조회 유무 - API 동시 호출을 방지하려는 의도.
     *
     * @param {Object} state 상태
     * @param {Boolean} payload 노출 여부
     */
    setIsNativeCss (state, payload) {
      // 하단 탭바 토글
      state.isNativeCss = payload
    }
  },

  actions: {
    /**
     * NS Live 토글
     *
     * @param {Object} context
     * @param {Function} context.commit
     * @param {Boolean} payload 노출 여부
     */
    toggleLive ({ commit }, payload) {
      if (payload) {
        uiUtil.disableScroll()
      } else {
        uiUtil.enableScroll()
      }

      commit('toggleLive', payload)
    },
    /**
     * scroll 최상단 설정 (subscribe / publish 패턴용)
     */
    scrollTop () {
    },
    /**
     * layout 스크롤 이벤트 설정 (subscribe / publish 패턴용)
     */
    onLayoutScrollEvent () {
    },
    /**
     * layout 스크롤 이벤트 해제 (subscribe / publish 패턴용)
     */
    offLayoutScrollEvent () {
    },
    /**
     * tab bar 조정 스크롤 이벤트 설정 (subscribe / publish 패턴용)
     */
    onTabBarOnlyScrollEvent () {
    },
    /**
     * tab bar 조정 스크롤 이벤트 해제 (subscribe / publish 패턴용)
     */
    offTabBarOnlyScrollEvent () {
    }
  }
}
