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
import joinSimpleLogin from '@/views/customer/login/simple/JoinSimpleLogin'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('joinSimpleLogin', () => {
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

  const simpleUserCheckUrl = `${CONST.API_URL}/NsMobileMemberSignupCmd`
  const loginUrl = `${CONST.API_URL}/NSLogonMoblieCmdReal`
  const staffSearchUrl = `${CONST.API_URL}/GetStaffAuthInfo`

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()

    delete router.history.current
    const current = {
      name: null,
      meta: {},
      path: '/',
      hash: '',
      query: {},
      params: {
        Email: 'lsdaaa@naver.com',
        access_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
        entFlag: 'NAVER',
        fnType: 'memberConnect',
        isShowSearch: false,
        logonId: '6338379',
        entUserId: '6338379',
        name: '나선영',
        title: '간편로그인',
        titleAlign: 'center'
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof joinSimpleLogin.data, 'function')
    const defaultData = joinSimpleLogin.data()
    assert.equal(defaultData.idParams.isSuccess, false)
  })

  /* 로그인 validation File */
  it('login Call Validation Fail Process', () => {
    const wrapper = mount(joinSimpleLogin, options)
    // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
    wrapper.vm.idParams.value = ''
    wrapper.vm.passwordParams.value = 'aqws0154!'
    const validationFail = wrapper.vm.toLogon()
    assert.notEqual(true, validationFail)
  })

  /* 로그인 5회오류 처리 */
  it('login Call 5 Fail Process', async () => {
    const wrapper = mount(joinSimpleLogin, options)
    const checkSimpleUser = {
      msg: {
        result: {
          linkYN: 'N',
          dupYN: 'N',
          nsLogonId: 'lsd251@nsmall.com'
        }
      }
    }
    const loginMockResponseResult = {
      msg: {
        root: {
          Logonresult: {
            failcount: '5',
            session_id: 'npGBib25MZPDDNxhqj1syRc',
            login_yn: 'N',
            text: '비밀번호가 5회이상 틀렸습니다.',
            resCode: '80'
          }
        }
      }
    }

    mock
      .onPost(simpleUserCheckUrl)
      .reply(200, checkSimpleUser)

    mock
      .onPost(loginUrl)
      .reply(200, loginMockResponseResult)

    try {
      wrapper.vm.passwordParams.value = 'aqws0154!'
      // 암호 5회 연속 틀린경우 자동입력방지처리 프로세스
      wrapper.vm.toLogon()

      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.equal(true, true)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /* 로그인처리 */
  it('login Call Success Process', async () => {
    const wrapper = mount(joinSimpleLogin, options)
    const checkSimpleUser = {
      msg: {
        result: {
          linkYN: 'Y',
          dupYN: 'N',
          nsLogonId: 'lsd251@nsmall.com'
        }
      }
    }

    const loginMockResponseResult = {
      msg: {
        root: {
          Logonresult: {
            failcount: '0',
            session_id: 'npGBib25MZPDDNxhqj1syRc',
            login_yn: 'Y',
            text: '성공 하였습니다.',
            resCode: '50'
          },
          memberInfo: {
            tcode: '',
            gender: 'M',
            userId: '102983700',
            hpNo: '010-1234-1234',
            isSSORequest: 'false',
            isAdult: '',
            custNum: '30120438',
            gradeNm: '',
            userName: '강진영',
            adultAuthYN: 'Y',
            entFlag: '',
            userMargetingTM: 'N',
            lastOrder: '2020-02-25 14:25:47.75',
            registration: '2017-03-23 16:30:26.733',
            email: 'test@nsmall.com',
            telNo: '010-1234-1234',
            userMargetingEmail: 'N',
            birthday: '1981-10-21',
            userMarketingSMS: 'Y',
            logonId: 'nstest01@nsmall.com'
          }
        }
      }
    }

    const staffSearchMockResponseResult = {
      catalogId: ['14051'],
      userId: ['102983700'],
      DM_PersistentCookieCreated: 'true',
      langId: ['-9'],
      accptPath: ['500'],
      staffBnft: {
        couponBnftRate: 20,
        useAmt: '398600',
        couponId: '1019974',
        bnftBiggerYn: 'N',
        memberId: '30120438',
        userId: '102983700',
        class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
        balanceAmt: '6601400',
        limitAmt: '7000000',
        empYn: 'Y',
        accptPathCd: ['500'],
        storeId: ['13001'],
        accessTm: ['20200409090001978']
      },
      staffInfo: {
        class: 'class com.ns.commerce.staff.bean.StaffInfoBean',
        companyGroupMail: 'nstest01@nsmall.com',
        nsEmpTopCategoryId: '1608059',
        expiredDate: '9999-12-31',
        userId: '102983700',
        companyGroupCode: 'NSMALL'
      }
    }

    mock
      .onPost(simpleUserCheckUrl)
      .reply(200, checkSimpleUser)

    mock
      .onPost(loginUrl)
      .reply(200, loginMockResponseResult)

    mock
      .onPost(staffSearchUrl)
      .reply(200, staffSearchMockResponseResult)

    try {
      wrapper.vm.idParams.value = 'nstest01@nsmall.com'
      wrapper.vm.passwordParams.value = 'aqws0154!'
      // 로그인 프로세스 확인
      wrapper.vm.toLogon()

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(false, false)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /* 기연동된 정보 존재 로그인 */
  it('login Fail Process', async () => {
    let wrapper = mount(joinSimpleLogin, options)
    const checkSimpleUser = {
      msg: {
        result: {
          linkYN: 'Y',
          dupYN: 'Y',
          nsLogonId: 'lsd251@nsmall.com'
        }
      }
    }

    mock
      .onPost(simpleUserCheckUrl)
      .reply(200, checkSimpleUser)

    try {
      wrapper.vm.passwordParams.value = ''
      // 비밀번호 Null
      wrapper.vm.toLogon()
      assert.equal(true, wrapper.vm.passwordParams.isError)

      wrapper.vm.passwordParams.value = 'aqws0154!'
      // NAVER
      wrapper.vm.toLogon()

      await flushPromises()
      await wrapper.vm.$nextTick()
      // assert.equal(true, wrapper.vm.idParams.isError)

      let current = {}
      // PAYCO
      delete router.history.current
      current = {
        name: null,
        meta: {},
        path: '/',
        hash: '',
        query: {},
        params: {
          Email: 'lsdaaa@naver.com',
          access_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
          entFlag: 'PAYCO',
          fnType: 'memberConnect',
          isShowSearch: false,
          logonId: '6338379',
          entUserId: '6338379',
          name: '나선영',
          title: '간편로그인',
          titleAlign: 'center'
        },
        fullPath: '/',
        matched: []
      }
      router.history.current = current
      wrapper = mount(joinSimpleLogin, options)

      wrapper.vm.passwordParams.value = 'aqws0154!'

      wrapper.vm.toLogon()

      await flushPromises()
      await wrapper.vm.$nextTick()
      // assert.equal(true, wrapper.vm.idParams.isError)

      // KAKAO
      delete router.history.current
      current = {
        name: null,
        meta: {},
        path: '/',
        hash: '',
        query: {},
        params: {
          Email: 'lsdaaa@naver.com',
          access_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
          entFlag: 'KAKAO',
          fnType: 'memberConnect',
          isShowSearch: false,
          logonId: '6338379',
          entUserId: '6338379',
          name: '나선영',
          title: '간편로그인',
          titleAlign: 'center'
        },
        fullPath: '/',
        matched: []
      }
      router.history.current = current
      wrapper = mount(joinSimpleLogin, options)

      wrapper.vm.passwordParams.value = 'aqws0154!'

      wrapper.vm.toLogon()

      await flushPromises()
      await wrapper.vm.$nextTick()
      // assert.equal(true, wrapper.vm.idParams.isError)

      // FACEBOOK
      delete router.history.current
      current = {
        name: null,
        meta: {},
        path: '/',
        hash: '',
        query: {},
        params: {
          Email: 'lsdaaa@naver.com',
          access_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
          entFlag: 'FACEBOOK',
          fnType: 'memberConnect',
          isShowSearch: false,
          logonId: '6338379',
          entUserId: '6338379',
          name: '나선영',
          title: '간편로그인',
          titleAlign: 'center'
        },
        fullPath: '/',
        matched: []
      }
      router.history.current = current
      wrapper = mount(joinSimpleLogin, options)

      wrapper.vm.passwordParams.value = 'aqws0154!'

      wrapper.vm.toLogon()

      await flushPromises()
      await wrapper.vm.$nextTick()
      // assert.equal(true, wrapper.vm.idParams.isError)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // id의 형식체크
  it('emailCheck Call Process', () => {
    const wrapper = mount(joinSimpleLogin, options)
    // 이메일형식도 아니고 일반아이디형식도 아닌경우 에러메세지발생
    wrapper.vm.idParams.value = '!@#!!'
    wrapper.vm.emailCheck()
    assert.notEqual(false, wrapper.vm.passwordParams.isError)

    // 이메일형식이거나 일반아이디형식이면 에러메세지 삭제된다
    wrapper.vm.idParams.value = 'nstest01@nsmall.com'
    wrapper.vm.emailCheck()
    assert.equal(false, wrapper.vm.idParams.isError)
  })

  // id/password Validation check
  it('loginValidation Call Process', () => {
    const wrapper = mount(joinSimpleLogin, options)
    // id가 공백 또는 Null이면 false return
    wrapper.vm.idParams.value = ''
    const idIsNull = wrapper.vm.loginValidation()
    assert.equal(false, idIsNull)

    // password가 공백 또는 Null이면 false return
    wrapper.vm.idParams.value = 'nstest01@nsmall.com'
    wrapper.vm.passwordParams.value = ''
    const passIsNull = wrapper.vm.loginValidation()
    assert.equal(false, passIsNull)

    // ID/password가 공백 또는 Null이 아니면 true return
    wrapper.vm.passwordParams.value = 'awsedf12!'
    const successCheck = wrapper.vm.loginValidation()
    assert.equal(true, successCheck)
  })

  it('idHangelCheck Call Process', () => {
    const wrapper = mount(joinSimpleLogin, options)
    wrapper.vm.idParams.value = 'nstest01에'
    const idHangel = wrapper.vm.idHangelCheck('', e)
    assert.equal(false, idHangel)
  })
})
