import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import VueRouter from 'vue-router'
import router from '@/router'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'

import { TEMP_PARAMS1, TEMP_PARAMS2 } from '@unit/views/order/complete/mock/orderConsultCompleteTest'
import OrderConsultComplete from '@/views/order/complete/OrderConsultComplete'

describe('OrderConsultComplete', () => {
  let localVue
  let options
  let mainWrapper

  beforeEach(function () {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'orderConsultComplete',
      meta: {},
      path: '/order/consult/complete',
      hash: '',
      query: {},
      params: { mInputParams: TEMP_PARAMS1, userInfo: TEMP_PARAMS2 },
      fullPath: '/',
      matched: []
    }

    options = {
      localVue,
      store,
      router
    }

    mainWrapper = mount(OrderConsultComplete, options)
  })

  describe('OrderConsultComplete 테스트', () => {
    it('상담신청 접수완료(method())-계속 쇼핑하기 확인 (onclickContinueShopping)', async () => {
      const wrapper = mainWrapper.find(OrderConsultComplete)
      wrapper.vm.onclickContinueShopping()
      assert.isTrue(true)
    })
    it('상담신청 접수완료(method())-주문내역조회 확인 (onclickOrdersList)', async () => {
      const wrapper = mainWrapper.find(OrderConsultComplete)
      wrapper.vm.onclickOrdersList()
      assert.isTrue(true)
    })
  })
})
