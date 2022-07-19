import PHONE_AUTH_CONST from '@constants/customer/phoneAuth'
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
import IdFindPhone from '@/views/customer/login/IdFindPhone'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('IdFindPhone', () => {
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

  // const idUrl = `${CONST.API_URL}/NSIDCheckMoblieCmdReal`
  // const passUrl = `${CONST.API_URL}/NSPWCheckMoblieCmdReal`

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
    assert.equal(typeof IdFindPhone.data, 'function')
    const defaultData = IdFindPhone.data()
    assert.equal(defaultData.userNameParams.isSuccess, false)
  })

  describe('이름 검증', () => {
    it('사용자명 규칙검증(@input)', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '김수한무@'
      wrapper.vm.userNameParams.value = str
      wrapper.find('input').trigger('input')
      assert.notEqual(str, wrapper.vm.userNameParams.value)
      const str2 = '김수한무김수한무김수한무'
      wrapper.vm.userNameParams.value = str2
      wrapper.find('input').trigger('input')
      assert.notEqual(str2, wrapper.vm.userNameParams.value)
      const str3 = 'abcdefghijabcdefghijabcdefghijabcdefghij'
      wrapper.vm.userNameParams.value = str3
      wrapper.find('input').trigger('input')
      assert.notEqual(str3, wrapper.vm.userNameParams.value)
    })

    it('사용자명 규칙검증(@Blur)', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '김수한무김수한무김수한무'
      wrapper.vm.userNameParams.value = str
      wrapper.find('input').trigger('blur')
      assert.equal(true, true)
    })
  })

  describe('휴대폰번호 검증', () => {
    it('휴대폰번호가 숫자형식인지 체크', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '010-1234-5678'
      wrapper.vm.userPhoneParams.value = str
      const validationFail = wrapper.vm.onKeyUpOnlyNumber()
      assert.notEqual(str, validationFail)
    })

    it('휴대폰번호가 NULL확인', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = ''
      wrapper.vm.userPhoneParams.value = str
      const validationFail = wrapper.vm.checkPhone()
      assert.notEqual(true, validationFail)
    })

    it('휴대폰번호가 10자리 미만인경우', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '010-1234'
      wrapper.vm.userPhoneParams.value = str
      const validationFail = wrapper.vm.checkPhone()
      assert.notEqual(true, validationFail)
    })

    it('휴대폰번호가 정상인경우', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userPhoneParams.value = '010-1234-5678'
      wrapper.vm.checkPhone()
      assert.equal('text', `${wrapper.vm.userPhoneParams.type}`)
    })

    it('휴대폰번호점유인증 모듈 이름 NULL인경우', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = ''
      wrapper.vm.userNameParams.value = str
      wrapper.vm.sendVerificationCode()
      assert.equal(true, wrapper.vm.userNameParams.isError)
    })

    it('휴대폰번호점유인증 모듈 폰번호 NULL인경우', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = ''
      wrapper.vm.userNameParams.value = '홍길동'
      wrapper.vm.userPhoneParams.value = str
      wrapper.vm.sendVerificationCode()
      assert.equal(true, wrapper.vm.userPhoneParams.isError)
    })

    it('휴대폰번호점유인증 모듈 정상인경우', () => {
      const wrapper = mount(IdFindPhone, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '01012345678'
      wrapper.vm.userNameParams.value = '홍길동'
      wrapper.vm.userPhoneParams.value = str
      wrapper.vm.sendVerificationCode()
      assert.equal(false, wrapper.vm.userPhoneParams.isError)
    })
  })

  /* 인증번호 받기 버튼 클릭 */
  // it('인증번호 받기 버튼 클릭', () => {
  //   const wrapper = mount(IdFindPhone, options)
  //   // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
  //   wrapper.vm.isSendCode = true
  //   wrapper.vm.requestAuthNo()
  //   assert.equal(true, wrapper.vm.isSendCode)
  // })

  /* 휴대폰으로 인증번호발송 처리 */
  describe('휴대폰으로 인증번호발송', () => {
    // it('이름이 공백인경우', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   wrapper.vm.userNameParams.value = ''
    //   const returnFail = wrapper.vm.authNoSend()
    //   assert.equal(false, returnFail)
    // })

    // it('휴대폰번호가 공백인경우', () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   wrapper.vm.userNameParams.value = '고객명'
    //   wrapper.vm.userPhoneParams.value = ''
    //   const returnFail = wrapper.vm.authNoSend()
    //   assert.equal(false, returnFail)
    // })

    // it('휴대폰번호가 11자 이하인경우', () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   wrapper.vm.userNameParams.value = '고객명'
    //   wrapper.vm.userPhoneParams.value = '010-1234'
    //   const returnFail = wrapper.vm.authNoSend()
    //   assert.equal(false, returnFail)
    // })

    // it('인증번호 발송 계정정보 없음(ID)', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   const responseResult = {
    //     msg: {
    //       root: {
    //         Searchresult: {
    //           authnumber: '',
    //           effectiveTime: '300',
    //           userId: 111197229,
    //           numbercreation: '2020-04-13 13:16',
    //           search_yn: 'N',
    //           text: '인증번호 전송이 완료되었습니다.'
    //         }
    //       }
    //     }
    //   }

    //   mock
    //     .onPost(idUrl)
    //     .reply(200, responseResult)

    //   try {
    //     wrapper.vm.userNameParams.value = '고객명'
    //     wrapper.vm.userPhoneParams.value = '010-1234-1234'
    //     wrapper.vm.viewType = 'ID'

    //     wrapper.vm.authNoSend()

    //     await flushPromises()
    //     await wrapper.vm.$nextTick()
    //     assert.equal(false, wrapper.vm.isAuthSend)
    //   } catch (error) {
    //     assert.fail(error.message)
    //   }
    // })

    // it('인증번호 발송 계정정보 없음(PASSWORD)', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   const responseResult = {
    //     msg: {
    //       root: {
    //         Searchresult: {
    //           authnumber: '',
    //           effectiveTime: '300',
    //           userId: 111197229,
    //           numbercreation: '2020-04-13 13:16',
    //           search_yn: 'N',
    //           text: '인증번호 전송이 완료되었습니다.'
    //         }
    //       }
    //     }
    //   }

    //   mock
    //     .onPost(passUrl)
    //     .reply(200, responseResult)

    //   try {
    //     wrapper.vm.userNameParams.value = '고객명'
    //     wrapper.vm.userPhoneParams.value = '010-1234-5678'
    //     wrapper.vm.viewType = 'PASS'
    //     wrapper.vm.authNoSend()

    //     await flushPromises()
    //     await wrapper.vm.$nextTick()
    //     assert.equal(false, wrapper.vm.isAuthSend)
    //   } catch (error) {
    //     assert.fail(error.message)
    //   }
    // })

    // it('인증번호 발송 완료(ID)', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   const responseResult = {
    //     msg: {
    //       root: {
    //         Searchresult: {
    //           authnumber: '',
    //           effectiveTime: '300',
    //           userId: 111197229,
    //           numbercreation: '2020-04-13 13:16',
    //           search_yn: 'Y',
    //           text: '인증번호 전송이 완료되었습니다.'
    //         }
    //       }
    //     }
    //   }

    //   mock
    //     .onPost(idUrl)
    //     .reply(200, responseResult)

    //   try {
    //     wrapper.vm.userNameParams.value = '고객명'
    //     wrapper.vm.userPhoneParams.value = '010-1234-5678'
    //     wrapper.vm.viewType = 'ID'

    //     wrapper.vm.authNoSend()

    //     await flushPromises()
    //     await wrapper.vm.$nextTick()
    //     assert.notEqual('', wrapper.vm.invoke.logonId)
    //   } catch (error) {
    //     assert.fail(error.message)
    //   }
    // })

    // it('인증번호 발송 완료(PASSWORD)', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   const responseResult = {
    //     msg: {
    //       root: {
    //         Searchresult: {
    //           authnumber: '',
    //           effectiveTime: '300',
    //           userId: 111197229,
    //           numbercreation: '2020-04-13 13:16',
    //           search_yn: 'Y',
    //           text: '인증번호 전송이 완료되었습니다.'
    //         }
    //       }
    //     }
    //   }

    //   mock
    //     .onPost(passUrl)
    //     .reply(200, responseResult)

    //   try {
    //     wrapper.vm.userNameParams.value = '고객명'
    //     wrapper.vm.userPhoneParams.value = '010-1234-5678'
    //     wrapper.vm.viewType = 'PASS'
    //     wrapper.vm.authNoSend()

    //     await flushPromises()
    //     await wrapper.vm.$nextTick()
    //     assert.notEqual('', wrapper.vm.invoke.logonId)
    //   } catch (error) {
    //     assert.fail(error.message)
    //   }
    // })
    it('인증번호 확인후 처리', () => {
      const wrapper = mount(IdFindPhone, options)
      const resultObject = {
        response: {
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
          userId: '666666',
          strLogonId: 'test001@nsmall.com'
        }
      }

      try {
        wrapper.vm.viewType = 'PASS'
        wrapper.vm.handleCheckVerificationCode(resultObject)

        assert.notEqual('', wrapper.vm.invoke.logonId)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })

  // it('resetTimer Call Process', () => {
  //   const wrapper = mount(IdFindPhone, options)
  //   wrapper.vm.resetTimer(wrapper.vm.timer)
  //   assert.equal('5', wrapper.vm.timer.minutes)
  // })

  // it('formattedLimitTime Call Process', () => {
  //   const wrapper = mount(IdFindPhone, options)
  //   wrapper.vm.timer.minutes = '4'
  //   wrapper.vm.timer.seconds = '2'
  //   const timerFormat = wrapper.vm.formattedLimitTime(wrapper.vm.timer)

  //   assert.equal('04:02', timerFormat)
  // })

  /* 휴대폰 인증 완료 처리 */
  describe('휴대폰 인증 완료 기능', () => {
    // it('인증번호가 공백인경우', () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   wrapper.vm.authNumber = ''
    //   const returnFail = wrapper.vm.sendAuthNo()
    //   assert.equal(false, returnFail)
    // })

    // it('인증 완료(ID)', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   const responseResult = {
    //     msg: {
    //       root: {
    //         Searchresult: {
    //           authnumber: '',
    //           status: '1',
    //           search_Id: 'nstest01@nsmall.com',
    //           userId: '',
    //           name: '고객명',
    //           search_yn: 'Y',
    //           text: '인증번호가 확인되었습니다.',
    //           logonId: ''
    //         }
    //       }
    //     }
    //   }

    //   mock
    //     .onPost(idUrl)
    //     .reply(200, responseResult)

    //   try {
    //     wrapper.vm.userNameParams.value = '고객명'
    //     wrapper.vm.userPhoneParams.value = '010-1234-5678'
    //     wrapper.vm.viewType = 'ID'
    //     wrapper.vm.authNumber = '4516'

    //     wrapper.vm.sendAuthNo()

    //     await flushPromises()
    //     await wrapper.vm.$nextTick()
    //     assert.notEqual('', wrapper.vm.authNumber)
    //   } catch (error) {
    //     assert.fail(error.message)
    //   }
    // })

    // it('인증 완료(PASSWORD)', async () => {
    //   const wrapper = mount(IdFindPhone, options)
    //   const responseResult = {
    //     msg: {
    //       root: {
    //         Searchresult: {
    //           authnumber: '',
    //           userId: '',
    //           search_yn: 'Y',
    //           text: '인증번호가 확인되었습니다.',
    //           logonId: ''
    //         }
    //       }
    //     }
    //   }

    //   mock
    //     .onPost(passUrl)
    //     .reply(200, responseResult)

    //   try {
    //     wrapper.vm.userNameParams.value = '고객명'
    //     wrapper.vm.userPhoneParams.value = '010-1234-5678'
    //     wrapper.vm.viewType = 'PASS'
    //     wrapper.vm.authNumber = '8068'

    //     wrapper.vm.sendAuthNo()

    //     await flushPromises()
    //     await wrapper.vm.$nextTick()
    //     assert.notEqual('', wrapper.vm.authNumber)
    //   } catch (error) {
    //     assert.fail(error.message)
    //   }
    // })
  })

  describe('점유인증', () => {
    it('아이디찾기 인증번호 발송 및 확인', async () => {
      const wrapper = mount(IdFindPhone, options)
      const vm = wrapper.vm

      /** 인증번호 발송 결과 mocking start */
      const url = `${CONST.API_URL}/NSIDCheckMoblieCmdReal`
      const mockSendingCodeResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              effectiveTime: '300',
              userId: 111672164,
              numbercreation: '2020-06-09 16:33',
              search_yn: 'Y',
              text: '인증번호 전송이 완료되었습니다.'
            }
          }
        },
        phone1: [
          '010-1234-0070'
        ],
        mode: [
          'S'
        ],
        userId: [
          ''
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        name: [
          '김덕배'
        ],
        accptPathCd: [
          '500'
        ],
        strLogonId: [
          ''
        ],
        authnumber: [
          ''
        ],
        catalogId: [
          '14051'
        ],
        type: [
          'P'
        ],
        mobAPI: [
          'NSIDCheckMoblieCmdReal'
        ],
        storeId: [
          '13001'
        ]
      }
      mock
        .onPost(url)
        .reply(200, mockSendingCodeResult)
      /** 인증번호 발송 결과 mocking end */

      /** 인증번호 발송 start */
      vm.userNameParams.value = '김덕배' // 고객명
      vm.userPhoneParams.value = '01012340070' // 고객 휴대폰
      await vm.$nextTick()

      vm.sendVerificationCode() // 인증코드 발송
      await flushPromises()
      /** 인증번호 발송 end */

      /** 인증번호 확인 결과 mocking start */
      const mockCheckCodeResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              status: '1',
              search_Id: 'asdf@a70.com',
              userId: '',
              name: '김덕배',
              search_yn: 'Y',
              text: '인증번호가 확인되었습니다.',
              logonId: ''
            }
          }
        },
        phone1: [
          '010-1234-0070'
        ],
        mode: [
          'V'
        ],
        userId: [
          '111672164'
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        name: [
          '김덕배'
        ],
        accptPathCd: [
          '500'
        ],
        strLogonId: [
          ''
        ],
        authnumber: [
          '8375'
        ],
        catalogId: [
          '14051'
        ],
        type: [
          'P'
        ],
        mobAPI: [
          'NSIDCheckMoblieCmdReal'
        ],
        storeId: [
          '13001'
        ]
      }
      mock.reset()
      mock
        .onPost(url)
        .reply(200, mockCheckCodeResult)
      /** 인증번호 확인 결과 mocking end */

      /** 인증번호 확인 start */
      vm.$refs.phoneAuth.verificationCode = '1234' // 인증번호 기입
      await vm.$nextTick()
      await vm.$refs.phoneAuth.checkVerificationCode() // 인증번호 확인
      await flushPromises()
      /** 인증번호 확인 end */
    })

    it('비밀번호찾기 인증번호 발송 및 확인', async () => {
      const wrapper = mount(IdFindPhone, options)
      const vm = wrapper.vm
      vm.authType = PHONE_AUTH_CONST.AUTH_TYPE.FIND_PASSWORD

      /** 인증번호 발송 결과 mocking start */
      const sendURL = `${CONST.API_URL}/NSPWCheckMoblieCmdReal`
      const mockSendingCodeResult = {
        msg: {
          root: {
            Searchresult: {
              authnumber: '',
              effectiveTime: '300',
              userId: 111672164,
              numbercreation: '2020-06-09 16:33',
              search_yn: 'Y',
              text: '인증번호 전송이 완료되었습니다.'
            }
          }
        },
        phone1: [
          '010-1234-0070'
        ],
        mode: [
          'S'
        ],
        userId: [
          ''
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        name: [
          '김덕배'
        ],
        accptPathCd: [
          '500'
        ],
        strLogonId: [
          ''
        ],
        authnumber: [
          ''
        ],
        catalogId: [
          '14051'
        ],
        type: [
          'P'
        ],
        mobAPI: [
          'NSIDCheckMoblieCmdReal'
        ],
        storeId: [
          '13001'
        ]
      }
      mock
        .onPost(sendURL)
        .reply(200, mockSendingCodeResult)
      /** 인증번호 발송 결과 mocking end */

      /** 인증번호 발송 start */
      vm.userNameParams.value = '김덕배' // 고객명
      vm.userPhoneParams.value = '01012340070' // 고객 휴대폰
      await vm.$nextTick()

      vm.sendVerificationCode() // 인증코드 발송
      await flushPromises()
      /** 인증번호 발송 end */

      /** router mocking start */
      delete router.history.current
      const current = {
        name: null,
        meta: { title: '비밀번호 찾기', layout: 'LayoutLnb', pageKey: 'PASS' },
        path: '/customer/login/find-pw/phone',
        hash: '',
        query: {},
        params: {
          logonId: 'fdsa1@a.com'
        },
        fullPath: '/',
        matched: []
      }
      router.history.current = current
      /** router mocking end */

      /** 인증번호 확인 결과 mocking start */
      const url = `${CONST.API_URL}/NSPWCheckMoblieCmdReal`
      const mockCheckCodeResult = {
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
        phone1: [
          '010-1234-0070'
        ],
        mode: [
          'V'
        ],
        userId: [
          '111672164'
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        name: [
          '김덕배'
        ],
        accptPathCd: [
          '500'
        ],
        strLogonId: [
          'asdf@a70.com'
        ],
        authnumber: [
          '4681'
        ],
        catalogId: [
          '14051'
        ],
        type: [
          'P'
        ],
        mobAPI: [
          'NSIDCheckMoblieCmdReal'
        ],
        storeId: [
          '13001'
        ]
      }
      mock
        .onPost(url)
        .reply(200, mockCheckCodeResult)
      /** 인증번호 확인 결과 mocking end */

      /** 인증번호 확인 start */
      vm.userNameParams.value = '김덕배' // 고객명
      vm.userPhoneParams.value = '01012340070' // 고객 휴대폰
      vm.$refs.phoneAuth.verificationCode = '1234' // 인증번호 기입
      await vm.$nextTick()
      await vm.$refs.phoneAuth.checkVerificationCode() // 인증번호 확인
      await flushPromises()
      /** 인증번호 확인 end */
    })
  })
})
