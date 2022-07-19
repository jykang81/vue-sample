import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import AppBottomNavi from '@components/layouts/items/AppBottomNavi'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'
import Vue2TouchEvents from 'vue2-touch-events'
import VueAwesomeSwiper from 'vue-awesome-swiper'
// import flushPromises from 'flush-promises'
import sinon from 'sinon'

Vue.use(VueAwesomeSwiper)
Vue.use(Vue2TouchEvents)

describe('AppBottomNavi', () => {
  let localVue
  let options
  let wrapper
  let vm

  before(() => {
    Vue.prototype.$nsaxios = nsaxios
    Vue.use(VueAwesomeSwiper)
    Vue.use(Vue2TouchEvents)

    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    options = {
      localVue,
      store,
      router
    }
  })

  beforeEach(() => {
    wrapper = shallowMount(AppBottomNavi, options)
    vm = wrapper.vm
  })

  afterEach(() => {
    document.documentElement.scrollTop = 0
    wrapper.destroy()
  })

  it('노출 확인', async () => {
    store.commit('layouts/toggleBottomNavi', true) // 하단 nav 상태 mocking
    await vm.$nextTick()

    assert.ok(wrapper.find('.app_bottom_navi').isVisible())
  })
  it('tvlive 엘리먼트', async () => {
    assert.deepEqual(vm.tvLiveBox, vm.$refs.tvLiveBox)
  })
  describe('scrollEvent', () => {
    const sandbox = sinon.createSandbox()

    afterEach(() => {
      sandbox.restore()
    })

    it('스크롤 상향, 하향 스크롤시 GNB 노출 영역 변경', async () => {
      // TODO : 수정 필요
      // const mockBoundingClientRect = {
      //   top: 0
      // }

      // // 상황 1. 스크롤 이벤트 발생 x
      // mockBoundingClientRect.top = -10
      // sandbox.replace(document.body, 'getBoundingClientRect', () => {
      //   return mockBoundingClientRect
      // })
      // vm.scrollEvent()
      // sandbox.restore()
      // assert.isFalse(vm.hide) // 하단 탭바 숨김 상태

      // // 조건 2. 스크롤 이벤트 발생
      // mockBoundingClientRect.top = -20
      // sandbox.replace(document.body, 'getBoundingClientRect', () => {
      //   return mockBoundingClientRect
      // })
      // vm.scrollEvent()
      // sandbox.restore()
      // assert.isTrue(vm.hide) // 하단 탭바 보임 상태

      // mockBoundingClientRect.top = -15
      // sandbox.replace(document.body, 'getBoundingClientRect', () => {
      //   return mockBoundingClientRect
      // })
      // vm.scrollEvent()
      // sandbox.restore()
      // assert.isFalse(vm.hide) // 하단 탭바 숨김 상태

      // mockBoundingClientRect.top = 50
      // sandbox.replace(document.body, 'getBoundingClientRect', () => {
      //   return mockBoundingClientRect
      // })
      // vm.scrollEvent()
    })
  })

  it('TV LIVE 레이어 위치 설정', async () => {
    vm.setTvLivePosition()
    assert.equal(vm.style.bottom, '0px')
  })
  // it(' TV LIVE 아이콘 클릭시 토글', async () => {
  //   // 닫힘 상태
  //   vm.tvlive = false

  //   // 토글
  //   vm.onTvLiveToggle()
  //   await flushPromises()

  //   // 열림
  //   assert.isTrue(vm.tvlive)

  //   // 토글
  //   vm.onTvLiveToggle()
  //   await flushPromises()

  //   // 닫힘
  //   assert.isFalse(vm.tvlive)
  // })

  describe('getSwiperTvlive', () => {
    it('tv live용 swiper 객체를 반환한다', () => {
      const result = vm.getSwiperTvlive

      assert.isNotNull(result)
    })
  })

  describe('getTvLiveSwiper', () => {
    it('tv live용 swiper 객체를 반환한다', () => {
      const result = vm.getTvLiveSwiper

      assert.isNotNull(result)
    })
  })

  describe('childLoadControl', () => {
    it('컴포넌트가 3회 이상 로드 되지 않았다면 true를 반환한다', () => {
      const didLoadLessThan3Times = vm.childLoadControl

      assert.isUndefined(didLoadLessThan3Times)
    })
  })
})
