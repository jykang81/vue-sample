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

import HappyDealWeek from '@/views/store/HappyDealWeek'
import { circleListRes, weekRecommListRes } from '@unit/views/store/mock/happyDeal'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

// 필수 테스트 할 대상 파일명을 넣음
describe('해피딜 주간 특가', () => {
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

  it('추천 해피딜 상품, 프로모션 배너', async () => {
    mock.reset()
    // 상단 배너, 오늩 특가 상품 상품 조회
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`, getProcessedWCSParameter('post', {
      espotInfo: [
        'EZ_HAPPYDEAL_WEEK_PRDWIDE|ESPOT_PRDWIDE|1|30|0',
        'EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER|ESPOT_CNTNT|1|10|0'
      ].join('$')
    }))
      .reply(200, circleListRes)
    const wrapper = mount(HappyDealWeek, options)
    const vm = wrapper.vm
    assert.isTrue(true, vm)
    vm.init()
    await flushPromises()
    vm.getHappyDealWeekData()
    await flushPromises()
    assert.deepEqual(vm.recommendProductListTitle, circleListRes.msg.espotExtendList._EZ_HAPPYDEAL_WEEK_PRDWIDE.titleContent.marketingText)
    assert.deepEqual(vm.recommendProductList, circleListRes.msg.espotList[0]._EZ_HAPPYDEAL_WEEK_PRDWIDE)
    assert.deepEqual(vm.promotionBannerList, circleListRes.msg.espotList[1]._EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER)
  })

  it('주간 특가 상품 조회', async () => {
    mock.reset()
    // 주간 특가 상품 조회
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`, getProcessedWCSParameter('post', {
      espotInfo: [
        'EZ_HAPPYDEAL_WEEK_PRDGRID|ESPOT_PRDLARGE|1|40|0'
      ]
    }))
      .reply(200, weekRecommListRes)
    const wrapper = mount(HappyDealWeek, options)
    const vm = wrapper.vm
    assert.isTrue(true, vm)
    vm.getWeekProductList()
    await flushPromises()
    assert.deepEqual(vm.weekProductList, weekRecommListRes.msg.espotList[0]._EZ_HAPPYDEAL_WEEK_PRDGRID)
  })

  it('최종', async () => {
    mock.reset()
    // 상단 배너, 오늩 특가 상품 상품 조회
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`, getProcessedWCSParameter('post', {
      espotInfo: [
        'EZ_HAPPYDEAL_WEEK_PRDWIDE|ESPOT_PRDWIDE|1|30|0',
        'EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER|ESPOT_CNTNT|1|10|0'
      ].join('$')
    }))
      .reply(200, circleListRes)
    // 주간 특가 상품 조회
    mock.onPost(`${CONST.API_URL}/NSFixedShopCmd`, getProcessedWCSParameter('post', {
      espotInfo: [
        'EZ_HAPPYDEAL_WEEK_PRDGRID|ESPOT_PRDLARGE|1|40|0'
      ]
    }))
      .reply(200, weekRecommListRes)
    const wrapper = mount(HappyDealWeek, options)
    const vm = wrapper.vm
    assert.isTrue(true, vm)
    vm.init()
    await flushPromises()
    vm.getWeekProductList()
    await flushPromises()

    assert.deepEqual(vm.recommendProductListTitle, circleListRes.msg.espotExtendList._EZ_HAPPYDEAL_WEEK_PRDWIDE.titleContent.marketingText)
    assert.deepEqual(vm.recommendProductList, circleListRes.msg.espotList[0]._EZ_HAPPYDEAL_WEEK_PRDWIDE)
    assert.deepEqual(vm.promotionBannerList, circleListRes.msg.espotList[1]._EZ_HAPPYDEAL_WEEK_CIRCLE_BANNER)
    assert.deepEqual(vm.weekProductList, weekRecommListRes.msg.espotList[0]._EZ_HAPPYDEAL_WEEK_PRDGRID)
  })
})
