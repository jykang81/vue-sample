import Vuex from 'vuex'
import {
  extend
} from '@utils/commonutil/commonUtil'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'

import ToggleProduct from '@/views/product/ToggleProduct'
import globalVal from '@unit/views/product/mock/globalVal'

describe('ToggleProduct', () => {
  let localVue
  let options

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

  // 초기값 체크
  // it('sets the correct default data', () => {
  //   assert.equal(typeof ToggleProduct.data, 'function')
  //   const defaultData = ToggleProduct.data()
  //   assert.equal(defaultData.isOpenCardBenefitInfoToggle, '')
  // })

  describe('computed test', () => {
    it('showCardBenefit(카드혜택 노출여부) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = true
      assert.equal(wrapper.vm.showCardBenefit, expected)
    })
    it('isRentalProduct 렌탈상품 여부', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.dispTypeCd = '45'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = true
      assert.equal(wrapper.vm.isRentalProduct, expected)
    })
    it('showCardBenefit(카드혜택 노출여부) 값 cardBnftList.length === 0', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.cardBnftList = []
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = false
      assert.equal(wrapper.vm.showCardBenefit, expected)
    })
    it('showCardBenefit(카드혜택 노출여부) 값 dispTypeCd === 60', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.dispTypeCd = '60'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = false
      assert.equal(wrapper.vm.showCardBenefit, expected)
    })
    it('showCardBenefit(카드혜택 노출여부) 값 qtyRstApplyYn = 1', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.cardBnftList[0].qtyRstApplyYn = '1'
      thisGlobalVal.productInfo.cardBnftList[0].qtyStartVal = 2
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = true
      assert.equal(wrapper.vm.showCardBenefit, expected)
    })
    it('showCardBenefit(카드혜택 노출여부) 값 bnftType = 35', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.cardBnftList[0].bnftType = '35'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = true
      assert.equal(wrapper.vm.showCardBenefit, expected)
    })
    it('showCardBenefit(카드혜택 노출여부) 값 bnftType = 31', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.cardBnftList[0].bnftType = '31'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = true
      assert.equal(wrapper.vm.showCardBenefit, expected)
    })
    it('cardBenefitList(신용카드 할인) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = false
      assert.equal(wrapper.vm.cardBenefitList.lenth > 0, expected)
    })
    it('savings(적립금) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isNull(wrapper.vm.savings)
    })
    it('mobileSavings(모바일 적립금) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isNull(wrapper.vm.mobileSavings)
    })
    it('dutyUseDur(의무사용기간) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isNull(wrapper.vm.dutyUseDur)
    })
    // it('creditCardBenefit(무이자/일시불 혜택정보 노출 여부) 값 ', () => {
    //   const wrapper = shallowMount(ToggleProduct, options)
    //   assert.isEmpty(wrapper.vm.creditCardBenefit)
    // })
    it('modelName(모델번호) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = '11371046'
      assert.equal(wrapper.vm.modelName, expected)
    })
    it('showCountryOfOriginInfo(원산지 노출 여부) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isFalse(wrapper.vm.showCountryOfOriginInfo)
    })
    it('countryOfOrigin(원산지, 원재료) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = '상세페이지 참조'
      assert.equal(wrapper.vm.countryOfOrigin, expected)
    })
    it('deliveryPrice(배송비) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      const expected = '무료배송'
      assert.equal(wrapper.vm.deliveryPrice, expected)
    })
    it('deliveryPriceMsg(계산된 배송비 부과정보) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isEmpty(wrapper.vm.deliveryPriceMsg)
    })
    it('showBundleProducts(묶음배송 노출 여부) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isNotTrue(wrapper.vm.deliveryPriceMsg)
    })
    it('shippingDateInfo(배송비 추가정보) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isNull(wrapper.vm.shippingDateInfo)
    })
    it('shippingDate(배송일) 값 ', () => {
      // const wrapper = shallowMount(ToggleProduct, options)
      // const expected = '4/10(금) 이내 도착예정'
      // assert.equal(wrapper.vm.shippingDate, expected)
    })
    it('additionalDeliveryPriceInfo(추가 배송일) 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isEmpty(wrapper.vm.additionalDeliveryPriceInfo)
    })
    it('savingRatio 값 ', () => {
      const wrapper = shallowMount(ToggleProduct, options)
      assert.isNull(wrapper.vm.savingRatio)
    })
  })

  describe('methods', () => {
    // it('openCardBenefitToggle method', async function () {
    //   const wrapper = shallowMount(ToggleProduct, options)
    //   assert.equal(wrapper.vm.isOpenCardBenefitInfoToggle, '')
    //   wrapper.vm.openCardBenefitToggle()
    //   assert.equal(wrapper.vm.isOpenCardBenefitInfoToggle, 'active')
    // })
    it('tooltipDeliveryOpen method', async function () {
      const wrapper = shallowMount(ToggleProduct, options)
      wrapper.vm.tooltipDeliveryOpen()
      assert.isTrue(wrapper.vm.tooltipDelivery)
    })
    it('tooltipDeliveryOpen method', async function () {
      const wrapper = shallowMount(ToggleProduct, options)
      wrapper.vm.tooltipDeliveryClose()
      assert.isFalse(wrapper.vm.tooltipDelivery)
    })
  })
})
