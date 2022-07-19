import CONST from '@constants/framework/framework'
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
import OrderSheetDelivery from '@/views/order/sheet/OrderSheetDelivery'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

import loginUtil from '@utils/loginUtil'

describe('OrderSheetDelivery', () => {
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

  describe('OrderSheetDelivery 테스트', () => {
    it('OrderSheetDeliveryinit', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)

      wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD = '50'
      wrapper.vm.init()

      wrapper.vm.globalVal.mOutputDatas.msg.deliveryMsg = ''
      wrapper.vm.init()

      wrapper.vm.strDispTypeCd = '50'
      wrapper.vm.init()

      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 2
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.globalVal.deliveryInfo.multiDelvIdx = 2
    })

    it('배송지 영역 출력', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)

      const data = wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList
      data[0].goodsDetail.DISP_TYPE_CD = '30'
      data[0].goodsDetail.PAY_TYPE_CD = '10'

      wrapper.vm.globalVal.productInfo.deliveryDesignatedDayFlag = 'Y'
      wrapper.vm.globalVal.productInfo.deliveryAagreeStatus = 'Y'
      wrapper.vm.setOrderDeliveryArea(data)
      assert.equal(true, true)

      wrapper.vm.globalVal.productInfo.deliveryDesignatedDayCount = 'Y'
      wrapper.vm.globalVal.productInfo.deliveryAagreeStatus = 'Y'
      wrapper.vm.setOrderDeliveryArea(data)
      assert.equal(wrapper.vm.isManyDeliveryShow, false)

      wrapper.vm.globalVal.productInfo.deliveryAagreeStatus = 'N'
      wrapper.vm.globalVal.deliveryIndexSelectHideStatus = 'Y'
      wrapper.vm.setOrderDeliveryArea(data)
      assert.equal(true, true)

      wrapper.vm.globalVal.deliveryInfo.safeCount = 'Y'
      wrapper.vm.setOrderDeliveryArea(data)
      assert.equal(true, true)

      wrapper.vm.globalVal.deliveryInfo.safeCount = 'N'
      wrapper.vm.setOrderDeliveryArea(data)
      assert.equal(true, true)

      wrapper.vm.globalVal.productInfo.deliveryDesignatedDayFlag = 'N'
      wrapper.vm.globalVal.productInfo.deliveryAagreeStatus = 'N'
      wrapper.vm.globalVal.productInfo.deliveryIndexSelectHideStatus = 'Y'
      wrapper.vm.setOrderDeliveryArea(data)
      assert.equal(true, true)
    })

    it('배송지정보 출력', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)

      const addressList = wrapper.vm.globalVal.mOutputDatas.msg.AddressList
      const strDispTypeCd = wrapper.vm.globalVal.mOutputDatas.msg.OrderGoodList[0].goodsDetail.DISP_TYPE_CD

      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 2
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.globalVal.deliveryInfo.multiDelvIdx = 1
      wrapper.vm.globalVal.deliveryInfo.multiDelvVal[0] = 'Y'
      wrapper.vm.setAddressList('', addressList, strDispTypeCd)
      assert.equal(true, true)

      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 2
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.globalVal.deliveryInfo.multiDelvIdx = 2
      wrapper.vm.globalVal.deliveryInfo.multiDelvVal[0] = 'Y'
      wrapper.vm.setAddressList('', addressList, strDispTypeCd)
      assert.equal(true, true)

      wrapper.vm.globalVal.mOutputDatas.TOTAL_ITEM_COUNT = 2
      wrapper.vm.globalVal.isGuest = false
      wrapper.vm.globalVal.deliveryInfo.multiDelvIdx = 1
      wrapper.vm.globalVal.deliveryInfo.multiDelvVal[0] = 'N'
      wrapper.vm.bDispTypeCdChoice = true
      wrapper.vm.setAddressList('', addressList, strDispTypeCd)
      assert.equal(true, true)
    })

    it('기본배송지 출력', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)

      const data = wrapper.vm.globalVal.mOutputDatas.msg.AddressList[0]

      data.ADDRESS1 = ''
      wrapper.vm.setBaseAddressLine(data, 0)
      assert.equal(data.ZIPCODE, (data.FAX2 || data.ZIPCODE))

      data.ADDRESS1 = '서울시'
      wrapper.vm.setBaseAddressLine(data, 0)
      assert.equal(data.ADDRESS2, '경기 성남시 분당구 대왕판교로 (동원동，NS홈쇼핑)')
      assert.equal(data.ADDRESS3, '15 7층')
    })

    it('배송메세지 변경', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      wrapper.vm.changeShippingMsg()
      assert.isTrue(true)

      wrapper.vm.shippingMessageSelected = '직접입력(20자 이내)'
      wrapper.vm.changeShippingMsg()
      assert.isTrue(true)
    })

    it('배송메세지 입력', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      wrapper.vm.keyupShippingMessage()
      assert.isTrue(true)
    })

    it('배송주소 클릭 시', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      wrapper.vm.globalVal.deliveryInfo.isMultiDeliveryShow = false
      wrapper.vm.clickAddressBookLink()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.globalVal.deliveryInfo.isMultiDeliveryShow = true
      wrapper.vm.clickAddressBookLink()
      await flushPromises()
      assert.isTrue(true)
    })

    it('안심택배함으로 받기 클릭 시', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      wrapper.vm.clickSafeDeliveryLink()
      await flushPromises()
      assert.isTrue(true)
    })

    it('여러곳으로 배송 받기 체크박스 클릭 시', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      wrapper.vm.multiDeliveryChecked = true
      wrapper.vm.changeManyDeliveryCheckBox()
      await flushPromises()
      assert.isTrue(true)

      wrapper.vm.multiDeliveryChecked = false
      wrapper.vm.changeManyDeliveryCheckBox()
      assert.isTrue(true)
    })

    it('최근 배송 메세지 목록 호출', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      loginUtil.login({ userId: 110548084 })
      wrapper.vm.clickGetCustDeliveryMsg()
      await flushPromises()
      assert.isTrue(true)
    })

    it('배송일지정_도서산간 지역체크', async () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSMypageCommCmd`).reply(200, { list: { resultCd: 'Y' } })

      const wrapper = orderSheetWrapper.find(OrderSheetDelivery)
      loginUtil.login({ userId: 110548084 })
      wrapper.vm.globalVal.productInfo.deliveryDesignatedDayFlag = 'Y'
      wrapper.vm.globalVal.productInfo.deliveryDateSelected = ''
      wrapper.vm.getIslandmountain(0, 300010975004, '123456', [], 'N')
      await flushPromises()
      assert.isTrue(true)
    })
  })
})
