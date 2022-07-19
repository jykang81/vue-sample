import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import AnchorBeauty from '@/views/store/module/AnchorBeauty'
import secondResponse from '@unit/views/store/mock/secondResponse'
import router from '@/router'
import VueRouter from 'vue-router'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'

describe('AnchorBeauty test case', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.use(anchorMixin)
    localVue.use(storeMixProductAddCartMixin)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('document', document)
    Vue.directive('window', window)
    Vue.directive('img-lazy-load', {})

    delete router.history.current
    const current = {
      name: null,
      meta: {},
      path: '/',
      hash: '',
      query: {},
      params: {
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    const propsParam = {
      espotData: {
        espotList: {
          _EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W:
            secondResponse.msg.espotList[10]._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W,
          _EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE:
            secondResponse.msg.espotList[11]._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE,
          _EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST:
            secondResponse.msg.espotList[12]._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST
        },
        espotExtendList: {
          _EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR6A_ESPOT_CNTNTPRDGRID4W,
          _EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR6B_ESPOT_CNTNTPRDSLIDE,
          _EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR6C_ESPOT_CNTNTLIST
        }
      }
    }
    options = {
      localVue,
      store,
      router,
      propsData: propsParam
    }
    wrapper = shallowMount(AnchorBeauty, options)
  })

  it('data() check', () => {
    const defaultData = wrapper.vm.data
    console.debug('[ defaultData ]\n', defaultData)
  })

  it('productDetailLogging test', () => {
    const productName = '시계'
    const routerInfo = {
      params: {
        number: '12345'
      }
    }
    wrapper.vm.productDetailLogging(productName, routerInfo)
  })
})
