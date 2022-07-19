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
import { initOrderSheet, initOrderSheetConfirm, initOrderSheetPaymentNspay } from '@unit/views/order/sheet/mock/setting'

import temp05ResSeparateStaffOnlyProducts from '@unit/views/order/sheet/mock/onload/05_res_SeparateStaffOnlyProducts'
import temp02ResNSMypageCommCmdAlejandroO from '@unit/views/order/sheet/mock/confirm/02_res_NSMypageCommCmd_alejandro_O'

describe('OrderSheetConfirmOnclickPayment', () => {
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
    initOrderSheetPaymentNspay(mock)
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

  describe('OrderSheetConfirm onclickPayment 테스트 ', async () => {
    it('결제하기(methods())-결제하기 버튼 클릭 1 (onclickPayment)', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, temp02ResNSMypageCommCmdAlejandroO.get(PAY_TYPE_CONST.CREDIT_CARD))
        .onPost(`${CONST.API_URL}/SeparateStaffOnlyProducts`).reply(200, temp05ResSeparateStaffOnlyProducts)
        .onPost(`${CONST.API_URL}/MobilePersonalInfoManageCmdReal`).reply(200, { msg: { root: '' } })

      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.confirmInfo.isCheckAgreePurchage = true
      assert.isUndefined(wrapper.vm.onclickPayment(e), `->${wrapper.vm.onclickPayment(e)}`)
      await flushPromises()
    })
    it('결제하기(methods())-결제하기 버튼 클릭 2 (onclickPayment)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = '0'
      assert.isFalse(wrapper.vm.onclickPayment(e))
      await flushPromises()
    })
    it('결제하기(methods())-결제하기 버튼 클릭 3 (onclickPayment)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      // 도서산간 체크
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.deliveryInfo.bDeliveryYn = 'N'
      wrapper.vm.globalVal.deliveryInfo.bjejuYn = 'N'
      assert.isTrue(wrapper.vm.validNoneDeliveryProduct())
      assert.isFalse(wrapper.vm.onclickPayment(e))
      await flushPromises()
    })
    it('결제하기(methods())-결제하기 버튼 클릭 4 (onclickPayment)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetConfirm)

      // 카드일시불할인은 결제금액이 5만원 이상인 경우에만 가능
      wrapper.vm.globalVal.paymentMethodInfo.paymentMethod = PAY_TYPE_CONST.CREDIT_CARD
      wrapper.vm.globalVal.discountInfo.showSinglePaymentDiscount = true
      wrapper.vm.globalVal.discountInfo.checkedSinglePaymentDiscount = true
      wrapper.vm.paymentData.Payment.getItem(0).OFFER_AMT = 12900

      assert.isFalse(wrapper.vm.onclickPayment(e))
      await flushPromises()
    })
  })
})
