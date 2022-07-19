import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수

import NsPassword from '@components/customer/NsPassword' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('NsPassord.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // 프로퍼티 파라메터 정의
    const propsParmas = {
      value: '',
      readonly: false,
      disabled: false,
      maxlength: 16,
      title: '비밀번호',
      placeholder: '비밀번호를 입력하세요',
      isSuccess: false,
      isError: false,
      defaultMessage: '영문, 숫자, 특수문자 2가지 이상 조합 8~16자',
      errorMessage: '비밀번호는 8~16자 이내여야 합니다.'
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
      const wrapper = shallowMount(NsPassword, options)
      const vm = wrapper.vm

      let testResult = vm.clearInputData()

      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      testResult = vm.changeValue({
        target: {
          value: 'mock'
        }
      })

      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      testResult = vm.setShowingPassword(true)

      assert.equal(true, wrapper.vm.isPasswordShowing)

      const inputObj = wrapper.find('input')
      inputObj.trigger('blur')
      inputObj.trigger('focusin')

      await wrapper.vm.$nextTick()

      // console.log('inputObj : ', inputObj)
    })
  })
})
