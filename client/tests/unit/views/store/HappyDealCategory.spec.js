import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import flushPromises from 'flush-promises'

import HappyDealCategory from '@/views/store/HappyDealCategory'
import { recommListRes } from '@unit/views/store/mock/happyDeal'

const initResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`)
    .reply(200, recommListRes)
}

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

// 필수 테스트 할 대상 파일명을 넣음
describe('해피딜 카테고리', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  Vue.directive('img-lazy-load', {})
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store,
    propsData: {
      categoryId: '919087'
    }
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
    initResponse(mock)
  })

  it('카테고리 상품 조회', async () => {
    const wrapper = mount(HappyDealCategory, options)
    const vm = wrapper.vm
    assert.isTrue(true, vm)
    vm.init()
    await flushPromises()
    vm.getCategoryProductList()
    await flushPromises()
    assert.deepEqual(vm.categoryProductList, recommListRes.msg.espotList[0]._EZ_HAPPYDEAL_CATE_PRDGRID)
  })
})
