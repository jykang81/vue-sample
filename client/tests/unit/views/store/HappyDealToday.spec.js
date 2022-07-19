import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router'

import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import store from '@/vuex'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import { getProcessedWCSParameter } from '@unit/testUtil'
import flushPromises from 'flush-promises'

import HappyDealToday from '@/views/store/HappyDealToday'
import { todaySaleRes, tommorowSaleRes } from '@unit/views/store/mock/happyDeal'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

// 필수 테스트 할 대상 파일명을 넣음
describe('해피딜 오늩 특가', () => {
  let mock

  const localVue = createLocalVue()
  Vue.prototype.$nsaxios = nsaxios
  Vue.directive('img-lazy-load', {})
  localVue.use(Vuex)
  localVue.use(VueRouter)

  const options = {
    localVue,
    router,
    store
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  it('상단 배너, 오늩 특가 상품 상품 조회', async () => {
    mock.reset()
    // 상단 배너, 오늩 특가 상품 상품 조회
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`, getProcessedWCSParameter('post', {
      espotInfo: [
        'EZ_HAPPYDEAL_TODAY_TOP_BANNER|ESPOT_CNTNT|1|1|0',
        'EZ_HAPPYDEAL_TODAY_PRODWIDE|ESPOT_PRDWIDE|1|9999|0'
      ].join('$')
    }))
      .reply(200, todaySaleRes)
    const wrapper = mount(HappyDealToday, options)
    const vm = wrapper.vm
    assert.isTrue(true, vm)
    vm.init()
    await flushPromises()
    vm.getHappyDealTodayInitData()
    await flushPromises()
    assert.deepEqual(vm.topBanner, todaySaleRes.msg.espotList[0]._EZ_HAPPYDEAL_TODAY_TOP_BANNER)
    assert.deepEqual(vm.todayProductList, todaySaleRes.msg.espotList[1]._EZ_HAPPYDEAL_TODAY_PRODWIDE)
  })

  it('프로모션 배너, 내일 특가 상품 조회', async () => {
    mock.reset()
    // 프로모션 배너, 내일 특가 상품 조회
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`, getProcessedWCSParameter('post', {
      espotInfo: [
        'EZ_HAPPYDEAL_TODAY_MID_BANNER|ESPOT_CNTNT|1|1|0',
        'EZ_HAPPYDEAL_TODAY_NEXT_PRDGRID|ESPOT_PRDGRID|1|3|0'
      ].join('$')
    }))
      .reply(200, tommorowSaleRes)
    const wrapper = mount(HappyDealToday, options)
    const vm = wrapper.vm
    assert.isTrue(true, vm)
    vm.init()
    await flushPromises()
    vm.getHappyDealTodayMoreData()
    await flushPromises()
    assert.deepEqual(vm.promotionBanner, tommorowSaleRes.msg.espotList[0]._EZ_HAPPYDEAL_TODAY_MID_BANNER)
    assert.deepEqual(vm.nextDayProductList, tommorowSaleRes.msg.espotList[1]._EZ_HAPPYDEAL_TODAY_NEXT_PRDGRID)
  })
})
