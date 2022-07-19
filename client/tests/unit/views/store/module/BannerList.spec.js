import Vue from 'vue'
import Vuex from 'vuex'
// import { assert } from 'chai' // assert, expect, should
import { shallowMount, createLocalVue } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
import BannerList from '@/views/store/module/BannerList'
import firstResponse from '@unit/views/store/mock/firstResponse'
import anchorMixin from '@/mixins/store/home/anchorMixin'

describe('BannerList', () => {
  let localVue
  let options
  let wrapper

  before('before', function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(anchorMixin)

    Vue.prototype.$nsaxios = nsaxios
    Vue.directive('img-lazy-load', {})
    const propsParam = {
      espotData: [
        firstResponse.msg.espotList[0]._EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND
      ],
      espotExtendList: firstResponse.msg.espotExtendList._EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND
    }
    options = {
      localVue,
      store,
      propsData: propsParam
    }
    wrapper = shallowMount(BannerList, options)
  })

  it('랜덤값 얻기.', () => {
    wrapper.vm.espotData = firstResponse.msg.espotList[0]._EZ_HOME_TOPA_ESPOT_CNTNTSLIDEEXTEND
    wrapper.vm.getRandomSortIndex()
  })

  it('배너 전체보기 열기.', () => {
    wrapper.vm.bannerAllViewOpen()
  })

  it('배너 전체보기 닫기.', () => {
    wrapper.vm.bannerAllViewClose()
  })
})
