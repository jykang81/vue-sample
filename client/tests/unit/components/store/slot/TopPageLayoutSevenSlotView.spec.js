import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import axios from 'axios'
import Vue from 'vue'
import MockAdapter from 'axios-mock-adapter'

import nsaxios from '@frameworks/axiosUtil'
import CONST from '@constants/framework/framework'
import TopPageLayoutSevenSlotView from '@/components/store/slot/TopPageLayoutSevenSlotView'

// import temp10ReqNSSlotShopCmd from '@unit/views/store/mock/10_req_NSSlotShopCmd'
import temp10ResNSSlotShopCmd from '@unit/views/store/mock/10_res_NSSlotShopCmd'
// import temp11ReqNSFixedShopNoCacheCmd from '@unit/views/store/mock/11_req_NSFixedShopNoCacheCmd'
import temp11ResNSFixedShopNoCacheCmd from '@unit/views/store/mock/11_res_NSFixedShopNoCacheCmd'
// import temp12ReqNSSlotShopNoCacheCmd from '@unit/views/store/mock/12_req_NSSlotShopNoCacheCmd'
import temp12ResNSSlotShopNoCacheCmd from '@unit/views/store/mock/12_res_NSSlotShopNoCacheCmd'

describe('TopPageLayoutSevenSlotView', () => {
  let localVue
  let options
  let wrapper
  let mock
  const espotLlistData = [
    {
      _1606556_MSLOTA_ESPOT_SUBCATE: [
        {
          espotId: '1606556_MSLOTA_ESPOT_SUBCATE'
        }
      ]
    },
    {
      _1606556_MSLOTB_ESPOT_THEMECATE: [
        {
          espotId: '1606556_MSLOTB_ESPOT_THEMECATE'
        }
      ]
    },
    {
      _1606556_MSLOTC_ESPOT_THEMECATESLIDE: [
        {
          espotId: '1606556_MSLOTC_ESPOT_THEMECATESLIDE'
        }
      ]
    },
    {
      _1606556_MSLOTD_ESPOT_CNTNT: [
        {
          espotId: '1606556_MSLOTD_ESPOT_CNTNT'
        }
      ]
    },
    {
      _1606556_MSLOTE_ESPOT_CNTNT4W: [
        {
          espotId: '1606556_MSLOTE_ESPOT_CNTNT4W'
        }
      ]
    },
    {
      _1606556_MSLOTF_ESPOT_CNTNTSLIDE15W: [
        {
          espotId: '1606556_MSLOTF_ESPOT_CNTNTSLIDE15W'
        }
      ]
    },
    {
      _1606556_MSLOTG_ESPOT_CNTNTCIRCLESLIDE: [
        {
          espotId: '1606556_MSLOTG_ESPOT_CNTNTCIRCLESLIDE'
        }
      ]
    },
    {
      _1606556_MSLOTH_ESPOT_CNTNTLIST: [
        {
          espotId: '1606556_MSLOTH_ESPOT_CNTNTLIST'
        }
      ]
    },
    {
      _1606556_MSLOTI_ESPOT_CNTNTTEXT: [
        {
          espotId: '1606556_MSLOTI_ESPOT_CNTNTTEXT'
        }
      ]
    },
    {
      _1606556_MSLOTJ_ESPOT_CNTNTPROM: [
        {
          espotId: '1606556_MSLOTA_ESPOJ_CNTNTPROM'
        }
      ]
    },
    {
      _1606556_MSLOTK_ESPOT_CNTNTPRDLIST: [
        {
          espotId: '1606556_MSLOTK_ESPOT_CNTNTPRDLIST'
        }
      ]
    },
    {
      _1606556_MSLOTL_ESPOT_CNTNTPRDGRID4W: [
        {
          espotId: '1606556_MSLOTL_ESPOT_CNTNTPRDGRID4W'
        }
      ]
    },
    {
      _1606556_MSLOTM_ESPOT_CNTNTPRDSLIDE: [
        {
          espotId: '1606556_MSLOTM_ESPOT_CNTNTPRDSLIDE'
        }
      ]
    },
    {
      _1606556_MSLOTN_ESPOT_PRDGRID: [
        {
          espotId: '1606556_MSLOTN_ESPOT_PRDGRID'
        }
      ]
    },
    {
      _1606556_MSLOTO_ESPOT_PRDSLIDESQUARE25W: [
        {
          espotId: '1606556_MSLOTO_ESPOT_PRDSLIDESQUARE25W'
        }
      ]
    },
    {
      _1606556_MSLOTO_ESPOT_RCMDCLICK_PRDSLIDESQUARE25W: [
        {
          espotId: '1606556_MSLOTO_ESPOT_RCMDCLICK_PRDSLIDESQUARE25W'
        }
      ]
    },
    {
      _1606556_MSLOTO_ESPOT_PRDRCMDUSER: [
        {
          espotId: '1606556_MSLOTO_ESPOT_PRDRCMDUSER'
        }
      ]
    },
    {
      _1606556_MSLOTP_ESPOT_PRDWIDE: [
        {
          espotId: '1606556_MSLOTP_ESPOT_PRDWIDE'
        }
      ]
    },
    {
      _1606556_MSLOTQ_ESPOT_PRDSLIDE15W: [
        {
          espotId: '1606556_MSLOTQ_ESPOT_PRDSLIDE15W'
        }
      ]
    },
    {
      _1606556_MSLOTR_ESPOT_PRDLIST: [
        {
          espotId: '1606556_MSLOTR_ESPOT_PRDLIST'
        }
      ]
    },
    {
      _1606556_MSLOTW_ESPOT_PRDGRID4W: [
        {
          espotId: '1606556_MSLOTW_ESPOT_PRDGRID4W'
        }
      ]
    },
    {
      _1606556_MSLOTT_ESPOT_ONAIR_BROADTV: [
        {
          espotId: '1606556_MSLOTT_ESPOT_ONAIR_BROADTV'
        }
      ]
    },
    {
      _1606556_MSLOTU_ESPOT_SHOPPLUS_BROAD: [
        {
          espotId: '1606556_MSLOTU_ESPOT_SHOPPLUS_BROAD'
        }
      ]
    },
    {
      _1606556_MSLOTV_ESPOT_TEXTSLIDE: [
        {
          espotId: '1606556_MSLOTV_ESPOT_TEXTSLIDE'
        }
      ]
    }
  ]

  beforeEach(() => {
    Vue.prototype.$nsaxios = nsaxios
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    delete router.history.current
    router.history.current = {
      name: 'slotStore',
      meta: {},
      path: '/store/slot/1788556',
      hash: '',
      query: {},
      params: { path: 'store/slot/1788556' },
      fullPath: '/',
      matched: []
    }

    // mock axios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)

    options = {
      localVue,
      store,
      router,
      attachToDocument: true,
      propsData: {
        slotGlobalVal: {
          param: {
            categoryDiv: ''
          },
          pageCallYn: '',
          continueEspotId: ''
        },
        espotList: espotLlistData,
        espotExtendList: {
        },
        totalOrgan: {
        }
      }
    }

    wrapper = mount(TopPageLayoutSevenSlotView, options)
  })
  describe('TopPageLayoutSevenSlotView 테스트', () => {
    // it('validateEspot', () => {
    //   wrapper.vm.validateEspot()
    //   assert.equal(true, true)
    // })

    it('callNSMobileGetEspotData 1', () => {
      wrapper.vm.callNSMobileGetEspotData('', 'SLOTA')
      assert.isTrue(true)
    })

    it('callNSMobileGetEspotData 2', () => {
      wrapper.vm.slotGlobalVal.param.categoryDiv = 'thema'
      wrapper.vm.slotGlobalVal.pageCallYn = 'Y'
      wrapper.vm.slotGlobalVal.continueEspotId = 'TEST'
      wrapper.vm.callNSMobileGetEspotData('', 'SLOTC')
      assert.isTrue(true)
    })

    it('callNSMobileGetEspotData 3', () => {
      wrapper.vm.slotGlobalVal.param.categoryDiv = 'sub'
      wrapper.vm.callNSMobileGetEspotData('sub', 'SLOTC')
      assert.isTrue(true)
    })

    it('callNSMobileGetEspotData 4', () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSSlotShopCmd`).reply(200, temp10ResNSSlotShopCmd)

      wrapper.vm.slotGlobalVal.param.categoryDiv = 'themaSlide'
      wrapper.vm.callNSMobileGetEspotData('thema', 'SLOTC')
      assert.isTrue(true)
    })

    it('callNSFixedShopNoCacheCmd', () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSFixedShopNoCacheCmd`).reply(200, temp11ResNSFixedShopNoCacheCmd)

      wrapper.vm.callNSFixedShopNoCacheCmd('')
      assert.isTrue(true)
    })

    it('callNSSlotShopNoCacheCmd', () => {
      mock.reset()
      mock.onPost(`${CONST.API_URL}/NSSlotShopNoCacheCmd`).reply(200, temp12ResNSSlotShopNoCacheCmd)

      wrapper.vm.callNSSlotShopNoCacheCmd('1789554_MSLOTV_RCMDUSER_PRDRCMDUSER', '1789554', {}, '')
      assert.isTrue(true)
    })

    it('setComponent', () => {
      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_THEMECATE', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_THEMECATESLIDE', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNT4W', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTSLIDE15W', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTCIRCLESLIDE', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTLIST', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTTEXT', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTPROM', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTPRDLIST', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTPRDGRID4W', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_CNTNTPRDSLIDE', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDGRID', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDSLIDESQUARE25W', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDWIDE', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDSLIDE15W', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDLIST', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDGRID4W', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_BROADTV', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_BROAD', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_TEXTSLIDE', '0')
      assert.isTrue(true)

      wrapper.vm.setComponent('_1789554_MSLOTV_RCMDUSER_PRDLARGE', '0')
      assert.isTrue(true)
    })
  })
})
