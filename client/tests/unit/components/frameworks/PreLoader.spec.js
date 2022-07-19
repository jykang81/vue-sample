import Vuex from 'vuex'
import { assert } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import PreLoader from '@components/frameworks/PreLoader'

const createOpiton = isShow => {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const store = new Vuex.Store({
    state: {
      preLoader: {
        isShow
      }
    }
  })

  return {
    store,
    localVue
  }
}

describe('PreLoader', () => {
  describe('state.preLoader.isShow 상태 정적 확인', () => {
    it('숨김 상태일 때 연관 DOM이 없다', () => {
      // given
      // store.state.preLoader.isShow = false
      const options = createOpiton(false)

      // when
      const wrapper = shallowMount(PreLoader, options)

      // then
      assert.equal(wrapper.findAll('div').exists(), false)
    })

    it('표시 상태일 때 연관 DOM이 있다', () => {
      // given
      // store.state.preLoader.isShow = true
      const options = createOpiton(true)

      // when
      const wrapper = shallowMount(PreLoader, options)

      // then
      assert.include(wrapper.classes(), 'pre_loader')
    })
  })

  describe('state.preLoader.isShow 상태 동적 확인', () => {
    it('상태가 변할 때 연관 DOM이 동적으로 변한다', async () => {
      // given
      // store.state.preLoader.isShow = false
      const options = createOpiton(false)

      // when
      const wrapper = shallowMount(PreLoader, options)

      // then
      assert.equal(wrapper.findAll('div').exists(), false)

      // given
      const vm = wrapper.vm
      vm.$store.state.preLoader.isShow = true

      // when
      await vm.$nextTick()

      // then
      assert.include(wrapper.classes(), 'pre_loader')
    })
  })
})
