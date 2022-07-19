export default {
  namespaced: true,

  state: {
    isShow: false, // 토스트 메시지 노출 여부
    splittedMessage: '', // 토스트 메시지
    customClass: '', // 토스트 메시지 커스텀 클래스
    timer: null, // 토스트 메시지 타이머
    messageQueue: [], // 토스트 순차 호출용 큐
    sequentialIntervalRef: null // interval 참조 아이디 (토스트 순차 표시용)
  },

  mutations: {
    /**
     * 토스트 메시지 띄우기
     * @param {Object} state (필수) 상태
     * @param {Object} payload (필수) 상태를 변경할 값
     */
    setMessage (state, payload) {
      // 타이머 초기화
      clearTimeout(state.timer)

      // 토스트 메시지 설정 후 노출
      state.splittedMessage = payload.message.split(/<br\s*\/?>|\n/) // 멀티라인 처리를 위해 배열로 넣어줌
      state.customClass = payload.customClass
      state.isShow = true

      // 1.5초 후 토스트 메시지 닫기
      state.timer = setTimeout(() => {
        state.isShow = false
        state.splittedMessage = ''
        state.customClass = ''
        state.timer = null
      }, 1500)
    },
    /**
     * 메시지 추가
     * @param {Object} state 상태
     * @param {Object} messageParam 메시지 객체
     */
    pushMessage (state, messageParam) {
      state.messageQueue = [...state.messageQueue, messageParam]
    },
    /**
     * 메시지 사용 후처리
     * @param {Object} state 상태
     */
    consumeMessage (state) {
      state.messageQueue.shift()
    },
    /**
     * 순차 표시용 참조 아이디
     * @param {Object} state 상태
     * @param {Number} ref interval 참조 아이디
     */
    setSequentialIntervalRef (state, ref) {
      state.sequentialIntervalRef = ref
    }
  },

  actions: {
    /**
     * 토스트 메시지 순차 호출
     * @param {Object} context
     * @param {Function} context.commit mutation 호출기
     * @param {Object} context.state 상태
     * @param {Object} messageParam 메시지 객체
     */
    showSequentially ({ commit, state }, messageParam) {
      commit('pushMessage', messageParam) // 토스트 메시지 큐에 삽입

      if (state.sequentialIntervalRef !== null) { // interval 중복 방지
        return
      }

      const intervalRef = setInterval(() => {
        if (state.sequentialIntervalRef === null) {
          commit('setSequentialIntervalRef', intervalRef) // interval 참조값 설정
        }

        if (state.messageQueue.length === 0) { // 메시지 큐 확인
          clearInterval(intervalRef)
          commit('setSequentialIntervalRef', null) // interval 참조값 설정

          return
        }

        if (state.timer !== null) { // timer 확인
          return
        }

        const message = state.messageQueue[0]
        commit('setMessage', message) // 토스트 메시지 표시
        commit('consumeMessage') // 메시지 큐 관리
      }, 100)
    }
  }
}
