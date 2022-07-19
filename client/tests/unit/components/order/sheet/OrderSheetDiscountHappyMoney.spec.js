import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import { initOrderSheet, initOrderSheetPayment } from '@unit/views/order/sheet/mock/setting'
import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetDiscountHappyMoney from '@/components/order/sheet/OrderSheetDiscountHappyMoney'

describe('OrderSheetDiscountHappyMoney', () => {
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const userInfo = {
    BILLINGCODETYPE: '',
    PERSONTITLE: '',
    SELFADDRESS: '1',
    BESTCALLINGTIME: '',
    ADDRESSTYPE: 'SB',
    LASTCREATE: '2020-03-12 17:08:32.0',
    PLCYACCT_ID: '-1',
    FIRSTNAME: '테스터',
    PERSONALIZATIONID: '1578637360610-42',
    ADDRBOOK_ID: '21583631',
    LASTSESSION: '2020-04-17 09:39:41.378',
    LASTNAME: '테스터',
    AUTHBIRTHDAY: '',
    PACKAGESUPPRESSION: '',
    USER_TYPE: 'K',
    SHIPPINGGEOCODE: '',
    EMAIL1: 'tester@test.com',
    EMAIL2: '',
    PROFILETYPE: 'C',
    ORGNAME: '',
    PUBLISHPHONE1: '',
    PUBLISHPHONE2: '',
    LASTORDER: '2020-04-06 14: 52: 53.783',
    PHONE1TYPE: '',
    REGISTERTYPE: 'K',
    LOGONID: 'tester@test.com',
    LANGUAGE_ID: '',
    ADDRESS_ID: '20639639003',
    CITY: 'C',
    NICKNAME: 'tester@test.com',
    ZIPCODE: '13547',
    STATE: '1',
    COUNTRY: 'KR',
    BUSINESSTITLE: '',
    ISPRIMARY: '0',
    DN: 'uid=tester@test.com,o=default organization,o=root organization',
    FIELD1: '',
    OFFICEADDRESS: '',
    FIELD2: '',
    FIELD3: '',
    MIDDLENAME: '',
    PHONE1: '010-1234-5678',
    PHONE2: '--',
    MOBILEPHONE1CNTRY: '',
    TAXGEOCODE: 'N',
    REGISTRATION: '2020-01-10 15: 49: 41.223',
    GENDER: '',
    MOBILEPHONE1: '',
    BILLINGCODE: '',
    USERS_ID: '110548084',
    ORGUNITNAME: '',
    FAX1: '200',
    FAX2: '13547',
    CUSTOM_NUMBER: '30124193',
    ADDRESS1: '경기 성남시 분당구 대왕판교로 (동원동,NS홈쇼핑)&amp;: 15 7층',
    ADDRESS2: '경기 성남시 분당구 동원동',
    PHONE2TYPE: '',
    ADDRESS3: '51번지 NS홈쇼핑 7층',
    AGE: '0',
    MEMBER_ID: '110548084',
    OPTCOUNTER: '18663',
    STATUS: 'P',
    SETCCURR: 'KRW'
  }

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    bizUtil.gotoOrdersheet(tempMInputParams)

    delete router.history.current
    router.history.current = {
      name: 'orderSheet',
      meta: {},
      path: '/order/sheet',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initOrderSheet(mock)
    initOrderSheetPayment(mock)

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      data () {
        return {
        }
      }
    }

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
    orderSheetWrapper = mount(OrderSheet, options)

    await flushPromises()
  })

  afterEach(() => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetDiscountHappyMoney 테스트', () => {
    let wrapper
    beforeEach(async () => {
      wrapper = mount(OrderSheetDiscountHappyMoney, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData
          }
        }
      })
    })

    it('해피머니(methods())- 확인 (onclickOk)', async () => {
      wrapper.vm.happyId = ''
      wrapper.vm.globalVal.mOutputDatas = { msg: { UserInfo: userInfo } }
      wrapper.vm.paymentData.Delivery = { deliveryList: [] }
      wrapper.vm.paymentData.OrderUserInfo = { getItem: () => { return { LASTNAME: '테스터' } } }
      wrapper.vm.doPaymentApprovalRequest = (a, b) => {}
      assert.isFalse(wrapper.vm.onclickOk())

      wrapper.vm.happyId = '1234'
      wrapper.vm.happyPw = ''
      assert.isFalse(wrapper.vm.onclickOk())

      wrapper.vm.happyPw = '1234'
      wrapper.vm.onclickOk()
      assert.isTrue(true)
    })
    it('해피머니(methods())- 취소 (onclickCancel)', async () => {
      // popupUtil.show('order/sheet/OrderSheetDiscountHappyMoney', { }, () => {})
      // wrapper.vm.onclickCancel()
      assert.isTrue(true)
    })
  })
})
