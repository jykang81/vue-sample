import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import SectionCustom from '@/views/product/SectionCustom'
import globalVal from '@unit/views/product/mock/globalVal_review'

describe('SectionCustom', () => {
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
    it('reviewList 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotEmpty(wrapper.vm.reviewList)
    })
    it('qAListCount 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotNull(wrapper.vm.qAListCount)
    })
    /*
    it('clothingCategoryList 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotEmpty(wrapper.vm.clothingCategoryList)
    })
    it('clothingCategoryList 값 ', () => {
      globalVal.reviewInfo.summary.size1 = 0
      globalVal.reviewInfo.summary.size2 = 4
      globalVal.reviewInfo.summary.size3 = 0
      globalVal.reviewInfo.summary.color1 = 0
      globalVal.reviewInfo.summary.color2 = 4
      globalVal.reviewInfo.summary.color3 = 0
      options = {
        localVue,
        store,
        router,
        propsData: {
          globalVal
        }
      }
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotEmpty(wrapper.vm.clothingCategoryList)
    })
    it('clothingCategoryList 값 ', () => {
      globalVal.reviewInfo.summary.size1 = 0
      globalVal.reviewInfo.summary.size2 = 0
      globalVal.reviewInfo.summary.size3 = 4
      globalVal.reviewInfo.summary.color1 = 0
      globalVal.reviewInfo.summary.color2 = 0
      globalVal.reviewInfo.summary.color3 = 4
      options = {
        localVue,
        store,
        router,
        propsData: {
          globalVal
        }
      }
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotEmpty(wrapper.vm.clothingCategoryList)
    })
    */
    it('isFoodProduct 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotTrue(wrapper.vm.isFoodProduct)
    })
    /*
    it('isClothingProduct 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isTrue(wrapper.vm.isClothingProduct)
    })
    */
    it('reviewCount 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotNull(wrapper.vm.reviewCount)
    })
    it('totalPointRating 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotNull(wrapper.vm.totalPointRating)
    })
    it('totalPoint 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotNull(wrapper.vm.totalPoint)
    })
    it('totalPointCount 값 ', () => {
      const wrapper = shallowMount(SectionCustom, options)
      assert.isNotNull(wrapper.vm.totalPointCount)
    })
  })

  describe('methods', () => {
    it('getEvalCatRateIndex', function () {
      const wrapper = shallowMount(SectionCustom, options)
      assert.equal(wrapper.vm.getEvalCatRateIndex(90), 0)
      assert.equal(wrapper.vm.getEvalCatRateIndex(60), 1)
      assert.equal(wrapper.vm.getEvalCatRateIndex(10), 2)
    })
    it('gotoCustomerReview', function () {
      const wrapper = shallowMount(SectionCustom, options)
      wrapper.vm.gotoCustomerReview()
    })
    it('gotoInquiry', function () {
      const wrapper = shallowMount(SectionCustom, options)
      wrapper.vm.gotoInquiry()
    })
  })
})
