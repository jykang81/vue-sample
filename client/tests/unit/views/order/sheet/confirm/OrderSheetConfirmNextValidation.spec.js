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

import temp02ResNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_res_NSMypageCommCmd_alejandro_O'
import temp03ResShoppingAmtLimitCheckCmd from '@unit/views/order/sheet/mock/onload/03_res_ShoppingAmtLimitCheckCmd'

describe('OrderSheetConfirmNextValidation', () => {
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

  describe('OrderSheetConfirm nextValidation 테스트', async () => {
    it('결제하기(methods())-Mixin(nextValidation 1)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.paymentData.Payment.paymentList[0] = { payType: '1100', payAmt: 1, FINAL_PAYMENT_AMT: 0 }
      assert.isFalse(wrapper.vm.nextValidation())

      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = false
      wrapper.vm.paymentData.Payment.setItem(0, { payType: PAY_TYPE_CONST.CREDIT_CARD, FINAL_PAYMENT_AMT: 12900 })
      assert.isFalse(wrapper.vm.nextValidation())

      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.nextValidation()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin(nextValidation 2)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/ShoppingAmtLimitCheckCmd`).reply(200, temp03ResShoppingAmtLimitCheckCmd)
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE = 'G'
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.nextValidation()
      wrapper.vm.globalVal.mOutputDatas.msg.UserInfo.REGISTERTYPE = 'K'
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin(nextValidation 3)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_cnt = 21
      wrapper.vm.nextValidation()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin(nextValidation 4)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.notSaleCheck = 'Y'
      wrapper.vm.nextValidation()
      assert.isTrue(true)
    })
    it('결제하기(methods())-Mixin(checkLiquidity)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_cnt = 21
      assert.isFalse(wrapper.vm.checkLiquidity())

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_cnt = 2
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_amt = 4000001
      assert.isFalse(wrapper.vm.checkLiquidity())

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_cnt = 2
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_amt = 3000001
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.year_amt = 10000001
      assert.isFalse(wrapper.vm.checkLiquidity())

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_cnt = 2
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_amt = 3000001
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.year_amt = 1000001
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.dlrOrdCnt = 4
      assert.isFalse(wrapper.vm.checkLiquidity())

      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_cnt = 2
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.month_amt = 3000001
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.year_amt = 1000001
      wrapper.vm.globalVal.mOutputDatas.msg.payCheck.dlrOrdCnt = 2
      assert.isTrue(wrapper.vm.checkLiquidity())
    })
  })
})
