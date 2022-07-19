import Vuex from 'vuex'
// import { assert } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/vuex'
import DataWarning from '@components/product/DataWarning'

describe('DataWarning', () => {
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

  describe('methods', () => {
    it('closeDataWarning method', async function () {
      const wrapper = shallowMount(DataWarning, options)
      wrapper.vm.closeDataWarning()

      wrapper.emitted()
    })
    it('playVideo method', async function () {
      const wrapper = shallowMount(DataWarning, options)
      wrapper.vm.playVideo()

      wrapper.emitted()
    })
  })
})
