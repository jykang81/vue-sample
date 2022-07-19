import Vuex from 'vuex'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import ContainerFullLayer from '@components/frameworks/ContainerFullLayer'
import store from '@/vuex'

describe('ContainerFullLayer', () => {
  describe('ContainerFullLayer', () => {
    let localVue
    let options

    beforeEach(function () {
      localVue = createLocalVue()
      localVue.use(Vuex)
      options = {
        localVue,
        store
      }
    })

    it('store에 full layer 팝업이 없으면, false를 반환한다', async () => {
      const wrapper = shallowMount(ContainerFullLayer, options)
      const vm = wrapper.vm

      vm.$store.state.popup.popupList = []
      await vm.$nextTick()
    })
  })
})
