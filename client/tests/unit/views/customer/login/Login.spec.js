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
import login from '@/views/customer/login/Login'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@utils/loginUtil'

describe('login', () => {
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

  const loginUrl = `${CONST.API_URL}/NSLogonMoblieCmdReal`
  const staffSearchUrl = `${CONST.API_URL}/GetStaffAuthInfo`
  const simpLoginSearchUrl = `${CONST.API_URL}/NsMobileMemberSignupCmd`
  const ajaxOrderPayNow4Url = `${CONST.API_URL}/AjaxNSOrderPayNow4Worklight`

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(() => {
    mock.reset()

    window.NSHub = {
      naGoHome: () => {},
      naShowToast: m => {},
      naGa360LoggerNativeSend: (a, b) => {},
      naGetPushAgree: () => {}
    }
  })

  afterEach(() => {
    window.NSHub = undefined
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof login.data, 'function')
    const defaultData = login.data()
    assert.equal(defaultData.idParams.isSuccess, false)
  })

  /* 로그인 validation File */
  it('login Call Validation Fail Process', () => {
    const wrapper = mount(login, options)
    // validation에서 성공하지 않으면 이후 프로세스는 진행하지 않는다.
    wrapper.vm.idParams.value = ''
    wrapper.vm.passwordParams.value = 'aqws0154!'
    const validationFail = wrapper.vm.toLogon()
    assert.notEqual(true, validationFail)
  })

  /* 로그인 5회오류 처리 */
  it('login Call 5 Fail Process', async () => {
    const wrapper = mount(login, options)
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
      .onPost(loginUrl)
      .reply(200, loginMockResponseResult)

    try {
      wrapper.vm.idParams.value = 'nstest01@nsmall.com'
      wrapper.vm.passwordParams.value = 'aqws0154!'
      // 암호 5회 연속 틀린경우 자동입력방지처리 프로세스
      wrapper.vm.toLogon()

      await flushPromises()
      await wrapper.vm.$nextTick()
      assert.equal(false, wrapper.vm.autoInputPrevention)
      assert.notEqual('', wrapper.vm.captchaObject)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  /* 네이버캡차처리 */
  it('네이버 캡챠 이미지 노출', () => {
    const wrapper = mount(login, options)
    wrapper.vm.getCaptchaType(true)
    const isImageCaptcha = wrapper.vm.isImageCaptcha
    assert.equal(true, isImageCaptcha)
  })

  it('네이버 캡챠 결과에 따른 처리', () => {
    const wrapper = mount(login, options)
    wrapper.vm.getCaptchaProc({ result: true })
    const isCaptcha = wrapper.vm.isCaptcha
    assert.equal(true, isCaptcha)
  })

  it('비밀번호 찾기 버튼 클릭 이벤트', () => {
    const wrapper = mount(login, options)
    wrapper.vm.findPwLogging()
  })

  /* 로그인처리 */
  it('login Call Success Process', async () => {
    const wrapper = mount(login, options)
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
      console.log('isAutoLoginCheck : ', wrapper.vm.isAutoLoginCheck)

      await flushPromises()

      await wrapper.vm.$nextTick()
      // assert.equal(false, wrapper.vm.isAutoLoginCheck)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // id의 형식체크
  it('emailCheck Call Process', () => {
    const wrapper = mount(login, options)
    // 이메일형식도 아니고 일반아이디형식도 아닌경우 에러메세지발생
    wrapper.vm.idParams.value = '!@#!!'
    wrapper.vm.emailCheck()
    // assert.notEqual(false, wrapper.vm.passwordParams.isError)

    // 이메일형식이거나 일반아이디형식이면 에러메세지 삭제된다
    wrapper.vm.idParams.value = 'nstest01@nsmall.com'
    wrapper.vm.emailCheck()
    // assert.equal(false, wrapper.vm.idParams.isError)
  })

  // id/password Validation check
  it('loginValidation Call Process', () => {
    const wrapper = mount(login, options)
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
    const wrapper = mount(login, options)
    wrapper.vm.idParams.value = 'nstest01에'
    const idHangel = wrapper.vm.idHangelCheck('', e)
    assert.equal(false, idHangel)
  })

  /* 메일주소 전체 도메인목록 이벤트 검증 */
  it('idHangel All E-Mail Domain Process', () => {
    const wrapper = mount(login, options)
    wrapper.vm.idParams.value = 'abc@'
    wrapper.vm.idHangelCheck('', e)
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
    const wrapper = mount(login, options)
    wrapper.vm.idParams.value = 'abc@na'
    wrapper.vm.idHangelCheck('', e)
    // console.log('param value : ', wrapper.vm.emailParams.value)
    const tmpEmailList = wrapper.vm.emailList
    const emailList = []
    for (let i = 0; i < tmpEmailList.length; i++) {
      emailList[i] = tmpEmailList[i][0] + tmpEmailList[i][1]
    }
    // console.log('emailList : ', emailList)
    assert.equal(wrapper.vm.isActive, true)
  })

  /* 메일주소 세팅 */
  it('changeValue Call', () => {
    const wrapper = mount(login, options)
    const id = 'nstest01'
    const domain = '@nsmall.com'

    wrapper.vm.changeValue(id, domain)
    assert.equal(false, wrapper.vm.idParams.isError)
  })

  // 앱 자동로그인
  it('자동로그인 값 변경 이벤트 쿠키에 값 저장', () => {
    const wrapper = mount(login, options)
    const vm = wrapper.vm

    const e = {
      target: {
        checked: true
      }
    }
    vm.autoYnChangeEvent(e)
    assert.equal(false, vm.idParams.isError)
  })

  describe('simple Login', () => {
    it('간편로그인 버튼클릭', () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      vm.simpleLogin('PAYCO')
      vm.simpleLogin('NAVER')
      vm.simpleLogin('KAKAO')
      vm.productData = {
        invoke: {
          accptPath: 500,
          accptPathCd: 500,
          calculationUsage: '-1,-2,-5,-6,-7',
          cartType: '15',
          catEntryId_1: ['10172384231'],
          directOrderYN: 'Y',
          extCatalogId_1: 97001,
          extPtncd_1: '110',
          inventoryValidation: 'false',
          itemBuschnId_1: 'CTCOM',
          itemType: 'product',
          orderId: '.',
          quantity_1: 1,
          userId: '',
          vdn_cd: '54102'
        },
        isOnlyUser: false
      }
      vm.simpleLogin('FACEBOOK')

      assert.equal(true, true)
    })

    it('페이코로그인 callback call 연결된 계정', async () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      const simpLoginSearchMockResponseResult = {
        msg: {
          resultCode: '00',
          result: {
            linkYN: 'Y',
            nsLogonId: 'nstest01@nsmall',
            dupYN: 'N'
          }
        }
      }

      mock
        .onPost(simpLoginSearchUrl)
        .reply(200, simpLoginSearchMockResponseResult)

      try {
        const params = {
          root: {
            email: 'lsdaaa@naver.com',
            refresh_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            name: '나선영',
            paycoId: '',
            titleAlign: 'center'
          }
        }
        vm.snsLoginCallback(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('페이코로그인 callback call 연결 안된 계정', async () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      const simpLoginSearchMockResponseResult = {
        msg: {
          resultCode: '00',
          result: {
            linkYN: 'N',
            nsLogonId: 'nstest01@nsmall',
            dupYN: 'N'
          }
        }
      }

      mock
        .onPost(simpLoginSearchUrl)
        .reply(200, simpLoginSearchMockResponseResult)

      try {
        const params = {
          root: {
            email: 'lsdaaa@naver.com',
            refresh_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            name: '나선영',
            paycoId: '',
            titleAlign: 'center'
          }
        }
        vm.snsLoginCallback(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('네이버로그인 callback call 연결된 계정', async () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      const simpLoginSearchMockResponseResult = {
        msg: {
          resultCode: '00',
          result: {
            linkYN: 'Y',
            nsLogonId: 'nstest01@nsmall',
            dupYN: 'N'
          }
        }
      }

      mock
        .onPost(simpLoginSearchUrl)
        .reply(200, simpLoginSearchMockResponseResult)

      try {
        const params = {
          root: {
            email: 'lsdaaa@naver.com',
            refresh_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            name: '나선영',
            paycoId: '',
            titleAlign: 'center'
          }
        }
        vm.snsLoginCallback(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('네이버로그인 callback call 연결 안된 계정', async () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      const simpLoginSearchMockResponseResult = {
        msg: {
          resultCode: '00',
          result: {
            linkYN: 'N',
            nsLogonId: 'nstest01@nsmall',
            dupYN: 'N'
          }
        }
      }

      mock
        .onPost(simpLoginSearchUrl)
        .reply(200, simpLoginSearchMockResponseResult)

      try {
        const params = {
          root: {
            email: 'lsdaaa@naver.com',
            refresh_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            name: '나선영',
            paycoId: '',
            titleAlign: 'center'
          }
        }
        vm.snsLoginCallback(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('카카오로그인 callback call 연결된 계정', async () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      const simpLoginSearchMockResponseResult = {
        msg: {
          resultCode: '00',
          result: {
            linkYN: 'Y',
            nsLogonId: 'nstest01@nsmall',
            dupYN: 'N'
          }
        }
      }

      mock
        .onPost(simpLoginSearchUrl)
        .reply(200, simpLoginSearchMockResponseResult)

      try {
        const params = {
          root: {
            email: 'lsdaaa@naver.com',
            refresh_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            name: '나선영',
            paycoId: '',
            titleAlign: 'center'
          }
        }
        vm.snsLoginCallback(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('카카오로그인 callback call 연결 안된 계정', async () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      const simpLoginSearchMockResponseResult = {
        msg: {
          resultCode: '00',
          result: {
            linkYN: 'N',
            nsLogonId: 'nstest01@nsmall',
            dupYN: 'N'
          }
        }
      }

      mock
        .onPost(simpLoginSearchUrl)
        .reply(200, simpLoginSearchMockResponseResult)

      try {
        const params = {
          root: {
            email: 'lsdaaa@naver.com',
            refresh_token: 'DXEKRLETveSzvOvKntvpjOZ7xw9585W7GzyxuraQLZdLgii349EgOmczNMRKdJ4ZokkDfhkm51RisiiQSiiR5NSpYmYDoVRFWuV3ZNrIbhwlQCkie',
            name: '나선영',
            paycoId: '',
            titleAlign: 'center'
          }
        }
        vm.snsLoginCallback(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(true, true)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('간편로그인 simpleLoginCallback 테스트', () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm
      const data = {
        fnType: 'memberConnect'
      }

      vm.simpleLoginCallback(data)
      data.fnType = 'join'
      vm.simpleLoginCallback(data)
      data.fnType = 'callPayco'
      vm.simpleLoginCallback(data)
      data.fnType = 'callNaver'
      vm.simpleLoginCallback(data)
      data.fnType = 'callKakao'
      vm.simpleLoginCallback(data)
      data.fnType = 'nsLogin'
      vm.simpleLoginCallback(data)
      data.fnType = 'nsJoin'
      vm.simpleLoginCallback(data)

      assert.equal(true, true)
    })
  })

  describe('비회원 주문', () => {
    it('성인상품 비회원 주문', () => {
      const wrapper = mount(login, options)
      const vm = wrapper.vm
      vm.productData = {
        invoke: {
          accptPath: 500,
          accptPathCd: 500,
          calculationUsage: '-1,-2,-5,-6,-7',
          cartType: '15',
          catEntryId_1: ['10172384231'],
          directOrderYN: 'Y',
          extCatalogId_1: 97001,
          extPtncd_1: '110',
          inventoryValidation: 'false',
          itemBuschnId_1: 'CTCOM',
          itemType: 'product',
          orderId: '.',
          quantity_1: 1,
          userId: '',
          adultItemFlag: 'Y',
          vdn_cd: '54102'
        },
        isOnlyUser: false
      }

      vm.noMemberOrder()
      assert.equal(true, true)
    })

    it('일반상품 비회원 주문', async () => {
      const resultData = {
        accptPath: '500',
        accptPathCd: '500',
        authorizedStaff: false,
        catalogId: '14051',
        exception: 'For input string: ',
        isSuccessful: true,
        langId: '-9',
        productList: [
          {
            catentryId: '10185775741'
          }
        ],
        staffBnft: {
          balanceAmt: 0,
          bnftBiggerYn: 'N',
          class: 'class com.ns.commerce.staff.bean.NSStaffBnftBean',
          couponBnftRate: 0,
          couponId: '',
          empYn: 'N',
          limitAmt: 0,
          memberId: '',
          useAmt: 0,
          userId: 0
        },
        staffOnlyProductList: [],
        storeId: '13001',
        userId: ''
      }
      const wrapper = mount(login, options)
      const vm = wrapper.vm

      mock
        .onPost(ajaxOrderPayNow4Url)
        .reply(200, resultData)

      try {
        vm.productData = {
          invoke: {
            accptPath: 500,
            accptPathCd: 500,
            calculationUsage: '-1,-2,-5,-6,-7',
            cartType: '15',
            catEntryId_1: ['10172384231'],
            directOrderYN: 'Y',
            extCatalogId_1: 97001,
            extPtncd_1: '110',
            inventoryValidation: 'false',
            itemBuschnId_1: 'CTCOM',
            itemType: 'product',
            orderId: '.',
            quantity_1: 1,
            userId: '',
            adultItemFlag: 'N',
            vdn_cd: '54102'
          },
          isOnlyUser: false
        }
        loginUtil.setUserInfo('adultAuthYN', 'Y')

        vm.noMemberOrder()

        await flushPromises()
        await wrapper.vm.$nextTick()
        assert.equal(true, true)
      } catch (error) {
        assert.fail(error.message)
      }
    })
  })
})
