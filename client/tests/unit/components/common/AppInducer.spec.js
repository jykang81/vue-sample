import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import AppInducer from '@/components/common/AppInducer'

describe('AppInducer', () => {
  let localVue
  let options

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    options = {
      localVue,
      store,
      router
    }

    window.airbridge.setDeeplinks = () => {}
  })

  it('handlePopupClosingClick', () => {
    const wrapper = mount(AppInducer, options)
    const vm = wrapper.vm

    vm.handlePopupClosingClick()
    assert.isTrue(true)
  })
})
