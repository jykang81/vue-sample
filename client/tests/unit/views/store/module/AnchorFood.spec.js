import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import AnchorFood from '@/views/store/module/AnchorFood'
import secondResponse from '@unit/views/store/mock/secondResponse'
import router from '@/router'
import VueRouter from 'vue-router'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'

describe('AnchorFood test case', () => {
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
          _EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST:
            secondResponse.msg.espotList[7]._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST,
          _EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST:
            secondResponse.msg.espotList[8]._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST,
          _EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST:
            secondResponse.msg.espotList[9]._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST
        },
        espotExtendList: {
          _EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR5A_ESPOT_CNTNTPRDLIST,
          _EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR5B_ESPOT_CNTNTPRDLIST,
          _EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR5C_ESPOT_CNTNTLIST
        }
      }
    }
    options = {
      localVue,
      store,
      router,
      propsData: propsParam
    }
    wrapper = shallowMount(AnchorFood, options)
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

  it('addToCartLogging test', () => {
    wrapper.vm.addToCartLogging('12345', '33', 'TV', '12345', '프라다', '과자', false)
    wrapper.vm.addToCartLogging('12345', '33', 'TV', '12345', '프라다', '과자', true)
  })
})
