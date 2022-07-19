import NSPayRegister from '@/views/customer/nspay/NSPayRegister'
import { mount } from '@vue/test-utils'

describe('마이페이지 > NS페이 관리 > 결제수단 등록', () => {
  it('신용/체크카드 버튼 클릭', () => {
    const wrapper = mount(NSPayRegister, {})
    const nspayCardRegisterButtonWrapper = wrapper.find('.card button')
    nspayCardRegisterButtonWrapper.trigger('click')
  })
})

describe('마이페이지 > NS페이 관리 > 결제수단 등록', () => {
  it('계좌이체 버튼 클릭', () => {
    const wrapper = mount(NSPayRegister, {})
    const nspayAccountRegisterButtonWrapper = wrapper.find('.account button')
    nspayAccountRegisterButtonWrapper.trigger('click')
  })
})
