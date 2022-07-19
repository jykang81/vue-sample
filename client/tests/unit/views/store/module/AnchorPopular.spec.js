import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import AnchorPopular from '@/views/store/module/AnchorPopular'
import firstResponse from '@unit/views/store/mock/firstResponse'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'

describe('AnchorPopular test case', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(storeMixProductAddCartMixin)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('document', document)
    Vue.directive('window', window)
    Vue.directive('img-lazy-load', {})

    const propsParam = {
      contentsData: firstResponse.msg.espotList[3]._EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM,
      contentsExtendData: firstResponse.msg.espotExtendList._EZ_HOME_ANCHOR1A_ESPOT_CNTNTPROM,
      productsData: firstResponse.msg.espotList[4]._EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE,
      productsExtendData: firstResponse.msg.espotExtendList._EZ_HOME_ANCHOR1B_ESPOT_PRDWIDE
    }
    options = {
      localVue,
      store,
      propsData: propsParam
    }
    wrapper = shallowMount(AnchorPopular, options)
  })

  it('data() check', () => {
    const defaultData = AnchorPopular.data()
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
