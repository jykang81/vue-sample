import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
// import loginUtil from '@/common/utils/loginUtil'
import flushPromises from 'flush-promises'
import MockAdapter from 'axios-mock-adapter'
import { getProcessedWCSParameter } from '@unit/testUtil'
import CONST from '@constants/framework/framework'
import axios from 'axios'
// import { getProcessedWCSParameter } from '@unit/testUtil'
import LnbCategory from '@/views/store/LnbCategory'
import VueRouter from 'vue-router'
import router from '@/router'

import search from '@/vuex/modules/search'

import lnbCategory from '@unit/views/store/mock/lnbCategory'

describe('LnbCategory.vue에 대한 케이스.', () => {
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
    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    options = {
      localVue,
      store,
      router
    }
    mock = new MockAdapter(axios)
    const params = {
      categoryId: 1583588,
      currentPage: 1,
      sortCriteria: 'best',
      accptPath: 500,
      accptPathCd: 500
    }
    const dummyResponse = lnbCategory
    url = `${CONST.API_URL}/NSMobileCategory`
    mock
      .onPost(url, getProcessedWCSParameter('post', params))
      .reply(200, dummyResponse)
    try {
      wrapper = shallowMount(LnbCategory, options)
      await flushPromises()
    } catch (error) {
      assert.fail(error.message)
    }
  })
  // it('데이터를 가져왔는지 판단.', () => {
  //   const defaultData = wrapper.vm.data
  //   console.log('defaultData \n', defaultData)
  // })
  it('상품 정렬.', () => {
    wrapper.vm.sort()
  })

  it('리스트 그리드 토글.', () => {
    wrapper.vm.listGrid()
  })

  it('찜 토글.', () => {
    wrapper.vm.wish()
  })

  it('무한스크롤 동적 제어 플래그.', () => {
    wrapper.vm.setPushFullEventFlag(true)
    wrapper.vm.setPushFullEventFlag(false)
  })

  it('무한스크롤 콜백 셋팅.', () => {
    wrapper.vm.pagePullingFlag = true
    wrapper.vm.pagePulling()
    wrapper.vm.pagePullingFlag = false
    wrapper.vm.pageIdx = 1
    wrapper.vm.totalPage = 2
    wrapper.vm.pagePulling()
    wrapper.vm.pageIdx = 1
    wrapper.vm.totalPage = 1
    wrapper.vm.pagePulling()
  })

  it('중분류 매장 데이터 셋팅.', () => {
    const data = lnbCategory
    wrapper.vm.pageIdx = 1
    wrapper.vm.setMidCategoryInfo(data)
    wrapper.vm.pageIdx = 2
    wrapper.vm.setMidCategoryInfo(data)
  })

  it('쇼핑 히스토리에 노출되는 카테고리 정보 setting.', () => {
    const data = lnbCategory
    wrapper.vm.setShoppingHistory(data.msg.categoryInfo)
  })

  it('매장 icons CDN 기준 이미지 조회.', () => {
    wrapper.vm.getCateImageUrl('12345', null)
    wrapper.vm.getCateImageUrl('12345', 'png')
  })

  it('서브 카테고리 리스트 처리.', () => {
    const data = lnbCategory
    wrapper.vm.setShoppingHistory(data.msg.categoryInfo)
  })
})
