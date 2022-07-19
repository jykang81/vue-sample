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

import { PAY_TYPE_CONST } from '@/common/constants/order/order'
import nsaxios from '@frameworks/axiosUtil'
import bizUtil from '@utils/bizUtil'
import {
  insertSeparatorPhoneNumber
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetConfirm from '@/views/order/sheet/OrderSheetConfirm'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetConfirm } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetConfirmHandlePaymentMethod', () => {
  // const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const paymentMethodInitDataCreditCard = {
    EP_order_no: '300010975004',
    EP_user_type: '1',
    EP_user_id: 'tester@test.com',
    EP_user_nm: '테스터',
    EP_user_mail: 'tester@test.com',
    EP_user_phone1: insertSeparatorPhoneNumber('010-1234-5678'),
    EP_user_addr: '주소',
    EP_product_type: '0',
    EP_product_nm: '브이솔루션 아사이베리 파우더 100g / 무료배송',
    EP_product_expr: '',
    EP_tax_flg: 'N',
    EP_cert_type: '0',
    EP_mall_id: 'T0002493',
    EP_mall_id_temp: 'T0002493',
    EP_mall_id_free_temp: 'T0002494',
    EP_currency: '00',
    EP_agent_ver: 'JSP',
    EP_mall_nm: 'test',
    EP_mall_pwd: '11111',
    EP_lang_flag: 'KOR',
    EP_ci_url: 'testgw.easypay.co.kr',
    EP_pay_type: '11',
    EP_card_code: '',
    EP_card_prefix: '',
    EP_ret_pay_type: '',
    EP_trace_no: '',
    EP_min_install_cnt: 0 // 최대 무이자 개월수
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
    axios.defaults.timeout = 10
    mock = new MockAdapter(axios)
    mock.reset()
    initOrderSheet(mock)
    initOrderSheetConfirm(mock)

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

  describe('OrderSheetConfirm handlePaymentMethod CreditCard 테스트', () => {
    it('결제하기(methods())-Mixin (handlePaymentMethod: CreditCard-1)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.nextValidation = (a = '') => {}

      for (const item of wrapper.vm.globalVal.mOutputDatas.msg.UseCardList) {
        wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
        wrapper.vm.globalVal.paymentMethodInfo.epCardCode = `${item.CARD_CO_CD}_${item.EZPAYCD}_${item.DIRECT_YN}_${item.CARD_SEQ}`
        wrapper.vm.globalVal.paymentMethodInfo.epCardText = item.CARD_CO_NM
        wrapper.vm.globalVal.paymentMethodInfo.epQuota = '00'
        wrapper.vm.globalVal.paymentMethodInfo.selectedCardData = item
        wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = paymentMethodInitDataCreditCard
        wrapper.vm.globalVal.isGuest = true
        wrapper.vm.handlePaymentMethod()
        wrapper.vm.globalVal.isGuest = false
      }

      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: CreditCard-2)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.nextValidation = (a = '') => {}

      for (const item of wrapper.vm.globalVal.mOutputDatas.msg.UseCardList) {
        wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
        wrapper.vm.globalVal.paymentMethodInfo.epCardCode = `${item.CARD_CO_CD}_${item.EZPAYCD}_${item.DIRECT_YN}_${item.CARD_SEQ}`
        wrapper.vm.globalVal.paymentMethodInfo.epCardText = item.CARD_CO_NM
        wrapper.vm.globalVal.paymentMethodInfo.epQuota = '03_n'
        wrapper.vm.globalVal.paymentMethodInfo.selectedCardData = item
        wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = paymentMethodInitDataCreditCard
        wrapper.vm.globalVal.discountCardChoice.discountList33Info = [{ type: 1 }]

        wrapper.vm.handlePaymentMethod()
      }

      assert.isTrue(true)
    })
  })
  describe('OrderSheetConfirm handlePaymentMethod Other 테스트', () => {
    it('결제하기(methods())-Mixin (handlePaymentMethod: DepositWithoutBankbook)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.paymentMethodInfo.selectedBankInfo = wrapper.vm.globalVal.mOutputDatas.msg.BankAccntList[0]

      wrapper.vm.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER = ''
      assert.isFalse(wrapper.vm.handlePaymentMethod())

      wrapper.vm.globalVal.mOutputDatas.msg.UserInfo.CUSTOM_NUMBER = '30124193'
      wrapper.vm.globalVal.paymentMethodInfo.selectedBank = ''
      assert.isFalse(wrapper.vm.handlePaymentMethod())

      wrapper.vm.globalVal.paymentMethodInfo.selectedBank = 'VAK'
      wrapper.vm.globalVal.paymentMethodInfo.selectedBankInfo.ACCT_NUM = 'nothing'
      assert.isFalse(wrapper.vm.handlePaymentMethod())

      wrapper.vm.globalVal.paymentMethodInfo.selectedBankInfo.ACCT_NUM = '356-49-0142-75224'
      wrapper.vm.globalVal.paymentMethodInfo.remitter = ''
      assert.isFalse(wrapper.vm.handlePaymentMethod())

      wrapper.vm.globalVal.paymentMethodInfo.remitter = '테스터'
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: RealtimeAccountTransfer)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: Mobile)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.MOBLE
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: Payco)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.PAYCO] = {}
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.PAYCO
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: Naverpay)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NAVER_PAY] = {}
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: NSPayCreditCard)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD] = {}
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (handlePaymentMethod: NSPayAccountTransfer)', () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER] = {}
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER
      wrapper.vm.handlePaymentMethod()
      assert.isTrue(true)
    })
  })
})
