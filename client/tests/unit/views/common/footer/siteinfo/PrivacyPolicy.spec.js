import { assert } from 'chai' // 필수
import { mount, createLocalVue } from '@vue/test-utils' // 필수
import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'

import store from '@/vuex' // 필수
import router from '@/router' // 필수
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import PrivacyPolicy from '@/views/common/footer/siteinfo/PrivacyPolicy'
import privateContentGuideRealResponse from '@unit/views/common/footer/siteinfo/mock/privateContentGuideRealResponse'

describe('PrivacyPolicy', () => {
  let localVue
  let options
  let wrapper
  let vm
  let mock

  before(() => {
    localVue = createLocalVue()
    Vue.prototype.$nsaxios = nsaxios
    mock = new MockAdapter(axios)
    options = {
      localVue,
      router,
      store
    }
  })

  beforeEach(() => {
    mock.reset()
  })

  describe('getPrivacyPolicyData', () => {
    it('개인정보 처리방침을 조회 후 컴포넌트 데이터를 갱신한다', async () => {
      // mock 이용약관 API
      mock
        .onPost(`${CONST.API_URL}/PrivateContentGuideReal`)
        .reply(200, privateContentGuideRealResponse)

      wrapper = mount(PrivacyPolicy, options)
      vm = wrapper.vm

      await flushPromises()

      assert.notEqual(vm.privateGuide, '')
    })
  })
})
