import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import AnchorHappydeal from '@/views/store/module/AnchorHappydeal'
import secondResponse from '@unit/views/store/mock/secondResponse'
import storeMixProductAddCartMixin from '@/mixins/store/cart/storeMixProductAddCartMixin'

describe('AnchorHappydeal test case', () => {
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
      espotData: {
        espotList: {
          _EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM:
            secondResponse.msg.espotList[2]._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM,
          _EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE:
            secondResponse.msg.espotList[3]._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE
        },
        espotExtendList: {
          _EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR3A_ESPOT_CNTNTPROM,
          _EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE:
            secondResponse.msg.espotExtendList._EZ_HOME_ANCHOR3B_ESPOT_PRDWIDE
        }
      }
    }
    options = {
      localVue,
      store,
      propsData: propsParam
    }
    wrapper = shallowMount(AnchorHappydeal, options)
  })

  it('data() check', () => {
    const defaultData = wrapper.vm.data
    assert.isUndefined(defaultData)
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
