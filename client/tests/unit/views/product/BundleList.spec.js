import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import BundleList from '@/views/product/BundleList'
import globalVal from '@unit/views/product/mock/globalVal_review'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import router from '@/router'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import CONST from '@constants/framework/framework'
import { getDCDeliveryProductsResponse } from '@unit/views/product/mock/bundleProductMock'

const getDCDeliveryProductsApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSSearchDCDeliveryWrapper`)
    .reply(200, getDCDeliveryProductsResponse)

  return mock
}

describe('BundleList', () => {
  let localVue
  let options
  let mock

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.prototype.$nsaxios = nsaxios

    delete router.history.current
    router.history.current = {
      name: 'bundleList',
      meta: {},
      path: '/product/bundle-list',
      hash: '',
      query: {},
      params: {
        globalVal
      },
      fullPath: '/',
      matched: []
    }

    options = {
      localVue,
      store,
      globalVal
    }

    mock = new MockAdapter(axios)
  })

  it('created', () => {
    const wrapper = shallowMount(BundleList, options)
    assert.isNotNull(wrapper.vm.globalVal)
  })

  describe('methods', () => {
    it('initSearchKeyword', async () => {
      const wrapper = shallowMount(BundleList, options)
      wrapper.vm.searchKeyword = 'test Text'
      wrapper.vm.initSearchKeyword()
      assert.equal('', wrapper.vm.searchKeyword)
    })
    it('getPrice', async () => {
      const wrapper = shallowMount(BundleList, options)
      const product = {
        dispTypeCd: '15',
        mmRntalPrc: 0,
        priceofferprice: 9220
      }

      assert.isNotNull(wrapper.vm.getPrice(product))
    })
    it('getDCDeliveryProducts', async () => {
      getDCDeliveryProductsApiResponse(mock)
      const wrapper = shallowMount(BundleList, options)
      wrapper.vm.getDCDeliveryProducts()
      await flushPromises()
    })
    it('search', async () => {
      getDCDeliveryProductsApiResponse(mock)
      const wrapper = shallowMount(BundleList, options)
      wrapper.vm.search()
      await flushPromises()
    })
    it('sort', async () => {
      getDCDeliveryProductsApiResponse(mock)
      const wrapper = shallowMount(BundleList, options)
      wrapper.vm.sort()
      await flushPromises()
    })
    it('listGrid', async () => {
      const wrapper = shallowMount(BundleList, options)
      wrapper.vm.listGrid()
      assert.isNotNull(wrapper.vm.listGridClass)
    })
    it('clickSortButton', async () => {
      const wrapper = shallowMount(BundleList, options)
      wrapper.vm.clickSortButton()
      assert.isNotNull(wrapper.vm.sortClass)
    })
  })
})
