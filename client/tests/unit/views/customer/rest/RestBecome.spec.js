import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import restBecome from '@/views/customer/rest/RestBecome'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import flushPromises from 'flush-promises'

describe('restBecome', () => {
  let mock
  let wrapper
  // let certify
  let options
  const realLocation = window.location
  const realOpener = window.opener
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

  // mock axios
  before(() => {
    Vue.prototype.$nsaxios = nsaxios
    Vue.prototype.$store = store
    const localVue = createLocalVue()
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
        memberInfo
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    options = {
      localVue,
      router,
      store,
      realLocation,
      realOpener
    }
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(function () {
    mock.reset()
  })

  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  it('created ', async () => {
    wrapper = mount(restBecome, options)
    const vm = wrapper.vm
    const url = `${CONST.API_URL}/NSRecoverMemberAjax`

    const responseResult = {
      msg: {
        root: {
          result: {
            rtnCode: 'Y'
          }
        }
      }
    }

    try {
      mock
        .onPost(url)
        .reply(200, responseResult)

      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.equal(true, vm.isNameCkecked)
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
