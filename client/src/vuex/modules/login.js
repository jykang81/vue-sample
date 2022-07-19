export default {
  namespaced: true,

  state: {
    returnRoute: null, // 로그인 후 이동할 라우트
    loginPopupType: '', // 로그인 레이어 팝업 타입
    isAdultLogin: false, // 성인 인증 문구 노출 여부
    loginParam: {} // 로그인 페이지에 넘길 파라미터 정보
  },

  getters: {
    /**
     * 로그인 후 이동할 라우트
     *
     * @param {Object} state 상태
     * @return {Object}  로그인 후 이동할 라우트
     */
    getReturnRoute (state) {
      return state.returnRoute
    },
    /**
     * 로그인 파라미터 정보
     *
     * @param {Object} state 상태
     * @return {Object}  로그인 파라미터 정보
     */
    getLoginParam (state) {
      return state.loginParam
    }
  },

  mutations: {
    /**
     * 로그인 후 이동할 라우트 설정
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 로그인 후 이동할 라우트
     */
    setReturnRoute (state, payload) {
      state.returnRoute = payload
    },
    /**
     * 로그인 후 이동할 라우트 초기화
     *
     * @param {*} state (필수) 상태
     */
    resetReturnRoute (state) {
      state.returnRoute = null
    },
    /**
     * 로그인 레이어 팝업 타입 (범용 로그인 / 회원전용 로그인 / 상품구매 로그인) 설정
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 로그인 레이어 팝업 타입
     */
    setLoginPopupType (state, payload) {
      state.loginPopupType = payload
    },
    /**
     * 성인 인증 문구 노출 여부 설정
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 성인 인증 문구 노출 여부
     */
    setIsAdultLogin (state, payload) {
      state.isAdultLogin = payload
    },
    /**
     * 로그인 페이지에 넘길 파라미터 정보 설정
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 로그인 페이지에 넘길 파라미터 정보
     */
    setLoginParam (state, payload) {
      state.loginParam = payload
    },
    /**
     * 로그인 후 파라미터 정보 초기화
     *
     * @param {*} state (필수) 상태
     */
    resetLoginParam (state) {
      state.loginParam = null
    }
  }
}
