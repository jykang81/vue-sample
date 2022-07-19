import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import loginUtil from '@/common/utils/loginUtil'
import flushPromises from 'flush-promises'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import { getProcessedWCSParameter } from '@unit/testUtil'
import SearchResult from '@/views/store/SearchResult'
import VueRouter from 'vue-router'
import router from '@/router'

import searchResultResponse1 from '@unit/views/store/mock/searchResultResponse1'
import searchResultResponse2 from '@unit/views/store/mock/searchResultResponse2'
import searchResultResponse3 from '@unit/views/store/mock/searchResultResponse3'

import search from '@/vuex/modules/search'
import marketingUtil from '@/common/utils/marketingUtil'

import SEARCH_CONST from '@/common/constants/search/search'

describe('SearchResult.vue 에 대한 케이스.', () => {
  let localVue
  let options
  let wrapper
  let mock
  let url

  before('before', async function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(search)
    localVue.use(VueRouter)
    localVue.use(marketingUtil)
    localVue.use(SEARCH_CONST)
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    options = {
      localVue,
      store,
      router
    }
    // GA 360
    window.ga = () => {}
    window.marketingRoute = {
      name: 'testGa360',
      fullPath: '/test/test-ga360-log',
      meta: {
        title: 'GA 360',
        depth: '아키텍처>테스트>GA 360'
      }
    }

    // Recobell
    window._eglconf = {}
    window._eglconf.forceTrackVisit = true
    window.eglc = {}
    window.eglc.op = () => {}
    window.eglc.clearData = () => {}

    // 네이버 프리미엄 로그
    window.wcs = {}
    window.wcs.inflow = () => {}
    window.wcs.cnv = () => {}
    window.wcs_do = () => {}

    // Airbridge
    window.airbridge = {}
    window.airbridge.init = () => {}
    window.airbridge.events = {}
    window.airbridge.events.signUp = () => {}
    window.airbridge.events.signIn = () => {}
    window.airbridge.events.signOut = () => {}
    window.airbridge.events.homeViewEvent = () => {}
    window.airbridge.events.productDetailsViewEvent = () => {}
    window.airbridge.events.productListViewEvent = () => {}
    window.airbridge.events.searchResultViewEvent = () => {}
    window.airbridge.events.addedToCart = () => {}
    window.airbridge.events.purchased = () => {}
    window.airbridge.events.send = () => {}

    // AIQUA
    window.AIQUA = () => {}
    window.AIQUA.init = {
      appId: '966ef26ddcc00f25775f',
      timeout: 5000
    }
    window.qg = () => {}

    // DTSI
    window.dlight = {}
    window.dlight.sendConversion = () => {}

    localVue = createLocalVue()
    Vue.prototype.$nsaxios = nsaxios
    localVue.use(Vuex)
    options = {
      localVue,
      store,
      router,
      loginUtil
    }
    mock = new MockAdapter(axios)
    let params = {}
    let dummyResponse = {}
    params = {
      searchType: 'search',
      appType: 'MOBILE',
      filterType: [],
      searchTerm: 'cc',
      researchTerm: 'bb',
      currentPage: 1,
      pageSize: 30,
      sortCriteria: 'weight',
      priceStart: '',
      priceEnd: '',
      cate3Name: [],
      brandName: [],
      freeDeliverYn: '',
      interestFreeYn: '',
      saveYn: '',
      lspYn: '',
      priceFilterFlag: false,
      categoryFilterFlag: false,
      setBrandFinishFlag: false,
      benefitFilterFlag: false,
      storeTypeFilterFlag: false,
      hasBenefitLabels: [],
      hasStoreTypeLabels: [],
      checkedFilterElement: [],
      cateRootList: [],
      priceList: [],
      brandSortNmList: [],
      brandSortCntList: [],
      cate3NameView: [],
      listForInputRecheckFromBack: []
    }
    dummyResponse = searchResultResponse1
    url = `${CONST.API_URL}/NSSearchMobileWrapper`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)

    params = {
      userId: '674050832',
      catentryId: '28201809'
    }
    dummyResponse = searchResultResponse2
    url = `${CONST.API_URL}/RegisterWish`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)

    dummyResponse = searchResultResponse3
    url = `${CONST.API_URL}/RemoveWish`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)

    try {
      wrapper = shallowMount(SearchResult, options)
      await flushPromises()
      await wrapper.vm.$nextTick()
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('데이터를 가져왔는지 판단.', () => {
    const defaultData = wrapper.vm.data
    console.log('defaultData \n', defaultData)
  })

  it('리스트 그리드 토글.', () => {
    wrapper.vm.listGrid()
  })

  it('필터 열기/닫기.', () => {
    wrapper.vm.filter()
    wrapper.vm.filterClass = !wrapper.vm.filterClass
    wrapper.vm.filter()
  })

  it('필터 아코디언.', () => {
    wrapper.vm.accordion(1)
    wrapper.vm.accordion(2)
    wrapper.vm.accordion(3)
    wrapper.vm.accordion(4)
    wrapper.vm.accordion(5)
    wrapper.vm.accordion(6)
  })

  it('초기화 메소드.', () => {
    const params = {
      searchTerm: 'abc',
      promotionText: 'def'
    }
    wrapper.vm.init(params)
  })

  it('검색어 조회.', () => {
    wrapper.vm.getTotalSearchInfo()
    wrapper.vm.pushFullEventFlag = true
    wrapper.vm.getTotalSearchInfo()
  })

  it('검색어 조회 콜백 메소드.', () => {
    const data = searchResultResponse1
    wrapper.vm.getTotalSearchInfoCallback(data)
    data.msg.root.filterSearchYn = 'Y'
    data.msg.root.TotalCount = 0
    wrapper.vm.getTotalSearchInfoCallback(data)
  })

  it('상품정보 셋팅 메소드.', () => {
    let data = {
      msg: {
        root: {
          ProductList: []
        }
      }
    }
    wrapper.vm.makeProductListArea(data)
    data = searchResultResponse1
    data.msg.root.ProductList[0].multiCd = ''
    wrapper.vm.pushFullEventFlag = false
    wrapper.vm.pageIdx = 1
    wrapper.vm.makeProductListArea(data)
  })

  it('검색어 변경시 watch 동작 기대.', () => {
    wrapper.vm.searchTerm = 'ddd'
    wrapper.vm.searchTerm = 'aaa'
  })

  it('실시간 인기 검색 상품 데이터 셋팅.', () => {
    const data = searchResultResponse1
    wrapper.vm.makeRecommPrdListArea(data)
  })

  // it('검색어 셋팅 및 필터 초기화.', () => {
  //   wrapper.vm.resetFilter()
  // })

  it('선택된 필터값들을 문자열로 나열.', () => {
    wrapper.vm.getTransCateLabel(['aaa', 'bb'])
  })

  it('검색결과에 해당하는 브랜드를 인풋 체크박스로 보여주기위한 데이터 셋팅.', () => {
    const data = searchResultResponse1
    wrapper.vm.setBrandList(data)
  })

  it('검색결과의 최저가, 최고가를 5등분한 정보로 라디오버튼 데이터 셋팅.', () => {
    const data = searchResultResponse1
    wrapper.vm.setProductPrice(data)
  })

  it('가격 라디오버튼 클릭했을때 필터 작동 여부.', () => {
    wrapper.vm.priceSubmit(20000, 30000)
  })

  it('정렬 라디오버튼을 클릭했을때 필터 작동 여부.', () => {
    wrapper.vm.setSortCriteria('weight')
    wrapper.vm.setSortCriteria('best')
    wrapper.vm.setSortCriteria('lowPrice')
    wrapper.vm.setSortCriteria('topPrice')
    wrapper.vm.setSortCriteria('eval')
  })

  it('검색결과가 없을때 선택된 필터들을 보여주기.', () => {
    wrapper.vm.getFilterCheckLable()
  })

  it('vuex 체크.', () => {
    const param = {
      searchTerm: 'abc',
      promotionText: ''
    }
    search.mutations.setSearchWordInfo(search.state, param)
  })

  it('filter 호출.', () => {
    wrapper.vm.filterClass = !wrapper.vm.filterClass
    wrapper.vm.filter()
    wrapper.vm.filterClass = !!wrapper.vm.filterClass
    wrapper.vm.filter()
  })

  it('SRP --> 정렬박스 눌렀을때 .', () => {
    wrapper.vm.nsRecommandAccordion()
  })

  it('브랜드 및 카테고리 클래스 셋팅 공통 메소드.', () => {
    wrapper.vm.$refs.categorySelected.classList.add('active')
    wrapper.vm.brandAndCateClassSet('categorySelected')
  })

  it('렌탈상품일때와 무형상품일때의 케이스.', () => {
    wrapper.vm.makeProductItem(null, null, null, null)
    let prdItemInfo = {
      isDepartment: 'Y',
      busChnId: 'TV',
      dispTypeCd: '45'
    }
    wrapper.vm.makeProductItem(prdItemInfo, null, null, null)
    prdItemInfo = {
      isDepartment: 'Y',
      busChnId: 'TV',
      dispTypeCd: '35'
    }
    wrapper.vm.makeProductItem(prdItemInfo, null, null, null)
    prdItemInfo = {
      ifiValue: 1,
      padValue: 1,
      wishProduct: true
    }
    wrapper.vm.makeProductItem(prdItemInfo, null, null, null)
  })

  it('조회수가 9999이상일때 제대로 동작하는지 체크.', () => {
    wrapper.vm.getJoinCnt(10000)
  })

  it('주문수량이 9999이상일때 제대로 동작하는지 체크.', () => {
    wrapper.vm.getOrderCount(10000)
  })

  it('pagePulling test', () => {
    wrapper.vm.pagePulling()
  })

  it('searchResultLogging test', () => {
    let productInfo = {
      busChnId: 'INT',
      prdInfo: {},
      oriPrice: 1245,
      salePrice: 0
    }
    wrapper.vm.searchResultLogging(productInfo)
    productInfo = {
      busChnId: 'CTCOM',
      prdInfo: {},
      oriPrice: 1245,
      salePrice: 12312
    }
    wrapper.vm.searchResultLogging(productInfo)
  })

  it('getFilterCheckLable test', () => {
    wrapper.vm.getFilterCheckLable()
  })
})
