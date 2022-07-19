import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import AnimationPopup from '@/components/frameworks/AnimationPopup'

describe('AnimationPopup', () => {
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
    window.NSHub = true
  })
  it('Popup close', () => {
    const wrapper = mount(AnimationPopup, options)
    const vm = wrapper.vm
    vm.closePopup()
    assert.equal(vm.isShow, false)
  })
  it('App Popup Close', () => {
    const wrapper = mount(AnimationPopup, options)
    const vm = wrapper.vm
    vm.closePopupOnlyApp()
    assert.equal(vm.isShow, false)
  })
})
