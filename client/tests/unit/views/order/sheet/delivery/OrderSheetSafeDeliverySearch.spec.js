// import { assert } from 'chai'
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

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetSafeDeliverySearch from '@/components/order/sheet/OrderSheetSafeDeliverySearch'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetSafeDeliverySearch', () => {
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
    initOrderSheet(mock)
    initOrderSheetDelivery(mock)

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

    orderSheetWrapper = mount(OrderSheet, options)

    await flushPromises()
  })
  describe('OrderSheetSafeDeliverySearch 테스트', () => {
    beforeEach(async () => {
      options.propsData = {
        param: {
          globalVal: orderSheetWrapper.vm.globalVal,
          paymentData: orderSheetWrapper.vm.paymentData,
          customerData: {
            recipientName: orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
            phone: orderSheetWrapper.vm.globalVal.customerInfo.phNumber
          }
        }
      }
    })

    it('처음 시/도 정보를 가지고 오는 곳', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearch, options)

      wrapper.vm.getSafeCity()
      await flushPromises()
    })
    it('시/도 변경 시', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearch, options)

      wrapper.vm.changeAddrCitySelect()
      await flushPromises()
    })
    it('검색 버튼 클릭 시', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearch, options)

      wrapper.vm.clickSearchDetailAddrBtn()
      await flushPromises()
    })
    it('주소 선택 클릭 시', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearch, options)

      wrapper.vm.clickPostItemBtn()
    })
  })
})
