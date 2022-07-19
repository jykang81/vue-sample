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
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetConfirm from '@/views/order/sheet/OrderSheetConfirm'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetConfirm } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetConfirmValid', () => {
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

  describe('OrderSheetConfirm Valid 테스트', async () => {
    it('결제하기(methods())-Mixin(precheckPayment) 1', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = '0'
      assert.isFalse(wrapper.vm.precheckPayment())
      await flushPromises()
    })
    it('결제하기(methods())-Mixin(precheckPayment) 2', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD

      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.FLASH_SALE_YN = 'Y'
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.QUANTITY = '1000'
      wrapper.vm.globalVal.discountInfo.flashSaleEnddd = ''
      assert.isFalse(wrapper.vm.precheckPayment(), `-> ${wrapper.vm.precheckPayment()}`)
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.FLASH_SALE_YN = ''
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.QUANTITY = '1'
      await flushPromises()
    })
    it('결제하기(methods())-Mixin(precheckPayment) 3', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.discountInfo.flashSaleEnddd = '20200529'
      assert.isTrue(wrapper.vm.precheckPayment())
      await flushPromises()
    })
    it('결제하기(methods())-Mixin(precheckPayment) 4', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.maximumPurchaseQuantityFlag = true
      assert.isTrue(wrapper.vm.precheckPayment())
      await flushPromises()
    })
    it('결제하기(methods())-Mixin(precheckPayment) 5', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.maximumPurchaseQuantityFlag = false
      wrapper.vm.paymentData.Payment.setItem(0, { FINAL_PAYMENT_AMT: -1 })
      assert.isFalse(wrapper.vm.precheckPayment())
      await flushPromises()
    })
    it('결제하기(methods())-Mixin(validNoneDeliveryProduct) 1', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true

      // 도서산간 체크
      wrapper.vm.globalVal.deliveryInfo.bDeliveryYn = 'N'
      wrapper.vm.globalVal.deliveryInfo.isPopOpenYn = 'N'
      assert.isTrue(wrapper.vm.validNoneDeliveryProduct())

      wrapper.vm.globalVal.deliveryInfo.bDeliveryYn = 'N'
      wrapper.vm.globalVal.deliveryInfo.isPopOpenYn = 'Y'
      assert.isTrue(wrapper.vm.validNoneDeliveryProduct())
    })
    it('결제하기(methods())-Mixin(validNoneDeliveryProduct) 2', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.deliveryInfo.bjejuYn = 'Y'
      assert.isTrue(wrapper.vm.validNoneDeliveryProduct())
    })
    it('결제하기(methods())-Mixin(validNoneDeliveryProduct) 3', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 999
      assert.isTrue(wrapper.vm.validNoneDeliveryProduct())
    })

    it('결제하기(methods())-Mixin(validPaymentDelivery) 1', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 1
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode = ''
      assert.isFalse(wrapper.vm.validPaymentDelivery())
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode = '123456'
    })

    it('결제하기(methods())-Mixin(validPaymentDelivery) 2', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 999
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode = '123456'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone21 = '010'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone22 = '1234'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone23 = '5678'
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD = '50'
      assert.isTrue(wrapper.vm.validPaymentDelivery())
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD = '10'
    })

    it('결제하기(methods())-Mixin(validPaymentDelivery) 3', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 999
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].zipCode = '123456'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone21 = '010'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone22 = '1234'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone23 = '5678'
      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD = '10'
      wrapper.vm.globalVal.isGuest = true
      wrapper.vm.globalVal.deliveryInfo.checkSafeGuest = ''
      wrapper.vm.validPaymentDelivery()

      wrapper.vm.globalVal.deliveryInfo.checkSafeGuest = 1
      wrapper.vm.validPaymentDelivery()

      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.globalVal.deliveryInfo.checkSafeGuest = null
      assert.isTrue(true)
    })

    it('결제하기(methods())-Mixin(validPaymentDelivery) 4', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.isGuest = true

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName = ''
      assert.isFalse(wrapper.vm.validPaymentDelivery(), '-1')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].recipientName = '김일모'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11 = ''
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12 = ''
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13 = ''
      assert.isFalse(wrapper.vm.validPaymentDelivery(), '-2')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11 = '111'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12 = '1234'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13 = '5678'
      assert.isFalse(wrapper.vm.validPaymentDelivery(), '-3')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone11 = '010'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone12 = '1234'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].phone13 = '5678'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].addrDetail = ''
      assert.isFalse(wrapper.vm.validPaymentDelivery(), '-4')

      wrapper.vm.globalVal.isGuest = false
    })

    it('결제하기(methods())-Mixin (validPaymentAuth: Mobile)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.isGuest = true

      wrapper.vm.globalVal.orderDeliveryInfo.ci = ''
      wrapper.vm.globalVal.orderDeliveryInfo.di = ''
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-1')

      wrapper.vm.globalVal.orderDeliveryInfo.ci = 'CI'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-2')

      wrapper.vm.globalVal.orderDeliveryInfo.di = 'DI'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-3')

      wrapper.vm.globalVal.orderDeliveryInfo.iptOrdererName = ''
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-4')

      wrapper.vm.globalVal.orderDeliveryInfo.iptOrdererName = '김일모'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-5')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo1 = ''
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo2 = ''
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo3 = ''
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-6')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo1 = '111'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo2 = '4567'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo3 = '5555'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-7')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo1 = '010'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo2 = '4567'
      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererHpNo3 = '5555'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-8')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererEmail = ''
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-9')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererEmail = 'testtest.com'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-10')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererEmail = 'test@test.com'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-11')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererPwd = ''
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-12')

      wrapper.vm.globalVal.orderDeliveryInfo.deliveryInfo[0].iptOrdererPwd = '123qwe!@'
      assert.isFalse(wrapper.vm.validPaymentAuth(), '-13')

      wrapper.vm.globalVal.isGuest = false
    })
    it('결제하기(methods())-Mixin (validCashReceipt: 무통장입금(현금영수증) 1)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      let result = false
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK

      wrapper.vm.globalVal.paymentMethodInfo.checkedReceipt = false
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)

      wrapper.vm.globalVal.paymentMethodInfo.checkedReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = '01022227777'
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '01022227777', RCPT_PBLS_CD: '100', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isTrue(result)
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = '6158211718'
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '6158211718', RCPT_PBLS_CD: '200', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isTrue(result)
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)
    })
    it('결제하기(methods())-Mixin (validCashReceipt: 무통장입금(현금영수증) 2)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      let result = false
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK

      wrapper.vm.globalVal.paymentMethodInfo.checkedReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = false
      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = '01022227777'
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '01022227777', RCPT_PBLS_CD: '100', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isTrue(result)
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = '6158211718'
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '6158211718', RCPT_PBLS_CD: '200', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isTrue(result)
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)
    })
    it('결제하기(methods())-Mixin (validCashReceipt: 무통장입금(현금영수증) 3)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      let result = false
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK

      wrapper.vm.globalVal.paymentMethodInfo.checkedReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = false
      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = ''
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '', RCPT_PBLS_CD: '100', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isTrue(result)
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = ''
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '', RCPT_PBLS_CD: '200', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isTrue(result)
      result = wrapper.vm.validCashReceipt()
      assert.isTrue(result)
    })
    it('결제하기(methods())-Mixin (validCashReceipt: 무통장입금(현금영수증) 4)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      let result = true
      wrapper.vm.globalVal.paymentMethodInfo.currentPayType = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.DEPOSIT_WITHOUT_BANKBOOK

      wrapper.vm.globalVal.paymentMethodInfo.checkedReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.isChangeReceipt = true
      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'P'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = ''
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '', RCPT_PBLS_CD: '100', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isFalse(result)
      result = wrapper.vm.validCashReceipt()
      assert.isFalse(result)

      wrapper.vm.globalVal.paymentMethodInfo.receiptType = 'B'
      wrapper.vm.globalVal.paymentMethodInfo.receiptValue = ''
      wrapper.vm.globalVal.lastCashReceipt = { REGI_NUM: '', RCPT_PBLS_CD: '200', USER_ID: '' }
      result = wrapper.vm.validCashReceipt(wrapper.vm.CONST_VALID_CASH_RECEIPT.SELECT)
      assert.isFalse(result)
      result = wrapper.vm.validCashReceipt()
      assert.isFalse(result)
    })
  })
})
