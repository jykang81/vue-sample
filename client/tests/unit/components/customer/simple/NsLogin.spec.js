import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import nsLogin from '@components/customer/simple/NsLogin'
import loginUtil from '@utils/loginUtil'
import store from '@/vuex'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('nsLogin', () => {
  let localVue
  let options
  let wrapper
  let vm
  let mock

  const url = `${CONST.API_URL}/NSPasswordIdentifyAjaxCmd`
  let result

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
    staffBnft: 'Y'
  }

  before(() => {
    localVue = createLocalVue()
    Vue.prototype.$nsaxios = nsaxios
    localVue.use(Vuex)
    localVue.use(VueRouter)

    options = {
      localVue,
      router,
      store,
      propsData: {
        param: {
          title: '비밀번호 확인',
          titleAlign: 'center',
          isShowSearch: false,
          isShowCart: false
        }
      }
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    loginUtil.login(memberInfo)
  })

  beforeEach(() => {
    window.NSHub = {
      naGoHome: () => {},
      naSetLoginMemberInfo: () => {},
      naGa360LoggerNativeSend: (a, b) => {},
      naGetPushAgreeYn: (a, b) => {}
    }

    sessionStorage.clear()
    localStorage.removeItem('memberInfo')
    mock.reset()
  })

  afterEach(() => {
    window.NSHub = undefined
  })

  // 초기값 비교
  it('created click', () => {
    wrapper = mount(nsLogin, options)
    vm = wrapper.vm
    const id = vm.idParams.value
    assert.isNotNull(id)
  })

  it('사용자 암호 검증 API호출 [검증실패]', async () => {
    wrapper = mount(nsLogin, options)
    const vm = wrapper.vm
    let returnVal

    result = {
      passwordIdentify: 'N'
    }

    mock
      .onPost(url)
      .reply(200, result)

    try {
      vm.passwordParams.value = ''
      await vm.checkPassword()
      returnVal = vm.passwordParams.isError
      assert.equal(true, returnVal)

      vm.passwordParams.value = 'jin163725!'
      await vm.checkPassword()

      await flushPromises()
      await vm.$nextTick()

      returnVal = vm.passwordParams.isError
      assert.equal(true, returnVal)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('사용자 암호 검증 API호출 [검증성공]', async () => {
    wrapper = mount(nsLogin, options)
    const vm = wrapper.vm
    result = {
      passwordIdentify: 'Y'
    }

    mock
      .onPost(url)
      .reply(200, result)

    try {
      vm.passwordParams.value = 'jin163725!'
      await vm.checkPassword()

      await flushPromises()
      await vm.$nextTick()

      const returnVal = vm.passwordParams.isError
      assert.equal(false, returnVal)
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
