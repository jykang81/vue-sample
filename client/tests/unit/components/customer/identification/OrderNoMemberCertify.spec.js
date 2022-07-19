import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import router from '@/router'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import orderNoMemberCertify from '@components/customer/info/OrderNoMemberCertify'
import loginUtil from '@utils/loginUtil'

describe('orderNoMemberCertify', () => {
  let mock

  const adultAuthUrl = `${CONST.API_URL}/NSAdultAuthCmd`
  const regAuthUrl = `${CONST.API_URL}/NSRegistAuthMobileCmdReal`
  const nonMemberCustNumUrl = `${CONST.API_URL}/NSOrderNonMemberCmd`

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  describe('hasFullPopup', () => {
    let localVue
    let options

    const memberInfo = {
      tcode: 't123',
      gender: 'F',
      loginType: 'K',
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
      staffBnft: 'Y'
    }

    const adultAuthResult = {
      NmChkBirthData: '19821220',
      NmChkGender: 'F',
      NmChkName: '임혜진',
      accptPath: '500',
      accptPathCd: '500',
      catalogId: '14051',
      custNum: '30124937',
      ipinYn: 'N',
      isSuccessful: true,
      langId: '-9',
      mobileYn: 'Y',
      modeFlag: 'auth',
      msg: {
        adultAuthYN: 'Y',
        birthday: '19821220',
        processMsg: 'S',
        sucessMsg: '성인인증이 완료 되었습니다.'
      },
      storeId: '13001',
      strCipherDateTime: '20200716093644',
      userId: '111103108',
      viewTaskName: 'NSAjaxActionResponse'
    }

    const regAuthResult01 = {
      IpinChkCoInfo: 't6mX+PjSc+Zqb6Prw47u4ru1XBRj3AMfCjYk5jzOj6LDg8ek767kURXT+0P9T5d0wlj6sI4tcyX84OJOJx7HeQ==',
      IpinChkDupInfo: 'MC0GCCqGSIb3DQIJAyEA8UuGGVZEwJjFaZD+0hH1xRUAmidnEsI963b46e3HVNk=',
      NmChkBirthData: '19821220',
      NmChkGender: 'F',
      NmChkName: '임혜진',
      NmChkUseHp: '01095558181',
      accptPath: '500',
      accptPathCd: '500',
      catalogId: '14051',
      custNum: '30124937',
      ipinYn: 'N',
      isSuccessful: true,
      langId: '-9',
      modeFlag: 'C',
      msg: {
        root: {
          RegusAuthMsg: {
            processMsg: 'A',
            rtnLogId: '',
            sucessMsg: '회원가입 시 입력하신 정보와 다릅니다. 인증하신 정보로 변경/관리 하시겠습니까?(미동의시 본인인증이 불가합니다.)'
          },
          birthData: '19811021',
          gender: 'M',
          lastname: '강진영'
        }
      },
      storeId: '13001',
      strCipherDateTime: '20200716091736',
      userId: '111103108'
    }

    const nonMemberCustNumResult = {
      accptPath: '500',
      accptPathCd: '500',
      catalogId: '14051',
      langId: '-9',
      msg: {
        custNum: '30125921',
        result: 'success'
      },
      custNum: '30125921',
      result: 'success',
      sandInfo: {
        CommandType: 'custNum',
        UserId: '',
        custNum: '',
        USER_NAME: '강진영',
        BIRTHDAY: '19811021',
        SEX: 'M',
        CI: 'mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z+OMCUg9Dv/E0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw==',
        DI: 'MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH/wYueeduhsY9MQOiPi7Km5iCyVjFqQ='
      },
      storeId: '13001',
      userId: ''
    }

    const nonMemberCustNumResultFail = {
      accptPath: '500',
      accptPathCd: '500',
      catalogId: '14051',
      langId: '-9',
      msg: {
        custNum: '',
        result: 'fail'
      },
      custNum: '',
      result: 'fail',
      sandInfo: {
        CommandType: 'custNum',
        UserId: '',
        custNum: '',
        USER_NAME: '강진영',
        BIRTHDAY: '19811021',
        SEX: 'M',
        CI: 'mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z+OMCUg9Dv/E0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw==',
        DI: 'MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH/wYueeduhsY9MQOiPi7Km5iCyVjFqQ='
      },
      storeId: '13001',
      userId: ''
    }

    beforeEach(function () {
      localVue = createLocalVue()
      localVue.use(Vuex)

      delete router.history.current
      router.history.current = {
        name: 'identity',
        meta: {},
        path: '/customer/info/identification',
        hash: '',
        query: {},
        params: {},
        fullPath: '/',
        matched: []
      }

      options = {
        localVue,
        router,
        propsData: {
          param: {
            title: '본인인증',
            titleAlign: 'center',
            isShowSearch: false,
            isShowCart: false,
            isAdultDiv: true
          }
        }
      }
    })

    it('setCurrentTab', () => {
      mock.reset()
      // when
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm

      vm.setCurrentTab(1)

      // then
      assert.isTrue(vm.isAdultDiv)
    })

    it('certSuccess Call Adult Test not Login', async () => {
      // when
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm

      const params = {
        type: 'ipin',
        resultCode: '1',
        name: '강진영',
        gender: '1',
        birth: '19811021',
        national: '0',
        enc_data: 'AgAEQTI4OGeo+HrS7wclsl3MA7QuRhcfrg5z31gKWG1QEm01jYnKS7NogoJ9Xmf3sYIbW7g41+u9wgAf+50k8cKrQbw7mJ4UAjq47zqAN46aOtMSoT1/pwfsNjj+PCEqiSHYnBSM/06ONoLxaaKSKo1EsLaEaD/Fd/edim6RtIKfo/5UtPQ1Qo3cj6D1CZhHMavSXPWV+T52U/8RaEIMb4fxXQQfU9L7S/u7NPP4yKhNyv79xRIkWpHcw7/ErJaEpScy+AnOet09MaysYTPQ9W7U4+I2/0P7uUPoLaMqjt8mgfBjphGMB8jN8Hr9g5OZCTSIX3FoJMEFnF+9znJH20zl0gfXfd1OfCx0NwVQVwqOs0tDggobDe+Xw4ZAcx62qmVqBCWOeXgUsyO3AmEszUHYzwbYGCS3B1X0X2fJ9RMDvp1BB25WBaz46WuaqLbmlVzxbAs1fcu6RpvK72UrHd4LXqfHc9rET/lO1wUORBXILLhOxBLU4VMN90mcu1xQvynBRm1skcDBoLyIhpCb+r3loNhPv7RcIL8Xi+AXBByR0S4r2ZjsWfDRGiJxrIsnQkn8a3GC9z9dWiC3V159Vhmq94WvLC3uVsJllx2KWRkAL6yXrbqYkbbzGL8/f8RLjeBfb47dq13AZVyXsJwQ11dhDOEej03hmLWkcDrAbp8HBtt913jiDR4qL72CnvTrlxzxGB96dVbBS084vKih96fwrxRucvofKSnGotRBtYt890C44kEyFHza6VbjoRjcXfoT4bDacw==',
        DI: 'MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH/wYueeduhsY9MQOiPi7Km5iCyVjFqQ=',
        CI: 'mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z+OMCUg9Dv/E0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw==',
        certUseHp: '',
        certUseHpCorp: ''
      }

      mock
        .onPost(adultAuthUrl)
        .reply(200, adultAuthResult)

      try {
        vm.certSuccess(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.isTrue(vm.isAdultDiv)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('certSuccess Call Auth Test not Login', async () => {
      // when
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm

      const params = {
        type: 'ipin',
        resultCode: '1',
        name: '강진영',
        gender: '1',
        birth: '19811021',
        national: '0',
        enc_data: 'AgAEQTI4OGeo+HrS7wclsl3MA7QuRhcfrg5z31gKWG1QEm01jYnKS7NogoJ9Xmf3sYIbW7g41+u9wgAf+50k8cKrQbw7mJ4UAjq47zqAN46aOtMSoT1/pwfsNjj+PCEqiSHYnBSM/06ONoLxaaKSKo1EsLaEaD/Fd/edim6RtIKfo/5UtPQ1Qo3cj6D1CZhHMavSXPWV+T52U/8RaEIMb4fxXQQfU9L7S/u7NPP4yKhNyv79xRIkWpHcw7/ErJaEpScy+AnOet09MaysYTPQ9W7U4+I2/0P7uUPoLaMqjt8mgfBjphGMB8jN8Hr9g5OZCTSIX3FoJMEFnF+9znJH20zl0gfXfd1OfCx0NwVQVwqOs0tDggobDe+Xw4ZAcx62qmVqBCWOeXgUsyO3AmEszUHYzwbYGCS3B1X0X2fJ9RMDvp1BB25WBaz46WuaqLbmlVzxbAs1fcu6RpvK72UrHd4LXqfHc9rET/lO1wUORBXILLhOxBLU4VMN90mcu1xQvynBRm1skcDBoLyIhpCb+r3loNhPv7RcIL8Xi+AXBByR0S4r2ZjsWfDRGiJxrIsnQkn8a3GC9z9dWiC3V159Vhmq94WvLC3uVsJllx2KWRkAL6yXrbqYkbbzGL8/f8RLjeBfb47dq13AZVyXsJwQ11dhDOEej03hmLWkcDrAbp8HBtt913jiDR4qL72CnvTrlxzxGB96dVbBS084vKih96fwrxRucvofKSnGotRBtYt890C44kEyFHza6VbjoRjcXfoT4bDacw==',
        DI: 'MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH/wYueeduhsY9MQOiPi7Km5iCyVjFqQ=',
        CI: 'mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z+OMCUg9Dv/E0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw==',
        certUseHp: '',
        certUseHpCorp: ''
      }

      mock
        .onPost(adultAuthUrl)
        .reply(200, adultAuthResult)

      mock
        .onPost(nonMemberCustNumUrl)
        .reply(200, nonMemberCustNumResult)

      try {
        vm.isAdultDiv = false
        vm.certSuccess(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(false, vm.isAdultDiv)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('certSuccess Call Auth Test not Login Fail', async () => {
      // when
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm

      const params = {
        type: 'ipin',
        resultCode: '1',
        name: '강진영',
        gender: '1',
        birth: '19811021',
        national: '0',
        enc_data: 'AgAEQTI4OGeo+HrS7wclsl3MA7QuRhcfrg5z31gKWG1QEm01jYnKS7NogoJ9Xmf3sYIbW7g41+u9wgAf+50k8cKrQbw7mJ4UAjq47zqAN46aOtMSoT1/pwfsNjj+PCEqiSHYnBSM/06ONoLxaaKSKo1EsLaEaD/Fd/edim6RtIKfo/5UtPQ1Qo3cj6D1CZhHMavSXPWV+T52U/8RaEIMb4fxXQQfU9L7S/u7NPP4yKhNyv79xRIkWpHcw7/ErJaEpScy+AnOet09MaysYTPQ9W7U4+I2/0P7uUPoLaMqjt8mgfBjphGMB8jN8Hr9g5OZCTSIX3FoJMEFnF+9znJH20zl0gfXfd1OfCx0NwVQVwqOs0tDggobDe+Xw4ZAcx62qmVqBCWOeXgUsyO3AmEszUHYzwbYGCS3B1X0X2fJ9RMDvp1BB25WBaz46WuaqLbmlVzxbAs1fcu6RpvK72UrHd4LXqfHc9rET/lO1wUORBXILLhOxBLU4VMN90mcu1xQvynBRm1skcDBoLyIhpCb+r3loNhPv7RcIL8Xi+AXBByR0S4r2ZjsWfDRGiJxrIsnQkn8a3GC9z9dWiC3V159Vhmq94WvLC3uVsJllx2KWRkAL6yXrbqYkbbzGL8/f8RLjeBfb47dq13AZVyXsJwQ11dhDOEej03hmLWkcDrAbp8HBtt913jiDR4qL72CnvTrlxzxGB96dVbBS084vKih96fwrxRucvofKSnGotRBtYt890C44kEyFHza6VbjoRjcXfoT4bDacw==',
        DI: 'MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH/wYueeduhsY9MQOiPi7Km5iCyVjFqQ=',
        CI: 'mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z+OMCUg9Dv/E0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw==',
        certUseHp: '',
        certUseHpCorp: ''
      }

      mock
        .onPost(adultAuthUrl)
        .reply(200, adultAuthResult)

      mock
        .onPost(nonMemberCustNumUrl)
        .reply(200, nonMemberCustNumResultFail)

      try {
        vm.isAdultDiv = false
        vm.certSuccess(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(false, vm.isAdultDiv)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('certSuccess Call Test Login', async () => {
      // when
      loginUtil.login(memberInfo)
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm

      const params = {
        type: 'ipin',
        resultCode: '1',
        name: '강진영',
        gender: '1',
        birth: '19811021',
        national: '0',
        enc_data: 'AgAEQTI4OGeo+HrS7wclsl3MA7QuRhcfrg5z31gKWG1QEm01jYnKS7NogoJ9Xmf3sYIbW7g41+u9wgAf+50k8cKrQbw7mJ4UAjq47zqAN46aOtMSoT1/pwfsNjj+PCEqiSHYnBSM/06ONoLxaaKSKo1EsLaEaD/Fd/edim6RtIKfo/5UtPQ1Qo3cj6D1CZhHMavSXPWV+T52U/8RaEIMb4fxXQQfU9L7S/u7NPP4yKhNyv79xRIkWpHcw7/ErJaEpScy+AnOet09MaysYTPQ9W7U4+I2/0P7uUPoLaMqjt8mgfBjphGMB8jN8Hr9g5OZCTSIX3FoJMEFnF+9znJH20zl0gfXfd1OfCx0NwVQVwqOs0tDggobDe+Xw4ZAcx62qmVqBCWOeXgUsyO3AmEszUHYzwbYGCS3B1X0X2fJ9RMDvp1BB25WBaz46WuaqLbmlVzxbAs1fcu6RpvK72UrHd4LXqfHc9rET/lO1wUORBXILLhOxBLU4VMN90mcu1xQvynBRm1skcDBoLyIhpCb+r3loNhPv7RcIL8Xi+AXBByR0S4r2ZjsWfDRGiJxrIsnQkn8a3GC9z9dWiC3V159Vhmq94WvLC3uVsJllx2KWRkAL6yXrbqYkbbzGL8/f8RLjeBfb47dq13AZVyXsJwQ11dhDOEej03hmLWkcDrAbp8HBtt913jiDR4qL72CnvTrlxzxGB96dVbBS084vKih96fwrxRucvofKSnGotRBtYt890C44kEyFHza6VbjoRjcXfoT4bDacw==',
        DI: 'MC0GCCqGSIb3DQIJAyEA0cavDv5pHjxCH/wYueeduhsY9MQOiPi7Km5iCyVjFqQ=',
        CI: 'mkpUXOVcmG9oNzG3BOUQ8QtsUP7B7o6t2yFNu32z+OMCUg9Dv/E0tTkZ5kj5Fn371xxI7aJq23Y41nxpZNMELw==',
        certUseHp: '',
        certUseHpCorp: ''
      }

      mock
        .onPost(regAuthUrl)
        .reply(200, regAuthResult01)

      try {
        vm.isAdultDiv = false
        vm.certSuccess(params)

        await flushPromises()

        await wrapper.vm.$nextTick()
        // then
        assert.equal(false, vm.isAdultDiv)
      } catch (e) {
        assert.fail(e.message)
      }
    })

    it('checkAdult call return Fail', () => {
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm
      const returnVal1 = vm.checkAdult('')
      assert.equal('N', returnVal1)

      const returnVal = vm.checkAdult('20101021')
      assert.equal('N', returnVal)
    })

    it('checkAdult call', () => {
      const wrapper = mount(orderNoMemberCertify, options)
      const vm = wrapper.vm

      const returnVal = vm.checkAdult('19811021')
      assert.equal('Y', returnVal)
    })
  })
})
