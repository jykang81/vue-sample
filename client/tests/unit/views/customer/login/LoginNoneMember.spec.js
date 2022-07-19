import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import loginNoneMember from '@/views/customer/login/LoginNoneMember'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('loginNoneMember', () => {
  let mock
  const e = {
    target: {
      value: ''
    }
  }

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  Vue.prototype.$store = store
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  const nonMemberOrderChkUrl = `${CONST.API_URL}/NSNonMemberOrderChk`

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof loginNoneMember.data, 'function')
    const defaultData = loginNoneMember.data()
    assert.equal(defaultData.orderNumParams.isSuccess, false)
  })

  /* 주문번호 validation File */
  it('Login입력정보 검증', () => {
    const wrapper = mount(loginNoneMember, options)
    let validation = true
    // 주문번호 NULL
    wrapper.vm.orderNumParams.value = ''
    wrapper.vm.passwordParams.value = 'jin163725!'
    validation = wrapper.vm.loginValidation()
    // 주문비밀번호 NULL
    wrapper.vm.orderNumParams.value = '300011167020'
    wrapper.vm.passwordParams.value = ''
    validation = wrapper.vm.loginValidation()

    // 정상
    wrapper.vm.orderNumParams.value = '300011167020'
    wrapper.vm.passwordParams.value = 'jin163725!'
    validation = wrapper.vm.loginValidation()
    assert.equal(true, validation)
  })

  /* 주문번호 규칙 확인 */
  it('주문번호 규칙 확인', () => {
    const wrapper = mount(loginNoneMember, options)
    wrapper.vm.orderNumParams.value = '300011167020a'
    const validation = wrapper.vm.orderNumInput('', e)
    assert.notEqual('300011167020a', validation)
  })

  /* 주문 번호 포커스아웃일때 체크 */
  it('주문 번호 포커스아웃일때 체크', () => {
    const wrapper = mount(loginNoneMember, options)
    wrapper.vm.orderNumParams.value = ''
    wrapper.vm.orderNumBlur()
    const validation = wrapper.vm.orderNumParams.isError
    assert.equal(true, validation)
  })

  /* 비밀 번호 포커스아웃일때 체크 */
  it('비밀 번호 포커스아웃일때 체크', () => {
    const wrapper = mount(loginNoneMember, options)
    wrapper.vm.passwordParams.value = ''
    wrapper.vm.passwordBlur()
    const validation = wrapper.vm.passwordParams.isError
    assert.equal(true, validation)
  })

  it('비회원 주문번호에 대한 API조회 false 체크', () => {
    const wrapper = mount(loginNoneMember, options)
    let validation = true
    wrapper.vm.orderNumParams.value = '1234567'
    validation = wrapper.vm.selectOrder()
    wrapper.vm.passwordParams.value = ''
    validation = wrapper.vm.selectOrder()
    assert.notEqual(true, validation)
  })

  // id/password Validation check
  it('비회원 주문번호에 대한 API조회', async () => {
    const wrapper = mount(loginNoneMember, options)
    const checkSimpleUser = {
      msg: {
        root: {
          resultYn: 'Y'
        }
      }
    }

    mock
      .onPost(nonMemberOrderChkUrl)
      .reply(200, checkSimpleUser)

    try {
      // id가 공백 또는 Null이면 false return
      wrapper.vm.orderNumParams.value = '300011167020'
      wrapper.vm.passwordParams.value = 'jin163725!'

      wrapper.vm.selectOrder()

      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.notEqual(true, wrapper.vm.passwordParams.isError)
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
