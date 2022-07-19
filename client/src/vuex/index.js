import Vue from 'vue'
import Vuex from 'vuex'

import cart from '@/vuex/modules/cart'
import shoppingHistory from '@/vuex/modules/shoppingHistory'
import tvScheduleTable from '@/vuex/modules/tvScheduleTable'
import layouts from '@/vuex/modules/layouts'
import login from '@/vuex/modules/login'
import sample from '@/vuex/modules/sample'
import orderSheet from '@/vuex/modules/orderSheet'
import popup from '@/vuex/modules/popup'
import message from '@/vuex/modules/message'
import toast from '@/vuex/modules/toast'
import product from '@/vuex/modules/product'
import preLoader from '@/vuex/modules/preLoader'
import search from '@/vuex/modules/search'
import member from '@/vuex/modules/member'
import home from '@/vuex/modules/home'
import animationPopup from '@/vuex/modules/animationPopup'
import history from '@/vuex/modules/history'
import appHeaderDefault from '@/vuex/modules/appHeaderDefault'

Vue.use(Vuex)

/**
 * store 모듈 관리 방법
 * 1. @/vuex/modules/module_name 해당 위치에 모듈 작성
 * 2. import module
 *    ex) import module_name from '@/vuex/modules/module_name'
 * 3. 하단 modules 객체에 프로퍼티 추가
 */
export default new Vuex.Store({
  /**
   * component의 data와 유사한 역할을 합니다.
   * 컴포넌트 내에서 참조방법
   * 1. this.$store.state.xxx
   * 2. computed: { ...mapState(['xxx']) }
   */
  state: {},

  /**
   * component의 computed와 유사한 역할을 합니다.
   * 컴포넌트 내에서 참조방법
   * computed: { ...mapGetters(['todosCount']) }
   */
  getters: {},

  /**
   * component의 methods와 유사한 역할을 합니다.
   * state를 변경할 때 사용합니다.
   * this.$store.commit('setTodos', [payload])
   */
  mutations: {},

  /**
   * component의 method와 유사한 역할을 합니다.
   * 비동기 처리를 합니다.
   * this.$store.dispatch('getTodos, [payload])
   */
  actions: {},

  /**
   * 모듈 관리 영역
   */
  modules: {
    cart,
    shoppingHistory,
    tvScheduleTable,
    layouts,
    login,
    sample,
    orderSheet,
    popup,
    message,
    toast,
    product,
    preLoader,
    search,
    member,
    home,
    animationPopup,
    history,
    appHeaderDefault
  }
})
