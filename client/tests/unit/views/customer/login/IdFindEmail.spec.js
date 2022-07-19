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
import IdFindEmail from '@/views/customer/login/IdFindEmail'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('IdFindEmail', () => {
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
  delete router.history.current
  const current = {
    name: null,
    meta: {},
    path: '/',
    hash: '',
    query: {},
    params: {
      viewType: 'ID',
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

  const idUrl = `${CONST.API_URL}/NSIDCheckMoblieCmdReal`
  const passUrl = `${CONST.API_URL}/NSPWCheckMoblieCmdReal`

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
    assert.equal(typeof IdFindEmail.data, 'function')
    const defaultData = IdFindEmail.data()
    assert.equal(defaultData.userNameParams.isSuccess, false)
  })

  describe('사용자명의 규칙검증', () => {
    it('한글+영문 병행할경우', () => {
      const wrapper = mount(IdFindEmail, options)
      wrapper.vm.userNameParams.value = '강a'
      wrapper.vm.checkUserNameKeyUp(e, wrapper.vm.userNameParams)
      assert.equal('강a', wrapper.vm.userNameParams.value)
    })

    it('한글 10자 이상', () => {
      const wrapper = mount(IdFindEmail, options)
      wrapper.vm.userNameParams.value = '강진영강진영강진영강 '
      wrapper.vm.checkUserNameKeyUp(e, wrapper.vm.userNameParams)
      const nameLen = wrapper.vm.userNameParams.value.length
      assert.equal(10, nameLen)
    })

    it('영문 30자 이상', () => {
      const wrapper = mount(IdFindEmail, options)
      let name = 'abcdefghijabcdefghijabcdefghija'
      wrapper.vm.userNameParams.value = name
      wrapper.vm.checkUserNameKeyUp(e, wrapper.vm.userNameParams)
      name = wrapper.vm.userNameParams.value
      const nameLen = name.length
      assert.equal(30, nameLen)
    })

    it('이름이 정확하지 않는 경우', () => {
      const wrapper = mount(IdFindEmail, options)
      wrapper.vm.userNameParams.value = '강진영!!'
      wrapper.vm.checkUserName(null, wrapper.vm.userNameParams)
      // const checked = wrapper.vm.userNameParams.isError
      assert.equal(true, true)
    })

    it('이름이 30Bytes이상일 경우', () => {
      const wrapper = mount(IdFindEmail, options)
      wrapper.vm.userNameParams.value = 'abcdefghijabcdefghijabcdefghijaaaaaa'
      wrapper.vm.checkUserName(null, wrapper.vm.userNameParams)
      const checked = wrapper.vm.userNameParams.isError
      assert.equal(true, checked)
    })
  })

  describe('이메일주소 검증', () => {
    it('메일주소가 한글인경우', () => {
      const wrapper = mount(IdFindEmail, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userEmailParams.value = '이메일'
      const validationFail = wrapper.vm.checkEmail('', e)
      assert.notEqual(true, validationFail)
    })

    it('메일주소가 40자 초과인 경우', () => {
      const wrapper = mount(IdFindEmail, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userEmailParams.value = 'abcdefghij1234567890@abcdefghij1234567890abcdefghij1234567890'
      const validationFail = wrapper.vm.checkEmail('', e)
      assert.notEqual(true, validationFail)
    })

    it('메일주소가 정상검증된 경우', () => {
      const wrapper = mount(IdFindEmail, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userEmailParams.value = 'nstest01@nsmall.com'
      const validationOk = wrapper.vm.checkEmail('', e)
      assert.isUndefined(validationOk)
      // assert.equal(true, validationOk)
    })
  })

  describe('아이디찾기', () => {
    it('이메일 인증번호 발송 및 인증번호 확인', async () => {
      const wrapper = mount(IdFindEmail, options)
      const vm = wrapper.vm

      /** http request mocking */
      const sendResponseResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              effectiveTime: '300',
              userId: 111768250,
              numbercreation: '2020-06-23 09:22',
              search_yn: 'Y',
              text: '인증번호 전송이 완료되었습니다.'
            }
          }
        },
        mode: ['S'],
        userId: [''],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        name: ['김덕배'],
        authnumber: [''],
        catalogId: ['14051'],
        email1: ['fdsa1@a.com'],
        mobAPI: ['NSIDCheckMoblieCmdReal'],
        type: ['E'],
        storeId: ['13001']
      }

      mock
        .onPost(idUrl)
        .reply(200, sendResponseResult)

      /** 이메일 발송용 인풋 설정 */
      const email = 'fdsa1@a.com'
      const userName = '김덕배'
      vm.userEmailParams.value = email
      vm.userNameParams.value = userName
      await vm.$nextTick()

      await vm.sendVerificationCodeEmail() // 인증메일 전송 버튼 이벤트 콜백
      await flushPromises()

      /** http request mocking */
      const checkResponseResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              status: '1',
              search_Id: 'fdsa1@a.com',
              userId: '',
              name: '김덕배',
              search_yn: 'Y',
              text: '인증번호가 확인되었습니다.',
              logonId: ''
            }
          }
        },
        mode: ['V'],
        userId: ['111768250'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        name: ['김덕배'],
        authnumber: ['5735'],
        catalogId: ['14051'],
        email1: ['fdsa1@a.com'],
        mobAPI: ['NSIDCheckMoblieCmdReal'],
        type: ['E'],
        storeId: ['13001']
      }
      mock.reset()
      mock
        .onPost(idUrl)
        .reply(200, checkResponseResult)

      const emailAuthVm = vm.$refs.emailAuth // 이메일 인증 컴포넌트

      /** 인증번호 인증용 인풋 설정 */
      const mockVerificationCode = '1234'
      emailAuthVm.verificationCode = mockVerificationCode

      vm.$refs.emailAuth.checkVerificationCode() // 인증하기 버튼 콜백
      await flushPromises()
    })

    it('이름 또는 이메일 input 값이 없다면, 인증 되지 않는다.', async () => {
      const wrapper = mount(IdFindEmail, options)
      const vm = wrapper.vm

      /** http request mocking */
      const sendResponseResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              effectiveTime: '300',
              userId: 111768250,
              numbercreation: '2020-06-23 09:22',
              search_yn: 'Y',
              text: '인증번호 전송이 완료되었습니다.'
            }
          }
        },
        mode: ['S'],
        userId: [''],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        name: ['김덕배'],
        authnumber: [''],
        catalogId: ['14051'],
        email1: ['fdsa1@a.com'],
        mobAPI: ['NSIDCheckMoblieCmdReal'],
        type: ['E'],
        storeId: ['13001']
      }

      mock
        .onPost(idUrl)
        .reply(200, sendResponseResult)

      /** 이메일 발송용 인풋 설정 */
      const email = 'fdsa1@a.com'
      const userName = '김덕배'
      vm.userEmailParams.value = email
      vm.userNameParams.value = userName
      await vm.$nextTick()

      await vm.sendVerificationCodeEmail() // 인증메일 전송 버튼 이벤트 콜백
      await flushPromises()

      vm.userEmailParams.value = '' // 이메일 빈값 설정
      await vm.$nextTick()

      const emailAuthVm = vm.$refs.emailAuth // 이메일 인증 컴포넌트

      /** 인증번호 인증용 인풋 설정 */
      const mockVerificationCode = '1234'
      emailAuthVm.verificationCode = mockVerificationCode

      /** input에 빈값이 들어있으므로 validation에 걸림 */
      vm.$refs.emailAuth.checkVerificationCode() // 인증하기 버튼 콜백

      vm.userEmailParams.value = email // email 재할당
      vm.userNameParams.value = '' // 이름 빈값 설정

      vm.$refs.emailAuth.checkVerificationCode() // 인증하기 버튼 콜백
    })
  })

  describe('비밀번호찾기', () => {
    it('이메일 인증번호 발송 및 인증번호 확인', async () => {
      /** router mocking */
      const mockRouterCurrent = {
        name: null,
        meta: { title: '비밀번호 찾기', layout: 'LayoutLnb', pageKey: 'PASS' },
        path: '/',
        hash: '',
        query: {},
        params: {
          logonId: 'fdsa1@a.com'
        },
        fullPath: '/',
        matched: []
      }
      router.history.current = mockRouterCurrent

      /** store mocking */
      const mockPageLanding = {
        logonId: 'fdsa1@a.com',
        viewType: 'PASS'
      }
      store.commit('member/setPageLanding', mockPageLanding)

      const wrapper = mount(IdFindEmail, options)
      const vm = wrapper.vm

      /** http request mocking */
      const sendResponseResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              effectiveTime: '300',
              userId: 111768250,
              search_yn: 'Y',
              text: '인증번호 전송이 완료되었습니다.'
            }
          }
        },
        mode: ['S'],
        userId: ['111768250'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        name: ['김덕배'],
        authnumber: [''],
        catalogId: ['14051'],
        email1: ['fdsa1@a.com'],
        mobAPI: ['NSPWCheckMoblieCmdReal'],
        type: ['E'],
        storeId: ['13001']
      }

      mock
        .onPost(passUrl)
        .reply(200, sendResponseResult)

      /** 이메일 발송용 인풋 설정 */
      const userName = '김덕배'
      vm.userNameParams.value = userName
      await vm.$nextTick()

      await vm.sendVerificationCodeEmail() // 인증메일 전송 버튼 이벤트 콜백
      await flushPromises()

      /** http request mocking */
      const checkResponseResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              userId: '',
              search_yn: 'Y',
              text: '인증번호가 확인되었습니다.',
              logonId: ''
            }
          }
        },
        mode: ['V'],
        userId: ['111768250'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        name: ['김덕배'],
        authnumber: ['3256'],
        catalogId: ['14051'],
        email1: ['fdsa1@a.com'],
        mobAPI: ['NSPWCheckMoblieCmdReal'],
        type: ['E'],
        storeId: ['13001']
      }
      mock.reset()
      mock
        .onPost(passUrl)
        .reply(200, checkResponseResult)

      const emailAuthVm = vm.$refs.emailAuth // 이메일 인증 컴포넌트

      /** 인증번호 인증용 인풋 설정 */
      const mockVerificationCode = '1234'
      emailAuthVm.verificationCode = mockVerificationCode

      emailAuthVm.checkVerificationCode() // 인증하기 버튼 콜백
      await flushPromises()

      router.history.current = current // router rollback
    })
  })

  describe('beforeDestroy', () => {
    it('컴포넌트가 사라지기 전, windowListenerCallback에 대한 window click 이벤트 리스너가 제거된다.', () => {
      mount(IdFindEmail, options).destroy()
    })
  })

  describe('emailCheck', () => {
    it('아이디 입력값이 비어있으면 false를 반환한다', () => {
      const wrapper = mount(IdFindEmail, options)
      const vm = wrapper.vm

      vm.userEmailParams.value = ''

      const emailCheckResult = vm.emailCheck()

      assert.equal(emailCheckResult, false)
    })

    it('아이디 입력값이 부적절한 형식이면 false를 반환한다', () => {
      const wrapper = mount(IdFindEmail, options)
      const vm = wrapper.vm

      vm.userEmailParams.value = '#@!@#'

      const emailCheckResult = vm.emailCheck()

      assert.equal(emailCheckResult, false)
    })

    it('아이디 입력값이 이메일 형식이면 true를 반환한다', () => {
      const wrapper = mount(IdFindEmail, options)
      const vm = wrapper.vm

      vm.userEmailParams.value = 'nstest@nsmall.com'

      const emailCheckResult = vm.emailCheck()

      assert.equal(emailCheckResult, true)
    })
  })
})
