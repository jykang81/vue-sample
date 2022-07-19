import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import flushPromises from 'flush-promises'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import { getProcessedWCSParameter } from '@unit/testUtil'
import HomeBridge from '@/components/store/HomeBridge'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import marketingUtil from '@/common/utils/marketingUtil'
import setNsTalkRollingMixin from '@/mixins/store/home/setNsTalkRollingMixin'
import consultationMixin from '@/mixins/product/consultationMixin'
import NSTvBroadCmd from '@unit/views/store/mock/NSTvBroadCmd'
import NSShopPlusBroadCmd from '@unit/views/store/mock/NSShopPlusBroadCmd'
import NSMobNsTalkForInfoBankCmd from '@unit/views/store/mock/NSMobNsTalkForInfoBankCmd'
import bizUtil from '@utils/bizUtil'
import VueRouter from 'vue-router' // 필수
import router from '@/router' // 필수

describe('HomeBridge.vue 에 대한 케이스.', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url

  before('before', async function () {
    // GA 360
    window.ga = () => {}
    window.marketingRoute = {
      name: 'testGa360',
      fullPath: '/test/test-ga360-log',
      meta: {
        title: 'GA 360',
        depth: '아키텍처>테스트>GA 360'
      }
    }

    // Recobell
    window._eglconf = {}
    window._eglconf.forceTrackVisit = true
    window.eglc = {}
    window.eglc.op = () => {}
    window.eglc.clearData = () => {}

    // 네이버 프리미엄 로그
    window.wcs = {}
    window.wcs.inflow = () => {}
    window.wcs.cnv = () => {}
    window.wcs_do = () => {}

    // Airbridge
    window.airbridge = {}
    window.airbridge.init = () => {}
    window.airbridge.events = {}
    window.airbridge.events.signUp = () => {}
    window.airbridge.events.signIn = () => {}
    window.airbridge.events.signOut = () => {}
    window.airbridge.events.homeViewEvent = () => {}
    window.airbridge.events.productDetailsViewEvent = () => {}
    window.airbridge.events.productListViewEvent = () => {}
    window.airbridge.events.searchResultViewEvent = () => {}
    window.airbridge.events.addedToCart = () => {}
    window.airbridge.events.purchased = () => {}
    window.airbridge.events.send = () => {}

    // AIQUA
    window.AIQUA = () => {}
    window.AIQUA.init = {
      appId: '966ef26ddcc00f25775f',
      timeout: 5000
    }
    window.qg = () => {}

    // DTSI
    window.dlight = {}
    window.dlight.sendConversion = () => {}

    localVue = createLocalVue()
    localVue.use(VueRouter)
    localVue.use(Vuex)
    localVue.use(VueAwesomeSwiper)
    localVue.use(anchorMixin)
    localVue.use(setNsTalkRollingMixin)
    localVue.use(consultationMixin)
    localVue.use(marketingUtil)
    localVue.use(bizUtil)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('document', document)
    Vue.directive('window', window)
    Vue.directive('img-lazy-load', {})
    delete router.history.current
    router.history.current = {
      name: '',
      meta: {},
      path: '',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    const propsParam = {
      param: {
        identify: 'shopPlus',
        goodId: '12345',
        startdtm: 20200913221133,
        enddtm: 20200913231133
      }
    }

    options = {
      localVue,
      store,
      propsData: propsParam,
      router
    }

    mock = new MockAdapter(axios)
    let params = []
    let firstData = {}
    let secondData = {}
    let thirdData = {}
    params = [ // Espot
      {
        selectDay: 'ONAIRPRENEXT',
        processFlag: 'brodcastingMobileScroll'
      },
      {
        selectDay: 'ONAIRPRENEXT',
        processFlag: 'shopPlusBrodcastingMobileScroll'
      }
    ]
    firstData = NSTvBroadCmd
    url = `${CONST.API_URL}/NSTvBroadCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', params[0]))
      .reply(200, firstData)

    secondData = NSShopPlusBroadCmd
    url = `${CONST.API_URL}/NSShopPlusBroadCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', params[1]))
      .reply(200, secondData)

    thirdData = NSMobNsTalkForInfoBankCmd
    url = `${CONST.API_URL}/NSMobNsTalkForInfoBankCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', {}))
      .reply(200, thirdData)

    try {
      wrapper = shallowMount(HomeBridge, options)
      await flushPromises()
      await wrapper.vm.$nextTick()
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('layerOpen test.', () => {
    wrapper.vm.layerOpen()
  })

  it('openDataWarning test.', () => {
    wrapper.vm.openDataWarning()
  })

  it('closeDataWarning test.', () => {
    wrapper.vm.closeDataWarning()
  })

  // it('onPlayerReadied test.', () => {
  //   wrapper.vm.onPlayerReadied()
  // })

  // it('onPlayerPause test.', () => {
  //   wrapper.vm.onPlayerPause()
  // })

  it('onPlayerPlay test.', () => {
    wrapper.vm.onPlayerPlay()
  })

  // it('playVideo test.', () => {
  //   wrapper.vm.playVideo()
  // })

  it('closePlayer test.', () => {
    wrapper.vm.closePlayer()
  })

  it('closeSearchPopup test.', () => {
    wrapper.vm.closeSearchPopup()
  })

  it('setProductsData test.', () => {
    const data = NSShopPlusBroadCmd.msg.TotalOrgan
    wrapper.vm.setProductsData(data)
  })

  it('getPreNextLabel test.', () => {
    wrapper.vm.getPreNextLabel('B')
    wrapper.vm.getPreNextLabel('A')
  })

  it('setAdviceParam test.', () => {
    wrapper.vm.setAdviceParam('12345')
  })

  it('setNSTalkData test.', () => {
    wrapper.vm.setNSTalkData('12345', 1234567, '010-1234-4321')
  })
})
