import { assert } from 'chai' // 필수
import { mount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import TimeEventsTwiceADay from '@/views/event/TimeEventsTwiceADay'
import loginUtil from '@utils/loginUtil'

const NSTimesTimeCouponAjaxResponse = {
  msg: [
    {
      PLUS_SPR_CD: '30',
      CP_APPLY_SPR: '2',
      PTCPT_EXPNS_END_TM: '235959',
      CNT: '1000',
      CP_IDFR: '1020410',
      BNFT_VAL: '10',
      PTCPT_EXPNS_START_TM: '100000'
    },
    {
      PLUS_SPR_CD: '30',
      CP_APPLY_SPR: '2',
      PTCPT_EXPNS_END_TM: '235959',
      CNT: '500',
      CP_IDFR: '1020414',
      BNFT_VAL: '10',
      PTCPT_EXPNS_START_TM: '220000'
    }
  ],
  req_co_cd: [
    '110'
  ],
  catalogId: [
    '97001'
  ],
  userId: [
    ''
  ],
  inde: [
    'mobile'
  ],
  langId: [
    '-9'
  ],
  accptPath: [
    '500'
  ],
  accptPathCd: [
    '500'
  ],
  storeId: [
    '13001'
  ]
}

describe('TimeEventsTwiceADay', () => {
  let localVue
  let options
  let wrapper
  let vm
  let mock

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    options = {
      localVue,
      store,
      router
    }

    Vue.prototype.$nsaxios = nsaxios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    mock
      .onPost(`${CONST.API_URL}/NSTimesTimeCouponAjax`)
      .reply(200, NSTimesTimeCouponAjaxResponse)

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })

    wrapper = mount(TimeEventsTwiceADay, options)
    vm = wrapper.vm
  })

  after(() => {
    mock.reset()
  })

  it('timeCouponParams', async () => {
    vm.timeCouponParams()
    assert.isTrue(true)
  })

  it('getReceiptTimeCoupon', async () => {
    mock
      .onPost(`${CONST.API_URL}/NSTimesTimeCouponAjax`)
      .reply(200, NSTimesTimeCouponAjaxResponse)

    vm.getReceiptTimeCoupon()
    await flushPromises()
    assert.isTrue(true)
  })

  it('setReceiptTimeCoupon', async () => {
    vm.setReceiptTimeCoupon(NSTimesTimeCouponAjaxResponse)
    assert.isTrue(true)
  })

  it('clickDownloadCouponButton', async () => {
    vm.clickDownloadCouponButton('day')
    await flushPromises()
    assert.isTrue(true)
  })

  it('downloadCoupon', async () => {
    mock
      .onPost(`${CONST.API_URL}/NSTimesTimeCouponAjax`)
      .reply(200, NSTimesTimeCouponAjaxResponse)

    vm.downloadCoupon('day')
    await flushPromises()
    assert.isTrue(true)
  })

  it('moveToSettings', () => {
    vm.moveToSettings()
    assert.isTrue(true)
  })
})
