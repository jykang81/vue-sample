
import ThingliveMain from '@/views/store/ThingliveMain'
import { shallowMount } from '@vue/test-utils'
import { assert } from 'chai'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'

// $nsaxios 추가
Vue.prototype.$nsaxios = nsaxios

describe('ThingliveMain', () => {
  const wrapper = shallowMount(ThingliveMain)
  const vm = wrapper.vm

  describe('computed', () => {
    it('floatingClass1', () => {
      vm.pgmMenuFloating = true
      assert.equal(vm.floatingClass, 'floating')
    })
    it('floatingClass1', () => {
      vm.pgmMenuFloating = false
      assert.equal(vm.floatingClass, '')
    })
  })

  describe('methods', () => {
    it('onClickShareBtn', () => {
      const testUrl = 'https://test.nsmall.com'
      vm.onClickShareBtn(testUrl)
    })
  })

  describe('beforeDestroy', () => {
    it('wrapper destroy', () => {
      wrapper.destroy()
    })
  })
})
