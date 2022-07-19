import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
// import store from '@/vuex' // 필수
// import router from '@/router' // 필수
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import flushPromises from 'flush-promises'
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

import { NAVER_CAPTCHA_CONST } from '@constants/customer/captcha'
import NaverVoiceCaptcha from '@components/customer/NaverVoiceCaptcha' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('NaverVoiceCaptcha.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null
  let mock

  const voiceUrl = `${NAVER_CAPTCHA_CONST.VOICE.API_URL}/getKey`
  const voiceMatchKeyUrl = `${NAVER_CAPTCHA_CONST.VOICE.API_URL}/matchKey`

  const voiceResult = 'No9UgysWbc2zzbG3'

  const voiceMatchKeyResult = {
    result: true
  }

  // mock axios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })

  beforeEach(function () {
    localVue = createLocalVue()
    Vue.prototype.$nsaxios = nsaxios
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // options 정의
    options = {
      localVue
    }

    mock.reset()
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : void 타입 테스트 코드 커버리지 용', () => {
    // 테스트 결과에 기대 조건 ... 대한 설명
    it('mounted Call', async () => {
      mock
        .onPost(voiceUrl)
        .reply(200, voiceResult)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(NaverVoiceCaptcha, options)
      const vm = wrapper.vm

      await flushPromises()

      await wrapper.vm.$nextTick()
      // console.log('naverVoiceCaptchaKey : ', vm.naverVoiceCaptchaKey)
      assert.notEqual('', vm.naverVoiceCaptchaKey)
    })

    it('handleClickButton Call', async () => {
      mock
        .onPost(voiceUrl)
        .reply(200, voiceResult)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(NaverVoiceCaptcha, options)
      const vm = wrapper.vm

      await flushPromises()

      await wrapper.vm.$nextTick()

      vm.handleClickButton()

      // console.log('naverVoiceCaptchaKey : ', vm.naverVoiceCaptchaKey)
      assert.equal('음성멈춤', vm.audioButtonName)
    })

    it('handleClickButton Call', async () => {
      mock
        .onPost(voiceUrl)
        .reply(200, voiceResult)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(NaverVoiceCaptcha, options)
      const vm = wrapper.vm

      await wrapper.vm.$nextTick()

      await flushPromises()

      vm.pauseSound()

      // console.log('naverVoiceCaptchaKey : ', vm.naverVoiceCaptchaKey)
      assert.equal('음성듣기', vm.audioButtonName)
    })

    it('matchNaverCaptchaValue Call', async () => {
      mock
        .onPost(voiceUrl)
        .reply(200, voiceResult)

      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(NaverVoiceCaptcha, options)
      const vm = wrapper.vm

      await flushPromises()

      await wrapper.vm.$nextTick()

      vm.captchaInputParams.value = ''

      vm.matchNaverCaptchaValue()
      assert.equal(true, vm.captchaInputParams.isError)

      mock
        .onPost(voiceMatchKeyUrl)
        .reply(200, voiceMatchKeyResult)

      vm.captchaInputParams.value = '1234'

      vm.matchNaverCaptchaValue()

      await flushPromises()

      await wrapper.vm.$nextTick()

      // console.log('naverVoiceCaptchaKey : ', vm.naverVoiceCaptchaKey)
      assert.equal(false, vm.captchaInputParams.isError)
    })
  })
})
