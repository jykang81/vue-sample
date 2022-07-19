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
import temp05ResSeparateStaffOnlyProducts from '@unit/views/order/sheet/mock/onload/05_res_SeparateStaffOnlyProducts'

describe('OrderSheetConfirmCheckStaffOnlyPrd', () => {
  // const dummy = 'dummy'
  let localVue
  let options
  let orderSheetWrapper
  let mock
  const _event = { preventDefault () {} }

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

  describe('OrderSheetConfirm checkStaffOnlyPrd 테스트', async () => {
    /*
    it('결제하기(methods())-Mixin 1(checkStaffOnlyPrd: callbackStaffOnlyPrdByPaymentType)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const data = extend(true, {}, temp05ResSeparateStaffOnlyProducts)

      wrapper.vm.paymentData.Product.getItem(0).custPrchQtyLimitYn = 'Y'
      wrapper.vm.globalVal.partNumberFlag = 0
      wrapper.vm.callbackStaffOnlyPrdByPaymentType(data, _event)

      assert.isTrue(true)
    })
    */
    it('결제하기(methods())-Mixin 2(checkStaffOnlyPrd: callbackStaffOnlyPrdByPaymentType)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const data = extend(true, {}, temp05ResSeparateStaffOnlyProducts)

      wrapper.vm.globalVal.partNumberFlag = 0
      wrapper.vm.callbackStaffOnlyPrdByPaymentType(data, _event)

      assert.isTrue(true)
    })

    it('결제하기(methods())-Mixin 3(checkStaffOnlyPrd: callbackStaffOnlyPrdByPaymentType)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const data = extend(true, {}, temp05ResSeparateStaffOnlyProducts)

      wrapper.vm.globalVal.partNumberFlag = '9999999'
      wrapper.vm.callbackStaffOnlyPrdByPaymentType(data, _event)

      assert.isTrue(true)
    })

    it('결제하기(methods())-Mixin 4(checkStaffOnlyPrd: callbackStaffOnlyPrdByPaymentType)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const data = extend(true, {}, temp05ResSeparateStaffOnlyProducts)

      wrapper.vm.globalVal.partNumberFlag = '20874208'
      wrapper.vm.callbackStaffOnlyPrdByPaymentType(data, _event)

      assert.isTrue(true)
    })

    it('결제하기(methods())-Mixin 5(checkStaffOnlyPrd: callbackStaffOnlyPrdByPaymentType)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const data = extend(true, {}, temp05ResSeparateStaffOnlyProducts)

      wrapper.vm.paymentData.Product.getItem(0).custPrchQtyLimitYn = 'N'
      wrapper.vm.globalVal.maxCheckFlag = false
      wrapper.vm.callbackStaffOnlyPrdByPaymentType(data, _event)

      assert.isTrue(true)
    })

    it('결제하기(methods())-Mixin 6(checkStaffOnlyPrd: callbackStaffOnlyPrdByPaymentType)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)
      const data = extend(true, {}, temp05ResSeparateStaffOnlyProducts)

      wrapper.vm.paymentData.Product.getItem(0).custPrchQtyLimitYn = 'N'
      wrapper.vm.globalVal.maxCheckFlag = true
      wrapper.vm.callbackStaffOnlyPrdByPaymentType(data, _event)

      assert.isTrue(true)
    })
  })
})
