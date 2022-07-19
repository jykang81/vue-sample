import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수

import ScrollPicker from '@components/common/ScrollPicker' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('ScrollPicker.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // 프로퍼티 파라메터 정의
    const propsParmas = [
      { value: 1, name: 'item 1', selected: false },
      { value: 2, name: 'item 2', selected: false },
      { value: 3, name: 'item 3', selected: false },
      { value: 4, name: 'item 4', selected: true },
      { value: 5, name: 'item 5', selected: false },
      { value: 6, name: 'item 6', selected: false },
      { value: 7, name: 'item 7', selected: false }
    ]

    options = {
      localVue,
      router,
      store,
      propsData: {
        itemList: propsParmas
      }
    }
  })

  // 여기서부터는 테스트 할 메소드 디스크립션
  describe('method : void 타입 테스트 코드 커버리지 용', () => {
    // 테스트 결과에 기대 조건 ... 대한 설명
    it('화면에 관련된 함수라 결과는 없다.', async () => {
      // 테스트 대상 컴포넌 명 입력
      const wrapper = shallowMount(ScrollPicker, options)
      const vm = wrapper.vm

      // vm.테스트대상메소드명
      const testResult = vm.initData()
      // console.log('testResult : ', testResult)
      // 테스트한 결과를 조건에 따라 확인한다.
      assert.equal(null, testResult)
      vm.bindTouchEvents()
      vm.bindMouseEvents()
      vm.currentPosY = 10
      vm.startPosY = 0
      vm.endTime = 20
      vm.startTime = 0
      vm.currentTranslatedY = 96
      vm.moveProcess(10)
      // await wrapper.vm.$nextTick()

      vm.itemList = 10

      wrapper.find('ul').trigger('mousedown')
      wrapper.find('ul').trigger('mouseup')
      wrapper.find('ul').trigger('mouseleave')
      wrapper.find('ul').trigger('mousemove')
      wrapper.find('ul').trigger('wheel')
    })
  })
})
