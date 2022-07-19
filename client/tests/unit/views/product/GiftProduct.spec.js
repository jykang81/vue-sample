import VueAwesomeSwiper from 'vue-awesome-swiper'
import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import globalVal from '@unit/views/product/mock/globalVal_giftProduct'
import GiftProduct from '@/views/product/GiftProduct'

describe('GiftProduct', () => {
  let localVue
  let options

  Vue.use(VueAwesomeSwiper)

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)

    options = {
      localVue,
      store,
      propsData: {
        globalVal
      }
    }
  })

  describe('computed test', () => {
    it('isGiftExist 값 ', () => {
      const wrapper = shallowMount(GiftProduct, options)
      assert.isTrue(wrapper.vm.isGiftExist)
    })
    it('giftsList 값 ', () => {
      const wrapper = shallowMount(GiftProduct, options)
      assert.isNotNull(wrapper.vm.giftsList)
    })
    it('shouldGiftOptionSelect 값 ', () => {
      const wrapper = shallowMount(GiftProduct, options)
      assert.isNotNull(wrapper.vm.shouldGiftOptionSelect)
    })
  })
})
