import { assert } from 'chai' // 필수
import { mount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'
import flushPromises from 'flush-promises'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import AppCategory from '@components/layouts/items/AppCategory'
import NSMobHomeViewResponse from '@unit/components/layouts/items/mock/NSMobileHomeViewResponse'

describe('AppCategory', () => {
  let localVue
  let options
  let mock

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
    options = {
      localVue,
      store,
      router,
      methods: {
        // 브라우저 종속 메소드 mocking
        centerCurrentCategory () {}
      }
    }

    Vue.prototype.$nsaxios = nsaxios
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
    const NSMobileHomeViewURL = `${CONST.API_URL}/NSMobHomeView`
    mock
      .onPost(NSMobileHomeViewURL)
      .reply(200, NSMobHomeViewResponse)
  })

  after(() => {
    mock.reset()
  })

  describe('swiper', () => {
    it('컴포넌트가 마운트 되면, swiper 객체가 생성된다', async () => {
      const wrapper = mount(AppCategory, options)

      await flushPromises()

      const vm = wrapper.vm
      const swiper = vm.swiper

      assert.isNotNull(swiper)
    })
  })

  describe('categoryClickLogging', () => {
    describe('매장 카테고리 클릭 정보를 적재한다', () => {
      it('홈매장 클릭 정보를 적재한다', async () => {
        const wrapper = mount(AppCategory, options)

        await flushPromises()

        const vm = wrapper.vm

        vm.categoryClickLogging('홈', '/store/path')
      })

      it('슬롯매장 클릭 정보를 적재한다', async () => {
        const wrapper = mount(AppCategory, options)

        await flushPromises()

        const vm = wrapper.vm

        vm.categoryClickLogging('슬롯매장', '/store/slot/')
      })
    })
  })

  describe('getCateogryIndexMatchWithPath', () => {
    it('현재 주소의 해당하는 카테고리 index 조회', async () => {
      const wrapper = mount(AppCategory, options)

      await flushPromises()

      const vm = wrapper.vm

      vm.getCateogryIndexMatchWithPath()
    })
  })
})
