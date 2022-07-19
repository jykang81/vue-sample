import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import {
  htmlDecode
} from '@utils/commonutil/commonUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import CustCenterNoticeDetail from '@/views/custcenter/CustCenterNoticeDetail'
import {
  FooterNoticeViewMobileReal
} from '@unit/views/custcenter/mock/CustCenterResponse'

describe('고객센터 > 공지사항 > 상세', () => {
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
      params: {
        id: '1978'
      },
      fullPath: '/',
      matched: []
    }

    options = {
      localVue,
      router,
      store
    }
  })

  it('getNoticeDetail', async () => {
    const wrapper = mount(CustCenterNoticeDetail, options)

    assert.equal(wrapper.vm.noticeId, router.history.current.params.id)

    mock
      .onPost(`${CONST.API_URL}/FooterNoticeViewMobileReal`)
      .reply(200, FooterNoticeViewMobileReal)

    wrapper.vm.getNoticeDetail()
    await flushPromises()

    assert.equal(wrapper.vm.decodeContent, htmlDecode(wrapper.vm.noticeView.content))
  })
})
