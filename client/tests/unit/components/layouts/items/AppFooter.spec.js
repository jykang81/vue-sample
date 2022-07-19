/* eslint-disable */
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import AppFooter from '@components/layouts/items/AppFooter'
import { nativeTestUtil } from '@unit/testUtil'
import {
  sleep
} from '@utils/commonutil/commonUtil'

describe('AppFooter', () => {
  let localVue
  let options

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    options = {
      localVue,
      store,
      router
    }
  })

  let wrapper
  let vm

  beforeEach(() => {
    wrapper = mount(AppFooter, options)
    vm = wrapper.vm
  })

  describe('openPCApp', () => {
    it('pc 페이지로 이동한다', () => {
      vm.openPCApp()
      assert.isTrue(wrapper.exists())
    })
  })

  describe('openWebBrowser', () => {
    before(() => {
      nativeTestUtil.setMockNativeUtil()      
    })

    after(() => {
      nativeTestUtil.clearMockNativeUtil()
    })

    it('웹 브라우저를 연다(앱전용)', () => {
      vm.openWebBrowser()
    })
  })

  describe('setAppMarketLink', () => {
    it('앱 마켓 링크를 설정한다', async () => {
      await sleep(1500) // bindAppMarketLink -> interval -> setAppMarketLink
    })
  })
})
