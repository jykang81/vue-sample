import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수

import ContainerMessage from '@components/frameworks/ContainerMessage' // 테스트 할 대상 컴포넌트
// import NsInput from '@/views/test/NsInputTest' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('ContainerMessage.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // 상황에 따라 필요하면 주석 제거 후 사용
    // localVue.use(Vuex)

    // 프로퍼티 파라메터 정의
    const propsParmas = {
    }

    options = {
      localVue,
      router,
      store,
      propsData: {
        params: propsParmas
      }
    }
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : void 타입 테스트 코드 커버리지 용', () => {
    // 테스트 결과에 기대 조건 ... 대한 설명
    it('화면에 관련된 함수라 결과는 없다.', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ContainerMessage, options)
      const vm = wrapper.vm

      // vm.테스트대상메소드명
      vm.param.okCallback = () => {}
      let testResult = vm.confirm()

      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      vm.param.cancelCallback = () => {}
      testResult = vm.cancel()

      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      await wrapper.vm.$nextTick()
    })
  })
})
