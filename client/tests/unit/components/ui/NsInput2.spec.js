import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'

// 상황에 따라 필요하면 주석 제거 후 사용
// import Vuex from 'vuex'

import NsInput from '@components/common/NsInput' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('NsInput.vue에 대한 테스트 케이스', () => {
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
      value: '',
      iconClass: 'user_name',
      title: '이름',
      isLabel: true,
      labelKind: 'label_text',
      isSuccess: true,
      isError: true,
      disabled: false,
      defaultKeyboard: 'korea'
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
    it('화면에 관련된 함수라 결과는 없다.', () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(NsInput, options)
      const vm = wrapper.vm

      // vm.테스트대상메소드명
      let testResult = vm.clearInputData()
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      const mockEvent = {
        target: {
          value: ''
        }
      }

      testResult = vm.changeValue(mockEvent)
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      /*       const input = vm.find('input')
      input.trigger('blur')
 */
      /*
      testResult = vm.handleBlur(new MouseEvent())
      console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)
 */
    })
  })
})
