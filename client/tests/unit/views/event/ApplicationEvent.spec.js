import CONST from '@constants/framework/framework'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ApplicationEvent from '@/views/event/ApplicationEvent'
import { getEventHtmlResponse, checkIsAlreadyAppliedResponse } from '@unit/views/event/mock/application'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '@/router'

const getEventHtmlApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxMTimesEventCmd`)
    .reply(200, getEventHtmlResponse)

  return mock
}

const checkIsAlreadyAppliedApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSTimesPrmtEventCmd`)
    .reply(200, checkIsAlreadyAppliedResponse)

  return mock
}

describe('ApplicationEvent', () => {
  let localVue
  let options
  let mock
  let wrapper

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.prototype.$nsaxios = nsaxios

    mock = new MockAdapter(axios)

    options = {
      localVue,
      router
    }

    getEventHtmlApiResponse(mock)
    checkIsAlreadyAppliedApiResponse(mock)

    wrapper = shallowMount(ApplicationEvent, options)
    router.history.current.params.offerId = getEventHtmlResponse.msg.eventDetail.offerIdfr
  })

  describe('methods', () => {
    it('getEventHtml', async () => {
      await wrapper.vm.getEventHtml()
      await flushPromises()
    })
    it('checkIsAlreadyApplied', async () => {
      wrapper.vm.checkIsAlreadyApplied()
      await flushPromises()
    })
    it('onClickToApply', async () => {
      wrapper.vm.onClickToApply()
      await flushPromises()
    })
    it('onClickToApply couponId 없는 경우', async () => {
      wrapper.vm.couponId = null
      wrapper.vm.onClickToApply()
      await flushPromises()
    })
    it('onClickToApply couponId 있는 경우', async () => {
      wrapper.vm.couponId = '1234'
      wrapper.vm.onClickToApply()
      await flushPromises()
    })
  })
})
