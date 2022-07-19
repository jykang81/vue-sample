import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import AppHeaderSub from '@components/layouts/items/AppHeaderSub'
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'
import flushPromises from 'flush-promises'

describe('AppHeaderSub', () => {
  const TITLE = '타이틀'
  let localVue
  let wrapper
  let options

  before(() => {
    Vue.use(Vue2TouchEvents)
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    options = {
      localVue,
      router,
      store
    }
  })

  beforeEach(() => {
    delete router.history.current
    router.history.current = {
      name: '',
      meta: {},
      path: '',
      hash: '',
      query: {},
      fullPath: '/',
      matched: []
    }
  })

  describe('created', () => {
    it('meta 객체 값을 확인한다.', () => {
      // 타이틀 설정
      delete router.history.current
      router.history.current = {
        name: '',
        meta: null,
        path: '',
        hash: '',
        query: {},
        fullPath: '/',
        matched: []
      }
      wrapper = shallowMount(AppHeaderSub, options)

      const actual = wrapper.find('.sub_title').text()
      assert.notEqual(actual, TITLE)
    })

    it('meta 객체에 title이 있으면 title을 갱신한다', () => {
      // 타이틀 설정
      router.history.current.meta.title = TITLE
      wrapper = shallowMount(AppHeaderSub, options)

      const actual = wrapper.find('.sub_title').text()
      const expected = TITLE
      assert.equal(actual, expected)
    })
  })

  describe('goBack', () => {
    it('이전 페이지로 이동한다. (앱 환경 대응)', async () => {
      wrapper = shallowMount(AppHeaderSub, options)
      const vm = wrapper.vm

      vm.goBack()
      await flushPromises
    })
  })
})
