import Vuex from 'vuex'
import {
  extend
} from '@utils/commonutil/commonUtil'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'

import ButtonArea from '@/views/product/ButtonArea'
import globalVal from '@unit/views/product/mock/globalVal_consultantProduct'
import loginUtil from '@utils/loginUtil'

describe('ButtonArea', () => {
  let localVue
  let options

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)

    options = {
      localVue,
      store,
      propsData: {
        globalVal
      }
    }

    loginUtil.login({ userId: 110548084, logonId: 'test@test.com', logonType: 'K', loginyn: 'Y' })
  })

  // 초기값 비교
  // it('sets the correct default data', () => {
  // assert.equal(typeof ButtonArea.data, 'function')
  // const defaultData = ButtonArea.data()
  // assert.equal(defaultData.showsLayer, false)
  // })
  // 마운트 할 때 컴포넌트 인스턴스를 검사합니다.
  // it('showsLayer 값 ', () => {
  //   const wrapper = shallowMount(ButtonArea, options)
  //   assert.equal(wrapper.vm.showsLayer, false)
  // })

  describe('computed test', () => {
    it('isTvLiveProduct: TV 방송중 상품 여부', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.tvLiveCd = 'A'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ButtonArea, options)
      const expected = true
      assert.equal(wrapper.vm.isTvLiveProduct, expected)
    })
    it('isConsultantProduct: 상담 상품 여부', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.dispTypeCd = '45'
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(ButtonArea, options)
      const expected = true
      assert.equal(wrapper.vm.isConsultantProduct, expected)
    })
  })

  describe('methods', () => {
    it('getItem ', () => {
      const wrapper = shallowMount(ButtonArea, options)
      const items = [{
        SKUs: {
          uniqueID: '10149549579'
        },
        attributes: [],
        partNumber: '23376618'
      }]
      const partNumber = '23376618'
      const result = wrapper.vm.getItem(items, partNumber)
      assert.isNotEmpty(result)
    })
    it('layerOpen : button should replace showsLayer ', () => {
      const wrapper = shallowMount(ButtonArea, options)
      // assert.equal(wrapper.vm.showsLayer, false)
      wrapper.vm.layerOpen()

      // assert.equal(wrapper.vm.showsLayer, true)
    })

    // it('layerClose : button should replace showsLayer ', () => {
    //   const wrapper = shallowMount(ButtonArea, options)
    //   wrapper.vm.layerOpen()
    //   assert.equal(wrapper.vm.showsLayer, true)
    //   wrapper.vm.layerClose()
    //   assert.equal(wrapper.vm.showsLayer, false)
    // })
    it('moveConsultationRequest ', () => {
      const wrapper = shallowMount(ButtonArea, options)
      wrapper.vm.moveConsultationRequest()
    })
  })
})
