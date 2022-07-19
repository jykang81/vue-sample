export default {
  namespaced: true,
  state: {
    alarmTalkClassName: []
  },
  mutations: {
    /**
     * TV편성표 NSTALK 아이콘 설정
     *
     *  @param {Object} state 상태
     */
    setAlarmTalkClassName (state, { index, el }) {
      state.alarmTalkClassName[index] = el
    }
  }
}
