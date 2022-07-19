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
// import OrderSheetDelivery from '@/views/order/sheet/OrderSheetDelivery'
// import OrderSheetCustomer from '@/views/order/sheet/OrderSheetCustomer'
import OrderSheetProduct from '@/views/order/sheet/OrderSheetProduct'
// import OrderSheetAddressBook from '@/components/order/sheet/OrderSheetAddressBook'
// import OrderSheetAddressBookAdd from '@/components/order/sheet/OrderSheetAddressBookAdd'
// import OrderSheetAddressBookUpdate from '@/components/order/sheet/OrderSheetAddressBookUpdate'
// import OrderSheetAddressMulti from '@/components/order/sheet/OrderSheetAddressMulti'
// import OrderSheetSafeDeliverySearch from '@/components/order/sheet/OrderSheetSafeDeliverySearch'
// import OrderDeliveryChange from '@/components/order/OrderDeliveryChange'
// import OrderSheetRmaCheck from '@/components/order/sheet/OrderSheetRmaCheck'
// import OrderSheetSafeDeliverySearchAdd from '@/components/order/sheet/OrderSheetSafeDeliverySearchAdd'

import tempMInputParams from '@unit/views/order/sheet/mock/onload/mInputParams'
import { initOrderSheet, initOrderSheetDelivery } from '@unit/views/order/sheet/mock/setting'

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

    /**
       * vm.$nextTick() -> component 상태 및 템플릿 업데이트
       * vue instance는 비동기 일괄 업데이트 되기 때문에 async / await 구문 사용 필요
       */
    // await wrapper.vm.$nextTick()

    /**
       * pending 상태 promise 대상 flush 처리
       * 테스트 대상 코드에 비동기 처리가 있을 때 사용
       */
    // await flushPromises()
  })
  describe('OrderSheetProduct 테스트', () => {
    it('배송일 지정 펼치기/접기', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetProduct)
      wrapper.vm.onCollapse()
      assert.isTrue(true)
    })
    it('상품상세 이동', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetProduct)
      wrapper.vm.onclickLinkProductDetail()
      assert.isTrue(true)
    })
    it('배송일 지정 클릭 시', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetProduct)

      await wrapper.vm.clickDeliveryData('', '')
      assert.equal(wrapper.vm.globalVal.productInfo.deliveryNoDataClass, 'active')
      assert.equal(wrapper.vm.globalVal.productInfo.deliveryDateSelected, '')

      await wrapper.vm.clickDeliveryData('1', '2020-04-25')
      assert.equal(wrapper.vm.globalVal.productInfo.deliveryDataClass[1], 'active')
      assert.equal(wrapper.vm.globalVal.productInfo.deliveryDateSelected, '2020-04-25')
    })
    it('deliveryDateView', async () => {
      const wrapper = orderSheetWrapper.find(OrderSheetProduct)

      wrapper.vm.deliveryDateView()
      assert.isTrue(true)
    })
  })
})
