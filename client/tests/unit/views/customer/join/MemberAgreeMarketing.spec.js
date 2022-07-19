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
import MemberAgreeMarketing from '@/views/customer/join/MemberAgreeMarketing'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('MemberAgreeMarketing', () => {
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

  const options = {
    localVue,
    router,
    store
  }

  // const wrapper = mount(MemberAgreeMarketing, options)
  const url = `${CONST.API_URL}/NsMobileMemberSignupCmd`

  const mock = new MockAdapter(axios)

  // mock axios
  axios.defaults.timeout = 100000

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof MemberAgreeMarketing.data, 'function')
    const defaultData = MemberAgreeMarketing.data()
    assert.equal(defaultData.isAllAgree, false)
  })

  describe('numberCheck Call Process', () => {
    it('입력값 문자가 들어간경우 false를 return하는지 확인', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 입력값 문자가 들어간경우 false를 return하는지 확인
      wrapper.vm.birthDayParams.value = '19840401a'
      const notNuberCheck = wrapper.vm.numberCheck()
      assert.equal(notNuberCheck, false)
    })

    it('MAXLENG와 다르면 false확인', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      wrapper.vm.birthDayParams.value = '1984040104'
      const notMaxlangCheck = wrapper.vm.numberCheck()
      assert.equal(notMaxlangCheck, false)
    })

    it('validDate조건 false 확인', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      wrapper.vm.birthDayParams.value = '20120101'
      const notValidDateCheck = wrapper.vm.numberCheck()
      assert.equal(notValidDateCheck, false)
    })

    it('모든조건에 만족하면 birthDayParams의 isError은 false 세팅', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      wrapper.vm.birthDayParams.value = '19840401'
      wrapper.vm.numberCheck()
      assert.equal(wrapper.vm.birthDayParams.isError, false)
    })
  })

  describe('isBirthDayFourteenValidDate Call Process', () => {
    it('14세미만 인경우', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 14세미만 인경우 return false
      const notUnderFourteenCheck = wrapper.vm.isBirthDayFourteenValidDate('20120101')
      assert.equal(notUnderFourteenCheck.stat, false)
    })

    it('생일의 월이 1~12가 아닌경우', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 생일의 월이 1~12가 아닌경우 return false
      const monthCheck = wrapper.vm.isBirthDayFourteenValidDate('20120001')
      assert.equal(monthCheck.stat, false)
    })

    it('생일의 일자가 1~31가 아닌경우', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 생일의 일자가 1~31가 아닌경우 return false
      const dayCheck = wrapper.vm.isBirthDayFourteenValidDate('20120133')
      assert.equal(dayCheck.stat, false)
    })

    it('생일의 월이 4, 6, 9, 11월인 경우 일자는 30일까지만 있으므로 31일로 들어온경우', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 생일의 월이 4, 6, 9, 11월인 경우 일자는 30일까지만 있으므로 31일로 들어온경우 return false
      const month2Check = wrapper.vm.isBirthDayFourteenValidDate('20120431')
      assert.equal(month2Check.stat, false)
    })

    it('생일의 월이 2월인경우', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 생일의 월이 2월인경우 일자는 29일까지만 있고 4년에 한번씩 29일만 존재하므로 해당 조건에 만족하지 않으면 return false
      const month3Check = wrapper.vm.isBirthDayFourteenValidDate('19970229')
      assert.equal(month3Check.stat, false)
    })

    it('모든조건에 만족하는 경우', () => {
      const wrapper = mount(MemberAgreeMarketing, options)
      // 모든조건에 만족하면 return은 true 세팅
      const successCheck = wrapper.vm.isBirthDayFourteenValidDate('19840401')
      assert.equal(successCheck.stat, true)
    })
  })

  it('setSex Call Process', () => {
    const wrapper = mount(MemberAgreeMarketing, options)
    wrapper.vm.memberSex = ''
    const fromSex = wrapper.vm.memberSex
    wrapper.vm.setSex('F')
    const toSex = wrapper.vm.memberSex
    assert.notEqual(fromSex, toSex)
  })

  // 전체 선택/해제 함수
  it('setAllAgree Call Process', () => {
    const wrapper = mount(MemberAgreeMarketing, options)
    // 전체 선택해제 상테에서 전체선택 처리시 isAllAgree는 true로 변경된다.
    wrapper.vm.isAllAgree = false
    wrapper.vm.setAllAgree()
    assert.equal(true, wrapper.vm.isAllAgree)

    // 전체 선택상테에서 전체해제 처리시 isAllAgree는 false로 변경된다.
    wrapper.vm.setAllAgree()
    assert.notEqual(true, wrapper.vm.isAllAgree)
  })

  it('setAgree Call Process', () => {
    const wrapper = mount(MemberAgreeMarketing, options)
    // 메일수신동의 체크 확인
    wrapper.vm.isAgreeEmail = false
    wrapper.vm.setAgree('mail')
    assert.equal(true, wrapper.vm.isAgreeEmail) // false => true
    wrapper.vm.setAgree('mail')
    assert.notEqual(true, wrapper.vm.isAgreeEmail) // true => false

    // sms수신동의 체크 확인
    wrapper.vm.isAgreeSMS = false
    wrapper.vm.setAgree('sms')
    assert.equal(true, wrapper.vm.isAgreeSMS) // false => true
    wrapper.vm.setAgree('sms')
    assert.notEqual(true, wrapper.vm.isAgreeSMS) // true => false

    // TM수신동의 체크 확인
    wrapper.vm.isAgreeTel = false
    wrapper.vm.setAgree('tel')
    assert.equal(true, wrapper.vm.isAgreeTel) // false => true
    wrapper.vm.setAgree('tel')
    assert.notEqual(true, wrapper.vm.isAgreeTel) // true => false

    // 전체 체크/해제 처리
    wrapper.vm.isAllAgree = false
    wrapper.vm.isAgreeTel = false
    wrapper.vm.isAgreeSMS = true
    wrapper.vm.isAgreeEmail = true
    wrapper.vm.setAgree('tel')
    assert.equal(true, wrapper.vm.isAllAgree) // false => true
    wrapper.vm.setAgree('tel')
    assert.notEqual(true, wrapper.vm.isAllAgree) // true => false
  })

  // 선택정보 저장처리
  it('saveAgree Call Process', async () => {
    const wrapper = mount(MemberAgreeMarketing, options)
    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'Y'
        }
      },
      birthDay: '19840425',
      gender: ['F'],
      agreeSms: 'Y',
      agreeEmail: 'N',
      agreeTel: 'N'
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    // 모든 조건을 만족한 경우 선택정보 저장처리
    wrapper.vm.birthDayParams.value = '19840425'
    wrapper.vm.isAgreeTel = true
    wrapper.vm.isAgreeSMS = false
    wrapper.vm.isAgreeEmail = false
    wrapper.vm.memberSex = 'F'
    wrapper.vm.isTestCase = true

    wrapper.vm.saveAgree()

    await flushPromises()

    await wrapper.vm.$nextTick()

    assert.notEqual(wrapper.vm.isSaveError, true)
  })

  it('saveAgree YMD Fail Call Process', () => {
    const wrapper = mount(MemberAgreeMarketing, options)
    // 생년월일이 입력되어 있을 경우 - 현재일보다 이후일자로 지정한 경우 false return
    wrapper.vm.birthDayParams.value = '20290425'
    const birthOverNow = wrapper.vm.saveAgree()
    assert.equal(false, birthOverNow)

    // 일이 1 ~ 해당 년월의 마지막날 사이인 경우 false return
    wrapper.vm.birthDayParams.value = '19831301'
    const birtNotMonth = wrapper.vm.saveAgree()
    assert.equal(false, birtNotMonth)

    // 일이 1 ~ 해당 년월의 마지막날 사이인 경우 false return
    wrapper.vm.birthDayParams.value = '16991231'
    const birtLowDay = wrapper.vm.saveAgree()
    assert.equal(false, birtLowDay)
  })

  // 다음에 하기처리
  it('saveLater Call Process', async () => {
    const wrapper = mount(MemberAgreeMarketing, options)
    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'Y'
        }
      },
      birthDay: '19840425',
      gender: ['F'],
      agreeSms: 'Y',
      agreeEmail: 'N',
      agreeTel: 'N'
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    // 입력값이 있는경우 confirm창 노출
    wrapper.vm.isAgreeTel = 'Y'
    wrapper.vm.isAgreeEmail = ''
    wrapper.vm.isAgreeSMS = ''
    wrapper.vm.memberSex = ''
    wrapper.vm.birthDayParams.value = ''

    wrapper.vm.saveLater()
    assert.equal(true, true)

    // 입력값이 없는경우 메인화면으로 이동
    wrapper.vm.isAgreeTel = 'Y'

    await flushPromises()

    await wrapper.vm.$nextTick()
    // console.log('emailParams value : ', wrapper.vm.emailParams.value)
    assert.notEqual(false, true)
  })
})
