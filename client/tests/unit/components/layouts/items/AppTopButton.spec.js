import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import sinon from 'sinon'
import store from '@/vuex'
import router from '@/router'
import AppTopButton from '@components/layouts/items/AppTopButton'
import * as isiOSModule from '@utils/commonutil/isiOS'

describe('AppTopButton', () => {
  let localVue
  let wrapper
  let vm

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)
  })

  beforeEach(() => {
    wrapper = mount(AppTopButton, {
      localVue,
      router,
      store
    })

    vm = wrapper.vm
  })

  describe('AppTopButton', () => {
    describe('scrollTop', () => {
      it('스크롤 최상단으로 이동', () => {
        vm.scrollTop()
      })
    })

    describe('pageTopToggle', () => {
      const pageYOffset = window.pageYOffset

      afterEach(() => {
        window.pageYOffset = pageYOffset
      })

      it('높이가 1000보다 낮으면 탑 버튼을 표시하지 않는다', () => {
        window.pageYOffset = 0

        vm.pageTopToggle()

        const display = 'none'

        assert.equal(vm.topButtonDisplay, display)
      })

      it('높이가 1000보다 높으면 탑 버튼을 표시한다', () => {
        window.pageYOffset = 1001

        vm.pageTopToggle()

        const display = 'block'

        assert.equal(vm.topButtonDisplay, display)
      })

      it('iOS 계열은 screen height를 디바이스 높이로 사용한다', () => {
        sinon.stub(isiOSModule, 'default').returns(true)

        vm.pageTopToggle()

        sinon.restore()
      })
    })

    describe('handleTopbuttonClick', () => {
      it('상단으로 이동한다', () => {
        vm.handleTopbuttonClick()
      })
    })

    describe('beforeDestroy', () => {
      it('전역 scroll event를 해제한다.', () => {
        vm.$destroy()
      })
    })
  })
})
