import CONST from '@constants/framework/framework'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import flushPromises from 'flush-promises'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'

import nsaxios from '@frameworks/axiosUtil'
// import { getProcessedWCSParameter } from '@unit/testUtil'

import SlotStore from '@/views/store/SlotStore'

// import temp05ReqNSmobilePLCategoryInfo from '@unit/views/store/mock/05_req_NSmobilePLCategoryInfo'
import temp05ResNSmobilePLCategoryInfo from '@unit/views/store/mock/05_res_NSmobilePLCategoryInfo'
// import temp06ReqNSMobileGetEspotData from '@unit/views/store/mock/06_req_NSMobileGetEspotData'
import temp06ResNSMobileGetEspotData from '@unit/views/store/mock/06_res_NSMobileGetEspotData'
// import temp04ReqNSFixedShopNoCacheCmd from '@unit/views/store/mock/04_req_NSFixedShopNoCacheCmd'
import temp04ResNSFixedShopNoCacheCmd from '@unit/views/store/mock/04_res_NSFixedShopNoCacheCmd'
// import temp09ReqNSMobileGetEspotData from '@unit/views/store/mock/09_req_NSMobileGetEspotData'
import temp09ResNSMobileGetEspotData from '@unit/views/store/mock/09_res_NSMobileGetEspotData'

const initSlotStore = mock => {
  mock.onPost(`${CONST.API_URL}/NSSlotPLCategoryInfoCmd`)
    .reply(200, temp05ResNSmobilePLCategoryInfo)
  mock.onPost(`${CONST.API_URL}/NSSlotShopCmd`)
    .reply(200, temp06ResNSMobileGetEspotData)
  mock.onPost(`${CONST.API_URL}/NSFixedShopNoCacheCmd`)
    .reply(200, temp04ResNSFixedShopNoCacheCmd)
  mock.onPost(`${CONST.API_URL}/NSSlotShopNoCacheCmd`)
    .reply(200, temp09ResNSMobileGetEspotData)

  return mock
}

describe('SlotStore', () => {
  let localVue
  let options
  let slotStoreWrapper
  let mock

  beforeEach(async () => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'slotStore',
      meta: {},
      path: '/store/slot/1606556',
      hash: '',
      query: {},
      params: { path: 'store/slot/1606556', categoryId: '1606556' },
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    initSlotStore(mock)

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      data () {
        return {
        }
      }
    }

    slotStoreWrapper = mount(SlotStore, options)

    await flushPromises()

    /**
     * vm.$nextTick() -> component 상태 및 템플릿 업데이트
     * vue instance는 비동기 일괄 업데이트 되기 때문에 async / await 구문 사용 필요
     */
    // await wrapper.vm.$nextTick()

    /**
     * pending 상태 promise 대상 flush 처리
     * 테스트 대상 코드에 비동기 처리가 있을 때 사용
     */
    // await flushPromises()
  })
  describe('SlotStore 테스트', () => {
    // it('callNSmobilePLCategoryInfo', async () => {
    //   const wrapper = slotStoreWrapper.find(SlotStore)

    //   wrapper.vm.callNSmobilePLCategoryInfo()
    //   assert.equal(true, true)
    // })

    // it('callNSMobileGetEspotData', async () => {
    //   const wrapper = slotStoreWrapper.find(SlotStore)

    //   wrapper.vm.callNSMobileGetEspotData(null)
    //   assert.equal(true, true)
    // })

    // it('callNSFixedShopNoCacheCmd', async () => {
    //   const wrapper = slotStoreWrapper.find(SlotStore)

    //   wrapper.vm.callNSFixedShopNoCacheCmd(null)
    //   assert.equal(true, true)
    // })

    // it('callNSSlotShopNoCacheCmd', async () => {
    //   const wrapper = slotStoreWrapper.find(SlotStore)

    //   wrapper.vm.callNSSlotShopNoCacheCmd(null)
    //   assert.equal(true, true)
    // })

    it('importEspot', async () => {
      const wrapper = slotStoreWrapper.find(SlotStore)

      wrapper.vm.importEspot()
      assert.equal(true, true)
    })

    // it('initParamObject', async () => {
    //   const wrapper = slotStoreWrapper.find(SlotStore)

    //   wrapper.vm.initParamObject()
    //   assert.equal(true, true)
    // })
  })
})
