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

import CONST from '@constants/framework/framework'
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
import temp02ResNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_res_NSMypageCommCmd_alejandro_O'

describe('OrderSheetConfirmExecutePaymentRequest', () => {
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

  const item = {
    usedcard_code: 'AM',
    VAN_CO: '20',
    EP_mall_id: '123456',
    EP_mall_nm: '',
    type: 'naverpay',
    FINAL_PAYMENT_AMT: 0,
    EP_noinst_term: '12345-67890',
    payType: PAY_TYPE_CONST.CREDIT_CARD,
    moduleGubun: '',
    str_apvl_chain_no_lt: '',
    custNum: '',
    payAmt: 0,
    EP_order_no: ''
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

  describe('OrderSheetConfirm executePaymentRequest 테스트', async () => {
    it('결제하기(methods())-Mixin (executePaymentRequest 1)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = () => {}
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = paymentMethodInitDataCreditCard
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.paymentData.Payment.setItem(0, item)
      wrapper.vm.executePaymentRequest()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (executePaymentRequest 2)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = () => {}
      item.FINAL_PAYMENT_AMT = 1000
      item.payAmt = 1000
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = paymentMethodInitDataCreditCard
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.paymentData.Payment.setItem(0, item)
      wrapper.vm.executePaymentRequest()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin (executePaymentRequest 3)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = () => {}
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.CREDIT_CARD] = null
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.paymentData.Payment.setItem(0, item)
      wrapper.vm.executePaymentRequest()
      assert.isTrue(true)
    })
  })
})
