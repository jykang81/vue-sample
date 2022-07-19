import { assert } from 'chai'
import { mount } from '@vue/test-utils'
import MockAdapter from 'axios-mock-adapter'
import nsaxios from '@frameworks/axiosUtil'
import axios from 'axios'
import flushPromises from 'flush-promises'
import Vue from 'vue'
import CONST from '@constants/framework/framework'
import setNsTalkRollingMixin from '@/mixins/store/home/setNsTalkRollingMixin'
import { msgResponse } from '@unit/common/store/home/mock/setNsTalkRollingMixinResponse'

const initResponse = mock => {
  mock.onPost(`https://${CONST.NSTALK_THINGLIVE_PATH}/api/messages`)
    .reply(200, msgResponse)
  mock.onPost(`https://${CONST.NSTALK_TVLIVE_PATH}/api/messages`)
    .reply(200, msgResponse)
}

describe('setNsTalkRollingMixin', () => {
  let wrapper
  let vm
  let mock
  Vue.prototype.$nsaxios = nsaxios
  before(() => {
    axios.defaults.timeout = 100000
    mock = new MockAdapter(axios)
  })
  beforeEach(() => {
    mock.reset()
    initResponse(mock)
  })

  describe('setNsTalkRolling', () => {
    it('띵라이브 매장 조회', async () => {
      wrapper = mount(setNsTalkRollingMixin, {})
      vm = wrapper.vm
      vm.setNsTalkInfo('ting', 144, 20200918210000, 20201231235900)
      vm.setNsTalkRolling()
      await flushPromises()
      clearInterval(vm.nsTalkInterval)
      clearInterval(vm.nsTalkInfoInterval)
      assert.equal(vm.nsTalkCode, msgResponse.code)
      assert.equal(vm.nsTalkCount, msgResponse.count)
      assert.equal(vm.nsTalkEnable, msgResponse.talk_enable)
      for (let i = 0; i < vm.nsTalkMessage.length; i++) {
        assert.equal(vm.nsTalkMessage[i], msgResponse.messages[i].msg)
      }
    })
    it('TV 매장 조회', async () => {
      wrapper = mount(setNsTalkRollingMixin, {})
      vm = wrapper.vm
      vm.setNsTalkRollingForHome('tv', 2506942, 20200918210000, 20201231235900)
      await flushPromises()
      clearInterval(vm.nsTalkInterval)
      clearInterval(vm.nsTalkInfoInterval)
      assert.equal(vm.nsTalkCode, msgResponse.code)
      assert.equal(vm.nsTalkCount, msgResponse.count)
      assert.equal(vm.nsTalkEnable, msgResponse.talk_enable)
      for (let i = 0; i < vm.nsTalkMessage.length; i++) {
        assert.equal(vm.nsTalkMessage[i], msgResponse.messages[i].msg)
      }
    })
  })
})
