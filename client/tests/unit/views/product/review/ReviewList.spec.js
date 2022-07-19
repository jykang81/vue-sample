import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import ReviewList from '@/views/product/review/ReviewList'
import globalVal from '@unit/views/product/mock/globalVal_review'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import CONST from '@constants/framework/framework'
import { checkReportableResponse, getCustomerReviewWritableResponse, getCustomerReviewResponse, setUsefulYnResponse } from '@unit/views/product/mock/reviewMock'

const checkReportableApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxProductReview`)
    .reply(200, checkReportableResponse)

  return mock
}
const getCustomerReviewWritableApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxProductReview`)
    .reply(200, getCustomerReviewWritableResponse)

  return mock
}
const getCustomerReviewApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxProductReview`)
    .reply(200, getCustomerReviewResponse)

  return mock
}
const setUsefulYnApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxProductReview`)
    .reply(200, setUsefulYnResponse)

  return mock
}

describe('ReviewList', () => {
  let localVue
  let options
  let mock

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(function () {
    mock.reset()
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.prototype.$nsaxios = nsaxios

    delete router.history.current
    router.history.current = {
      name: 'reviewList',
      meta: {},
      path: '/product/review/list',
      hash: '',
      query: {},
      params: { globalVal },
      fullPath: '/',
      matched: []
    }

    options = {
      localVue,
      store,
      router
    }
  })

  describe('computed', () => {
    it('isFoodProduct 값 ', () => {
      const wrapper = shallowMount(ReviewList, options)
      assert.isFalse(wrapper.vm.isFoodProduct)
    })
  })
  describe('methods', () => {
    it('checkReportable', async () => {
      checkReportableApiResponse(mock)
      const wrapper = shallowMount(ReviewList, options)
      wrapper.vm.checkReportable('2517353')
      await flushPromises()
    })
    it('getCustomerReviewWritable', async () => {
      getCustomerReviewWritableApiResponse(mock)
      const wrapper = shallowMount(ReviewList, options)
      wrapper.vm.getCustomerReviewWritable()
      await flushPromises()
    })
    it('getCustomerReview', async () => {
      getCustomerReviewApiResponse(mock)
      const wrapper = shallowMount(ReviewList, options)
      wrapper.vm.getCustomerReview()
      await flushPromises()
    })
    it('setUsefulYn', async () => {
      setUsefulYnApiResponse(mock)
      const wrapper = shallowMount(ReviewList, options)
      wrapper.vm.setUsefulYn('2517353', true)
      await flushPromises()
    })
  })
})
