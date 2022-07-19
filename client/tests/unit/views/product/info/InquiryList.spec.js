import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import InquiryList from '@/views/product/info/InquiryList'
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

describe('InquiryList', () => {
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
      name: 'inquiryList',
      meta: {},
      path: '/product/info/inquiry',
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
    it('qAListCount 값 ', () => {
      const wrapper = shallowMount(InquiryList, options)
      assert.isNotNull(wrapper.vm.qAListCount)
    })
  })

  describe('methods', () => {
    it('showOnlyMyInquiry', async () => {
      getQAListApiResponse(mock)
      const wrapper = shallowMount(InquiryList, options)
      wrapper.vm.showOnlyMyInquiry()
      await flushPromises()
    })
    it('setToggle', async () => {
      getQAListApiResponse(mock)
      const wrapper = shallowMount(InquiryList, options)
      wrapper.vm.setToggle()
      assert.isNotNull(wrapper.vm.openedIndexList)
    })
  })
})
