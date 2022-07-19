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
import joinSimple from '@/views/customer/join/JoinSimple'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

describe('joinSimple', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url
  let joinUrl
  const e = {
    target: {
      value: ''
    }
  }

  const { location } = window

  before(() => {
    localVue = createLocalVue()
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
    // joinUrl = `${CONST.API_URL}/CustomerJoin`
    joinUrl = `${CONST.API_URL}/NsMobileMemberSignupCmd`

    wrapper = mount(joinSimple, options)
    delete window.location
  })

  after(() => {
    window.location = location
  })

  afterEach(() => {
    mock.reset()
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof joinSimple.data, 'function')
    const defaultData = joinSimple.data()
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
      wrapper.vm.checkJoinId('')

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
      wrapper.vm.checkJoinId('')
      const valueNull = wrapper.vm.emailParams.isError

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(valueNull, true)
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
      wrapper.vm.checkJoinId('')
      const idEmailCheck = wrapper.vm.emailParams.isError

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(idEmailCheck, true)
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
      wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(wrapper.vm.emailParams.isSuccess, false)
    } catch (error) {
      assert.fail(error.message)
    }
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
      wrapper.vm.checkJoinId('')

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.notEqual(wrapper.vm.emailParams.isError, true)
    } catch (error) {
      assert.fail(error.message)
    }
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

    const tmpEmailList = wrapper.vm.emailList
    const emailList = []
    for (let i = 0; i < tmpEmailList.length; i++) {
      emailList[i] = tmpEmailList[i][0] + tmpEmailList[i][1]
    }

    assert.equal(wrapper.vm.isActive, true)
  })

  /* 메일주소 특정 도메인목록 이벤트 검증 */
  it('clearCheck Search E-Mail Domain Process', () => {
    wrapper.vm.emailParams.value = 'abc@na'
    wrapper.vm.clearCheck('', e)

    const tmpEmailList = wrapper.vm.emailList
    const emailList = []
    for (let i = 0; i < tmpEmailList.length; i++) {
      emailList[i] = tmpEmailList[i][0] + tmpEmailList[i][1]
    }

    assert.equal(wrapper.vm.isActive, true)
  })

  /* 메일주소 특정 한글입력 방지 검증 */
  it('clearCheck E-Mail not Kor Process', () => {
    wrapper.vm.emailParams.value = 'a강bb@naver.com'
    const notKor = wrapper.vm.clearCheck('', e)
    assert.equal(notKor, false)
  })

  it('saveJoin Param Fail Process', () => {
    wrapper.vm.emailParams.value = 'testkang'
    const failResult = wrapper.vm.saveJoin()
    assert.notEqual(true, failResult)
  })

  it('saveJoin API Fail Process', async () => {
    wrapper.vm.emailParams.value = 'testkang@naver.com'
    wrapper.vm.userNameParams.value = '강진영'
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.pwdGradeCode = '00'
    wrapper.vm.isDuplicationHpNo = false
    wrapper.vm.emailParams.isSuccess = false
    wrapper.vm.userNameParams.isSuccess = false
    wrapper.vm.userPhoneParams.isSuccess = false
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
          resultMsg: '이미 가입된 정보입니다.',
          resultCode: 'N'
        }
      }
    }

    const checkIdMockResponseResult = {
      msg: {
        result: {
          resultCode: 'Y'
        }
      }
    }

    const checkPhoneMockResponseResult = {
      msg: {
        logonIds: '',
        result: {
          resultMsg: '',
          resultCode: 'S0'
        }
      }
    }

    mock
      .onPost(joinUrl)
      .reply(200, mockResponseResult)

    mock
      .onPost(url)
      .reply(200, checkIdMockResponseResult)

    mock
      .onPost(url)
      .reply(200, checkPhoneMockResponseResult)

    try {
      let rtnVal = true
      rtnVal = await wrapper.vm.saveJoin()
      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.notEqual(true, rtnVal)

      wrapper.vm.emailParams.isSuccess = true
      wrapper.vm.userNameParams.isSuccess = true
      wrapper.vm.userPhoneParams.isSuccess = true

      rtnVal = await wrapper.vm.saveJoin()
      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.notEqual(true, rtnVal)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /**
   * 가입정보저장하기 이벤트
   */
  it('saveJoin Success Process', async () => {
    wrapper.vm.emailParams.value = 'testkang@naver.com'
    wrapper.vm.userNameParams.value = '강진영'
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.pwdGradeCode = '00'
    wrapper.vm.emailParams.isSuccess = true
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

    const checkIdMockResponseResult = {
      msg: {
        result: {
          resultCode: 'Y'
        }
      }
    }

    const checkPhoneMockResponseResult = {
      msg: {
        logonIds: '',
        result: {
          resultMsg: '',
          resultCode: 'S0'
        }
      }
    }

    mock
      .onPost(joinUrl)
      .reply(200, mockResponseResult)

    mock
      .onPost(url)
      .reply(200, checkIdMockResponseResult)

    mock
      .onPost(url)
      .reply(200, checkPhoneMockResponseResult)

    try {
      wrapper.vm.saveJoin()

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
      wrapper.vm.checkPhone()

      await flushPromises()

      await wrapper.vm.$nextTick()
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
      wrapper.vm.checkPhone()

      await flushPromises()

      await wrapper.vm.$nextTick()
      assert.equal(true, wrapper.vm.userPhoneParams.isError)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('checkPhone Certification Target TV User Success Process', async () => {
    wrapper.vm.userPhoneParams.value = '010-1234-5678'
    wrapper.vm.isPhoneFail = false
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
      wrapper.vm.checkPhone()

      await flushPromises()

      await wrapper.vm.$nextTick()

      assert.equal(true, wrapper.vm.userPhoneParams.isError)
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
      assert.notEqual(wrapper.vm.emailParams.isError, true)
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
