import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import OrderNspayCert from '@/components/order/OrderNspayCert'
import { nativeTestUtil } from '@unit/testUtil'

describe('OrderNspayCert', () => {
  let localVue
  let options

  beforeEach(async () => {
    localVue = createLocalVue()

    options = {
      localVue,
      attachToDocument: true,
      propsData: {
        param: { orderNspayParams: {} }
      }
    }
  })

  describe('OrderNspayCert 테스트', () => {
    it('비밀번호 변경(created())', async () => {
      options.propsData.param.orderNspayParams = { sendFlag: 'chgPW', MOB_RET_URL: '/payment/success', MOB_ERR_URL: '/payment/error' }
      const wrapper = mount(OrderNspayCert, options)
      wrapper.vm.$store = { commit: d => {} }
      wrapper.vm.init()
      await flushPromises()
      assert.isTrue(true)
    })
    it('비밀번호 확인(created())', async () => {
      options.propsData.param.orderNspayParams = { sendFlag: 'checkPW', MOB_RET_URL: '/payment/success', MOB_ERR_URL: '/payment/error' }
      const wrapper = mount(OrderNspayCert, options)
      wrapper.vm.$store = { commit: d => {} }
      wrapper.vm.init()
      await flushPromises()
      assert.isTrue(true)
    })
    it('NS페이약관(created())', async () => {
      options.propsData.param.orderNspayParams = { sendFlag: undefined, MOB_RET_URL: '/payment/success', MOB_ERR_URL: '/payment/error' }
      const wrapper = mount(OrderNspayCert, options)
      wrapper.vm.$store = { commit: d => {} }
      wrapper.vm.init()
      await flushPromises()
      assert.isTrue(true)
    })
    it('비밀번호 변경-App(created())', async () => {
      nativeTestUtil.setMockNativeUtil()

      options.propsData.param.orderNspayParams = { sendFlag: 'chgPW', MOB_RET_URL: '/payment/success', MOB_ERR_URL: '/payment/error' }
      const wrapper = mount(OrderNspayCert, options)
      wrapper.vm.$store = { commit: d => {} }
      wrapper.vm.init()
      await flushPromises()
      assert.isTrue(true)

      nativeTestUtil.clearMockNativeUtil()
    })
  })
})
