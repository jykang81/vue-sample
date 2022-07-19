import {
  mount,
  createLocalVue
} from '@vue/test-utils'
import {
  assert
} from 'chai'
import Vue from 'vue'
import router from '@/router'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import nsaxios from '@frameworks/axiosUtil'
import flushPromises from 'flush-promises'
import SelectProductLayer from '@components/custcenter/SelectProductLayer'
import {
  NSMypageCmd
} from '@unit/components/custcenter/mock/Response'

describe('SelectProductLayer', () => {
  let mock
  const localVue = createLocalVue()

  Vue.prototype.$nsaxios = nsaxios

  const options = {
    localVue,
    router
  }

  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios) // mock axios
  })

  beforeEach(() => {
    mock.reset() // reset mock adapter
  })

  it('goOrderDetail', () => {
    const wrapper = mount(SelectProductLayer, options)
    wrapper.vm.goOrderDetail('12345')
  })

  it('getOrderList', async () => {
    const wrapper = mount(SelectProductLayer, options)

    mock
      .onPost(`${CONST.API_URL}/NSMypageCmd`)
      .reply(200, NSMypageCmd)

    wrapper.vm.getOrderList()
    await flushPromises()

    assert.equal(Array.isArray(wrapper.vm.pageDataset), true)
  })

  it('orderList', () => {
    const wrapper = mount(SelectProductLayer, options)

    wrapper.vm.pageDataset = NSMypageCmd.msg.root.orders

    assert.equal(Array.isArray(wrapper.vm.orderList), true)
  })
})
