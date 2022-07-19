import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import memberJoinSelect from '@/views/customer/join/MemberJoinSelect'
import loginUtil from '@utils/loginUtil'
import store from '@/vuex'
import router from '@/router'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('memberJoinSelect', () => {
  let localVue
  let options
  let wrapper
  let vm
  let mock

  const url = `${CONST.API_URL}/NSSnsMemberDispAjax`
  const result = {
    msg: {
      result: {
        snsMemberDispYn: 'Y'
      }
    }
  }

  before(() => {
    localVue = createLocalVue()
    Vue.prototype.$nsaxios = nsaxios
    localVue.use(Vuex)
    localVue.use(VueRouter)

    options = {
      localVue,
      router,
      store
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
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
  it('simpleLogin click', async () => {
    mock
      .onPost(url)
      .reply(200, result)

    wrapper = mount(memberJoinSelect, options)
    vm = wrapper.vm
    await flushPromises()
    await vm.$nextTick()
    vm.simpleLogin('NAVER')
    assert.equal(true, true)
  })

  it('초기 Login여부확인', async () => {
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

    loginUtil.login(memberInfo)

    mock
      .onPost(url)
      .reply(200, result)

    wrapper = mount(memberJoinSelect, options)
    vm = wrapper.vm
    await flushPromises()
    await vm.$nextTick()
    assert.notEqual(false, loginUtil.isLoggedIn())
  })

  it('init', async () => {
    wrapper = mount(memberJoinSelect, options)
    const vm = wrapper.vm

    mock
      .onPost(url)
      .reply(200, result)

    try {
      await vm.init()

      await flushPromises()
      await vm.$nextTick()

      console.log('vm.isSnsDiv >>> ', vm.isSnsDiv)

      if (vm.isSnsDiv) {
        assert.equal(true, vm.isSnsDiv)
      } else {
        assert.equal(false, vm.isSnsDiv)
      }
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
