import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수

import NsCalendar from '@components/common/NsCalendar' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('NsCalendar.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // 프로퍼티 파라메터 정의
    const propsParmas = {
      titleName: '기간설정',
      isYearUsed: true,
      isMonthUsed: true,
      isDayUsed: true,
      startYear: 2010,
      endYear: 2020,
      setDate: '2019-07-05'
    }

    options = {
      localVue,
      router,
      store,
      propsData: {
        param: propsParmas
      }
    }
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : void 타입 테스트 코드 커버리지 용', () => {
    // 테스트 결과에 기대 조건 ... 대한 설명
    it('화면에 관련된 함수라 결과는 없다.', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(NsCalendar, options)
      const vm = wrapper.vm

      // vm.테스트대상메소드명
      const testResult = vm.closeCalendar('ok')

      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)

      // await wrapper.vm.$nextTick()
    })
  })
})
