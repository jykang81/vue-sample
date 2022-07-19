import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import rightOrderMixin from '@/mixins/product/rightOrderMixin'

describe('rightOrderMixin 믹스인', () => {
  const wrapper = shallowMount(rightOrderMixin)
  const vm = wrapper.vm

  describe('onClickRightOrderBtn 함수', () => {
    vm.onClickRightOrderBtn('12345678')

    it('globalVal.partNumber 값 확인', done => {
      done()
      assert.equal(vm.globalVal.partNumber, '12345678')
    })
    it('finishedSetParamFlag 값 확인', done => {
      done()
      assert.isTrue(vm.finishedSetParamFlag)
    })
  })

  describe('rightOrderLayerOpen 함수', () => {
    vm.rightOrderLayerOpen()

    it('anchorLayer 값 확인', done => {
      done()
      assert.isTrue(vm.anchorLayer)
    })
  })

  describe('rightOrderLayerClose 함수', done => {
    vm.rightOrderLayerClose()

    it('anchorLayer 값 확인', done => {
      done()
      assert.isFalse(vm.anchorLayer)
    })
    it('finishedSetParamFlag 값 확인', done => {
      done()
      assert.isFalse(vm.finishedSetParamFlag)
    })
  })
})
