import {
  extend
} from '@utils/commonutil/commonUtil'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'

import BannerProduct from '@/views/product/BannerProduct'
import globalVal from '@unit/views/product/mock/globalVal'

describe('BannerProduct', () => {
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
    it('headCopyList(headCopy 목록) 값 ', () => {
      const wrapper = shallowMount(BannerProduct, options)
      assert.isNotEmpty(wrapper.vm.headCopyList)
    })
    it('headCopyList(headCopy 목록) 값 ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.headCopyList = []
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }

      const wrapper = shallowMount(BannerProduct, options)
      assert.isNull(wrapper.vm.headCopyList)
      // assert.isEmpty(wrapper.vm.headCopyList)
    })
    it('headCopyList(headCopy 목록) 값 error ', () => {
      const thisGlobalVal = extend(true, {}, globalVal)
      thisGlobalVal.productInfo.headCopyList = null
      options = {
        localVue,
        store,
        propsData: {
          globalVal: thisGlobalVal
        }
      }
      const wrapper = shallowMount(BannerProduct, options)
      assert.isNull(wrapper.vm.headCopyList)
    })
    it('headCopyList(headCopy 목록) 값 ', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal
        }
      }
      const wrapper = shallowMount(BannerProduct, options)
      assert.isNotNull(wrapper.vm.headCopyList)
    })
  })

  describe('methods', () => {
    it('bannerClickLogging method', () => {
      options = {
        localVue,
        store,
        propsData: {
          globalVal
        }
      }
      const wrapper = shallowMount(BannerProduct, options)
      wrapper.vm.bannerClickLogging(0)
    })
  })
})
