import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import CONST from '@constants/framework/framework'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import HappyDeal from '@/views/store/HappyDeal'
import { topMenuRes } from '@unit/views/store/mock/happyDeal'

const initResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`)
    .reply(200, topMenuRes)
}

describe('해피딜 매장 테스트', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store,
    attachToDocument: true
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
    initResponse(mock)
  })

  describe('Created --->', () => {
    it('setCurrentTab --->', async () => {
      const wrapper = mount(HappyDeal, options)
      await flushPromises()
      const vm = wrapper.vm
      assert.equal(vm.currentTabIndex, 0)
      assert.equal(vm.currentTab, 'today')
    })
    it('getCategory --->', async () => {
      const wrapper = mount(HappyDeal, options)
      await flushPromises()
      const vm = wrapper.vm
      assert.equal(vm.isApiCalled, true)
      assert.equal(vm.tabs.length, topMenuRes.msg.espotList[0]._EZ_HAPPYDEAL_CATE.length)
    })
    it('set currentTabIndex as minus 1 --->', async () => {
      const wrapper = mount(HappyDeal, options)
      await flushPromises()
      const vm = wrapper.vm

      vm.currentTab = '1'
      assert.equal(vm.currentTabIndex, 0)
    })
    it('swiperHappydealCategories --->', async () => {
      const wrapper = mount(HappyDeal, options)
      await flushPromises()
      const vm = wrapper.vm
      assert.deepEqual(vm.swiperHappydealCategories, vm.$refs.happydealCategories.$swiper)
    })
    // it('initCategoryUi --->', async () => {
    //   const wrapper = mount(HappyDeal, options)
    //   await flushPromises()
    //   const vm = wrapper.vm

    //   vm.initCategoryUi()
    //   await flushPromises()
    //   assert.isTrue(true)
    // })
  })
})
