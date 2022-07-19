import {
  extend
} from '@utils/commonutil/commonUtil'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import EssentialInfo from '@/views/product/EssentialInfo'
import globalVal from '@unit/views/product/mock/globalVal'

describe('EssentialInfo', () => {
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

  describe('computed test', () => {
    it('ftcGuideList(상품상세기술서 목록) 값 ', () => {
      const wrapper = shallowMount(EssentialInfo, options)
      assert.isNull(wrapper.vm.ftcGuideList)
    })
    it('ftcGuideList(상품상세기술서 목록) 값 에러처리 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      delete thisGlobalVal.ftcGuideList
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(EssentialInfo, options)
      assert.isNull(wrapper.vm.ftcGuideList)
    })
    it('ftcGuideList(상품상세기술서 목록) 값 ', () => {
      globalVal.ftcGuideList = [
        {
          itemCd: '1',
          goodsGuideList: null,
          goodsSpecsItemNm: '제품소재',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: 'TPE (상세이미지참고)'
        },
        {
          itemCd: '2',
          goodsGuideList: null,
          goodsSpecsItemNm: '색상',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '화이트계열 (상세이미지참고)'
        },
        {
          itemCd: '3',
          goodsGuideList: null,
          goodsSpecsItemNm: '치수',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '옵션(S(220-235)) / 옵션(M(240-255)) / 옵션(L(260-275)) / ※ 굽높이 : 4cm / ※ 실측단위(mm) (상세이미지참고)'
        },
        {
          itemCd: '4',
          goodsGuideList: null,
          goodsSpecsItemNm: '제조자/수입자',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '토앤토 / 병행수입'
        },
        {
          itemCd: '5',
          goodsGuideList: null,
          goodsSpecsItemNm: '제조국',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '대한민국'
        },
        {
          itemCd: '6',
          goodsGuideList: null,
          goodsSpecsItemNm: '취급주의사항',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '그늘에서 건조 (상세이미지참고)'
        },
        {
          itemCd: '7',
          goodsGuideList: null,
          goodsSpecsItemNm: '품질보증기준',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '관련법 및 소비자 분쟁해결 규정에 따름'
        },
        {
          itemCd: '8',
          goodsGuideList: null,
          goodsSpecsItemNm: 'AS책임자/전화번호',
          _classname: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSpecsItemCd: null,
          class: 'com.ns.commerce.nsitemdetails.bean.NSGoodsGuideDataBean',
          goodsSafeCertCd: null,
          goodsUrl: null,
          _type: 'JavaClass',
          goodsSafeCertYN: null,
          clssfCd: '2',
          specsInputVal: '(주)인퓨전프로젝 (1644-1889)'
        }
      ]

      options = {
        localVue,
        store,
        propsData: {
          globalVal
        }
      }

      const wrapper = shallowMount(EssentialInfo, options)
      assert.isNotNull(wrapper.vm.ftcGuideList)
    })
  })

  describe('methods', () => {
    it('openEssentialInfoToggle', function () {
      const wrapper = shallowMount(EssentialInfo, options)
      assert.equal(wrapper.vm.isOpenEssentialInfoToggle, '')
      wrapper.vm.openEssentialInfoToggle()
      assert.equal(wrapper.vm.isOpenEssentialInfoToggle, 'active')
    })
    it('openEssentialInfoToggle', function () {
      const wrapper = shallowMount(EssentialInfo, options)
      wrapper.vm.isOpenEssentialInfoToggle = 'active'
      assert.equal(wrapper.vm.isOpenEssentialInfoToggle, 'active')
      wrapper.vm.openEssentialInfoToggle()
      assert.equal(wrapper.vm.isOpenEssentialInfoToggle, '')
    })
  })
})
