import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { mount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import LiveSectionAll from '@/views/store/module/LiveSectionAll'
import VueRouter from 'vue-router'
import router from '@/router'
import liveFullDataTvLive from '@unit/views/store/mock/liveFullDataTvLive'
import liveFullDataThingShop from '@unit/views/store/mock/liveFullDataThingShop'
import marketingUtil from '@/common/utils/marketingUtil'
import VueVideoPlayer from 'vue-video-player'

describe('LiveSectionAll.vue --> TV LIVE에 대한 케이스.', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.use(marketingUtil)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    Vue.use(VueVideoPlayer)

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

    options = {
      localVue,
      store,
      router,
      propsData: {
        swiperRefName: null,
        whatContents: 'NS_LIVE',
        bottomNaviValue: { NS_LIVE: 'NS LIVE' },
        bottomNaviIndex: 1,
        liveFullData: liveFullDataTvLive
      }
    }
    try {
      wrapper = mount(LiveSectionAll, options)
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('데이터경고창 열기.', () => {
    wrapper.vm.openDataWarning()
  })

  it('데이터경고창 닫기.', () => {
    wrapper.vm.closeDataWarning()
  })

  it('동영상 준비완료.', () => {
    wrapper.vm.onPlayerReadied()
  })

  it('재생.', () => {
    wrapper.vm.playVideo()
  })

  it('computed test.', () => {
    assert.isTrue(wrapper.vm.isTvOrShopPlus)
    assert.isNotNull(wrapper.vm.getTvOrVodRemainingTime)
    assert.isFalse(wrapper.vm.isShopPlus)
    assert.isFalse(wrapper.vm.isThingLive)
  })

  it('thingLiveLogging test.', () => {
    wrapper.vm.thingLiveLogging()
  })

  it('scheduleLogging test.', () => {
    let object = { NS_LIVE: '' }
    wrapper.vm.scheduleLogging(object)
    object = { SHOP_PLUS: '' }
    wrapper.vm.scheduleLogging(object)
  })

  it('closePlayer test.', () => {
    wrapper.vm.closePlayer()
  })

  it('getImageUrl test.', () => {
    wrapper.vm.getImageUrl(12345, 'Y')
  })

  it('htmlDecode test.', () => {
    wrapper.vm.htmlDecode('abcdefg')
  })

  it('onPlayerPlay test.', () => {
    wrapper.vm.whatContents = 'THING_LIVE'
    wrapper.vm.onPlayerPlay()
    wrapper.vm.whatContents = 'NS_LIVE'
    wrapper.vm.onPlayerPlay()
    wrapper.vm.whatContents = 'SHOP_PLUS'
    wrapper.vm.onPlayerPlay()
  })

  it('setTingLiveArea test.', () => {
    const tingLiveInfo = liveFullDataThingShop
    const onAirInfo = tingLiveInfo.msg[0]._1699585_MSLOTB_BROADALL_BROADBOXSLIDE[1]._VODINFO[0]
    wrapper.vm.livePlay = { vodPlayGubun: 'LIVE' }
    wrapper.vm.setTingLiveArea(onAirInfo)
    wrapper.vm.livePlay = { vodPlayGubun: '' }
    wrapper.vm.setTingLiveArea(onAirInfo)
  })

  it('setPlayLog test.', () => {
    wrapper.vm.setPlayLog()
  })

  it('liveIconCheck test.', () => {
    wrapper.vm.isTv = true
    wrapper.vm.liveIconCheck('LIVE')
    wrapper.vm.isTv = false
    wrapper.vm.liveIconCheck('LIVE')
    wrapper.vm.isShopPlus = true
    wrapper.vm.liveIconCheck('LIVE')
    wrapper.vm.isShopPlus = false
    wrapper.vm.liveIconCheck('LIVE')
  })

  // it('setAdviceParam test.', () => {
  //   wrapper.vm.setAdviceParam('123456')
  // })

  // it('setMainPrdInfo test.', () => {
  //   wrapper.vm.totalOrgan.busChnId = 'TV'
  //   const objTotalOrganF = totalOrgan
  //   wrapper.vm.setMainPrdInfo(param.busChnId = objTotalOrganF)
  // })
})
