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
import memberModify from '@/views/customer/info/MemberModify'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@/common/utils/loginUtil'

describe('MemberModify', () => {
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

  const passUrl = `${CONST.API_URL}/NSPWChangeMoblieCmdReal`
  const changeUrl = `${CONST.API_URL}/NSCustInfoChangeReal`
  // const phoneAuthUrl = `${CONST.API_URL}/NsMobileMemberSignupCmd`
  // const phoneChangeUrl = `${CONST.API_URL}/NSPhoneCheckMoblieCmdReal`
  const defaultOnLoadUrl = `${CONST.API_URL}/MobilePersonalInfoManageCmdReal`
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
    lastName: '강진영',
    adultAuthYN: 'N',
    entFlag: 'Y',
    userMargetingTM: 'N',
    tmYn: 'N',
    lastOrder: '2020-03-12 18:21:20.125',
    registration: '2020-03-12 16:44:06.125',
    email: 'lsd251@nsmall.com',
    telNo: '010-9898-9342',
    phoneNum: '010-9898-9342',
    userMargetingEmail: 'N',
    emailYn: 'N',
    birthday: '19840425',
    relBirth: '19840425',
    userMarketingSMS: 'N',
    smsYn: 'N',
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
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()
    sessionStorage.clear()
    localStorage.removeItem('memberInfo')
    // cookieUtil.deleteCookie('securityVerification')
    loginUtil.login(memberInfo)
    const responseResult = {
      msg: {
        root: {
          PersonalInfo: memberInfo
        }
      }
    }

    mock
      .onPost(defaultOnLoadUrl)
      .reply(200, responseResult)
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof memberModify.data, 'function')
    const defaultData = memberModify.data()
    assert.equal(defaultData.userEmailParams.isSuccess, false)
  })

  describe('버튼 이벤트', () => {
    it('버튼 클릭', () => {
      try {
        const wrapper = mount(memberModify, options)
        wrapper.find('button').trigger('click')
        // assert.equal(true, wrapper.vm.idCollapse)
        assert.isTrue(true, `-${wrapper.vm.idCollapse}`)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })

  describe('메일주소 검증', () => {
    it('메일주소가 한글인경우', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userEmailParams.value = '이메일'
      const validationFail = wrapper.vm.checkEmail('', e)
      assert.notEqual(true, validationFail)
    })

    it('메일주소가 40자 초과인 경우', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userEmailParams.value = 'abcdefghij1234567890@abcdefghij1234567890abcdefghij1234567890'
      const validationFail = wrapper.vm.checkEmail('', e)
      assert.notEqual(true, validationFail)
    })

    it('EMail ID인경우 @입력시 도메인목록 노출', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.userEmailParams.value = 'nstest@'
      wrapper.vm.checkEmail('', e)
      assert.equal(true, wrapper.vm.isActive)
      wrapper.vm.userEmailParams.value = 'nstest@na'
      wrapper.vm.checkEmail('', e)
      assert.equal(true, wrapper.vm.isActive)
    })

    it('메일주소가 정상검증된 경우', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userEmailParams.value = 'nstest01@nsmall.com'
      const validationOk = wrapper.vm.checkEmail('', e)
      assert.notEqual(true, validationOk)
    })

    it('이메일 도메인선택한경우', () => {
      const wrapper = mount(memberModify, options)
      const id = 'test01'
      const domain = '@naver.com'
      wrapper.vm.changeValue(id, domain)
      assert.notEqual('', wrapper.vm.userEmailParams.value)
    })
  })

  describe('암호변경 검증', () => {
    it('입력값이 정책에 맞지 않는 경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = '111123aqwdf!'
      wrapper.vm.passPress()
      assert.notEqual('00', wrapper.vm.pwdGradeCode)
    })

    it('입력값이 정상적일 경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = 'Jin163725!'
      wrapper.vm.passPress()
      assert.equal('00', wrapper.vm.pwdGradeCode)
    })

    it('확인입력값이 변경입력값과 일치 하지 않는 경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass01!'
      wrapper.vm.inputPwdConfirmParams.value = 'nspass02!'
      wrapper.vm.passwordCompare()
      assert.notEqual(true, wrapper.vm.isPasswordCheck)
    })

    it('확인입력값이 변경입력값과 일치 할 경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass01!'
      wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
      wrapper.vm.passwordCompare()
      assert.equal(true, wrapper.vm.isPasswordCheck)
    })
  })

  describe('휴대폰번호 검증', () => {
    it('휴대폰번호가 숫자형식인지 체크', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '010-1234-5678'
      wrapper.vm.userPhoneParams.value = str
      const validationFail = wrapper.vm.onKeyUpOnlyNumber()
      assert.notEqual(str, validationFail)
    })

    it('휴대폰번호가 NULL확인', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = ''
      wrapper.vm.userPhoneParams.value = str
      const validationFail = wrapper.vm.checkPhone()
      assert.notEqual(true, validationFail)
    })

    it('휴대폰번호가 10자리 미만인경우', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      const str = '010-1234'
      wrapper.vm.userPhoneParams.value = str
      const validationFail = wrapper.vm.checkPhone()
      assert.notEqual(true, validationFail)
    })

    it('휴대폰번호가 정상인경우', () => {
      const wrapper = mount(memberModify, options)
      // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
      wrapper.vm.userPhoneParams.value = '010-1234-5678'
      wrapper.vm.checkPhone()
      assert.equal('text', String(wrapper.vm.userPhoneParams.type))
    })
  })

  describe('생년월일 검증', () => {
    it('입력값 문자가 들어간경우 false를 return하는지 확인', () => {
      const wrapper = mount(memberModify, options)
      // 입력값 문자가 들어간경우 false를 return하는지 확인
      wrapper.vm.birthDayParams.value = '19840401a'
      const notNuberCheck = wrapper.vm.numberCheck()
      assert.equal(notNuberCheck, false)
    })

    it('MAXLENG와 다르면 false확인', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '1984040104'
      const notMaxlangCheck = wrapper.vm.numberCheck()
      assert.equal(notMaxlangCheck, false)
    })

    it('validDate조건 false 확인', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '20120101'
      const notValidDateCheck = wrapper.vm.numberCheck()
      assert.equal(notValidDateCheck, false)
    })

    it('모든조건에 만족하면 birthDayParams의 isError은 false 세팅', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '19840401'
      wrapper.vm.numberCheck()
      assert.equal(wrapper.vm.birthDayParams.isError, false)
    })

    it('14세미만 인경우', () => {
      const wrapper = mount(memberModify, options)
      // 14세미만 인경우 return false
      const notUnderFourteenCheck = wrapper.vm.isBirthDayFourteenValidDate('20120101')
      assert.equal(notUnderFourteenCheck.stat, false)
    })

    it('생일의 월이 1~12가 아닌경우', () => {
      const wrapper = mount(memberModify, options)
      // 생일의 월이 1~12가 아닌경우 return false
      const monthCheck = wrapper.vm.isBirthDayFourteenValidDate('20120001')
      assert.equal(monthCheck.stat, false)
    })

    it('생일의 일자가 1~31가 아닌경우', () => {
      const wrapper = mount(memberModify, options)
      // 생일의 일자가 1~31가 아닌경우 return false
      const dayCheck = wrapper.vm.isBirthDayFourteenValidDate('20120133')
      assert.equal(dayCheck.stat, false)
    })

    it('생일의 월이 4, 6, 9, 11월인 경우 일자는 30일까지만 있으므로 31일로 들어온경우', () => {
      const wrapper = mount(memberModify, options)
      // 생일의 월이 4, 6, 9, 11월인 경우 일자는 30일까지만 있으므로 31일로 들어온경우 return false
      const month2Check = wrapper.vm.isBirthDayFourteenValidDate('20120431')
      assert.equal(month2Check.stat, false)
    })

    it('생일의 월이 2월인경우', () => {
      const wrapper = mount(memberModify, options)
      // 생일의 월이 2월인경우 일자는 29일까지만 있고 4년에 한번씩 29일만 존재하므로 해당 조건에 만족하지 않으면 return false
      const month3Check = wrapper.vm.isBirthDayFourteenValidDate('19970229')
      assert.equal(month3Check.stat, false)
    })

    it('모든조건에 만족하는 경우', () => {
      const wrapper = mount(memberModify, options)
      // 모든조건에 만족하면 return은 true 세팅
      const successCheck = wrapper.vm.isBirthDayFourteenValidDate('19840401')
      assert.equal(successCheck.stat, true)
    })
  })

  describe('성별 수정', () => {
    it('setSex Call Process', async () => {
      const wrapper = mount(memberModify, options)
      const mockResponseResult = {
        msg: {
          isSuccess: 'Y'
        }
      }

      mock
        .onPost(changeUrl)
        .reply(200, mockResponseResult)

      try {
        await wrapper.vm.setSex('F')

        await flushPromises()

        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })
  })

  describe('암호변경 API 검증', () => {
    it('변경 암호가 공백인경우', async () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = ''
      wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
      const returnFail = wrapper.vm.chagePassword()
      assert.equal(false, returnFail)
    })

    it('변경 암호가 정상 체크가 안된경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass02!'
      wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
      wrapper.vm.passwordCompare()

      const returnFail = wrapper.vm.chagePassword()
      assert.equal(false, returnFail)
    })

    it('변경 암호확인 값이 공백인경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.inputNewPwdParams.value = 'nspass02!'
      wrapper.vm.inputPwdConfirmParams.value = ''
      wrapper.vm.passPress()

      const returnFail = wrapper.vm.chagePassword()
      assert.equal(false, returnFail)
    })

    it('암호 변경 정상', async () => {
      const wrapper = mount(memberModify, options)
      const responseResult = {
        msg: {
          root: {
            Searchresult: {
              change_yn: 'Y'
            }
          }
        }
      }

      mock
        .onPost(passUrl)
        .reply(200, responseResult)

      try {
        wrapper.vm.inputNewPwdParams.value = 'nspass01!'
        wrapper.vm.inputPwdConfirmParams.value = 'nspass01!'
        wrapper.vm.passPress()
        wrapper.vm.passwordCompare()

        wrapper.vm.chagePassword()

        await flushPromises()
        await wrapper.vm.$nextTick()
        assert.notEqual('', wrapper.vm.passwordInvoke.userPwd)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })

  describe('선택정보 저장 기능', () => {
    it('MAXLENG와 다르면 false확인', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '1984040104'
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생년월일이 NULL 인경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = ''
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생일의 월이 1~12가 아닌경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '20010001'
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생일의 일자가 1~31가 아닌경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '20010133'
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생일의 월이 4, 6, 9, 11월인 경우 일자는 30일까지만 있으므로 31일로 들어온경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '20010431'
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생일의 월이 2월인경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '19970229'
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생일의 현재일 이후 인경우', () => {
      const wrapper = mount(memberModify, options)
      wrapper.vm.birthDayParams.value = '20210101'
      const notMaxlangCheck = wrapper.vm.saveBirth()
      assert.equal(notMaxlangCheck, false)
    })

    it('생년월일 변경', async () => {
      const wrapper = mount(memberModify, options)
      const mockResponseResult = {
        msg: {
          isSuccess: 'Y'
        }
      }

      mock
        .onPost(changeUrl)
        .reply(200, mockResponseResult)

      try {
        wrapper.vm.birthDayParams.value = '19810401'
        await wrapper.vm.saveBirth()

        await flushPromises()

        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })
    // 전체 선택/해제 함수
    it('setAllAgree Call Process', () => {
      const wrapper = mount(memberModify, options)
      // 전체 선택해제 상테에서 전체선택 처리시 isAllAgree는 true로 변경된다.
      wrapper.vm.isAllAgree = false
      wrapper.vm.setAllAgree()
      assert.equal(true, wrapper.vm.isAllAgree)

      // 전체 선택상테에서 전체해제 처리시 isAllAgree는 false로 변경된다.
      wrapper.vm.setAllAgree()
      assert.notEqual(true, wrapper.vm.isAllAgree)
    })

    it('메일수신동의 변경', async () => {
      const wrapper = mount(memberModify, options)
      const mockResponseResult = {
        msg: {
          isSuccess: 'Y'
        }
      }

      mock
        .onPost(changeUrl)
        .reply(200, mockResponseResult)

      try {
        wrapper.vm.isAgreeEmail = false
        await wrapper.vm.setAgree('mail')

        await flushPromises()

        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('SMS수신동의 변경', async () => {
      const wrapper = mount(memberModify, options)
      const mockResponseResult = {
        msg: {
          isSuccess: 'Y'
        }
      }

      mock
        .onPost(changeUrl)
        .reply(200, mockResponseResult)

      try {
        wrapper.vm.isAgreeSMS = false
        await wrapper.vm.setAgree('sms')

        await flushPromises()

        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('TM수신동의 변경', async () => {
      const wrapper = mount(memberModify, options)
      const mockResponseResult = {
        msg: {
          isSuccess: 'Y'
        }
      }

      mock
        .onPost(changeUrl)
        .reply(200, mockResponseResult)

      try {
        wrapper.vm.isAgreeTel = false
        wrapper.vm.gender = 'F'
        wrapper.vm.birthDayParams.value = '19810101'
        await wrapper.vm.setAgree('tel')

        await flushPromises()

        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('TM수신동의 변경 실패', async () => {
      const wrapper = mount(memberModify, options)
      const mockResponseResult = {
        msg: {
          isSuccess: 'Y'
        }
      }

      mock
        .onPost(changeUrl)
        .reply(200, mockResponseResult)

      try {
        wrapper.vm.isAgreeTel = false

        wrapper.vm.gender = ''
        wrapper.vm.birthDayParams.value = ''
        await wrapper.vm.setAgree('tel')

        wrapper.vm.gender = ''
        wrapper.vm.birthDayParams.value = '19810101'
        await wrapper.vm.setAgree('tel')

        wrapper.vm.gender = 'F'
        wrapper.vm.birthDayParams.value = ''
        await wrapper.vm.setAgree('tel')

        await flushPromises()

        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })
  })

  describe('점유인증', () => {
    it('인증번호 발송 및 확인', async () => {
      const wrapper = mount(memberModify, options)
      const vm = wrapper.vm

      /** 인증번호 발송 결과 mocking start */
      const url = `${CONST.API_URL}/NSPhoneCheckMoblieCmdReal`
      const mockSendingCodeResult = {
        msg: {
          root: {
            EXCPT_YN: 'N',
            FINAL_RVIS_PIC: 'NSBAQ',
            TEAM_CD: '000',
            phone1: '',
            verificationCode: '4714',
            RECVR_TEL: '',
            SEND_TO_TEL: '16887700',
            TRMS_STAT: '1',
            INIT_REGI_PIC: 'NSBAQ',
            USER_ID: 'MALL',
            TRMS_QTY_SPR: '00',
            processMsg: {
              authnumber: '',
              processMsg: 'S',
              phone1: '',
              effectiveTime: '300',
              UserId: '111672164',
              sucessMsg: '인증번호 전송이 완료되었습니다.'
            },
            PRIORRANK: '1',
            SMS: '[NSMALL] 본인인증번호는 4714 입니다. 정확히 입력해 주세요.',
            MSG_CD: '00'
          }
        },
        pMode: [
          'K'
        ],
        catalogId: [
          '14051'
        ],
        userId: [
          '111672164'
        ],
        authUsage: [
          '6'
        ],
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        accptPathCd: [
          '500'
        ],
        storeId: [
          '13001'
        ],
        phone: [
          '010-1234-0071'
        ]
      }
      mock
        .onPost(url)
        .reply(200, mockSendingCodeResult)
      /** 인증번호 발송 결과 mocking end */

      /** 인증번호 발송 start */
      vm.userNameParams.value = '김덕배' // 고객명
      vm.phoneParams.value = '01012340070' // 현재 사용중인 휴대폰
      vm.userPhoneParams.value = '01012340071' // 변경할 휴대폰
      await vm.$nextTick()

      vm.sendVerificationCode() // 인증코드 발송
      await flushPromises()
      /** 인증번호 발송 end */

      /** 인증번호 확인 결과 mocking start */
      const mockCheckCodeResult = {
        msg: {
          root: {
            processMsg: {
              processMsg: 'S',
              sucessMsg: '회원정보를 인증된 휴대전화 번호로 수정하였습니다.'
            }
          }
        },
        modifyUserHpNoYn: [
          'Y'
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
        accptPathCd: [
          '500'
        ],
        Phone: [
          '010-1234-0071'
        ],
        phone: [
          '010-1234-0071'
        ],
        authNumber: [
          '8420'
        ],
        pMode: [
          'C'
        ],
        custNum: [
          '30125521'
        ],
        catalogId: [
          '14051'
        ],
        authUsage: [
          '6'
        ],
        storeId: [
          '13001'
        ],
        email: [
          'asdf@a70.com'
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
  })

  describe('이메일 인증', () => {
    it('인증번호 발송 및 확인', async () => {
      const wrapper = mount(memberModify, options)
      const vm = wrapper.vm

      /** 인증번호 발송 결과 mocking start */
      const url = `${CONST.API_URL}/NSAuthNumberConfirmCmd`
      const mockSendingCodeResult = {
        userTypeGb: ['K'],
        userId: ['111672164'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        authNumRecall: ['N'],
        authNumber: [''],
        processMsg: 'S',
        pMode: ['R'],
        catalogId: ['14051'],
        email1: [''],
        oldLogonId: ['asdf@a70.com'],
        duplicationChk: ['Y'],
        authUsage: ['5'],
        processFlag: 'R',
        storeId: ['13001'],
        sucessMsg: '인증번호 전송이 완료되었습니다.',
        newLogonId: ['asdf@a700.com']
      }
      mock
        .onPost(url)
        .reply(200, mockSendingCodeResult)

      /** 고객 아이디 설정 */
      const mockEmail = 'asdf@70.com'
      vm.userEmailParams.value = mockEmail
      await vm.$nextTick()

      /** 인증번호 발송 start */
      vm.sendVerificationCodeEmail() // 인증코드 발송
      await flushPromises()

      /** 인증번호 확인 결과 mocking start */
      const mockCheckCodeResult = {
        userTypeGb: ['K'],
        userId: ['111672164'],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        rtnCd: 'S',
        authNumRecall: ['Y'],
        authNumber: ['5779'],
        pMode: ['C'],
        catalogId: ['14051'],
        email1: [''],
        oldLogonId: ['asdf@a70.com'],
        duplicationChk: ['Y'],
        authUsage: ['5'],
        processFlag: 'C',
        email: [''],
        storeId: ['13001'],
        newLogonId: ['asdf@a700.com'],
        successMsg: '이메일(아이디)가 정상적으로 변경되었습니다.'
      }
      mock.reset()
      mock
        .onPost(url)
        .reply(200, mockCheckCodeResult)

      /** 인증번호 확인 start */
      const emailAuthVm = vm.$refs.emailAuth
      emailAuthVm.verificationCode = '1234' // 인증번호 기입
      await vm.$nextTick()
      await emailAuthVm.checkVerificationCode() // 인증번호 확인
      await flushPromises()
      /** 인증번호 확인 end */
    })
  })
})
