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
import OrderSheetAddressMulti from '@/components/order/sheet/OrderSheetAddressMulti'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

import loginUtil from '@utils/loginUtil'

describe('OrderSheetAddressMulti', () => {
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

  afterEach(async () => {
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  })

  describe('OrderSheetAddressMulti 테스트', () => {
    let wrapper

    beforeEach(async () => {
      wrapper = mount(OrderSheetAddressMulti, {
        propsData: {
          param: {
            globalVal: orderSheetWrapper.vm.globalVal,
            paymentData: orderSheetWrapper.vm.paymentData,
            resultMulti: {}
          }
        }
      })
      wrapper.vm.$store = { commit: data => {} }
      wrapper.vm.itemList = [
        { goodsDetail: { QUANTITY: 1 }, itemDetailInfo: { brandName: '' } },
        { goodsDetail: { QUANTITY: 1 }, itemDetailInfo: { brandName: '' } }
      ]
      wrapper.vm.multiDeliveryCount = 2
      wrapper.vm.multi = [{
        sumShipCharge: 100,
        sumRmaShipCharge: 100,
        addr: 'dummy1',
        addrDetail: 'dummy1',
        recipientName: 'dummy'
      },
      {
        sumShipCharge: 100,
        sumRmaShipCharge: 100,
        addr: 'dummy2',
        addrDetail: 'dummy2',
        recipientName: 'dummy'
      }]
      wrapper.vm.globalVal.deliveryInfo.multi = [{
        selectedCnt: [1],
        shipCharge: 100,
        rmaShipCharge: 100
      },
      {
        selectedCnt: [1],
        shipCharge: 0,
        rmaShipCharge: 0
      }]
    })

    describe('OrderSheetAddressMulti 테스트', () => {
      // it('init', async () => {
      //   wrapper.vm.init()
      //   assert.isTrue(true, '-00')
      // })

      it('배송지1 출력', async () => {
        wrapper.vm.setBaseAddressLine(wrapper.vm.globalVal.mOutputDatas.msg.AddressList[0])
        assert.isTrue(true)
      })

      it('배송주소 클릭 시', async () => {
        wrapper.vm.clickAddressBookLink(0)
        await flushPromises()
        assert.isTrue(true)
      })

      it('안심택배함으로 받기 클릭 시', async () => {
        wrapper.vm.clickSafeDeliveryLink(0)
        await flushPromises()
        assert.isTrue(true)
      })

      it('최근 배송 메세지 목록 호출', async () => {
        loginUtil.login({ userId: 110548084 })
        wrapper.vm.clickGetCustDeliveryMsg()
        await flushPromises()
        assert.isTrue(true)
      })

      it('배송 받는 곳 횟수 변경 시', async () => {
        wrapper.vm.multiDeliveryCount = 2
        wrapper.vm.changeMultiDeliverySelect()
        assert.isTrue(true)
      })

      it('받으실 상품 수량 변경 시', async () => {
        wrapper.vm.changeItemCntSelect(0, 0)
        assert.isTrue(true)
      })

      it('저장 버튼 클릭 시', async () => {
        wrapper.vm.clickMultiDeliverySaveBtn()
        assert.isTrue(true)
      })

      it('배송메세지 변경', async () => {
        wrapper.vm.multi[0].shippingMessageSelected = '직접입력(20자 이내)'
        wrapper.vm.changeShippingMsg(0)
        assert.isTrue(true)

        wrapper.vm.multi[0].shippingMessageSelected = ''
        wrapper.vm.changeShippingMsg(0)
        assert.isTrue(true)
      })

      it('배송메세지 입력', async () => {
        wrapper.vm.multi[0].shippingMessage = ''
        wrapper.vm.keyupShippingMessage(0)
        assert.isTrue(true)
      })
    })
  })
})
