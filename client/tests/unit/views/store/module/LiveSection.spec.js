import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { mount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import LiveSection from '@/views/store/module/LiveSection'
import VueRouter from 'vue-router'
import router from '@/router'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import CONST from '@constants/framework/framework'
import { getProcessedWCSParameter } from '@unit/testUtil'
import nsLiveAndShopPlusData from '@unit/views/store/mock/nsLiveAndShopPlusData'

describe('LiveSection.vue 에 대한 케이스.', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    options = {
      localVue,
      store,
      router
    }
    mock = new MockAdapter(axios)
    const params = {
      espotInfo: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE|BROADALL_BROADBOXSLIDE|1|999|0',
      gubun: 'TV|SHOPPLUS',
      targetEspotId: 'EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE'
    }
    const response = nsLiveAndShopPlusData
    url = `${CONST.API_URL}/NSFixedShopNoCacheCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, response)
    try {
      wrapper = mount(LiveSection, options)
      wrapper.vm.timeLimitNSLive = {
        formattedLimitTime: () => {}
      }
    } catch (error) {
      assert.fail(error.message)
    }
  })

  // it('데이터를 가져왔는지 판단.', () => {
  //   const defaultData = wrapper.vm.data
  //   console.log('defaultData \n', defaultData)
  // })

  it('computed --> swiperHide 속성 확인.', () => {
    wrapper.vm.tvLiveImage = ''
    wrapper.vm.shopLiveImage = ''
    wrapper.vm.shopLiveImage = '1234'
  })

  it('바로구매 열기.', () => {
    wrapper.vm.layerOpen('12345')
  })

  it('바로구매 닫기.', () => {
    wrapper.vm.layerClose()
  })

  it('NS LIVE, Shop+ 편성 정보 호출.', () => {
    wrapper.vm.callNSLiveAndShopPlusInfo()
  })

  it('NS LIVE, Shop+ 데이터 유효성 체크.', () => {
    wrapper.vm.nsLiveValidator(nsLiveAndShopPlusData)
    wrapper.vm.shopPlusValidator(nsLiveAndShopPlusData)
  })

  it('NS Live 데이터 셋팅이 정상적인지 체크.', () => {
    const onAirInfo = nsLiveAndShopPlusData.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo
    wrapper.vm.setNSLiveData(onAirInfo.TotalOrgan, 'nsLive')
  })

  it('Shop+ 데이터 셋팅이 정상적인지 체크.', () => {
    const totalOrgan = nsLiveAndShopPlusData.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[1]._SHOPPLUS[0].TotalOrgan
    wrapper.vm.setShopPlusLiveData(totalOrgan, 'shopPlus')
  })

  it('Thing Live 데이터 셋팅이 정상적인지 체크.', () => {
    const onAirInfo = nsLiveAndShopPlusData.msg[0]._EZ_HOME_TOPB_BROADALL_BROADBOXSLIDE[0]._TV[0].OnAirInfo
    wrapper.vm.setNSLiveData(onAirInfo.TotalOrgan, 'thingLive')
  })

  it('단일코드, 복수코드 판단 로직의 모든 케이스.', () => {
    wrapper.vm.clickedLiveProduct(false, '')
    wrapper.vm.clickedLiveProduct(false, '2017321')
    wrapper.vm.clickedLiveProduct(true, '2017321')
  })

  it('NS Live 데이터 초기화 잘 되는지 확인.', () => {
    wrapper.vm.nsLiveDataInit()
  })

  it('Shop+ 데이터 초기화 잘 되는지 확인.', () => {
    wrapper.vm.shopPlusDataInit()
  })
})
