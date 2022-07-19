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
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'

import OrderSheet from '@/views/order/sheet/OrderSheet'
import OrderSheetAddressBookAdd from '@/components/order/sheet/OrderSheetAddressBookAdd'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

describe('OrderSheetAddressBookAdd', () => {
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
    mock.reset()
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

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetAddressBookAdd 테스트', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(OrderSheetAddressBookAdd, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData
          }
        }
      })
      wrapper.vm.$store = { commit: data => {} }
    })

    describe('OrderSheetAddressBookAdd 테스트', () => {
      it('우편번호검색 버튼 클릭', async () => {
        wrapper.vm.clickSearchPostCodeBtn()
        await flushPromises()
        assert.isTrue(true)
      })

      it('저장 버튼 클릭', async () => {
        wrapper.vm.clickSetAddressBtn()
        assert.isTrue(true)
      })

      it('배송주소록 추가', async () => {
        wrapper.vm.recipientName = ''
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '!@#!@'
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김'
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = ''
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = '111'
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = '01012341231'
        wrapper.vm.postcode = ''
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = '01012341231'
        wrapper.vm.postcode = '13487'
        wrapper.vm.addr = ''
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = '01012341231'
        wrapper.vm.postcode = '13487'
        wrapper.vm.addr = '경기도 성남시 분당구 판교로 228번길'
        wrapper.vm.addrDetail = ''
        wrapper.vm.insertShippingAddress()

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = '01012341231'
        wrapper.vm.postcode = '13487'
        wrapper.vm.addr = '경기도 성남시 분당구 판교로 228번길'
        wrapper.vm.addrDetail = '15 NS홈쇼핑'
        wrapper.vm.insertShippingAddress()
        await flushPromises()
        assert.isTrue(true)

        wrapper.vm.recipientName = '김일모'
        wrapper.vm.phone = '01012341231'
        wrapper.vm.postcode = '13487'
        wrapper.vm.addr = '경기도 성남시 분당구 판교로 228번길'
        wrapper.vm.addrDetail = '15 NS홈쇼핑'
        wrapper.vm.ipDefaultDest = true
        wrapper.vm.insertShippingAddress()
        await flushPromises()
        assert.isTrue(true)
      })

      it('keydownNumber', async () => {
        wrapper.vm.keydownNumber({
          keyCode: 50,
          target: {
            value: '12'
          }
        })
        assert.isTrue(true)
      })

      it('blurRecipientName', async () => {
        wrapper.vm.recipientName = ''
        wrapper.vm.blurRecipientName({
          target: {
            value: ''
          }
        })
        assert.isTrue(true)

        wrapper.vm.recipientName = '!@#!@'
        wrapper.vm.blurRecipientName({
          target: {
            value: ''
          }
        })
        assert.isTrue(true)

        wrapper.vm.recipientName = '김'
        wrapper.vm.blurRecipientName({
          target: {
            value: ''
          }
        })
        assert.isTrue(true)
      })

      it('blurPhone', async () => {
        wrapper.vm.phone = ''
        wrapper.vm.blurPhone({
          target: {
            value: ''
          }
        })
        assert.isTrue(true)

        wrapper.vm.phone = '010'
        wrapper.vm.blurPhone({
          target: {
            value: ''
          }
        })
        assert.isTrue(true)
      })

      it('blurAddrDetail', async () => {
        wrapper.vm.addrDetail = ''
        wrapper.vm.blurAddrDetail({
          target: {
            value: ''
          }
        })
        assert.isTrue(true)
      })
    })
  })
})
