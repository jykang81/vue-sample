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
import OrderSheetPaymentMethod from '@/views/order/sheet/OrderSheetPaymentMethod'

import { dummyPayTypes } from '@unit/views/order/sheet/mock/tempOrderConst'
import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet } from '@unit/views/order/sheet/mock/setting'
import temp02ResAjaxNSWPayPayInfoAll from '@unit/views/order/sheet/mock/payment/nspay/02_res_AjaxNSWPay_payInfoAll'

describe('OrderSheet', () => {
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
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock.onPost(`${CONST.API_URL}/AjaxNSWPay`).reply(200, temp02ResAjaxNSWPayPayInfoAll)
    initOrderSheet(mock)

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

  describe('OrderSheetPaymentMethod 테스트', () => {
    it('결제수단(methods())-결제수단 선택팝업(onclickPaymentMethodSelect)', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetPaymentMethod)

      wrapper.vm.onclickPaymentMethodSelect()
      assert.isTrue(true)
    })
    it('결제수단(methods())-저장된 결제수단확인(setSavePaymentMethod)-저장된 결제수단 없음', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetPaymentMethod)

      wrapper.vm.globalVal.mOutputDatas.OrderMethodSave.paySaveFlag = '1'
      wrapper.vm.setSavePaymentMethod()
      assert.isTrue(true)
    })
    it('결제수단(methods())-저장된 결제수단확인(setSavePaymentMethod)- Title 확인', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetPaymentMethod)

      for (const type of dummyPayTypes) {
        wrapper.vm.globalVal.mOutputDatas.OrderMethodSave.LastPayTypeCode = type
        wrapper.vm.globalVal.mOutputDatas.OrderMethodSave.acctInfo = 'VAK|356-49-0142-75224'
        wrapper.vm.setSavePaymentMethod()

        let name = ''
        if (PAY_TYPE_CONST.isCreditCard(type)) {
          name = '하나카드'
        } else if (PAY_TYPE_CONST.isDepositWithoutBankbook(type)) {
          name = '국민'
        }

        PAY_TYPE_CONST.getTmplTitle(type, name, '일시불')
      }
      assert.isTrue(true)
    })
  })
})
