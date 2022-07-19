import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import AppHeaderMain from '@components/layouts/items/AppHeaderMain'

describe('AppHeaderMain 테스트', () => {
  let localVue
  let wrapper
  let vm

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    wrapper = shallowMount(AppHeaderMain, {
      localVue,
      router,
      store
    })
    vm = wrapper.vm
  })

  it('검색 레이어 띄우기', async () => {
    vm.searchFullLayer()
  })
})
