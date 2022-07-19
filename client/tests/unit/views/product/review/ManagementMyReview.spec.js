import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import ManagementMyReview from '@/views/product/review/ManagementMyReview'

import {
  ReviewListRealResponse,
  NotYetProductReviewedListRealResponse,
  NotYetReviewedListRealResponse
} from '@unit/views/product/review/mock/reviewResponse'

describe('마이페이지 > 상품평 관리', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  delete router.history.current
  router.history.current = {
    name: 'managementMyReview',
    meta: {},
    path: 'review/management',
    hash: '',
    query: {},
    params: {
      type: 'unregistered'
    },
    fullPath: '/',
    matched: []
  }

  const options = {
    localVue,
    router,
    store
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios

    mock
      .onPost(`${CONST.API_URL}/NotYetReviewedListReal`)
      .reply(200, NotYetReviewedListRealResponse)

    mock
      .onPost(`${CONST.API_URL}/ReviewListReal`)
      .reply(200, ReviewListRealResponse)

    mock
      .onPost(`${CONST.API_URL}/NotYetProductReviewedListReal`)
      .reply(200, NotYetProductReviewedListRealResponse)
  })

  it('getUnregisteredList', async () => {
    const wrapper = mount(ManagementMyReview, options)

    wrapper.vm.getUnregisteredList('list')

    await flushPromises()

    const item = wrapper.vm.unregistered.nonReviewList[0]
    assert.equal(item.goodsName, htmlDecode((item.brandNM && item.brandNM !== '미정의' ? `[${item.brandNM}]` : '') + item.catentryNM))

    wrapper.vm.writeReview(item)
  })

  it('getRegisteredList', async () => {
    const wrapper = mount(ManagementMyReview, options)

    wrapper.vm.getRegisteredList('list')

    await flushPromises()

    const item = wrapper.vm.registered.reviewList[0]
    assert.equal(item.goodsName, htmlDecode((item.brand_nm && item.brand_nm !== '미정의' ? `[${item.brand_nm}]` : '') + item.catentry_nm))
    assert.equal(Array.isArray(item.scoreCateList), true)

    wrapper.vm.modifyReview(item)
  })

  it('setPageType', () => {
    router.history.current.params.type = 'unregistered'
    const wrapperUnReg = mount(ManagementMyReview, options)

    assert.equal(wrapperUnReg.vm.pageType, 'unregistered')

    router.history.current.params.type = 'registered'
    const wrapperReg = mount(ManagementMyReview, options)

    assert.equal(wrapperReg.vm.pageType, 'registered')
  })
})
