import {
  mount,
  createLocalVue
} from '@vue/test-utils'
import { assert } from 'chai'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'
import VueRouter from 'vue-router'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import CustCenterFaqSearch from '@/views/custcenter/CustCenterFaqSearch'
import {
  FooterFAQListMobileReal
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > FAQ > 검색', () => {
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

    mock
      .onPost(`${CONST.API_URL}/FooterFAQListMobileReal`)
      .reply(200, FooterFAQListMobileReal)
  })

  it('FAQ Search', async () => {
    const wrapper = mount(CustCenterFaqSearch, options)

    wrapper.vm.onTextWrite({ keyCode: 13 })

    wrapper.vm.searchKeyword = 'sdfsdf'
    wrapper.vm.onSearchClick()

    wrapper.vm.getSearchResult()
    await flushPromises()

    wrapper.vm.selectItem('81')
    wrapper.vm.selectItem('81')
    wrapper.vm.selectItem('82')

    assert.equal(Array.isArray(wrapper.vm.faqList), true)
    assert.equal(wrapper.vm.faqList.length > 0, true)

    wrapper.vm.removeSearchKeyword()

    assert.equal(wrapper.vm.faqList.length === 0, true)
  })
})
