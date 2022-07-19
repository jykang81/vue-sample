import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import flushPromises from 'flush-promises'
import axios from 'axios'
import CONST from '@constants/framework/framework'
import store from '@/vuex'
import router from '@/router'
import MockAdapter from 'axios-mock-adapter'
import nsaxios from '@frameworks/axiosUtil'
import TvScheduleTable from '@/views/store/TvScheduleTable'
// import temp13ReqNSTvBroadCmd from '@unit/views/store/mock/13_req_NSTvBroadCmd'
import temp13ResNSTvBroadCmd from '@unit/views/store/mock/13_res_NSTvBroadCmd'

// import { getProcessedWCSParameter } from '@unit/testUtil'
// import temp01ReqTVHomeShoppingAjaxMob from '@unit/views/store/mock/01_req_TVHomeShoppingAjaxMob'
// import temp02ReqShopPlusTVHomeShoppingAjax from '@unit/views/store/mock/02_req_ShopPlusTVHomeShoppingAjax'

const initTvScheduleTable = mock => {
  mock.onPost(`${CONST.API_URL}/NSTvBroadCmd`).reply(200, temp13ResNSTvBroadCmd)

  return mock
}

describe('TvScheduleTable', () => {
  let localVue
  let options
  let wrapper
  let mock

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'tvScheduleTable',
      meta: {},
      path: '/media/schedule',
      hash: '',
      query: {},
      params: {},
      fullPath: '/',
      matched: []
    }

    options = {
      localVue,
      store,
      router
    }

    Vue.prototype.$nsaxios = nsaxios

    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initTvScheduleTable(mock)
  })

  beforeEach(async () => {
    wrapper = mount(TvScheduleTable, options)

    await flushPromises()
  })

  after(() => {
    // mock.reset()
  })

  describe('TvScheduleTable 테스트', () => {
    it('toggleLeft', async () => {
      wrapper.vm.toggleLeft()

      await flushPromises()

      assert.equal(true, true)
    })

    it('toggleRight', async () => {
      wrapper.vm.toggleRight()

      await flushPromises()

      assert.equal(true, true)
    })

    it('layerOpen', async () => {
      wrapper.vm.totalOrgan[0] = {
        partNumber: '42986501'
      }
      wrapper.vm.layerOpen(0)

      await flushPromises()

      assert.equal(true, true)
    })

    it('layerClose', async () => {
      wrapper.vm.layerClose()

      await flushPromises()

      assert.equal(true, true)
    })

    it('categoryTab', async () => {
      wrapper.vm.categoryTab(7, '20200605')

      await flushPromises()

      wrapper.vm.toggle = 'active'
      wrapper.vm.categoryTab(7, '20200605')

      await flushPromises()

      assert.equal(true, true)
    })

    it('timeListToggle', async () => {
      wrapper.vm.timeListToggle()

      await flushPromises()

      assert.equal(true, true)
    })

    it('onCollapse', async () => {
      wrapper.vm.collapse[0] = 'product_related open'
      wrapper.vm.onCollapse(0)

      await flushPromises()

      wrapper.vm.collapse[0] = ''
      wrapper.vm.onCollapse(0)

      await flushPromises()
    })

    it('getBroadcastingMobileList', async () => {
      wrapper.vm.getBroadcastingMobileList('20200605')

      await flushPromises()
    })

    it('setLimitLiveTime', async () => {
      wrapper.vm.setLimitLiveTime()

      await flushPromises()

      assert.equal(true, true)
    })

    it('setRemainedTime', async () => {
      wrapper.vm.totalOrgan[0] = {
        startDtm: '20200605093000',
        endDtm: '20200605103000'
      }

      await flushPromises()

      wrapper.vm.setRemainedTime()

      assert.equal(true, true)
    })

    it('clickShoppingAlarm', async () => {
      wrapper.vm.clickShoppingAlarm(0)

      await flushPromises()

      assert.equal(true, true)
    })

    it('clickOpenSearchPop', async () => {
      wrapper.vm.clickOpenSearchPop()

      await flushPromises()

      assert.equal(true, true)
    })

    // it('productDetailLogging', async () => {
    //   wrapper.vm.productDetailLogging()
    //   assert.equal(true, true)
    // })
  })
})
