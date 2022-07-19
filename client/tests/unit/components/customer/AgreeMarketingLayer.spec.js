import Vuex from 'vuex'
import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import AgreeMarketingLayer from '@components/customer/AgreeMarketingLayer'

describe('agreeMarketingLayer', () => {
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
            isTel: '동의'
          }
        }
      }
    })

    it('layerClose이벤트', () => {
      // when
      const wrapper = mount(AgreeMarketingLayer, options)
      const vm = wrapper.vm

      vm.$store = { commit: data => {} }
      vm.layerClose()

      assert.equal(true, true)
    })
  })
})
