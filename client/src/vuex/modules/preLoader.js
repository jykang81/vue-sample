export default {
  namespaced: true,

  state: {
    isShow: false, // preLoader 노출 여부
    isBlocked: true // preLoader 노출 시 엘리먼트 접근 가능 여부
  },

  getters: {},

  mutations: {
    /**
     * preLoader 보여주기
     *
     * @param {*} state (필수) 상태
     */
    show (state) {
      state.isShow = true
    },
    /**
     * preLoader 숨기기
     *
     * @param {*} state (필수) 상태
     */
    hide (state) {
      state.isShow = false
    }
  }
}
