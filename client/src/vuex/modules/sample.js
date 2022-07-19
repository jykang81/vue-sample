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
    todos: [],
    todoItems: []
  },

  /**
   * component의 computed와 유사한 역할을 합니다.
   * 컴포넌트 내에서 참조방법
   * computed: { ...mapGetters('sample', ['todosCount']) }
   */
  getters: {
    todosCount: state => {
      return state.todos.length
    }
  },

  /**
   * component의 methods와 유사한 역할을 합니다.
   * state를 변경할 때 사용합니다.
   * this.$store.commit('sample/setTodos', [payload])
   */
  mutations: {
    /**
     * todo 목록 갱신
     *
     * @param {object} state
     * @param {arrary} payload todo 목록
     */
    setTodos (state, payload) {
      state.todos = payload
    },
    /**
     * todo 아이템 추가
     *
     * @param {object} state
     * @param {string} todoItem
     */
    addOneItem (state, todoItem) {
      const obj = { completed: false, item: todoItem }
      localStorage.setItem(todoItem, JSON.stringify(obj))
      state.todoItems.push(obj)
    },
    /**
     * todo 아이템 삭제
     *
     * @param {object} state
     * @param {object} payload
     */
    removeItem (state, payload) {
      localStorage.removeItem(payload.todoItem.item)
      state.todoItems.splice(payload.index, 1)
    },
    /**
     * 아이템 상태 변경 (check/uncheck 처리)
     *
     * @param {object} state
     * @param {object} payload
     */
    toggleItem (state, payload) {
      state.todoItems[payload.index].completed = !state.todoItems[payload.index]
        .completed
      localStorage.removeItem(payload.todoItem.item)
      localStorage.setItem(
        payload.todoItem.item,
        JSON.stringify(payload.todoItem)
      )
    },
    /**
     * todo 목록 비우기
     *
     * @param {object} state
     */
    clearAllItems (state) {
      localStorage.clear()
      state.todoItems = []
    },
    /**
     * todo item 설정
     *
     * @param {object} state
     * @param {array} payload
     */
    setTodoItems (state, payload) {
      state.todoItems = payload
    }
  },

  /**
   * component의 method와 유사한 역할을 합니다.
   * 비동기 처리를 합니다.
   * this.$store.dispatch('sample/getTodos, [payload])
   */
  actions: {}
}
