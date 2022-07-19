export default {
  /**
   * 하기 항목들에 name space를 사용합니다.
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
    param1: '',
    param2: []
  },

  /**
   * component의 computed와 유사한 역할을 합니다.
   * 1. this.$store.state.sample.todosCount
   * 2. computed: { ...mapState('sample', ['todosCount']) }
   */
  getters: {
    param2Count: state => {
      return state.param2.length
    }
  },

  /**
   * component의 method와 유사한 역할을 합니다.
   * state를 변경할 때 사용합니다.
   * this.$store.commit('sample/setTodos')
   */
  mutations: {},

  /**
   * component의 method와 유사한 역할을 합니다.
   * 비동기 처리를 합니다.
   * this.$store.dispatch('sample/getAction)
   */
  actions: {
    getAction (context) {
    }
  }
}
