import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import WriteInquiry from '@/views/product/inquiry/WriteInquiry'
import globalVal from '@unit/views/product/mock/globalVal_review'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import CONST from '@constants/framework/framework'
import { getQAListResponse } from '@unit/views/product/mock/inquiryMock'

const getQAListApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/GoodsQnAReal`)
    .reply(200, getQAListResponse)

  return mock
}

describe('WriteInquiry', () => {
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
      name: 'writeInquiry',
      meta: {},
      path: '/product/inquiry/write',
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
    it('activateButton 값 ', () => {
      const wrapper = shallowMount(WriteInquiry, options)
      assert.isNotTrue(wrapper.vm.activateButton)
    })
  })

  describe('methods', () => {
    it('registerInquiry', async () => {
      getQAListApiResponse(mock)
      const wrapper = shallowMount(WriteInquiry, options)
      wrapper.vm.registerInquiry()
      await flushPromises()
    })
  })
})
