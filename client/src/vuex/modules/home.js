export default {
  namespaced: true,
  // state는 component의 data와 유사한 역할을 함.
  state: {
    liveSectionFlag: false,
    displayName: null
  },

  // setter 개념 - state는 mutation을 통해서만 수정. 여기에 로그를 남기면 됨.
  mutations: {
    /**
     * 라이브섹션 로딩 여부 셋팅.
     * @param {Object} state - vuex 객체.
     * @param {bool} infoLoad - 호출부에서 넘겨받은 bool 값.
     */
    setLiveSectionFlag (state, infoLoad) {
      state.liveSectionFlag = infoLoad
    },
    /**
     * 마케팅 스크립트 관련 GNB 매장명 저장.
     * @param {Object} state - vuex 객체.
     * @param {bool} infoLoad - 호출부에서 넘겨받은 GNB 매장명.
     */
    setDisplayName (state, infoLoad) {
      state.displayName = infoLoad
    }
  },

  getters: {
  /**
   * 라이브섹션 로딩 여부 반환.
   * @param {*} state (필수) 상태
   * @returns {bool}
   */
    getLiveSectionFlag: state => {
      const liveSectionFlag = state.liveSectionFlag
      return liveSectionFlag
    },
    /**
     * 마케팅 스크립트 관련 GNB 매장명 반환.
     * @param {*} state (필수) 상태
     * @returns {String}
     */
    getDisplayName: state => {
      const displayName = state.displayName
      return displayName
    }
  }
}
