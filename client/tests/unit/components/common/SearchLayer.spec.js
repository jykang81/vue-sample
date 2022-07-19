import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import flushPromises from 'flush-promises'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import { getProcessedWCSParameter } from '@unit/testUtil'
// import localStorageUtil from '@frameworks/localStorageUtil'
import VueRouter from 'vue-router' // 필수
import router from '@/router' // 필수
import SearchLayer from '@/components/common/SearchLayer'
import COMM_CONST from '@/common/constants/framework/constants'
import SEARCH_CONST from '@/common/constants/search/search'
import search from '@/vuex/modules/search'

describe('Search.vue 에 대한 케이스.', () => {
  let localVue
  let wrapper
  let options
  let mock
  let url
  before('before', async function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    Vue.prototype.$nsaxios = nsaxios
    localVue.use(VueRouter)
    localVue.use(COMM_CONST)
    localVue.use(search)
    delete router.history.current
    const current = {
      name: 'searchLayer',
      meta: {},
      path: 'common/SearchLayer',
      hash: '',
      query: {},
      params: { searchTerm: '라면' },
      fullPath: '/',
      matched: []
    }
    router.history.current = current
    options = {
      localVue,
      store,
      router
    }
    mock = new MockAdapter(axios)
    let params = {
      searchType: 'auto',
      searchTerm: '신라면'
    }
    let dummyResponse = {}

    dummyResponse = { // 자동 완성 API 응답.
      totalTime: 23,
      isSuccessful: true,
      responseHeaders: {
        'Access-Control-Allow-Origin': 'http://m.nsmall.com',
        'Keep-Alive': 'timeout=5, max=100',
        'Access-Control-Allow-Headers': '*',
        'Content-Language': 'en-US',
        Date: 'Tue, 12 May 2020 03:53:14 GMT',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'max-age=3600',
        Vary: 'Accept-Encoding,User-Agent',
        Expires: 'Tue, 12 May 2020 04:53:14 GMT',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Transfer-Encoding': 'chunked',
        Connection: 'Keep-Alive',
        'Access-Control-Allow-Credentials': 'true'
      },
      statusReason: 'OK',
      tranId: 'webapp/wcs/stores/servlet/NSSearchMobile',
      autoResultList: [
        {
          brandId: '',
          planId: '',
          keyword: '하림 닭가슴살 IFF',
          keyType: 'autoBKey',
          count: '1'
        },
        {
          brandId: '',
          planId: '',
          keyword: '비비안 GENTOFF',
          keyType: 'autoBKey',
          count: '1'
        },
        {
          brandId: '',
          planId: '',
          keyword: 'IFF 정육 2',
          keyType: 'autoBKey',
          count: '1'
        }
      ],
      totalCount: 3,
      returnCode: '1',
      responseTime: 23,
      statusCode: 200
    }
    url = `${CONST.API_URL}/NSSearchMobile`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)

    params = { // 인기검색어 조회.
      searchType: 'top'
    }
    dummyResponse = {
      returnCode: '1',
      totalCount: 10,
      topResultList: [
        { keyword: '지하영' },
        { keyword: 'G-PAD' },
        { keyword: 'G-PAD 5만원' },
        { keyword: '지하영 차장님 휴가' },
        { keyword: '최순실 국정농단' },
        { keyword: '트럼프 쇼크' },
        { keyword: '한일 군사정보보호협정' },
        { keyword: '삼성 갤럭시 폭발' },
        { keyword: '내일은 G-PAD 가져오겠지' },
        { keyword: '주식하는사람 지금 어때요?' }
      ]
    }
    url = `${CONST.API_URL}/NSSearchMobile`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)

    params = { // 프로모션 정보 조회.
      espotInfo: 'GNB_PROMOTION_TEXT_MOB|Text'
    }
    dummyResponse = {
      msg: {
        root: {
          _GNB_PROMOTION_TEXT_MOB: []
        }
      },
      catalogId: ['14051'],
      viewTaskName: 'NSAjaxActionResponse',
      espotInfo: ['GNB_PROMOTION_TEXT_MOB|Text'],
      userId: ['102983700'],
      langId: ['-9'],
      accptPath: ['500'],
      accptPathCd: ['500'],
      storeId: ['13001']
    }

    url = `${CONST.API_URL}/NSEspotCommon`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)
    try {
      wrapper = shallowMount(SearchLayer, options)
      await flushPromises()
      await wrapper.vm.$nextTick()
    } catch (error) {
      assert.fail(error.message)
    }
  })

  it('데이터를 가져왔는지 판단.', () => {
    wrapper.vm.init()
    wrapper.vm.init({ searchTerm: 'qwer' })
    wrapper.vm.init({ searchType: 'dummy' })
  })

  // it('검색 레이어 닫기.', () => {
  //   wrapper.vm.$store = { commit: data => {} }
  //   wrapper.vm.closeSearchPopup()
  // })

  it('검색어 지우기.', () => {
    wrapper.vm.searchReset()
  })

  it('공백 검사후 검색 매장으로 이동.', () => {
    wrapper.vm.keywordClicked('abc')
  })

  it('검색 결과 페이지로 이동.', () => {
    wrapper.vm.searchKeyword = ''
    wrapper.vm.searchSubmit()
    wrapper.vm.searchKeyword = 'abc'
    wrapper.vm.searchSubmit()
  })

  it('검색 input 박스에 키가 입력될때마다 api 콜 (자동완성 기능).', () => {
    const mock = new MockAdapter(axios)
    const params = {
      searchType: 'auto',
      searchTerm: '신라면'
    }
    let dummyResponse = {}

    dummyResponse = { // 자동 완성 API 응답.
      totalTime: 23,
      isSuccessful: true,
      responseHeaders: {
        'Access-Control-Allow-Origin': 'http://m.nsmall.com',
        'Keep-Alive': 'timeout=5, max=100',
        'Access-Control-Allow-Headers': '*',
        'Content-Language': 'en-US',
        Date: 'Tue, 12 May 2020 03:53:14 GMT',
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'max-age=3600',
        Vary: 'Accept-Encoding,User-Agent',
        Expires: 'Tue, 12 May 2020 04:53:14 GMT',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Transfer-Encoding': 'chunked',
        Connection: 'Keep-Alive',
        'Access-Control-Allow-Credentials': 'true'
      },
      statusReason: 'OK',
      tranId: 'webapp/wcs/stores/servlet/NSSearchMobile',
      autoResultList: [
        {
          brandId: '',
          planId: '',
          keyword: '하림 닭가슴살 IFF',
          keyType: 'autoBKey',
          count: '1'
        },
        {
          brandId: '',
          planId: '',
          keyword: '비비안 GENTOFF',
          keyType: 'autoBKey',
          count: '1'
        },
        {
          brandId: '',
          planId: '',
          keyword: 'IFF 정육 2',
          keyType: 'autoBKey',
          count: '1'
        }
      ],
      totalCount: 3,
      returnCode: '1',
      responseTime: 23,
      statusCode: 200
    }
    url = `${CONST.API_URL}/NSSearchMobile`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)
    // wrapper.vm.repeatCallAutocomplete()
  })

  it('최근검색어 전체 삭제.', () => {
    wrapper.vm.deleteAllLatelySearchWord()
  })

  it('최근 검색어 데이터 유무 체크.', () => {
    wrapper.vm.hasLatelySearchWord()
  })

  it('최근 검색어 리스트 조회 및 셋팅.', () => {
    wrapper.vm.isLogon = true
    wrapper.vm.getLatelySearchWord()
  })

  it('프로모션 텍스트가 null 일때 체크.', () => {
    wrapper.vm.getPromotionTextCallback(null)
  })

  it('자동완성 리스트중에 현재 검색어에 대한 폰트 빨간색 처리.', () => {
    wrapper.vm.setFontColor('라면', '신라면')
  })

  it('검색어 유무에 따른 반환값 분기.', () => {
    wrapper.vm.paramData = null
    wrapper.vm.hasKeyword()
    wrapper.vm.paramData = {
      searchTerm: 'abcd'
    }
    wrapper.vm.hasKeyword()
  })

  it('편성표 라벨 숨김.', () => {
    wrapper.vm.tvTagLabelHide()
  })

  // it('편성표 라벨 유무에 따른 클래스 셋팅.', () => {
  // wrapper.vm.setTvTableClass(true)
  // wrapper.vm.setTvTableClass(false)
  // })

  // it('연관 검색어 데이터 조회 콜백.', () => {
  //   let data = {
  //     autoResultList: undefined
  //   }
  //   wrapper.vm.isLogon = false
  //   wrapper.vm.relateSearchWordCallback(data)
  //   data = {
  //     autoResultList: [
  //       'a',
  //       'abc'
  //     ]
  //   }
  // wrapper.vm.relateSearchWordCallback(data)
  // })

  it('search 상수 사용.', () => {
    const SEARCH_CONST_OBJECT = SEARCH_CONST
    console.log('[ SEARCH_CONST_OBJECT ]\n', SEARCH_CONST_OBJECT)
  })
})
