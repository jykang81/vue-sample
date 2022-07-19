import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import AnchorLife from '@/views/store/module/AnchorLife'
import secondResponse from '@unit/views/store/mock/secondResponse'
import router from '@/router'
import VueRouter from 'vue-router'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'

describe('AnchorLife test case', () => {
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
          _EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST:
            secondResponse.msg.espotList[13]._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST,
          _EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE:
            secondResponse.msg.espotList[14]._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE,
          _EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST:
            secondResponse.msg.espotList[15]._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST
        },
        espotExtendList: {
          _EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR7A_ESPOT_CNTNTPRDLIST,
          _EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR7B_ESPOT_CNTNTPRDSLIDE,
          _EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR7C_ESPOT_CNTNTLIST
        }
      }
    }
    options = {
      localVue,
      store,
      router,
      propsData: propsParam
    }
    wrapper = shallowMount(AnchorLife, options)
  })

  it('data() check', () => {
    const defaultData = wrapper.vm.data
    console.debug('[ defaultData ]\n', defaultData)
  })

  it('anchorMixin - bannerCommonExternalUrlCheck test', () => {
    wrapper.vm.bannerCommonExternalUrlCheck('External')
    wrapper.vm.bannerCommonExternalUrlCheck('Product')
  })

  it('anchorMixin - bannerCommonClickEvent test', () => {
    wrapper.vm.bannerCommonClickEvent('External', '12345', '', '', 'https://testm2.nsmall.com')
    wrapper.vm.bannerCommonClickEvent('Product', '12345', '', '', '')
    wrapper.vm.bannerCommonClickEvent('Category', '12345', '', '', '')
    wrapper.vm.bannerCommonClickEvent('aa', '', '', '', '')
    wrapper.vm.bannerCommonClickEvent(null, '', '', '', '')
  })

  it('anchorMixin - checkMoreView test', () => {
    const object = {
      titleContent: {
        mdUrl: ''
      }
    }
    wrapper.vm.checkMoreView(object)
  })

  it('anchorMixin - hasEspotExtendList test', () => {
    wrapper.vm.espotExtendList = {
      titleContent: {
        mdUrl: ''
      }
    }
    wrapper.vm.hasEspotExtendList()
  })

  it('anchorMixin - getBytes test', () => {
    wrapper.vm.getBytes('abcdef')
    wrapper.vm.getBytes('abcdefghijklmnopqr')
  })

  it('anchorMixin - getCutBytes test', () => {
    wrapper.vm.getCutBytes('abcdef')
    wrapper.vm.getCutBytes('abcdefghijklmnopqr')
  })

  it('anchorMixin - is12ByteLow test', () => {
    wrapper.vm.is12ByteLow('abcdef')
    wrapper.vm.is12ByteLow('abcdefghijklmnopqr')
  })

  it('anchorMixin - getInsertCommas test', () => {
    wrapper.vm.getInsertCommas('12345')
  })

  it('anchorMixin - isNotNullProductDetail test', () => {
    const object = {
      partnumber: '12345'
    }
    wrapper.vm.isNotNullProductDetail(object)
  })

  it('anchorMixin - setClassNameHasSlideData test', () => {
    let object = {
      partnumber: '12345'
    }
    wrapper.vm.setClassNameHasSlideData(object)
    object = null
    wrapper.vm.setClassNameHasSlideData(object)
  })

  it('anchorMixin - hasExtendList test', () => {
    const object = {
      partnumber: '12345'
    }
    wrapper.vm.hasExtendList(object)
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
