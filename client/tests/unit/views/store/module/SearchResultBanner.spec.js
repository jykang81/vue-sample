import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import SearchResultBanner from '@/views/store/module/SearchResultBanner'
import router from '@/router'
import VueRouter from 'vue-router'
import anchorMixin from '@/mixins/store/home/anchorMixin'

describe('SearchResultBanner test case', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    localVue.use(anchorMixin)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('document', document)
    Vue.directive('window', window)
    Vue.directive('img-lazy-load', {})

    delete router.history.current
    const current = {
      name: null,
      meta: {},
      path: '/',
      hash: '',
      query: {},
      params: {
      },
      fullPath: '/',
      matched: []
    }
    router.history.current = current

    const propsParam = {
      planList: [
        {
          planNm: '[CJ브랜드위크_12월]',
          mdUrl: 'CategoryDisplay?identifier=-31528&categoryId=-31528&catalogId=21151&storeId=13001',
          class: 'class com.ns.commerce.search.bean.NSSearchRelPlanBean',
          planId: '-31528',
          imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/mobile/2020/11/(m)201123_promo_main1_03_31528_375_230_z.jpg',
          contentsId: '2212732'
        },
        {
          planNm: '신세계푸드 올반 피코크 인기상품 모음전',
          mdUrl: 'CategoryDisplay?identifier=-66724&categoryId=-66724&catalogId=21151&storeId=13001',
          class: 'class com.ns.commerce.search.bean.NSSearchRelPlanBean',
          planId: '-66724',
          imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/Aimg/mobile/2020/11/(m)201116_promo_main1_05_66724_375_230_z.jpg',
          contentsId: '2208178'
        }
      ],
      dataLength: 2
    }
    options = {
      localVue,
      store,
      router,
      propsData: propsParam
    }
    wrapper = shallowMount(SearchResultBanner, options)
  })

  it('data() check', () => {
    const defaultData = wrapper.vm.data
    console.debug('[ defaultData ]\n', defaultData)
  })
})
