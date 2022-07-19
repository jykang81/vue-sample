// import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import AppSearchHeader from '@components/layouts/items/AppSearchHeader'

describe('AppSearchHeader', () => {
  let localVue
  let wrapper

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    wrapper = shallowMount(AppSearchHeader, {
      localVue,
      router,
      store
    })
  })
  /*
  describe('searchFullLayer', () => {
    it('검색 팝업을 열고 닫는다', async () => {
      const vm = wrapper.vm

      // 검색 팝업 열기
      vm.searchFullLayer()

      // 검색 팝업 닫기
      store.commit('popup/hide', {})
    })
  })
*/
  describe('goBack', () => {
    it('뒤로가기 버튼을 누르면 이전 페이지로 이동한다', () => {
      const blackButtonWrappper = wrapper.find('.back_btn')
      blackButtonWrappper.trigger('click')
    })
  })
})
