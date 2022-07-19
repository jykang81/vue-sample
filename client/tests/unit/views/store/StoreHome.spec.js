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
import firstResponse from '@unit/views/store/mock/firstResponse'
import secondResponse from '@unit/views/store/mock/secondResponse'
import StoreHome from '@/views/store/StoreHome'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import ANCHOR_CONST from '@/common/constants/store/anchor'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import marketingUtil from '@/common/utils/marketingUtil'

describe('StoreHome.vue 에 대한 케이스.', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url
  // let paramIndex = 0

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
    localVue.use(Vuex)
    localVue.use(VueAwesomeSwiper)
    localVue.use(anchorMixin)
    localVue.use(marketingUtil)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('document', document)
    Vue.directive('window', window)
    Vue.directive('img-lazy-load', {})
    options = {
      localVue,
      store
    }

    mock = new MockAdapter(axios)
    let params = []
    let firstData = {}
    let secondData = {}

    params = [ // Espot
      {
        espotInfo: ANCHOR_CONST.FIRST_PARAMETERS.join('$')
      },
      {
        typeFlag: ANCHOR_CONST.SECOND_PARAMETERS_EXTEND.TYPE_FLAG,
        rbPcid: 0,
        userId: '',
        targetEspotId: ANCHOR_CONST.SECOND_PARAMETERS_EXTEND.TARGET_ESPOT_ID,
        espotInfo: Object.values(ANCHOR_CONST.PARAMETERS).join('$')
      }
    ]
    firstData = firstResponse
    url = `${CONST.API_URL}/NSFixedShopCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', params[0]))
      .reply(200, firstData)

    secondData = secondResponse
    url = `${CONST.API_URL}/NSFixedShopCmd`
    mock
      .onPost(url, getProcessedWCSParameter('post', params[1]))
      .reply(200, secondData)

    try {
      wrapper = shallowMount(StoreHome, options)
      await flushPromises()
      await wrapper.vm.$nextTick()
    } catch (error) {
      assert.fail(error.message)
    }
  })
})
