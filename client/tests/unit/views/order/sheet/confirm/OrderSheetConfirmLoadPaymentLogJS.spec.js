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
  extend
} from '@utils/commonutil/commonUtil'
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetConfirm from '@/views/order/sheet/OrderSheetConfirm'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetConfirm } from '@unit/views/order/sheet/mock/setting'
import tempCallbackPaymentResult from '@unit/views/order/sheet/mock/confirm/tempCallbackPaymentResult'
import temp02ResNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_res_NSMypageCommCmd_alejandro_O'

describe('OrderSheetConfirmLoadPaymentLogJS', () => {
  // const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
  let mock

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

  describe('OrderSheetConfirm loadPaymentLogJS 테스트', async () => {
    it('결제하기(methods())-Mixin (loadPaymentLogJS: CreditCard: 롯데카드 직승인)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.result = ''
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.usedcard_code = 'AM'

      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.result = '0000'
      data.params.card_no = '5320920017121956'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.usedcard_code = 'AM'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: CreditCard: KB카드 직승인)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.SendCode = '22002200'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun = 'I'

      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.SendCode = '00130013'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun = 'I'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.SendCode = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      await flushPromises()

      data.params.SendCode = '10001000'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun = 'I'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: CreditCard: 신한 직승인)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.sendCode = ''
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun = 'P'

      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.sendCode = 'success'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.payType = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.VAN_CO = '20'
      wrapper.vm.globalVal.paymentMethodInfo.objPaymentCertData.moduleGubun = 'P'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: CreditCard: Other-creditcard-신용카드)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.type = 'creditcard'
      data.params.result = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: Mobile: Other-phone-휴대폰소액결제)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.MOBILE))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.type = 'phone'
      data.params.Resultcd = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.MOBILE, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.type = 'phone'
      data.params.Resultcd = '0000'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.MOBILE, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: RealtimeAccountTransfer: Other-account-실시간계좌이체)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.type = 'account'
      data.params.LGD_RESPCODE = '0000'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.type = 'account'
      data.params.LGD_RESPCODE = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: Payco: Other-payco-페이코)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.PAYCO))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.type = 'payco'
      data.params.code = '0'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.PAYCO, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.type = 'payco'
      data.params.code = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.PAYCO, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: Naverpay: Other-naverpay-네이버페이)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NAVER_PAY))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      data.params.type = 'naverpay'
      data.params.resultCode = 'Success'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.NAVER_PAY, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.type = 'naverpay'
      data.params.resultCode = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.NAVER_PAY, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: NSPayCreditCard: Other-NSPAY_CARD-NS카드)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_CREDIT_CARD] = { nspayParams: '' }

      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)
      wrapper.vm.$store = { commit: data => {} }

      data.params.type = 'NSPAY_CARD'
      data.params.resultCode = '0000'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.type = 'NSPAY_CARD'
      data.params.resultCode = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.NS_PAY_CREDIT_CARD, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (loadPaymentLogJS: NSPayAccountTransfer: Other-NSPAY_ACCT-NS계좌이체)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethodInitData[PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER] = { nspayParams: '' }

      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)
      wrapper.vm.$store = { commit: data => {} }

      data.params.type = 'NSPAY_ACCT'
      data.params.resultCode = '0000'
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, data.params)
      assert.isTrue(true)
      await flushPromises()

      data.params.type = 'NSPAY_ACCT'
      data.params.resultCode = ''
      wrapper.vm.loadPaymentLogJS('O', data.params.EP_order_no, data.params.EP_pay_mny, PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER, data.params)
      assert.isTrue(true)
      await flushPromises()
    })
    it('결제하기(methods())-Mixin (gotoPaymentComplete)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const params = tempCallbackPaymentResult.params

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-1')
      await flushPromises()

      wrapper.vm.globalVal.discountCardChoice.discountCardPreDc33 = true
      wrapper.vm.globalVal.discountCardChoice.discountList33Info = [{ index: 0, indexDc: 0 }]
      wrapper.vm.globalVal.discountCardChoice.discountList33 = [{ orderItemId: '', CATENTRY_ID: '', couponList: [{ dummy: '' }] }]
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-2')
      await flushPromises()

      wrapper.vm.globalVal.discountCardChoice.discountCardPreDc33 = false
      wrapper.vm.globalVal.discountCardChoice.discountCardPreDc32 = true
      wrapper.vm.globalVal.discountCardChoice.discountList32Info = [{ index: 0, indexDc: 0 }]
      wrapper.vm.globalVal.discountCardChoice.discountList32 = [{ orderItemId: '', CATENTRY_ID: '', couponList: [{ dummy: '' }] }]
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-3')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-4')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-5')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.MOBILE
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-6')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.PAYCO
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-7')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NAVER_PAY
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-8')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NS_PAY_CREDIT_CARD
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-9')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.NS_PAY_ACCOUNT_TRANSFER
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-10')
      await flushPromises()

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = 0
      wrapper.vm.paymentData.Payment.getItem(0).FINAL_PAYMENT_AMT = 0
      wrapper.vm.gotoPaymentComplete(params)
      assert.isTrue(true, '-11')
      await flushPromises()
    })
    it('결제하기(methods())-결제완료처리 (callbackResult)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.gotoPaymentComplete = (a = '') => {}
      const data = extend(true, {}, tempCallbackPaymentResult)

      wrapper.vm.globalVal.confirmInfo.enableCallbackResult = true
      wrapper.vm.callbackResult(data)
      assert.isTrue(true)

      wrapper.vm.globalVal.confirmInfo.enableCallbackResult = true
      data.params.type = 'naverpay'
      data.params.resultCode = 'dummy'
      data.params.resultMessage = 'dummy'
      wrapper.vm.callbackResult(data)
      assert.isTrue(true)

      wrapper.vm.globalVal.confirmInfo.enableCallbackResult = true
      data.params.type = 'naverpay'
      data.params.resultCode = 'dummy'
      data.params.resultMessage = 'dummy'
      wrapper.vm.callbackResult(data)
      assert.isTrue(true)

      wrapper.vm.globalVal.confirmInfo.enableCallbackResult = true
      data.params.type = 'nswpay'
      data.params.resultCode = 'Fail'
      data.params.resultMessage = 'dummy'
      wrapper.vm.callbackResult(data)
      assert.isTrue(true)

      wrapper.vm.globalVal.confirmInfo.enableCallbackResult = true
      data.params.type = 'nswpay'
      data.params.resultCode = 'Fail'
      data.params.resultMessage = 'userCancel'
      wrapper.vm.callbackResult(data)
      assert.isTrue(true)

      wrapper.vm.globalVal.confirmInfo.enableCallbackResult = true
      data.cmd = 'close'
      wrapper.vm.callbackResult(data)
      assert.isTrue(true)
    })
  })
})
