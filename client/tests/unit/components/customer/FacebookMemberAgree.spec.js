import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import facebookMemberAgree from '@components/customer/FacebookMemberAgree'

describe('facebookMemberAgree', () => {
  describe('layerPopup', () => {
    let localVue
    let options

    beforeEach(function () {
      localVue = createLocalVue()
      localVue.use(Vuex)
      options = {
        localVue,
        propsData: {
          param: {
            agreeDate: '2020년 7월 20일',
            isSms: '동의',
            isisEmailSms: '미동의',
            isTel: '동의',
            mallUserGuide: '&lt;H5 id=SA-001-01&gt;제1조 목적&lt;/H5&gt;&lt;P&gt;이 약관의 목적은 주식회사 엔에스쇼핑(이하 회사)이 운영하는 nsmall(이하 ns모바일 등 무선을 이용하는 전자상거래를 포함하여 몰이라 통칭)에서 제공하는 인터넷 관련 서비스(이하 서비스)를 회원 또는 비회원(이하 고객)이 이용함과 관련하여 몰과 고객에 적용되는 제 기준 및 원칙을 정함에 있습니다'
          }
        }
      }
    })

    it('isAgreeTerms값 확인', () => {
      // when
      const wrapper = mount(facebookMemberAgree, options)
      const vm = wrapper.vm

      const returnResult = vm.isAgreeTerms

      // then
      assert.equal(true, returnResult)
    })
  })
})
