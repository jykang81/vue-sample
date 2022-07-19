import ThingliveVodDetail from '@/views/media/ThingliveVodDetail'
import { shallowMount } from '@vue/test-utils'
import router from '@/router' // 필수
import nsaxios from '@frameworks/axiosUtil'
import { assert } from 'chai'
import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import CONST from '@constants/framework/framework'
import { vodDetail } from '@unit/views/media/mock/thinglive'

// $nsaxios 추가
Vue.prototype.$nsaxios = nsaxios

describe('ThingliveVodDetail', () => {
  const mock = new MockAdapter(axios)
  mock.onPost(`${CONST.API_URL}/NSThingLiveCmd`)
    .reply(200, vodDetail)

  const options = {
    router
  }
  const wrapper = shallowMount(ThingliveVodDetail, options)
  const vm = wrapper.vm

  describe('computed', () => {
    it('dataUtil', () => {
      assert.isNotNull(vm.dataUtil)
    })
  })

  describe('methods', () => {
    describe('onClickVodNext 함수', () => {
      it('loadVideoPlayer 확인', () => {
        vm.onClickVodNext()
        assert.isFalse(vm.loadVideoPlayer)
      })
    })
    describe('openDataWarning 함수', () => {
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

    describe('closeDataWarning 함수', () => {
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
    describe('onClickShareBtn 함수', () => {
      it('함수 호출 확인', () => {
        vm.onClickShareBtn('1', '12345678')
      })
    })
    describe('setLikeCount  함수', () => {
      it('함수 호출 확인, type이 1일 때', () => {
        vm.setLikeCount('1')
      })
      it('함수 호출 확인, type이 2일 때', () => {
        vm.setLikeCount('2')
      })
    })
    describe('setPlayLog  함수', () => {
      it('함수 호출 확인', () => {
        vm.setPlayLog()
      })
    })
  })
})
