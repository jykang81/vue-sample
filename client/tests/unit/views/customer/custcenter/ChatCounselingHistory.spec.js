import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import flushPromises from 'flush-promises'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'

import ChatCounselingHistory from '@/views/custcenter/ChatCounselingHistory'

const localVue = createLocalVue()

// 필수 테스트 할 대상 파일명을 넣음
describe('ChatCounselingHistory 테스트', () => {
  let wrapper
  let vm
  let mock
  const TEST_CUST_NUM = '12345678'

  before(() => {
    Vue.prototype.$nsaxios = nsaxios

    // mock axios
    mock = new MockAdapter(axios)

    // 바로 구매
    mock.onPost(`${CONST.API_URL}/InquiryCmdAjax`).reply(200,
      {
        custNum: TEST_CUST_NUM
      }
    )

    // 테스트 대상 컴포넌트 명 입력
    wrapper = shallowMount(ChatCounselingHistory, {
      localVue
    })
    vm = wrapper.vm
  })

  describe('funcPostMsg', () => {
    it('funcPostMsg', () => {
      const TEST_HEIGHT = 500

      const param = `{ "func_name": "iframeResize", "param": { "iframe_size": ${TEST_HEIGHT}}}`
      vm.funcPostMsg(param)
      const test = vm.$refs.chatHistoryView
      const actual = test.height
      const expected = `${TEST_HEIGHT}px`
      assert.equal(actual, expected)
    })
  })
  describe('getChttingIframe', async () => {
    it('getChttingIframe', async () => {
      vm.talkId = ''
      vm.talkType = 'PUSH'
      vm.getChttingIframe()

      await flushPromises()

      assert.equal(vm.customerId, TEST_CUST_NUM)
    })
  })
  describe('loginCheck', () => {
    it('loginCheck', () => {
      const data = {
        customer_id: 'testID'
      }
      vm.loginCheck(data)
    })
  })
  describe('pageCheck', () => {
    it('pageCheck', () => {
      const data = {
        talk_id: '',
        page_name: ''
      }
      vm.pageCheck(data)
    })
  })
  describe('pageMove', () => {
    it('pageMove', () => {
      vm.pageMove()
    })
  })
  describe('addTalkList', () => {
    it('addTalkList', () => {
      vm.addTalkList()
    })
  })
})
