import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import store from '@/vuex'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
import MypageBenefit from '@/views/customer/benefit/MypageBenefit'

import { MileageReal, TolPointReal, AccumulatedMoneyReal, CpInfoReal, GiftCardInfoReal, NsMembershipReal, NSCustExpCouponCountReal } from '@unit/views/customer/benefit/mock/benefitResponse'

const initBenefitResponse = mock => {
  mock.onPost(`${CONST.API_URL}/MileageReal`)
    .reply(200, MileageReal)

  mock.onPost(`${CONST.API_URL}/TolPointReal`)
    .reply(200, TolPointReal)

  mock.onPost(`${CONST.API_URL}/AccumulatedMoneyReal`)
    .reply(200, AccumulatedMoneyReal)

  mock.onPost(`${CONST.API_URL}/CpInfoReal`)
    .reply(200, CpInfoReal)

  mock.onPost(`${CONST.API_URL}/GiftCardInfoReal`)
    .reply(200, GiftCardInfoReal)

  mock.onPost(`${CONST.API_URL}/NsMembershipReal`)
    .reply(200, NsMembershipReal)

  mock.onPost(`${CONST.API_URL}/NSCustExpCouponCountReal`)
    .reply(200, NSCustExpCouponCountReal)

  return mock
}

describe('마이페이지 > 나의혜택 테스트', () => {
  let localVue
  let options
  let mock

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    Vue.prototype.$nsaxios = nsaxios

    delete router.history.current
    router.history.current = {
      name: 'mypageBenefit',
      meta: {},
      path: '/benefit',
      hash: '',
      query: {},
      params: {
        type: ''
      },
      fullPath: '/',
      matched: []
    }

    mock = new MockAdapter(axios)
    initBenefitResponse(mock)

    options = {
      localVue,
      store,
      router
    }
  })

  it('정의되지 않은 페이지 진입 시', () => {
    router.history.current.params.type = 'sav'

    const wrapper = mount(MypageBenefit, options)
    assert.equal(wrapper.vm.pageType, '')
  })

  it('정의된 페이지 진입 시', async () => {
    router.history.current.params.type = 'savings'
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm

    assert.equal(vm.period, 'weekly')
    assert.equal(vm.pageNum, 1)
    assert.equal(vm.pageType, vm.$route.params.type)
    assert.equal(Array.isArray(vm[vm.pageType].benefitList), true)
  })

  it('적립금 데이터 호출 시', async () => {
    router.history.current.params.type = 'savings'
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm

    vm.getDataByPageType()

    await flushPromises()

    assert.equal(vm.savings.totalCount, MileageReal.msg.root.common.totalCount)
    assert.equal(vm.savings.amount, insertCommas(MileageReal.msg.root.common.amount))
    assert.equal(vm.savings.expiredAmt, insertCommas(MileageReal.msg.root.common.expiredAmt))
  })

  it('톨포인트 테이터 호출 시', async () => {
    router.history.current.params.type = 'toll'
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm

    vm.getDataByPageType()

    await flushPromises()

    assert.equal(vm.toll.totalCount, TolPointReal.msg.root.common.totalCount)
    assert.equal(vm.toll.amount, insertCommas(TolPointReal.msg.root.common.amount))
    assert.equal(vm.toll.expiredAmt, insertCommas(TolPointReal.msg.root.common.expiredAmt))
  })

  it('예치금 테이터 호출 시', async () => {
    router.history.current.params.type = 'deposit'
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm

    vm.getDataByPageType()

    await flushPromises()

    assert.equal(vm.deposit.totalCount, AccumulatedMoneyReal.msg.root.common.totalCount)
    assert.equal(vm.deposit.amount, insertCommas(AccumulatedMoneyReal.msg.root.common.amount))
    assert.equal(vm.deposit.expiredAmt, insertCommas(AccumulatedMoneyReal.msg.root.common.expiredAmt))
  })

  it('쿠폰 테이터 호출 시', async () => {
    router.history.current.params.type = 'coupon'
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm

    vm.getDataByPageType()

    await flushPromises()

    assert.equal(vm.coupon.totalCount, CpInfoReal.msg.root.Common.cpCnt)
    assert.equal(vm.coupon.cpCnt, insertCommas(CpInfoReal.msg.root.Common.cpCnt))

    if (NSCustExpCouponCountReal.msg.isSuccess === 'S') {
      assert.equal(vm.coupon.expiredCoupon, NSCustExpCouponCountReal.msg.couponCnt)
    }
  })

  it('상품권 테이터 호출 시', async () => {
    router.history.current.params.type = 'gift-card'
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm

    vm.getDataByPageType()

    await flushPromises()

    assert.equal(vm.gift.totalCount, GiftCardInfoReal.msg.root.common.totalCount)
    assert.equal(vm.gift.giftCardBalance, insertCommas(GiftCardInfoReal.msg.root.common.giftCardBalance))
  })

  it('기간 탭 변경 시', () => {
    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm
    const periodArr = ['weekly', '1monthly', '3monthly', '6monthly', 'all']

    for (let i = 0; i < periodArr.length; i++) {
      vm.setPagePeriod(periodArr[i])
      assert.equal(vm.period, periodArr[i])
      assert.equal(vm.pageNum, 1)
    }

    vm.pageType = 'savings'

    for (let i = 0; i < periodArr.length; i++) {
      vm.setPagePeriod(periodArr[i])
      assert.equal(vm.period, periodArr[i])
      assert.equal(vm.pageNum, 1)
      assert.equal(Array.isArray(vm[vm.pageType].benefitList), true)
    }
  })

  it('FromDate 호출 시', () => {
    router.history.current.params.type = 'savings'

    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm
    const periodArr = ['weekly', '1monthly', '3monthly', '6monthly', 'all']

    for (let i = 0; i < periodArr.length; i++) {
      vm.period = periodArr[i]

      const result = vm.getFromDate()

      assert.equal(typeof result, 'string')
      assert.equal(result.length, 8)
    }
  })

  it('getSchFlag 호출 시', () => {
    router.history.current.params.type = 'savings'

    const wrapper = mount(MypageBenefit, options)
    const vm = wrapper.vm
    const periodArr = ['weekly', '1monthly', '3monthly', '6monthly']
    const flagArr = ['W', '1M', '3M', '6M']

    for (let i = 0; i < periodArr.length; i++) {
      vm.period = periodArr[i]

      const result = vm.getSchFlag()

      assert.equal(result, flagArr[i])
    }
  })
})
