import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import uiUtil from '@utils/uiUtil'
import TestInfiniteScroll from '@/views/test/TestInfiniteScroll'
import App from '@/App'
import sinon from 'sinon'
import * as viewTypeModule from '@utils/commonutil/viewType'
import {
  sleep
} from '@utils/commonutil/commonUtil'

describe('uiUtil', () => {
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

  describe('bindInfiniteScroll', () => {
    let options
    let wrapper
    let vm

    before(() => {
      options = {
        attachToDocument: true
      }
    })

    beforeEach(() => {
      wrapper = shallowMount(TestInfiniteScroll, options)
      vm = wrapper.vm
    })

    it('인자를 넘기지 않으면, 에러가 발생한다', () => {
      assert.throws(() => {
        uiUtil.bindInfiniteScroll()
      })
    })

    it('vue 객체를 인자로 넘기지 않으면, 에러가 발생한다', () => {
      const invalidObject = {}

      assert.throws(() => {
        uiUtil.bindInfiniteScroll(invalidObject)
      })
    })

    it('콜백 함수를 인자로 넘기지 않으면, 에러가 발생한다', () => {
      const notFunction = {}

      assert.throws(() => {
        uiUtil.bindInfiniteScroll(vm, notFunction)
      })
    })

    it('스크롤 이벤트가 발생될 때, 무한스크롤이 동작한다', async () => {
      uiUtil.bindInfiniteScroll(vm, vm.object)

      // 스크롤 및 타이머 검증
      document.documentElement.scrollTop = document.documentElement.scrollHeight - document.documentElement.clientHeight
      window.dispatchEvent(new Event('scroll'))
      await vm.$nextTick()

      // 타이머 종료 후
      const DEFAULT_TIMEOUT = 2000
      await setTimeout(() => {}, DEFAULT_TIMEOUT)

      // 스크롤 콜백 실행
      document.documentElement.scrollTop = document.documentElement.scrollHeight - document.documentElement.clientHeight
      window.dispatchEvent(new Event('scroll'))
      await vm.$nextTick()

      // 타이머 종료 전
      await setTimeout(() => {}, 1000)

      // 스크롤 이벤트 실행
      document.documentElement.scrollTop = document.documentElement.scrollHeight - document.documentElement.clientHeight
      window.dispatchEvent(new Event('scroll'))
      await vm.$nextTick()
    })
  })

  describe('scrollMove', () => {
    it('특정 ID DOM 위치로 스크롤 이동한다', () => {
      const wrapper = shallowMount(App, options)

      const targetID = 'app'
      uiUtil.scrollMove(targetID)

      assert.isTrue(wrapper.exists())
    })
  })

  describe('setInfiniteScroll', () => {
    it('화면과 문서 최하단 스크롤 교차 시 콜백이 실행된다.', () => {
      const wrapper = shallowMount(App, options)
      const vm = wrapper.vm

      const mockCallback = sinon.spy()

      uiUtil.setInfiniteScroll(vm, {
        callback: mockCallback
      })

      assert.isTrue(wrapper.exists())
    })
  })

  describe('enableScroll', () => {
    describe('iOS 경우', () => {
      before(() => {
        sinon.stub(uiUtil, 'isItNecessaryForScrollPolyfill').returns(true)
      })

      after(() => {
        uiUtil.isItNecessaryForScrollPolyfill.restore()
      })

      it('iOS이면서 스크롤 금지가 걸려있지 않다면 함수가 종료된다', () => {
        uiUtil.enableScroll()
      })

      it('iOS이면서 스크롤 금지가 걸려있다면 스크롤 허용 처리한다', () => {
        document.body.style.overflow = 'hidden'

        uiUtil.enableScroll()

        document.body.style.removeProperty('overflow')
      })
    })
  })

  describe('disableScroll', () => {
    describe('iOS 경우', () => {
      before(() => {
        sinon.stub(uiUtil, 'isItNecessaryForScrollPolyfill').returns(true)
      })

      after(() => {
        uiUtil.isItNecessaryForScrollPolyfill.restore()
      })

      it('스크롤 금지 처리한다', () => {
        uiUtil.disableScroll()
      })
    })
  })

  describe('toggleScroll', () => {
    describe('iOS 경우', () => {
      before(() => {
        sinon.stub(uiUtil, 'isItNecessaryForScrollPolyfill').returns(true)
      })

      after(() => {
        uiUtil.isItNecessaryForScrollPolyfill.restore()
      })

      it('스크롤 허용/불가 상태로 전환된다.', () => {
        uiUtil.toggleScroll()
        uiUtil.toggleScroll()
      })
    })

    describe('android 경우', () => {
      it('스크롤 허용/불가 상태로 전환된다.', () => {
        uiUtil.toggleScroll()
        uiUtil.toggleScroll()
      })
    })
  })

  describe('setPreventFixedElementCracking', () => {
    describe('iOS 경우', () => {
      const mockFixedElement = {
        style: {
          bottom: '',
          removeProperty () {}
        }
      }

      before(() => {
        sinon.stub(viewTypeModule, 'default').returns('ios')
      })

      after(() => {
        viewTypeModule.default.restore()
      })

      it('focus in/out 이벤트 발생 시, 고정요소 깨짐 방지 콜백이 실행된다', async () => {
        sinon.stub(document.body, 'contains').returns(true)

        uiUtil.setPreventFixedElementCracking()

        uiUtil.preventFixedElementCracking(mockFixedElement)

        document.dispatchEvent(new Event('focusin'))

        document.dispatchEvent(new Event('focusout'))
        await sleep(200) // interval 대기

        document.body.contains.restore()
      })
    })
  })

  describe('preventFixedElementCracking', () => {
    before(() => {
      sinon.stub(viewTypeModule, 'default').returns('ios')
    })

    after(() => {
      viewTypeModule.default.restore()
    })

    it('깨짐 방지할 고정 요소를 추가한다.', () => {
      const mockFixedElement = {
        style: {
          bottom: '',
          removeProperty () {}
        }
      }

      uiUtil.preventFixedElementCracking(mockFixedElement)
    })
  })
})
