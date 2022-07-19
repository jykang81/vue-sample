import CONST from '@constants/framework/framework'
import Vuex from 'vuex'
import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import globalVal from '@unit/views/product/mock/globalVal'
import VueRouter from 'vue-router' // 필수
import router from '@/router' // 필수
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'

import ProductDetail from '@/views/product/ProductDetail'
import { detailProductViewRealResponse, nSAjaxProductReviewResponse, nSItemDetailGoodsGuide, goodsQnARealResponse, recobellRecommendResponse } from '@unit/views/product/mock/productDetailMock'

const detailProductViewRealApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/DetailProductViewReal`)
    .reply(200, detailProductViewRealResponse)

  return mock
}
const productReviewApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSAjaxProductReview`)
    .reply(200, nSAjaxProductReviewResponse)

  return mock
}
const nSItemDetailGoodsGuideApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/NSItemDetailGoodsGuide`)
    .reply(200, nSItemDetailGoodsGuide)

  return mock
}
const goodsQnARealResponseApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/GoodsQnAReal`)
    .reply(200, goodsQnARealResponse)

  return mock
}
const recobellRecommendResponseApiResponse = mock => {
  mock.onPost(`${CONST.API_URL}/GoodsQnAReal`)
    .reply(200, recobellRecommendResponse)

  return mock
}

describe('ProductDetail', () => {
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
      name: 'productDetail',
      meta: {},
      path: '/product/23110038',
      hash: '',
      query: {},
      params: { path: '23110038' },
      fullPath: '/',
      matched: []
    }

    mock = new MockAdapter(axios)

    options = {
      localVue,
      store,
      router
    }
  })

  // 초기값 비교
  it('sets the correct default data', () => {
    assert.equal(typeof ProductDetail.data, 'function')
    const defaultData = ProductDetail.data()
    assert.equal(defaultData.isLoadChildComponent, false)
  })

  describe('computed', () => {
    // 상품정보 호출을 위한 파라미터
    // it('togetherViewParams', () => {
    //   const wrapper = shallowMount(ProductDetail, options)

    //   const expected = {
    //     partNumber: '23110038',
    //     cocd: '110',
    //     imgSizeType: 'Q'
    //   }
    //   assert.deepEqual(expected, wrapper.vm.togetherViewParams)
    // })
  })

  describe('methods', () => {
    it('init ', async () => {
      detailProductViewRealApiResponse(mock)
      nSItemDetailGoodsGuideApiResponse(mock)
      productReviewApiResponse(mock)
      goodsQnARealResponseApiResponse(mock)

      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.init()
    })
    it('checkProductValidation', async () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.checkProductValidation(globalVal.productInfo)
    })
    it('getProductDetail', async () => {
      detailProductViewRealApiResponse(mock)
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.getProductDetail(wrapper.vm.productDetailParams)
      await flushPromises()
    })
    it('getProductReview', async () => {
      productReviewApiResponse(mock)
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.getProductReview()

      await flushPromises()
    })
    it('getMoreGeneralInfo 상품기술서 조회 ', async () => {
      nSItemDetailGoodsGuideApiResponse(mock)
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.getMoreGeneralInfo()
      await flushPromises()
    })
    it('getQAList ', async () => {
      goodsQnARealResponseApiResponse(mock)
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.getQAList()
      await flushPromises()
    })
    it('getRecommend ', async () => {
      recobellRecommendResponseApiResponse(mock)
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.getRecommend()
      await flushPromises()
    })
    it('setProductDetailData ', async () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.setProductDetailData({ productDetailData: detailProductViewRealResponse, generalInfoData: nSItemDetailGoodsGuide, productReviewData: nSAjaxProductReviewResponse, qaListData: goodsQnARealResponse })
      assert.isNotEmpty(wrapper.vm.globalVal)
    })
    it('checkAdultCertificated ', async () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.checkAdultCertificated()
    })
    it('layerOpen ', () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.layerOpen()
    })
    it('layerClose ', () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.layerClose()
    })
    it('handleRequiresRefresh ', () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.handleRequiresRefresh()
    })
    it('refreshPage ', () => {
      const wrapper = shallowMount(ProductDetail, options)
      wrapper.vm.refreshPage()
    })
  })
})
