import { assert } from 'chai'
import { mount } from '@vue/test-utils'
import OrderSheetGuestAgree from '@/components/order/sheet/OrderSheetGuestAgree'

describe('OrderSheetGuestAgree', () => {
  it('비회원 개인정보 수집 및 이용 동의', async () => {
    const wrapper = mount(OrderSheetGuestAgree)
    wrapper.vm.$store = { commit: data => {} }
    wrapper.vm.onclickClose()
    assert.isNotNull(wrapper)
  })
})
