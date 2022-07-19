// import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import ErrorPage from '@components/frameworks/ErrorPage'
import {
  sleep
} from '@utils/commonutil/commonUtil'

describe('ErrorPage', () => {
  let localVue
  let options
  let wrapper
  let vm

  before(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    options = {
      localVue,
      store,
      router
    }
  })

  beforeEach(() => {
    wrapper = mount(ErrorPage, options)
    vm = wrapper.vm
  })

  describe('goHome', () => {
    it('홈으로 이동한다', () => {
      vm.goHome()
    })
  })

  it('mount 후 3초 경과 시, 홈으로 이동한다', async () => {
    await sleep(3100)

    wrapper.vm.$destroy()
  })
})
