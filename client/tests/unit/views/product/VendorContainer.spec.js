import {
  extend
} from '@utils/commonutil/commonUtil'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import VendorContainer from '@/views/product/VendorContainer'
import globalVal from '@unit/views/product/mock/globalVal'

describe('VendorContainer', () => {
  let localVue
  let options

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)

    globalVal.guideDataList = [
      {
        itemCd: null,
        goodsGuideList: null,
        goodsSpecsItemNm: null,
        _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
        goodsSpecsItemCd: null,
        class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
        goodsSafeCertCd: null,
        goodsUrl: null,
        _type: 'JavaClass',
        goodsSafeCertYN: null,
        clssfCd: null,
        specsInputVal: 'TPE (상세이미지참고)'
      }
    ]

    options = {
      localVue,
      store,
      propsData: {
        globalVal
      }
    }
  })

  describe('computed test', () => {
    // it('guideDataList(상품상세기술서 목록) 값 ', () => {
    //   const wrapper = shallowMount(VendorContainer, options)
    //   const expected = 'TPE (상세이미지참고)'
    //   assert.equal(wrapper.vm.guideDataList, expected)
    // })
    // it('guideDataList(상품상세기술서 목록) 값 에러처리', () => {
    //   const thisGlobalVal = extend(true, {}, globalVal)
    //   delete thisGlobalVal.guideDataList
    //   options = {
    //     localVue,
    //     store,
    //     propsData: {
    //       globalVal: thisGlobalVal
    //     }
    //   }
    //   const wrapper = shallowMount(VendorContainer, options)
    //   assert.isNull(wrapper.vm.guideDataList)
    // })
    it('guideDataList(상품상세기술서 목록) 값 분기', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      delete thisGlobalVal.guideDataList[0].specsInputVal
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(VendorContainer, options)
      assert.isNull(wrapper.vm.guideDataList)
    })
  })

  describe('methods', () => {
    it('showMore', function () {
      const wrapper = shallowMount(VendorContainer, options)
      assert.isFalse(wrapper.vm.isExpanded.active)
      wrapper.vm.showMore()
      assert.isTrue(wrapper.vm.isExpanded.active)
    })
    it('showMore branch', function () {
      const wrapper = shallowMount(VendorContainer, options)
      wrapper.vm.isExpanded.active = true
      assert.isTrue(wrapper.vm.isExpanded.active)
      wrapper.vm.showMore()
      assert.isFalse(wrapper.vm.isExpanded.active)
    })
  })
})
