export default {
  /**
   * 하기 항목들에 namespace를 사용합니다.
   * [getters, actions, mutaions]
   */
  namespaced: true,

  /**
   * component의 data와 유사한 역할을 합니다.
   * 컴포넌트 내에서 참조방법
   * 1. this.$store.state.sample.todos
   * 2. computed: { ...mapState('sample', ['todos']) }
   */
  state: {
    vuexUserName: '',
    vuexSearchId: '',
    vuexPageLanding: {}
  },

  /**
   * component의 methods와 유사한 역할을 합니다.
   * state를 변경할 때 사용합니다.
   * this.$store.commit('sample/setTodos', [payload])
   */
  mutations: {
    /**
     * user명을 갱신
     *
     * @param {object} state
     * @param {String} userName String
     */
    setUserName (state, userName) {
      state.vuexUserName = userName
    },
    /**
     * 검색된 user Id목록 String을 갱신
     *
     * @param {object} state
     * @param {String} userName String
     */
    setSearchId (state, searchId) {
      state.vuexSearchId = searchId
    },
    /**
     * 뒤로가기시 랜딩에 필요한 파라메터를 갱신
     *
     * @param {object} state
     * @param {object} pageData object
     */
    setPageLanding (state, pageData) {
      state.vuexPageLanding = pageData
    }
  }
}
