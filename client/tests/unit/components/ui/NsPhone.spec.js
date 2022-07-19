import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수

import NsPhone from '@components/common/NsPhone' // 테스트 할 대상 컴포넌트
// import NsInput from '@/views/test/NsInputTest' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('NsPhone.vue에 대한 테스트 케이스', () => {
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
      readonly: false,
      disabled: false,
      maxlength: 11,
      title: '휴대전화 입력',
      placeholder: '휴대폰 번호 (‘-’ 없이 입력)',
      isSuccess: false,
      isError: false,
      errorMessage: 'jh****@naver.com 아이디(이메일)로 가입된 휴대전화입니다. <br>신규가입하실 경우, 휴대전화 인증이 필요합니다.',
      verification: {
        value: '',
        readonly: false,
        disabled: false,
        maxlength: 6,
        title: '인증번호 6자리',
        placeholder: '인증번호 6자리',
        isVerficationMode: true,
        timeLimit: '', /* 시간 제한 ex)05:00 or 04:59 ... */
        isSuccess: false,
        isError: false,
        isSendCode: false,
        sendMessage: '입력하신 번호로 인증번호가 발송되었습니다.',
        errorMessage: '인증번호를 다시 한 번 확인 후 입력해주세요.',
        successMessage: '인증완료',
        sendBtnName: '인증번호전송'
      }
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
      const wrapper = shallowMount(NsPhone, options)
      const vm = wrapper.vm

      // vm.테스트대상메소드명
      let testResult = vm.clearInputData()
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      testResult = vm.changeValue()
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      const inputObj = wrapper.find('input')
      inputObj.trigger('blur')
      inputObj.trigger('focusin')

      vm.resetVerificationState()

      // inputMixin.js 테스트
      let event = { target: { type: 'text', value: 0 } }
      const param = { value: '01099055545', maxlength: 10, type: 'tel' }
      vm.filterStringOut(event, param)
      vm.filterStringOut(event, param)

      event = { target: { type: 'number', value: 0 } }
      vm.filterStringOut(event, param)
      vm.removeOverLengthValue(event, param)
      vm.isPhonePattern(event, param)
    })
  })
})
