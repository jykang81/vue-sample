import ProductList from '@/components/media/ProductList'
import { beforeAfter } from '@unit/views/store/mock/thinglive'
import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'

const productList = beforeAfter.msg[0]._EZ_THING_LIVE_VODDUEPROGRAM[0].nextLive._vod_main_product

describe('ProductList 컴포넌트', () => {
  describe('1) parentInfo : null', () => {
    let wrapper
    let vm

    before(() => {
      wrapper = shallowMount(ProductList, {
        propsData: {
          productList,
          productMoreBtn: true,
          rightOrderBtn: false
        }
      })

      vm = wrapper.vm
    })

    describe('computed', () => {
      it('commonUtil', () => {
        assert.isNotNull(vm.commonUtil)
      })
    })

    describe('methods', () => {
      it('onToggleList', () => {
        vm.onToggleList()
      })

      it('productClickLogging', () => {
        vm.productClickLogging('12345678')
      })

      it('onClickRightOrderBtn', () => {
        vm.onClickRightOrderBtn('12345678')
        assert.equal(wrapper.emitted().onClickRightOrderBtn[0], '12345678')
      })

      it('onClickConsultationRequestBtn', () => {
        vm.onClickConsultationRequestBtn('12345678')
      })
    })
  })

  describe('2) parentInfo : ThingLive', () => {
    let wrapper
    let vm

    before(() => {
      wrapper = shallowMount(ProductList, {
        propsData: {
          productList,
          productMoreBtn: true,
          rightOrderBtn: false,
          parentInfo: 'ThingLive'
        }
      })

      vm = wrapper.vm
    })

    describe('methods', () => {
      it('onToggleList', () => {
        vm.onToggleList()
      })

      it('productClickLogging', () => {
        vm.productClickLogging('12345678')
      })
    })
  })

  describe('3) parentInfo : next', () => {
    let wrapper
    let vm

    before(() => {
      wrapper = shallowMount(ProductList, {
        propsData: {
          productList,
          productMoreBtn: true,
          rightOrderBtn: false,
          parentInfo: 'next'
        }
      })

      vm = wrapper.vm
    })

    describe('methods', () => {
      it('onToggleList', () => {
        vm.onToggleList()
      })

      it('productClickLogging', () => {
        vm.productClickLogging('12345678')
      })
    })
  })

  describe('4) parentInfo : prev', () => {
    let wrapper
    let vm

    before(() => {
      wrapper = shallowMount(ProductList, {
        propsData: {
          productList,
          productMoreBtn: true,
          rightOrderBtn: false,
          parentInfo: 'prev'
        }
      })

      vm = wrapper.vm
    })

    describe('methods', () => {
      it('onToggleList', () => {
        vm.onToggleList()
      })

      it('productClickLogging', () => {
        vm.productClickLogging('12345678')
      })
    })
  })

  describe('5) parentInfo : Highlight', () => {
    let wrapper
    let vm

    before(() => {
      wrapper = shallowMount(ProductList, {
        propsData: {
          productList,
          productMoreBtn: true,
          rightOrderBtn: false,
          parentInfo: 'Highlight'
        }
      })

      vm = wrapper.vm
    })

    describe('methods', () => {
      it('onToggleList', () => {
        vm.onToggleList()
      })

      it('productClickLogging', () => {
        vm.productClickLogging('12345678')
      })
    })
  })
})
