export default {
  namespaced: true,

  state: {
    savedPosition: null // 저장 좌표 객체
  },

  mutations: {
    /**
     * 저장 좌표 설정
     * @param {Object} state
     * @param {Object} savedPosition window 좌표 객체
     */
    setSavedPosition (state, savedPosition) {
      state.savedPosition = savedPosition
    }
  },

  actions: {
    /**
     * window 좌표 정보 갱신
     * @param {Object} context
     * @param {Function} context.commit
     * @param {Object} savedPosition window 좌표 객체
     */
    setSavedPosition ({ commit }, savedPosition) {
      commit('setSavedPosition', savedPosition)
    }
  }
}
