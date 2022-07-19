import Vue from 'vue'
import Vuex from 'vuex'
import { assert } from 'chai' // assert, expect, should
import { createLocalVue, shallowMount } from '@vue/test-utils' // shallowMount, createLocalVue, mount
import store from '@/vuex'
import nsaxios from '@frameworks/axiosUtil'
// import Home from '@/views/store/Home'
import CircleSlideList from '@/views/store/module/CircleSlideList'
import anchorMixin from '@/mixins/store/home/anchorMixin'
import VueRouter from 'vue-router'
import router from '@/router'

describe('CircleSlideList', () => {
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

    const propsParam = [
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-1.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '라운지V',
        contentsId: '604653',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '/product/20874208',
        clickTarget: 'Internal',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-2.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '월요패션관입니다',
        contentsId: '605152',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '/product/20874208',
        clickTarget: 'Internal',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-3.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '생활가전',
        contentsId: '605153',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '/product/20874208',
        clickTarget: 'Internal',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-4.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '주말마트',
        contentsId: '605154',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '/product/20874208',
        clickTarget: 'Internal',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-5.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '띵라이브',
        contentsId: '605155',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '/product/20874208',
        clickTarget: 'Internal',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-6.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '식품관',
        contentsId: '620154',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '',
        clickTarget: '',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-7.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '호텔여행',
        contentsId: '620155',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '',
        clickTarget: '',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      },
      {
        espotType: 'MarketingContent',
        espotId: '411953',
        contentMimeType: 'image',
        imgUrl: '//image.nsmall.com/ec_comimages/nsupload/espot/images/easy/easy_home_test_2-8.jpg',
        espotTitle: 'easy_circle_new',
        marketingText: '뷰티띵템',
        contentsId: '620156',
        clickCode: '',
        espotTitleImgPath: '',
        mdUrl: '',
        clickTarget: '',
        espotTitleText: '1,4',
        espotTitleMimeType: ''
      }
    ]

    options = {
      localVue,
      store,
      router,
      espotData: propsParam
    }
    wrapper = shallowMount(CircleSlideList, options)
  })

  it('data() check', () => {
    const defaultData = wrapper.vm.data
    assert.isNotNull(defaultData)
  })

  it('html 디코드.', () => {
    wrapper.vm.getHtmlDecode('aaa')
  })

  it('url이 외부링크 인지 내부링크 인지 체크.', () => {
    wrapper.vm.bannerCommonExternalUrlCheck('external')
    wrapper.vm.bannerCommonExternalUrlCheck('category')
  })

  it('배너 링크를 판단하여 url 반환.', () => {
    wrapper.vm.bannerCommonClickEvent('Product', '12345', '', '', '')
    wrapper.vm.bannerCommonClickEvent('External', '12345', '', '', 'http://m.naver.com')
  })

  it('데이터 판단후 new 또는 빈 문자열 반환.', () => {
    wrapper.vm.setNewIcon(0, '1,5')
    wrapper.vm.setNewIcon(0, '')
  })

  it('setNewIcon test.', () => {
    wrapper.vm.setNewIcon('Y')
    wrapper.vm.setNewIcon('N')
  })
})
