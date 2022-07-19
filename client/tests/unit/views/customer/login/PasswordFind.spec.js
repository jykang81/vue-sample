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
import passwordFind from '@/views/customer/login/PasswordFind'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('PasswordFind', () => {
  let mock
  const e = {
    target: {
      value: ''
    }
  }

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  const url = `${CONST.API_URL}/NSPWCheckMoblieCmdReal`

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
    assert.equal(typeof passwordFind.data, 'function')
    const defaultData = passwordFind.data()
    assert.equal(defaultData.userIdParams.isSuccess, false)
  })

  describe('ID입력 처리', () => {
    it('ID에 한글이 입력된경우', () => {
      const wrapper = mount(passwordFind, options)
      wrapper.vm.userIdParams.value = 'test아'
      const returnResult = wrapper.vm.clearCheck('', e)
      assert.notEqual(true, returnResult)
    })

    it('EMail ID인경우 @입력시 도메인목록 노출', () => {
      const wrapper = mount(passwordFind, options)
      wrapper.vm.userIdParams.value = 'nstest@'
      wrapper.vm.clearCheck('', e)
      assert.equal(true, wrapper.vm.isActive)
      wrapper.vm.userIdParams.value = 'nstest@na'
      wrapper.vm.clearCheck('', e)
      assert.equal(true, wrapper.vm.isActive)
    })

    it('이메일 도메인선택한경우', () => {
      const wrapper = mount(passwordFind, options)
      const id = 'test01'
      const domain = '@naver.com'
      wrapper.vm.changeValue(id, domain)
      assert.notEqual('', wrapper.vm.userIdParams.value)
    })

    it('checkMoveTarget', () => {
      const wrapper = mount(passwordFind, options)
      wrapper.vm.checkMoveTarget({ relatedTarget: true })
      assert.notEqual(true, wrapper.vm.isActive)
    })
  })

  /* ID존재 여부 체크 */
  it('ID존재하는 경우', async () => {
    const wrapper = mount(passwordFind, options)
    const responseResult = {
      msg: {
        root: {
          Checkresult: {
            processMsg: ''
          }
        }
      }
    }

    const snsPswMmtUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
    const snsPswMmtResult = {
      isRegisteredPwd: 'Y'
    }

    mock
      .onPost(url)
      .reply(200, responseResult)

    mock
      .onPost(snsPswMmtUrl)
      .reply(200, snsPswMmtResult)

    try {
      wrapper.vm.userIdParams.value = 'nstest01@naver.com'

      wrapper.vm.sendIdCheck()

      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.equal(true, wrapper.vm.isNewSend)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('ID존재하지 않는 경우', async () => {
    const wrapper = mount(passwordFind, options)
    const responseResult = {
      msg: {
        root: {
          Checkresult: {
            processMsg: 'E'
          }
        }
      }
    }

    const snsPswMmtUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
    const snsPswMmtResult = {
      isRegisteredPwd: 'Y'
    }

    mock
      .onPost(url)
      .reply(200, responseResult)

    mock
      .onPost(snsPswMmtUrl)
      .reply(200, snsPswMmtResult)

    try {
      wrapper.vm.userIdParams.value = 'nstest01@naver.com'

      const returnReselt = wrapper.vm.sendIdCheck()

      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.notEqual(true, returnReselt)
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
