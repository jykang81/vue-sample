import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router' // 필수
import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContainerToast from '@components/frameworks/ContainerToast'
import store from '@/vuex'

describe('ContainerToast', () => {
  let localVue
  let options

  describe('toastClassName 확인', () => {
    beforeEach(function () {
      localVue = createLocalVue()
      localVue.use(Vuex)
      localVue.use(VueRouter)
      options = {
        localVue,
        store,
        router
      }
    })

    const toastClassName = 'is_nav'

    it('하단 nav가 없을 때 toast class가 없다', async () => {
      const wrapper = shallowMount(ContainerToast, options)
      const vm = wrapper.vm

      store.commit('layouts/toggleBottomNavi', false) // 하단 nav 상태 mocking
      await vm.$nextTick()

      assert.isFalse(vm.toastClassName.includes(toastClassName))
    })

    it('하단 nav가 있을 때 toast class가 있다', async () => {
      const wrapper = shallowMount(ContainerToast, options)
      const vm = wrapper.vm

      store.commit('layouts/toggleBottomNavi', true) // 하단 nav 상태 mocking
      await vm.$nextTick()

      assert.isTrue(vm.toastClassName.includes(toastClassName))
    })
  })
})
