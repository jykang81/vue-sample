import { mount } from '@vue/test-utils'
import NSPayIntro from '@/views/customer/nspay/NSPayIntro'
import router from '@/router'

describe('마이페이지 > NS페이 관리 > 인트로', () => {
  const options = {
    router
  }

  it('NS페이 등록하기 버튼 클릭', () => {
    const wrapper = mount(NSPayIntro, options)
    const nspayRegisterButtonWrapper = wrapper.find('.btn')
    nspayRegisterButtonWrapper.trigger('click')
  })
})
