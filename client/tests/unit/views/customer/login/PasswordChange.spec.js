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
import passwordChange from '@/views/customer/login/PasswordChange'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('PasswordChange', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)
  delete router.history.current
  const current = {
    name: null,
    meta: {},
    path: '/',
    hash: '',
    query: {},
    params: {
      userId: '111197229',
      logonId: 'test01@nsmall.com'
    },
    fullPath: '/',
    matched: []
  }
  router.history.current = current

  const options = {
    localVue,
    router,
    store
  }

  const url = `${CONST.API_URL}/NSPWChangeMoblieCmdReal`

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
    assert.equal(typeof passwordChange.data, 'function')
    const defaultData = passwordChange.data()
    assert.equal(defaultData.inputNewPwdParams.isSuccess, false)
  })

  describe('변경암호 처리', () => {
    it('입력값이 정책에 맞지 않는 경우', () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = '111123aqwdf!'
      wrapper.vm.passPress()
      assert.notEqual(true, wrapper.vm.inputNewPwdParams.isSuccess)
    })

    it('입력값이 정상적일 경우', () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = 'Jin163725!'
      wrapper.vm.passPress()
      assert.equal(true, wrapper.vm.inputNewPwdParams.isSuccess)
    })

    it('확인입력값이 변경입력값과 일치 하지 않는 경우', () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass01!'
      wrapper.vm.inputPwdConfirmParams.value = 'nspass02!'
      wrapper.vm.passwordCompare()
      assert.notEqual(true, wrapper.vm.inputPwdConfirmParams.isSuccess)
    })

    it('확인입력값이 변경입력값과 일치 할 경우', () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass01!'
      wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
      wrapper.vm.passwordCompare()
      assert.equal(true, wrapper.vm.inputPwdConfirmParams.isSuccess)
    })
  })

  /* 암호 변경 처리 */
  describe('암호 변경', () => {
    it('변경 암호가 공백인경우', async () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = ''
      wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
      const returnFail = wrapper.vm.chagePassword()
      assert.equal(false, returnFail)
    })

    it('변경 암호가 정상 체크가 안된경우', () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass02!'
      wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
      wrapper.vm.passwordCompare()

      const returnFail = wrapper.vm.chagePassword()
      assert.equal(false, returnFail)
    })

    it('변경 암호확인 값이 공백인경우', () => {
      const wrapper = mount(passwordChange, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass02!'
      wrapper.vm.inputPwdConfirmParams.value = ''
      wrapper.vm.passPress()

      const returnFail = wrapper.vm.chagePassword()
      assert.equal(false, returnFail)
    })

    it('암호 변경 정상', async () => {
      const wrapper = mount(passwordChange, options)
      const responseResult = {
        msg: {
          root: {
            Searchresult: {
              change_yn: 'Y'
            }
          }
        }
      }

      mock
        .onPost(url)
        .reply(200, responseResult)

      try {
        wrapper.vm.inputNewPwdParams.value = 'nspass01!'
        wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
        wrapper.vm.passPress()
        wrapper.vm.passwordCompare()

        wrapper.vm.chagePassword()

        await flushPromises()
        await wrapper.vm.$nextTick()
        assert.equal(true, wrapper.vm.inputPwdConfirmParams.isSuccess)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })
})
