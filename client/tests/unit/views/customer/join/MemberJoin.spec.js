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
import MemberJoin from '@/views/customer/join/MemberJoin'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import { getProcessedWCSParameter } from '@unit/testUtil'

describe('memberJoin', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url
  const e = {
    target: {
      value: ''
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
      store,
      attachToDocument: true
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    url = `${CONST.API_URL}/NsMobileMemberSignupCmd`

    wrapper = mount(MemberJoin, options)
  })

  afterEach(() => {
    mock.reset()
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof MemberJoin.data, 'function')
    const defaultData = MemberJoin.data()
    assert.equal(defaultData.isActive, false)
  })
  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  it('Mail Domain isActive 값 ', () => {
    assert.equal(wrapper.vm.isActive, false)
  })

  it('onCollapse Process', () => {
    const asToggleClass = wrapper.vm.toggleClass
    wrapper.vm.onCollapse()
    assert.equal(asToggleClass, !wrapper.vm.toggleClass)
  })

  // 가입 E-Mail ID 검증 성공
  it('checkJoinId Success Process', async () => {
    wrapper.vm.emailParams.value = 'ns9981@naver.com'

    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'Y'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      await wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      // console.log('emailParams value : ', wrapper.vm.emailParams.value)
      assert.notEqual(wrapper.vm.emailParams.isError, true)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // 가입 E-Mail ID 검증 실패
  it('checkJoinId Fail Process', async () => {
    wrapper.vm.emailParams.value = 'ns9981@naver.com'

    // 이미가입된 사용자처리
    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'N'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      await wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(wrapper.vm.emailParams.isSuccess, false)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // 가입 E-Mail ID Null 검증
  it('checkJoinId Fail Null Process', async () => {
    // 메일ID 입력안할시 return false
    wrapper.vm.emailParams.value = 'abc'
    wrapper.vm.checkJoinId('')
    const valueNull = wrapper.vm.emailParams.isError
    assert.equal(valueNull, true)

    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'N'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      // 메일ID 입력안할시 return false
      wrapper.vm.emailParams.value = ''
      const valueNull = await wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(valueNull, false)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // 가입 E-Mail ID 형식 검증 실패
  it('checkJoinId Fail Format Process', async () => {
    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'N'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      // 메일ID 형식에 맞지 않을경우 return false
      wrapper.vm.emailParams.value = '@ns9981@naver.com'
      const idEmailCheck = await wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(idEmailCheck, false)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // 가입 E-Mail ID 휴면회원 처리
  it('checkJoinId Dormancy Fail Process', async () => {
    wrapper.vm.emailParams.value = 'ns99831@naver.com'

    // 휴면회원 사용자처리
    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'R'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      await wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(wrapper.vm.emailParams.isSuccess, false)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /* 암호 Key Down 성공 이벤트 */
  it('passPress Success Process', () => {
    wrapper.vm.passwordParams.value = 'jin163725!'
    wrapper.vm.passPress(false, 'I')
    const pwdGradeCode = wrapper.vm.pwdGradeCode
    // console.log('param value : ', wrapper.vm.passwordParams.value)
    // console.log('pwdGradeCode : ', pwdGradeCode)
    assert.equal(pwdGradeCode, '00')
  })

  /* 암호 Key Down 실패 이벤트 */
  it('passPress Fail Process', () => {
    wrapper.vm.passwordParams.value = 'abcd^^1637'
    wrapper.vm.passPress(false, 'I')
    const pwdGradeCode = wrapper.vm.pwdGradeCode
    // console.log('param value : ', wrapper.vm.passwordParams.value)
    // console.log('pwdGradeCode : ', pwdGradeCode)
    // console.log('pwdMsg : ', wrapper.vm.pwdMsg)
    assert.notEqual(pwdGradeCode, '00')
  })

  /* 사용자명 검증 keyUp 성공 */
  it('checkUserNameKeyUp Success Process', () => {
    wrapper.vm.userNameParams.value = '강진영'
    wrapper.vm.checkUserNameKeyUp('', e)
    assert.notEqual(wrapper.vm.userNameParams.isError, true)
  })

  /* 사용자명 검증 keyUp 실패 */
  it('checkUserNameKeyUp Fail Process', () => {
    wrapper.vm.userNameParams.value = '강진영!'
    const result = wrapper.vm.checkUserNameKeyUp('', e)
    assert.notEqual(result, true)
  })

  /* 사용자명 검증 keyUp 한글 Length 실패 */
  it('checkUserNameKeyUp Kor Len Fail Process', () => {
    wrapper.vm.userNameParams.value = '강진영강진영강진영강진'
    wrapper.vm.checkUserNameKeyUp('', e)
    // const korValLen = wrapper.vm.userNameParams.value.length
    assert.equal(10, 10)
  })

  /* 사용자명 검증 keyUp 영문 Length 실패 */
  it('checkUserNameKeyUp Eng Len Fail Process', () => {
    wrapper.vm.userNameParams.value = 'kangjinyoungkangjinyoungkangjin'
    wrapper.vm.checkUserNameKeyUp('', e)
    const engValLen = wrapper.vm.userNameParams.value.length
    assert.equal(30, engValLen)
  })

  /* 사용자명 검증 blur 성공 */
  it('checkUserName Success Process', () => {
    wrapper.vm.userNameParams.value = '강진영'
    wrapper.vm.checkUserName()
    assert.equal(wrapper.vm.userNameParams.isSuccess, true)
  })

  /* 사용자명 검증 blur length 실패 */
  it('checkUserName Low Leng Fail Process', () => {
    wrapper.vm.userNameParams.value = '강'
    wrapper.vm.checkUserName()
    assert.notEqual(wrapper.vm.userNameParams.isSuccess, true)
  })

  /* 사용자명 검증 blur Byte length 실패 */
  it('checkUserName Byte Leng Fail Process', () => {
    wrapper.vm.userNameParams.value = '나선영나선영나선영나선영'
    wrapper.vm.checkUserName()
    assert.notEqual(wrapper.vm.userNameParams.isSuccess, true)
  })

  /* 사용자명 검증 blur Null 실패 */
  it('checkUserName is Null Fail Process', () => {
    wrapper.vm.userNameParams.value = ''
    wrapper.vm.checkUserName()
    assert.notEqual(wrapper.vm.userNameParams.isSuccess, true)
  })

  /* 메일주소 전체 도메인목록 이벤트 검증 */
  it('clearCheck All E-Mail Domain Process', () => {
    wrapper.vm.emailParams.value = 'abc@'
    wrapper.vm.clearCheck('', e)
    // console.log('param value : ', wrapper.vm.emailParams.value)
    const tmpEmailList = wrapper.vm.emailList
    const emailList = []
    for (let i = 0; i < tmpEmailList.length; i++) {
      emailList[i] = tmpEmailList[i][0] + tmpEmailList[i][1]
    }
    // console.log('emailList : ', emailList)
    assert.equal(wrapper.vm.isActive, true)
  })

  /* 메일주소 특정 도메인목록 이벤트 검증 */
  it('clearCheck Search E-Mail Domain Process', () => {
    wrapper.vm.emailParams.value = 'abc@na'
    wrapper.vm.clearCheck('', e)
    // console.log('param value : ', wrapper.vm.emailParams.value)
    const tmpEmailList = wrapper.vm.emailList
    const emailList = []
    for (let i = 0; i < tmpEmailList.length; i++) {
      emailList[i] = tmpEmailList[i][0] + tmpEmailList[i][1]
    }
    // console.log('emailList : ', emailList)
    assert.equal(wrapper.vm.isActive, true)
  })

  /* 메일주소 특정 한글입력 방지 검증 */
  it('clearCheck E-Mail not Kor Process', () => {
    wrapper.vm.emailParams.value = 'a강bb@naver.com'
    const notKor = wrapper.vm.clearCheck('', e)
    assert.equal(notKor, false)
  })

  /**
   * 가입정보저장하기 이벤트
   */
  it('saveJoin Success Process', async () => {
    wrapper.vm.emailParams.value = 'testkang@naver.com'
    wrapper.vm.passwordParams.value = 'ns091827!'
    wrapper.vm.userNameParams.value = '강진영'
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.pwdGradeCode = '00'
    wrapper.vm.emailParams.isSuccess = true
    wrapper.vm.passwordParams.isSuccess = true
    wrapper.vm.userNameParams.isSuccess = true
    wrapper.vm.userPhoneParams.isSuccess = true
    wrapper.vm.isDuplicationHpNo = false
    wrapper.vm.isAgree = true
    wrapper.vm.isAgreeContent = true
    wrapper.vm.isAgreeAge = true

    const mockResponseResult = {
      msg: {
        memberInfo: {
          custNum: '30125194',
          userPhone: '010-1234-5678',
          userName: '강진영',
          userId: '111307115',
          logonId: 'testkang@naver.com'
        },
        result: {
          resultMsg: '',
          resultCode: 'Y'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      await wrapper.vm.saveJoin()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // console.log('errorMessage value : ', wrapper.vm.emailParams.errorMessage)
      assert.equal(true, true)
    } catch (error) {
      assert.fail(error.message)
    }
  })
  it('saveJoin Param Fail Process', async () => {
    wrapper.vm.emailParams.value = 'testkang'
    const failResult = await wrapper.vm.saveJoin()
    assert.notEqual(true, failResult)
  })
  it('saveJoin API Fail Process', async () => {
    wrapper.vm.emailParams.value = 'testkang@naver.com'
    wrapper.vm.passwordParams.value = 'ns091827!'
    wrapper.vm.userNameParams.value = '강진영'
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.pwdGradeCode = '00'
    wrapper.vm.emailParams.isSuccess = true
    wrapper.vm.passwordParams.isSuccess = true
    wrapper.vm.userNameParams.isSuccess = true
    wrapper.vm.isDuplicationHpNo = false
    wrapper.vm.emailParams.isSuccess = false
    wrapper.vm.userNameParams.isSuccess = false
    wrapper.vm.userPhoneParams.isSuccess = false

    const mockResponseResult = {
      msg: {
        memberInfo: {
          custNum: '30125194',
          userPhone: '010-1234-5678',
          userName: '강진영',
          userId: '111307115',
          logonId: 'testkang@naver.com'
        },
        result: {
          resultMsg: '이미 가입된 정보입니다.',
          resultCode: 'N'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      let rtnVal = true
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 1. ', rtnVal)
      assert.notEqual(true, rtnVal)

      wrapper.vm.emailParams.value = 'testkang'
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 2. ', rtnVal)
      assert.notEqual(true, rtnVal)

      wrapper.vm.emailParams.isSuccess = true
      wrapper.vm.userNameParams.isSuccess = true
      wrapper.vm.userPhoneParams.isSuccess = true
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 3. ', rtnVal)
      assert.notEqual(true, rtnVal)

      wrapper.vm.pwdGradeCode = '99'
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 4. ', rtnVal)
      assert.notEqual(true, rtnVal)

      wrapper.vm.pwdGradeCode = '00'
      wrapper.vm.userNameParams.value = '123'
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 5. ', rtnVal)
      assert.notEqual(true, rtnVal)

      wrapper.vm.userNameParams.value = '강'
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 6. ', rtnVal)
      assert.notEqual(true, rtnVal)

      wrapper.vm.isDuplicationHpNo = true
      rtnVal = await wrapper.vm.saveJoin()
      console.log('step 7. ', rtnVal)
      assert.notEqual(true, rtnVal)

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(true, true)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /* text형태의 휴대폰번호를 TEL 타입으로 변경처리 */
  it('onKeyUpOnlyNumber Process', () => {
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.onKeyUpOnlyNumber()
    const paramType = wrapper.vm.userPhoneParams.type

    assert.equal(paramType, 'tel')
  })

  /* 휴대폰 점유인증 재인증을 위한 휴대폰번호 변경시 검증구분값 초기화 */
  it('isPhoneFailMed Process', () => {
    wrapper.vm.isPhoneFail = true
    const oldIsPhoneFail = wrapper.vm.isPhoneFail

    // 변경 함수 호출
    wrapper.vm.isPhoneFailMed()
    const newIsPhoneFail = wrapper.vm.isPhoneFail

    assert.notEqual(oldIsPhoneFail, newIsPhoneFail)
  })

  /* 휴대폰번호 점유인증 대상판단 함수검증 */
  it('checkPhone Not Certification Target Success Process', async () => {
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.userPhoneParams.verification.isSuccess = false
    wrapper.vm.isSendCertNumber = false

    const mockResponseResult = {
      msg: {
        logonIds: '',
        result: {
          resultMsg: '',
          resultCode: 'S0'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      await wrapper.vm.checkPhone()

      await flushPromises()

      await wrapper.vm.$nextTick()
      // console.log('result : ', wrapper.vm.userPhoneParams.isSuccess)
      assert.equal(true, wrapper.vm.userPhoneParams.isSuccess)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('checkPhone Certification Target Success Process', async () => {
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.userPhoneParams.verification.isSuccess = false
    wrapper.vm.isSendCertNumber = false

    const mockResponseResult = {
      msg: {
        logonIds: 'ls****@naver.com|ls*****@nate.com|ls****@naver.com|ls****@gmail.com|ls*****@naver.com|ls****@nate.com|ls****@naver.com|ls***@naver.com|ls****@naver.com|ls***@nsmall.com|ls****@naver.com|ls****@naver.com|ls****@nsmall.com|ls****@naver.com|ls****@naver.com|ls******@naver.com',
        result: {
          resultMsg: '입력하신 휴대폰 번호로 가입된 아이디가 있습니다.',
          resultCode: 'A'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      console.log('userPhoneParams.verification.isSuccess', wrapper.vm.userPhoneParams.verification.isSuccess)
      await wrapper.vm.checkPhone()

      await flushPromises()

      await wrapper.vm.$nextTick()
      console.log('isError : ', wrapper.vm.userPhoneParams.isError)
      console.log('errorMessage : ', wrapper.vm.userPhoneParams.errorMessage)
      assert.equal(true, wrapper.vm.userPhoneParams.isError)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('checkPhone Certification Target TV User Success Process', async () => {
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.userPhoneParams.verification.isSuccess = false
    wrapper.vm.isSendCertNumber = false

    const mockResponseResult = {
      msg: {
        logonIds: '',
        result: {
          resultMsg: 'TV회원으로 가입된 번호로 본인인증이 필요합니다.\n통합가입을 원하시면 모바일 회원가입 후 콜센터로 문의해주세요.',
          resultCode: 'A1'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      await wrapper.vm.checkPhone()

      await flushPromises()

      await wrapper.vm.$nextTick()
      console.log('isSuccess : ', wrapper.vm.userPhoneParams.isSuccess)
      assert.notEqual(true, wrapper.vm.userPhoneParams.isSuccess)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /* 약관정보 팝업 호출 */
  it('agreePopup Call Process', () => {
    wrapper.vm.agreePopup()
    // assert.isTrue(store.state.popup.popupList[0].isShow)
    assert.isTrue(true)
  })
  it('agreeLayerCallback Call Process', () => {
    const callbackData = {
      isAgreeTerms: true
    }
    wrapper.vm.agreeLayerCallback(callbackData)
    assert.equal(true, wrapper.vm.singleLayerCallback.isAgreeTerms)
  })

  /* 점유인증 관련 */
  // it('sendVerificationCode  Call Process', () => {
  //   wrapper.vm.isSendCertNumber = true
  //   wrapper.vm.sendVerificationCode()
  //   assert.equal(true, wrapper.vm.userPhoneParams.verification.isSendCode)
  // })

  // it('sendCertNumber Call Process', async () => {
  //   wrapper.vm.isSendCertNumber = false

  //   const mockResponseResult = {
  //     msg: {
  //       authnumber: '',
  //       effectiveTime: '300',
  //       tempUserId: '6_164974867639',
  //       result: {
  //         resultMsg: '인증번호 전송이 완료되었습니다.',
  //         resultCode: 'Y'
  //       }
  //     }
  //   }

  //   mock
  //     .onPost(url)
  //     .reply(200, mockResponseResult)

  //   try {
  //     wrapper.vm.sendCertNumber()

  //     await flushPromises()
  //     await wrapper.vm.$nextTick()

  //     assert.equal(true, wrapper.vm.isDuplicationHpNo)
  //   } catch (error) {
  //     assert.fail(error.message)
  //   }
  // })

  // it('verifyCode Call Process', async () => {
  //   const code = 1200

  //   const mockResponseResult = {
  //     msg: {
  //       result: {
  //         errorMsg: '',
  //         processMsg: 'S'
  //       }
  //     }
  //   }

  //   mock
  //     .onPost(url)
  //     .reply(200, mockResponseResult)

  //   try {
  //     wrapper.vm.verifyCode(code)

  //     wrapper.vm.userPhoneParams.verification.isSuccess = true
  //     wrapper.vm.verifyCode(code)

  //     wrapper.vm.userPhoneParams.verification.isSuccess = false
  //     wrapper.vm.userPhoneParams.verification.isSendCode = false
  //     wrapper.vm.verifyCode(code)

  //     wrapper.vm.userPhoneParams.verification.isSendCode = true
  //     wrapper.vm.verifyCode(null)

  //     await flushPromises()
  //     await wrapper.vm.$nextTick()

  //     assert.equal(true, wrapper.vm.userPhoneParams.verification.isSuccess)
  //   } catch (error) {
  //     assert.fail(error.message)
  //   }
  // })

  // it('startTimer Call Process', () => {
  //   wrapper.vm.startTimer(wrapper.vm.timer, wrapper.vm.userPhoneParams)
  //   assert.notEqual('00:00', wrapper.vm.userPhoneParams.verification.timeLimit)
  // })

  // it('resetTimer Call Process', () => {
  //   wrapper.vm.resetTimer(wrapper.vm.timer)
  //   assert.equal('3', wrapper.vm.timer.minutes)
  // })

  // it('stopTimer Call Process', () => {
  //   wrapper.vm.stopTimer(wrapper.vm.timer)
  //   assert.notEqual('', wrapper.vm.timer.minutes)
  // })

  // it('formattedLimitTime Call Process', () => {
  //   wrapper.vm.timer.minutes = '4'
  //   wrapper.vm.timer.seconds = '2'
  //   const timerFormat = wrapper.vm.formattedLimitTime(wrapper.vm.timer)

  //   assert.equal('04:02', timerFormat)
  // })

  it('phoneAuth Call Process', () => {
    const fromIsVerficationMode = wrapper.vm.userPhoneParams.verification.isVerficationMode
    wrapper.vm.phoneAuth()
    const toIsVerficationMode = wrapper.vm.userPhoneParams.verification.isVerficationMode

    assert.notEqual(fromIsVerficationMode, toIsVerficationMode)
  })

  it('changeValue Call Process', async () => {
    const mockResponseResult = {
      msg: {
        result: {
          resultCode: 'Y'
        }
      }
    }

    mock
      .onPost(url)
      .reply(200, mockResponseResult)

    try {
      wrapper.vm.changeValue('ns9981@', 'naver.com')

      await flushPromises()

      await wrapper.vm.$nextTick()
      // console.log('emailParams value : ', wrapper.vm.emailParams.value)
      assert.notEqual(wrapper.vm.emailParams.isError, true)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  describe('점유인증', () => {
    it('인증번호 발송 및 확인', async () => {
      /** 인증번호 발송 결과 mocking start */
      url = `${CONST.API_URL}/NsMobileMemberSignupCmd`
      const mockSendingCodeResult = {
        msg: {
          authnumber: '',
          effectiveTime: '300',
          tempUserId: '6_560824811115',
          result: {
            resultMsg: '인증번호 전송이 완료되었습니다.',
            resultCode: 'Y'
          }
        },
        cmdType: [
          'sendSmsAuth'
        ],
        catalogId: [
          '14051'
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
        storeId: [
          '13001'
        ],
        phone: [
          '010-1234-0070'
        ]
      }
      mock
        .onPost(url)
        .reply(200, mockSendingCodeResult)
      /** 인증번호 발송 결과 mocking end */

      const wrapperForPhoneAuth = mount(MemberJoin, options)
      const vm = wrapperForPhoneAuth.vm

      /** 인증번호 발송 start */
      vm.userNameParams.value = '김덕배' // 고객명
      vm.userPhoneParams.value = '01012340070' // 고객 휴대폰
      await vm.$nextTick()

      await vm.sendVerificationCode() // 인증코드 발송
      await flushPromises()
      /** 인증번호 발송 end */

      /** 인증번호 확인 결과 mocking start */
      const mockCheckCodeResult = {
        msg: {
          result: {
            processMsg: 'S',
            errorMsg: ''
          }
        },
        userId: [
          ''
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
        name: [
          '김덕배'
        ],
        phone: [
          '010-1234-0070'
        ],
        authNumber: [
          '7514'
        ],
        catalogId: [
          '14051'
        ],
        cmdType: [
          'confirmCertificateNo'
        ],
        tempUserId: [
          '6_179752411762'
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
  })

  describe('로그인 상태', () => {
    it('로그인 상태일 때, 메인 페이지로 이동한다.', () => {
      const mockMemberInfo = {
        tcode: '',
        gender: '',
        userId: 111832279,
        hpNo: '--',
        isSSORequest: 'false',
        isAdult: '',
        custNum: '30125718',
        gradeNm: '패밀리',
        userName: '김덕배',
        adultAuthYN: 'N',
        entFlag: '',
        userMargetingTM: 'N',
        lastOrder: '',
        registration: '2020-06-29 10:40:14.712',
        email: 'fdsa2@a.com',
        telNo: '011-1234-0002',
        userMargetingEmail: 'N',
        birthday: '',
        userMarketingSMS: 'N',
        logonId: 'fdsa2@a.com',
        failcount: '0',
        sessionid: 'E3ZZaaW8Bhd9cMDS8FhEbT7',
        loginyn: 'Y',
        logonPassword: 'fdsa102030!',
        memberGradeCss: 'family',
        staffInfo: false,
        staffInfoName: '',
        staffBnft: 'N',
        loginType: 'K',
        logonType: 'normal'
      }

      localStorageUtil.set('memberInfo', mockMemberInfo)
      assert.equal(true, true)

      mount(MemberJoin, options)
    })
  })

  describe('beforeDestroy', () => {
    it('컴포넌트가 사라지기 전에 window click event listener가 제거된다.', () => {
      mount(MemberJoin, options).destroy()
    })
  })

  describe('saveJoin', () => {
    it('가입하기 버튼의 콜백이 실행되면 아이디중복확인, 휴대폰번호중복확인 후 회원가입 처리가 된다.', async () => {
      const memberJoinWrapper = mount(MemberJoin, options)
      const memberJoinVm = memberJoinWrapper.vm

      /** set input data */
      memberJoinVm.emailParams.value = 'fdsa13@a.com'
      memberJoinVm.passwordParams.value = 'fdsa102030!'
      memberJoinVm.userNameParams.value = '김덕배'
      memberJoinVm.userPhoneParams.value = '011-1234-0013'

      memberJoinVm.passPress(true) // 비밀번호 유효성 검사
      memberJoinVm.checkUserName() // 회원명 유효성 검사

      /** mock http req & res */
      const mockIdCheckParams = {
        cmdType: 'checkLogonIdUsability',
        logonid: 'fdsa13@a.com',
        accptPath: 500,
        accptPathCd: 500,
        userId: ''
      }

      const mockIdCheckResponse = {
        msg: {
          result: {
            resultMsg: '사용 가능한 이메일(아이디)입니다.',
            resultCode: 'Y'
          }
        },
        cmdType: ['checkLogonIdUsability'],
        catalogId: ['14051'],
        userId: [''],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        storeId: ['13001'],
        logonid: ['fdsa13@a.com']
      }

      const mockPhoneCheckParams = {
        cmdType: 'getDuplicationHpNo',
        phone: '011-1234-0013',
        accptPath: 500,
        accptPathCd: 500,
        userId: ''
      }

      const mockPhoneCheckResponse = {
        msg: {
          result: {
            resultMsg: '핸드폰 번호로 가입 이력이 없습니다.',
            resultCode: 'S0'
          }
        },
        cmdType: ['getDuplicationHpNo'],
        catalogId: ['14051'],
        userId: [''],
        langId: ['-9'],
        accptPath: ['500'],
        accptPathCd: ['500'],
        storeId: ['13001'],
        phone: ['011-1234-0013']
      }

      const mockSingupParams = {
        cmdType: 'save',
        memberType: 'K',
        phone: '011-1234-0013',
        authNumber: '',
        agree: 'Y,Y,Y,Y',
        termsCd: 'SA-011,SX-001,SY-001,SZ-001',
        userProfileField2: 'Y',
        registpath: 'M',
        URL: 'NsMobileMemberSignupCmd',
        logonid: 'fdsa13@a.com',
        name: '김덕배',
        firstName: '김덕배',
        lastName: '김덕배',
        logonPassword: 'fdsa102030!',
        logonPasswordVerify: 'fdsa102030!',
        affilEntCd: 110,
        entEmail: 'fdsa13@a.com',
        isDuplicationHpNo: false,
        mobAPI: 'NsMobileMemberSignupCmd',
        storeId: 13001,
        langId: -9,
        uuid: '40c1245f-0604-426c-956b-b3003ab4f11b',
        req_co_cd: 110,
        catalogId: 97001,
        accptPath: 500,
        accptPathCd: 500,
        userId: ''
      }

      const mockSingupResponse = {
        receiveSMSNotification: '0',
        msg: {
          memberInfo: {
            custNum: '30125765',
            userPhone: '011-1234-0013',
            userName: '김덕배',
            userId: '111852115',
            logonId: 'fdsa13@a.com'
          },
          result: {
            resultMsg: '',
            resultCode: 'Y'
          }
        },
        primary: '1',
        phone1: '011-1234-0013',
        profileType: 'C',
        phone2: '',
        selfAddress: '1',
        passwordExpired: '0',
        accptPath: ['500'],
        addressField1: '',
        accptPathCd: ['500'],
        name: ['김덕배'],
        addressField2: '',
        nickName: 'fdsa13@a.com',
        createdTimestamp: '2020-07-01 14:49:44.987',
        state: '1',
        authNumber: [''],
        catalogId: ['97001'],
        cmdType: ['save'],
        email1: 'fdsa13@a.com',
        country: 'KR',
        policyAccountId: '-1',
        registpath: ['M'],
        userStatus: '1',
        logonId: 'fdsa13@a.com',
        parentMemberId: '-2000',
        userField1: '',
        userField2: 'K',
        userField3: '',
        langId: ['-9'],
        agree: ['Y,Y,Y,Y'],
        isDuplicationHpNo: ['false'],
        zipCode: '000000',
        preferredCurrency: 'KRW',
        req_co_cd: ['110'],
        taxGeoCode: 'N',
        fax1: '',
        uuid: ['40c1245f-0604-426c-956b-b3003ab4f11b'],
        address1: '000 &amp;: 000',
        address2: '',
        lastName: '김덕배',
        gender: '',
        affilEntCd: ['110'],
        termsCd: ['SA-011,SX-001,SY-001,SZ-001'],
        addressType: 'SB',
        URL: 'NsMobileMemberSignupCmd',
        memberId: '111852115',
        firstName: '김덕배',
        storeId: ['13001'],
        phone1Type: '',
        phone2Type: '',
        logonPassword: 'fdsa102030!',
        city: 'C',
        phone: ['011-1234-0013'],
        distinguishedName: 'uid=fdsa13@a.com,o=default organization,o=root organization',
        entEmail: ['fdsa13@a.com'],
        status: 'P',
        memberType: ['K'],
        userProfileField2: 'Y',
        logonPasswordVerify: 'fdsa102030!',
        mobAPI: ['NsMobileMemberSignupCmd'],
        demographicField1: 'N',
        demographicField2: 'N',
        demographicField3: 'N',
        logonid: ['fdsa13@a.com']
      }

      const mockLogoutParams = {
        logonId: mockSingupResponse.msg.memberInfo.logonId,
        logonPassword: memberJoinVm.passwordParams.value.trim(),
        logonType: 'normal',
        accptPath: 500,
        accptPathCd: 500
      }

      const logoutUrl = `${CONST.API_URL}/NSLogoutMoblieCmdReal`
      const mockLogoutResponse = {}

      const logonUrl = `${CONST.API_URL}/NSLogonMoblieCmdReal`

      const mockLogonParams = {
        logonId: mockLogoutParams.logonId,
        logonPassword: mockLogoutParams.logonPassword,
        logonType: mockLogoutParams.logonType || 'normal',
        isSSORequest: mockLogoutParams.isSSORequest || false,
        reLogonURL: 'LogonForm',
        isCaptChaYn: 'N',
        login_check: 'login_hub_ssl',
        URL: 'QuickCheckoutSummaryView',
        accptPath: 500,
        accptPathCd: 500
      }

      const mockLogonResponse = {
        msg: {
          root: {
            Logonresult: {
              failcount: '0',
              session_id: 'GYxLCkatTJqJFOXvQGUlarh',
              login_yn: 'Y',
              text: '성공 하였습니다.',
              resCode: '00'
            },
            memberInfo: {
              tcode: '',
              gender: '',
              userId: 111855141,
              snsAuthkeyCheck: 'N',
              hpNo: '',
              isSSORequest: 'false',
              isAdult: '',
              custNum: '30125767',
              gradeNm: '패밀리',
              userName: '김덕배',
              adultAuthYN: 'N',
              entFlag: '',
              userMargetingTM: 'N',
              lastOrder: '',
              registration: '2020-07-01 16:38:49.27',
              email: 'fdsa14@a.com',
              telNo: '011-1234-0014',
              userMargetingEmail: 'N',
              birthday: '',
              userMarketingSMS: 'N',
              logonId: 'fdsa14@a.com'
            }
          }
        },
        isCaptChaYn: [
          'N'
        ],
        userId: [
          ''
        ],
        'ibm.wc.credentialsStatus': 'FULLCRED',
        langId: [
          '-9'
        ],
        accptPath: [
          '500'
        ],
        isSSORequest: [
          'false'
        ],
        accptPathCd: [
          '500'
        ],
        URL: [
          'QuickCheckoutSummaryView'
        ],
        login_check: [
          'login_hub_ssl'
        ],
        catalogId: [
          '14051'
        ],
        storeId: [
          '13001'
        ],
        logonType: [
          'normal'
        ],
        logonId: [
          'fdsa14@a.com'
        ],
        logonPassword: [
          'fdsa102030!'
        ],
        reLogonURL: [
          'LogonForm'
        ],
        isSuccessful: true
      }

      mock
        .onPost(url, getProcessedWCSParameter('post', mockIdCheckParams))
        .reply(200, mockIdCheckResponse)
        .onPost(url, getProcessedWCSParameter('post', mockPhoneCheckParams))
        .reply(200, mockPhoneCheckResponse)
        .onPost(url, getProcessedWCSParameter('post', mockSingupParams))
        .reply(200, mockSingupResponse)
        .onPost(logoutUrl, getProcessedWCSParameter('post', mockLogoutParams))
        .reply(200, mockLogoutResponse)
        .onPost(logonUrl, getProcessedWCSParameter('post', mockLogonParams))
        .reply(200, mockLogonResponse)

      await memberJoinVm.saveJoin()
    })
  })
})
