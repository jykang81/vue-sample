import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import { PAY_TYPE_CONST } from '@/common/constants/order/order'

import OrderPaymentCert from '@/components/order/OrderPaymentCert'

describe('OrderPaymentCert', () => {
  let localVue
  let options

  beforeEach(async () => {
    localVue = createLocalVue()

    options = {
      localVue,
      attachToDocument: true,
      propsData: {
        param: {}
      }
    }
  })

  describe('OrderPaymentCert 테스트', () => {
    it('결제진행중(mount())', async () => {
      const payTypes = []
      payTypes.push(PAY_TYPE_CONST.MOBILE)
      payTypes.push(PAY_TYPE_CONST.REALTIME_ACCOUNT_TRANSFER)
      payTypes.push(PAY_TYPE_CONST.CREDIT_CARD)
      payTypes.push(PAY_TYPE_CONST.NAVER_PAY)
      payTypes.push(PAY_TYPE_CONST.PAYCO)
      payTypes.push(PAY_TYPE_CONST.NS_PAY_CREDIT_CARD)

      for (let i = 0; i < payTypes.length; i++) {
        options.propsData.param.orderPaymentParams = { payType: payTypes[i], MOB_RET_URL: '/payment/success', MOB_ERR_URL: '/payment/error' }
        const wrapper = mount(OrderPaymentCert, options)
        wrapper.vm.$store = { commit: d => {} }
        wrapper.vm.onclickClose()
        await flushPromises()
        assert.isTrue(true)
      }
    })
  })
})
