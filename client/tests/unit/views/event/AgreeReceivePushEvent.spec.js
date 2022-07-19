import CONST from '@constants/framework/framework'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import AgreeReceivePushEvent from '@/views/event/AgreeReceivePushEvent'
import { getEventHtmlResponse } from '@unit/views/event/mock/application'
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

describe('AgreeReceivePushEvent', () => {
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

    wrapper = shallowMount(AgreeReceivePushEvent, options)
    router.history.current.params.offerId = getEventHtmlResponse.msg.eventDetail.offerIdfr
  })

  describe('methods', () => {
    it('getEventHtml', async () => {
      await wrapper.vm.getEventHtml()
      await flushPromises()
    })
  })
})
