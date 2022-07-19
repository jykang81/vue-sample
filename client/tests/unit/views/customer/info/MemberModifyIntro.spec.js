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
import memberModifyIntro from '@/views/customer/info/MemberModifyIntro'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@/common/utils/loginUtil'
// import cookieUtil from '@frameworks/cookieUtil'

describe('MemberModifyIntro', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  const url = `${CONST.API_URL}/NSPasswordIdentifyAjaxCmd`
  const snsPswMmtUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
  const memberInfo = {
    tcode: 't123',
    gender: 'F',
    userId: 111103108,
    hpNo: '010-9898-9342',
    isSSORequest: 'false',
    isAdult: 'true',
    custNum: '30124937',
    gradeNm: '패밀리',
    userName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    userMargetingEmail: 'N',
    birthday: '19840425',
    userMarketingSMS: 'N',
    logonId: 'lsd251@nsmall.com',
    failcount: '0',
    sessionid: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    sessionId: 'mxa-VH3TY9K5c1ECcC5i_Uj',
    loginyn: 'Y',
    logonType: 'WEB',
    memberGradeCss: 'family',
    staffInfo: false,
    staffInfoName: '대표',
    staffBnft: 'Y',
    logonPassword: 'test001!'
  }
  const snsPswMmtResult = {
    isRegisteredPwd: 'Y',
    isSuccess: 'Y'
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
    sessionStorage.clear()
    localStorage.removeItem('memberInfo')
    // cookieUtil.deleteCookie('securityVerification')
    loginUtil.login(memberInfo)

    mock
      .onPost(snsPswMmtUrl)
      .reply(200, snsPswMmtResult)
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof memberModifyIntro.data, 'function')
    const defaultData = memberModifyIntro.data()
    assert.equal(defaultData.idParams.isSuccess, false)
  })

  describe('암호검증 처리', () => {
    it('초기 사용자ID 세션스토리에서 가져와 세팅', () => {
      try {
        const wrapper = mount(memberModifyIntro, options)
        wrapper.vm.initUserInfo()
        assert.notEqual('', wrapper.vm.idParams.value)
      } catch (error) {
        assert.fail(error.message)
      }
    })

    it('암호유효성 체크 false', () => {
      const wrapper = mount(memberModifyIntro, options)
      wrapper.vm.passwordParams.value = ''
      const result = wrapper.vm.checkPassword()
      assert.equal(false, result)
    })

    it('일반사용자 / SNS사용자 검증 분기처리 (일반사용자)', async () => {
      const wrapper = mount(memberModifyIntro, options)
      wrapper.vm.passwordParams.value = 'jin163725!'
      wrapper.vm.getSubmit()

      wrapper.vm.inputNewPwdParams.value = 'jin163725!'
      const responseResult = {
        passwordIdentify: 'Y'
      }
      const regUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
      const regResult = {
        data: {
          msg: {
            root: {
              isSuccess: 'Y'
            }
          }
        }
      }

      mock
        .onPost(url)
        .reply(200, responseResult)

      mock
        .onPost(regUrl)
        .reply(200, regResult)

      assert.equal(true, wrapper.vm.isSnsRegisteredPwd)
    })

    it('일반사용자 / SNS사용자 검증 분기처리 (SNS사용자)', async () => {
      const wrapper = mount(memberModifyIntro, options)

      wrapper.vm.isSnsRegisteredPwd = false
      wrapper.vm.inputNewPwdParams.value = 'jin163725!'
      wrapper.vm.inputPwdConfirmParams.value = 'jin163725!'
      const regUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
      const regResult = {
        data: {
          msg: {
            root: {
              isSuccess: 'Y'
            }
          }
        }
      }
      mock
        .onPost(regUrl)
        .reply(200, regResult)

      wrapper.vm.getSubmit()

      assert.equal(false, wrapper.vm.isSnsRegisteredPwd)
    })

    it('SNS사용자 암호저장', async () => {
      const wrapper = mount(memberModifyIntro, options)

      wrapper.vm.isSnsRegisteredPwd = false
      wrapper.vm.isPasswordCheck = true
      wrapper.vm.inputNewPwdParams.value = 'jin163725!'
      wrapper.vm.inputPwdConfirmParams.value = 'jin163725!'
      const regUrl = `${CONST.API_URL}/NSMobileSnsPswMgmt`
      const regResult = {
        data: {
          msg: {
            root: {
              isSuccess: 'Y'
            }
          }
        }
      }
      mock
        .onPost(regUrl)
        .reply(200, regResult)

      wrapper.vm.registerPassword()

      assert.equal(false, wrapper.vm.isSnsRegisteredPwd)
    })

    it('SNS사용자 암호 Key Down이벤트', () => {
      const wrapper = mount(memberModifyIntro, options)

      wrapper.vm.isSnsRegisteredPwd = false
      wrapper.vm.isPasswordCheck = false
      wrapper.vm.inputNewPwdParams.value = 'jin163725!'
      wrapper.vm.inputPwdConfirmParams.value = 'jin163725!'

      wrapper.vm.passPress()

      assert.equal(true, wrapper.vm.isPasswordCheck)
    })

    it('암호유효성 API 체크', async () => {
      const wrapper = mount(memberModifyIntro, options)
      const responseResult = {
        passwordIdentify: 'Y'
      }

      mock
        .onPost(url)
        .reply(200, responseResult)

      try {
        wrapper.vm.passwordParams.value = 'test001!'

        wrapper.vm.checkPassword()

        const result = loginUtil.isLoggedIn()

        await flushPromises()
        await wrapper.vm.$nextTick()
        assert.equal(true, result)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })
})
