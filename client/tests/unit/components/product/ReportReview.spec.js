import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import ReportReview from '@components/product/ReportReview'
import globalVal from '@unit/views/product/mock/globalVal_review'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router' // 필수
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import CONST from '@constants/framework/framework'
import { registerReportRespnose } from '@unit/views/product/mock/reviewMock'

const registerReportApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxProductReview`)
    .reply(200, registerReportRespnose)

  return mock
}

describe('ReportReview', () => {
  let localVue
  let options
  let mock

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.prototype.$nsaxios = nsaxios

    options = {
      localVue,
      store,
      propsData: {
        param: {
          globalVal,
          seq: 2517353
        }
      }
    }

    mock = new MockAdapter(axios)
  })

  describe('computed', () => {
    it('activateButton 값 ', () => {
      const wrapper = shallowMount(ReportReview, options)
      wrapper.vm.reportText = 'test'
      wrapper.vm.complainCd = '01'
      assert.isTrue(wrapper.vm.activateButton)
    })
  })

  describe('methods', () => {
    it('registerReport', async () => {
      registerReportApiResponse(mock)
      const wrapper = shallowMount(ReportReview, options)
      wrapper.vm.registerReport()
      await flushPromises()
    })
    it('registerReport', async () => {
      registerReportApiResponse(mock)
      const wrapper = shallowMount(ReportReview, options)
      wrapper.vm.reportText = 'test2'
      wrapper.vm.complainCd = '01'
      wrapper.vm.registerReport()
      await flushPromises()
    })
    it('typing', async () => {
      const wrapper = shallowMount(ReportReview, options)
      wrapper.vm.typing({ target: { value: '' } })
    })
    it('focusEvent', async () => {
      const wrapper = shallowMount(ReportReview, options)
      wrapper.vm.focusEvent({ target: { value: '' } })
    })
  })
})
