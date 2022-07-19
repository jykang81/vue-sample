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
import loginUtil from '@utils/loginUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetConfirm from '@/views/order/sheet/OrderSheetConfirm'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetConfirm } from '@unit/views/order/sheet/mock/setting'

import temp05ResSeparateStaffOnlyProducts from '@unit/views/order/sheet/mock/onload/05_res_SeparateStaffOnlyProducts'
import temp02ResNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_res_NSMypageCommCmd_alejandro_O'

describe('OrderSheetConfirmOnclickBeforePayment', () => {
  // const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const e = {
    preventDefault: () => {},
    keyCode: '',
    target: { value: '' }
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

    orderSheetWrapper.vm.globalVal.completeOrderSheetInfo = true
    orderSheetWrapper.vm.globalVal.completeLastCashReceiptData = true
    orderSheetWrapper.vm.globalVal.completeOrderSheetCustomer = true
    orderSheetWrapper.vm.globalVal.completeOrderSheetDelivery = true
    orderSheetWrapper.vm.globalVal.completeOrderSheetProduct = true
    orderSheetWrapper.vm.globalVal.completeOrderSheetPayment = true
    orderSheetWrapper.vm.globalVal.completeOrderSheetDiscount = true

    await flushPromises()
  })

  afterEach(() => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetConfirm onclickBeforePayment 테스트', async () => {
    it('결제하기(methods())-결제하기 버튼 클릭1(onclickBeforePayment)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/SeparateStaffOnlyProducts`).reply(200, temp05ResSeparateStaffOnlyProducts)
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      assert.isFalse(wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage)
      assert.isFalse(wrapper.vm.globalVal.activeDoubleClick)

      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.customerInfo = {}
      wrapper.vm.globalVal.customerInfo.mHpNoSmsAuthYn = 'Y'
      wrapper.vm.globalVal.customerInfo.isCertCheck = true
      await wrapper.vm.onclickBeforePayment(e)
      assert.isTrue(wrapper.vm.globalVal.activeDoubleClick)
    })
    it('결제하기(methods())-결제하기 버튼 클릭2(onclickBeforePayment)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      assert.isFalse(wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage, ' 1-1')
      assert.isFalse(wrapper.vm.globalVal.activeDoubleClick, ' 1-2')

      wrapper.vm.globalVal.activeDoubleClick = false
      wrapper.vm.globalVal.customerInfo.mHpNoSmsAuthYn = 'N'
      wrapper.vm.globalVal.customerInfo.isCertCheck = false
      assert.isFalse(await wrapper.vm.onclickBeforePayment(e), ' 1-3')
      assert.isFalse(wrapper.vm.globalVal.activeDoubleClick, ' 1-4')
    })
    it('결제하기(methods())-결제하기 버튼 클릭3(onclickBeforePayment)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      assert.isFalse(wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage, ' 2-1')
      assert.isFalse(wrapper.vm.globalVal.activeDoubleClick, ' 2-2')

      wrapper.vm.globalVal.activeDoubleClick = false
      wrapper.vm.globalVal.completeOrderSheetInfo = false
      wrapper.vm.globalVal.completeLastCashReceiptData = false
      wrapper.vm.globalVal.completeOrderSheetCustomer = false
      wrapper.vm.globalVal.completeOrderSheetDelivery = false
      wrapper.vm.globalVal.completeOrderSheetProduct = false
      wrapper.vm.globalVal.completeOrderSheetPayment = false
      wrapper.vm.globalVal.completeOrderSheetDiscount = false
      assert.isFalse(await wrapper.vm.onclickBeforePayment(e), ' 2-3')
    })
    it('결제하기(methods())-결제하기 버튼 클릭4(onclickAfterPayment)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      assert.isFalse(wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage)
      assert.isFalse(wrapper.vm.globalVal.activeDoubleClick)

      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSItemDetailAjax`).reply(200, { jsonData: { rtn: { flag: 'Y' } } })

      const invoke = {
        cmdType: 11,
        custDurSpr: 0,
        partNumber: 0,
        itemCnt: 100
      }

      const invokeOther = {
        custDurSpr: 0,
        partNumber: 0,
        maxquantity: 0,
        maxOrderPossQty: 10,
        custPrchQtyLimitYn: 'Y'
      }

      wrapper.vm.onclickAfterPayment(invoke, invokeOther, e)

      invokeOther.custPrchQtyLimitYn = 'N'
      wrapper.vm.onclickAfterPayment(invoke, invokeOther, e)

      invoke.custDurSpr = 1
      invokeOther.custPrchQtyLimitYn = 'Y'
      wrapper.vm.onclickAfterPayment(invoke, invokeOther, e)
    })
  })
})
