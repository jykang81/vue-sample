import Vuex from 'vuex'
import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import router from '@/router'
import AppHeaderProduct from '@components/layouts/items/AppHeaderProduct'
import flushPromises from 'flush-promises'

describe('AppHeaderProduct 테스트', () => {
  let localVue
  let options

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)

    options = {
      localVue,
      store,
      router
    }
  })

  describe('headerOverStyle 확인', () => {
    it('초기 opacity는 0이다', () => {
      // when
      const wrapper = shallowMount(AppHeaderProduct, options)
      const vm = wrapper.vm
      const initialOpacity = vm.headerOverStyle.opacity

      // then
      assert.equal(0, initialOpacity)
    })
  })

  describe('updateScroll', () => {
    it('페이지 수직 위치가 낮으면 opacity는 변하지 않는다.', () => {
      // when
      const wrapper = shallowMount(AppHeaderProduct, options)
      const vm = wrapper.vm

      window.pageYOffset = 0
      vm.updateScroll()

      // then
      assert.equal(0, vm.headerOverStyle.opacity)
    })

    it('페이지 수직 위치가 높으면 opacity가 높아진다.', () => {
      // when
      const wrapper = shallowMount(AppHeaderProduct, options)
      const vm = wrapper.vm

      const overRange = 500
      window.pageYOffset = overRange
      vm.updateScroll()

      // then
      assert.equal(1, vm.headerOverStyle.opacity)
    })
  })

  describe('gotoMain', () => {
    it('메인 페이지로 이동한다.', async () => {
      const wrapper = shallowMount(AppHeaderProduct, options)

      const vm = wrapper.vm

      try {
        vm.gotoMain()
        await flushPromises()
        await vm.$nextTick()
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })

  describe('searchFullLayer', () => {
    it('검색창을 열었다 닫는다.', async () => {
      const wrapper = shallowMount(AppHeaderProduct, options)

      const vm = wrapper.vm

      // 검색창 열기
      vm.searchFullLayer()

      // 검색창 닫기
      store.commit('popup/hide', {})
    })
  })

  describe('destroyed', () => {
    it('컴포넌트가 삭제되기 전, 스크롤 이벤트 리스너를 해제한다', async () => {
      const wrapper = shallowMount(AppHeaderProduct, options)

      wrapper.destroy()
    })
  })

  describe('goBack', () => {
    it('이전 페이지로 이동한다', async () => {
      const wrapper = shallowMount(AppHeaderProduct, options)

      const vm = wrapper.vm

      vm.goBack()
    })
  })
})
