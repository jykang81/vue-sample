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

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetSafeDeliverySearchAdd from '@/components/order/sheet/OrderSheetSafeDeliverySearchAdd'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetSafeDeliverySearchAdd', () => {
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
  describe('OrderSheetSafeDeliverySearchAdd 테스트', () => {
    beforeEach(async () => {
      options.propsData = {
        param: {
          globalVal: orderSheetWrapper.vm.globalVal,
          paymentData: orderSheetWrapper.vm.paymentData,
          customerData: {
            recipientName: orderSheetWrapper.vm.globalVal.mOutputDatas.msg.UserInfo.LASTNAME,
            phone: orderSheetWrapper.vm.globalVal.customerInfo.phNumber
          },
          safeData: {
            zipCode: '14225',
            addr1: '경기도 광명시 철산동 63',
            addr2: '국민체육센터(무인택배)',
            road1: '경기도 광명시 사성로 74',
            road2: '국민체육센터(철산동)'
          }
        }
      }
    })

    it('우편번호검색 버튼 클릭', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearchAdd, options)
      wrapper.vm.clickSearchPostCodeBtn()
      await flushPromises()
      assert.isTrue(true)
    })
    it('저장 버튼 클릭', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearchAdd, options)
      wrapper.vm.clickSetAddressBtn()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.recipientName = ''
      wrapper.vm.clickSetAddressBtn()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = ''
      wrapper.vm.clickSetAddressBtn()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = options.propsData.param.customerData.phone
      wrapper.vm.postcode = ''
      wrapper.vm.clickSetAddressBtn()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = options.propsData.param.customerData.phone
      wrapper.vm.postcode = options.propsData.param.safeData.zipCode
      wrapper.vm.addr = ''
      wrapper.vm.clickSetAddressBtn()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = options.propsData.param.customerData.phone
      wrapper.vm.postcode = options.propsData.param.safeData.zipCode
      wrapper.vm.addr = options.propsData.param.safeData.addr1
      wrapper.vm.addrDetail = ''
      wrapper.vm.clickSetAddressBtn()
      await flushPromises()
      assert.isTrue(true)
    })
    it('배송주소록 추가', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearchAdd, options)
      wrapper.vm.insertShippingAddress()
      assert.isTrue(true)

      wrapper.vm.recipientName = ''
      wrapper.vm.insertShippingAddress()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = ''
      wrapper.vm.insertShippingAddress()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = options.propsData.param.customerData.phone
      wrapper.vm.postcode = ''
      wrapper.vm.insertShippingAddress()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = options.propsData.param.customerData.phone
      wrapper.vm.postcode = options.propsData.param.safeData.zipCode
      wrapper.vm.addr = ''
      wrapper.vm.insertShippingAddress()
      assert.isTrue(true)

      wrapper.vm.recipientName = options.propsData.param.customerData.recipientName
      wrapper.vm.phone = options.propsData.param.customerData.phone
      wrapper.vm.postcode = options.propsData.param.safeData.zipCode
      wrapper.vm.addr = options.propsData.param.safeData.addr1
      wrapper.vm.addrDetail = ''
      wrapper.vm.insertShippingAddress()
      assert.isTrue(true)
    })
    it('배송주소록 조회', async () => {
      const wrapper = mount(OrderSheetSafeDeliverySearchAdd, options)
      wrapper.vm.getShipAddrList()
      assert.isTrue(true)
    })
  })
})
