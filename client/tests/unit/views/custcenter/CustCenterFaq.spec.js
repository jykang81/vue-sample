import CustCenterFaq from '@/views/custcenter/CustCenterFaq'
import {
  mount,
  createLocalVue
} from '@vue/test-utils'
import {
  assert
} from 'chai'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import {
  FooterFAQListMobileReal
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > FAQ', () => {
  const localVue = createLocalVue()
  let mock

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(VueRouter)

  const options = {
    localVue,
    router
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(() => {
    mock.reset() // reset mock adapter
  })

  it('getFaqList', async () => {
    const wrapper = mount(CustCenterFaq, options)

    mock
      .onPost(`${CONST.API_URL}/FooterFAQListMobileReal`)
      .reply(200, FooterFAQListMobileReal)

    wrapper.vm.getFaqList()
    await flushPromises()

    wrapper.vm.selectCate('01')
    wrapper.vm.selectCate('02')

    wrapper.vm.selectItem('81')
    wrapper.vm.selectItem('81')
    wrapper.vm.selectItem('82')

    assert.equal(Array.isArray(wrapper.vm.faqList), true)
  })
})
