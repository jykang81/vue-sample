import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import RelatedProduct from '@/views/product/RelatedProduct'
import globalVal from '@unit/views/product/mock/globalVal_related'

describe('RelatedProduct', () => {
  let localVue
  let options

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)

    options = {
      localVue,
      store,
      router,
      propsData: {
        globalVal
      }
    }
  })

  describe('computed', () => {
    it('togetherViewList 값 ', () => {
      const wrapper = shallowMount(RelatedProduct, options)
      assert.isNotEmpty(wrapper.vm.togetherViewList)
    })
    it('togetherPurchaseList  값 ', () => {
      const wrapper = shallowMount(RelatedProduct, options)
      assert.isNotEmpty(wrapper.vm.togetherPurchaseList)
    })
    it('popularProductsList 값 ', () => {
      const wrapper = shallowMount(RelatedProduct, options)
      assert.isNotEmpty(wrapper.vm.popularProductsList)
    })
  })

  describe('methods', () => {
    it('gotoProductDetail', function () {
      const wrapper = shallowMount(RelatedProduct, options)
      const product = {
        partnumber: '24001696'
      }
      wrapper.vm.gotoProductDetail(product)
    })
  })
})
