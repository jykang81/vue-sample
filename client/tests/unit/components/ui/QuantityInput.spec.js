import { assert } from 'chai' // 필수
import { shallowMount, createLocalVue } from '@vue/test-utils' // 필수
import VueRouter from 'vue-router' // 필수
import Vuex from 'vuex' // 필수
import store from '@/vuex' // 필수
import router from '@/router' // 필수

import QuantityInput from '@components/common/QuantityInput' // 테스트 할 대상 컴포넌트

// 필수 테스트 할 대상 파일명을 넣음
describe('QuantityInput.vue에 대한 테스트 케이스', () => {
  let localVue = null
  let options = null
  let wrapper = null
  let vm = null
  const INIT_QUANTITY = 2 // 초기 수량 2
  const MAX_QUANTITY = 3 // 최대 수량 3

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    localVue.use(VueRouter)

    // 프로퍼티 파라메터 정의
    options = {
      localVue,
      router,
      store,
      propsData: {
        params: {
          value: INIT_QUANTITY,
          max: MAX_QUANTITY
        }
      }
    }

    // 테스트 대상 컴포넌트 명 입력
    wrapper = shallowMount(QuantityInput, options)
    vm = wrapper.vm
  })

  it('수량 minus 테스트', async () => {
    // 수량 minus
    vm.minus() // 실행 후 수량 1

    // change emit 실행 확인
    assert.ok(wrapper.emitted().change)

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량 1로 변경됨 확인
    assert.equal(vm.value, 1)

    // 수량 minus
    vm.minus() // 실행 후 수량 1

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량 0이 아닌 1로 변경없음 확인
    assert.equal(vm.value, 1)
  })

  it('수량 plus 테스트', async () => {
    // 수량 2번 plus
    vm.plus() // 실행 후 수량 3
    vm.plus() // 실행 후 수량 4가 되야하지만 max가 3이다

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량이 4가 아닌 3임을 확인
    assert.equal(vm.value, MAX_QUANTITY)
  })

  it('키 입력 검증 테스트', async () => {
    vm.validChange({
      keyCode: 65, // 숫자가 아닌 'a' 입력
      target: {
        value: 'a' // a
      },
      preventDefault: () => {
        // Nothing to do
      }
    })

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량이 그대로 2인 것을 확인
    assert.equal(vm.value, INIT_QUANTITY)
  })

  it('공백 입력 테스트', async () => {
    vm.change({
      target: {
        value: ''
      }
    })

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량이 그대로 2인 것을 확인
    assert.equal(vm.value, INIT_QUANTITY)
  })

  it('숫자 0 입력 테스트', async () => {
    vm.change({
      target: {
        value: '0'
      }
    })

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량이 그대로 2인 것을 확인
    assert.equal(vm.value, INIT_QUANTITY)
  })

  it('현재 수량과 동일한 수량 입력 테스트', async () => {
    // 현재 수량과 동일한 수량 입력 (수량 2)
    vm.change({
      target: {
        value: '2'
      }
    })

    // DOM 업데이트 대기
    await vm.$nextTick()

    // max 수량이 그대로 2인 것을 확인
    assert.equal(vm.value, INIT_QUANTITY)
  })

  it('수량 변경 테스트', async () => {
    // 수량 1 입력
    vm.change({
      keyCode: 48, // 숫자 1 keycoe
      target: {
        value: '1' // 수량 1
      }
    })

    // DOM 업데이트 대기
    await vm.$nextTick()

    // 수량 1로 변경 확인
    assert.equal(vm.value, 1)
  })

  it('수량 변경 테스트 (max 값 도달)', async () => {
    // 수량 9 입력
    vm.change({
      keyCode: 57, // 숫자 9 keycoe
      target: {
        value: '9' // 수량 9
      }
    })

    // DOM 업데이트 대기
    await vm.$nextTick()

    // max 수량이 3이므로 9가 아닌 3으로 변경됨 확인
    assert.equal(vm.value, MAX_QUANTITY)
  })

  it('최대 구매 가능 수량 도달 시 토스트 메시지', async () => {
    vm.maxToastAlert()
  })
})
