import ThingliveLiveDetail from '@/views/media/ThingliveLiveDetail'
import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'
import { liveDetail } from '@unit/views/media/mock/thinglive'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'

// $nsaxios 추가
Vue.prototype.$nsaxios = nsaxios

describe('ThingliveLiveDetail', () => {
  const mock = new MockAdapter(axios)
  mock.onPost(`${CONST.API_URL}/NSThingLiveCmd`)
    .reply(200, liveDetail)

  const wrapper = shallowMount(ThingliveLiveDetail)
  const vm = wrapper.vm

  describe('computed', () => {
    it('commonUtil', () => {
      assert.isNotNull(vm.commonUtil)
    })
  })

  describe('methods', () => {
    describe('openDataWarning', () => {
      it('showDataWarning 확인', () => {
        vm.openDataWarning()
        assert.isTrue(vm.showDataWarning)
      })
      it('showPlayButton 확인', () => {
        vm.openDataWarning()
        assert.isFalse(vm.showPlayButton)
      })
      it('showRemainingTime 확인', () => {
        vm.openDataWarning()
        assert.isFalse(vm.showRemainingTime)
      })
    })

    describe('closeDataWarning', () => {
      it('showDataWarning 확인', () => {
        vm.closeDataWarning()
        assert.isFalse(vm.showDataWarning)
      })
      it('showPlayButton 확인', () => {
        vm.closeDataWarning()
        assert.isTrue(vm.showPlayButton)
      })
      it('showRemainingTime 확인', () => {
        vm.closeDataWarning()
        assert.isTrue(vm.showRemainingTime)
      })
    })

    describe('productLayerOpen', () => {
      it('showProductLayer 확인', () => {
        vm.productLayerOpen()
        assert.isTrue(vm.showProductLayer)
      })
    })

    describe('productLayerClose', () => {
      it('showProductLayer 확인', () => {
        vm.productLayerClose()
        assert.isFalse(vm.showProductLayer)
      })
    })
  })

  describe('destroyed', () => {
    it('wrapper destroy', () => {
      wrapper.destroy()
    })
  })
})
