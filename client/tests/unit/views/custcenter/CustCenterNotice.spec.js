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
import CustCenterNotice from '@/views/custcenter/CustCenterNotice'
import {
  FooterNoticeListMobileReal
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > 공지사항', () => {
  let mock
  let options

  const localVue = createLocalVue()

  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(() => {
    mock.reset() // reset mock adapter

    delete router.history.current
    router.history.current = {
      name: 'custCenterNoticeDetail',
      meta: {},
      path: '/cust-center/notice',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    options = {
      localVue,
      router,
      store
    }
  })

  it('getNotice', async () => {
    const wrapper = mount(CustCenterNotice, options)

    mock
      .onPost(`${CONST.API_URL}/FooterNoticeListMobileReal`)
      .reply(200, FooterNoticeListMobileReal)

    wrapper.vm.getNotice()
    await flushPromises()

    assert.equal(Array.isArray(wrapper.vm.noticeList), true)
  })
})
