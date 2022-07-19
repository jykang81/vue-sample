import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import MemberComplete from '@/views/customer/join/MemberComplete'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@/common/utils/loginUtil'

describe('MemberComplete', () => {
  let localVue
  let options
  let wrapper
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

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    Vue.prototype.$store = store
    localVue = createLocalVue()
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
        userName: '나선영',
        userEMail: 'ns9981@naver.com',
        userPhone: '010-1234-5678',
        userId: '30125194',
        userPass: ''
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    options = {
      localVue,
      router,
      store
    }

    sessionStorage.clear()
    localStorage.removeItem('memberInfo')
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    loginUtil.login(memberInfo)
    wrapper = mount(MemberComplete, options)
    assert.equal(typeof MemberComplete.data, 'function')
    const defaultData = MemberComplete.data()
    assert.notEqual(defaultData.userId, '30125194')
  })

  it('sets the correct default data params', () => {
    assert.equal(typeof MemberComplete.data, 'function')
    const defaultData = MemberComplete.data()
    assert.notEqual(defaultData.userId, '30125194')
  })

  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  it('Parameter userName 값 ', () => {
    loginUtil.login(memberInfo)
    wrapper = mount(MemberComplete, options)
    assert.notEqual(wrapper.vm.userId, '')
  })

  it('setMarketing Call Process', () => {
    loginUtil.login(memberInfo)
    wrapper = mount(MemberComplete, options)
    wrapper.vm.setMarketing()
    assert.notEqual(wrapper.vm.userId, '')
  })

  it('goHome Call Process', () => {
    loginUtil.login(memberInfo)
    wrapper = mount(MemberComplete, options)
    wrapper.vm.goHome()
    assert.notEqual(wrapper.vm.userId, '')
  })
})
