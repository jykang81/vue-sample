export default {
  namespaced: true,

  state: {
    pageTitle: '' // 동적 헤더 타이틀
  },

  mutations: {
    /**
     * 페이지 타이틀 설정
     * @param {Object} state
     * @param {Object} pageTitle 갱신될 타이틀
     */
    setPageTitle (state, pageTitle) {
      state.pageTitle = pageTitle
    }
  }
}
