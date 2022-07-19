import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ThingliveLive from '@/views/store/module/ThingliveLive'
import { livePlay } from '@unit/views/store/mock/thinglive'
import CONST from '@/common/constants/framework/framework'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import nsaxios from '@frameworks/axiosUtil'
import Vue from 'vue'

// $nsaxios 추가
Vue.prototype.$nsaxios = nsaxios

const responseData = livePlay.msg[0]._EZ_THING_LIVE[0]

describe('ThingliveLive', () => {
  // wrapper 생성
  const wrapper = shallowMount(ThingliveLive, {
    propsData: {
      responseData
    }
  })
  const vm = wrapper.vm

  describe('getThingliveLivePlay', () => {
    before(() => {
      const mock = new MockAdapter(axios)
      mock.onPost(`${CONST.API_URL}/NSFixedShopNoCacheCmd`)
        .reply(200, livePlay)
    })

    it('callback 확인', () => {
      vm.getThingliveLivePlay()
      assert.equal(vm.responseData, responseData)
    })
  })

  describe('onClickShareBtn', () => {
    it('emit 확인', () => {
      vm.onClickShareBtn()
      const testShareUrl = `https://${CONST.MOBILE_NSMALL_PATH}/media/thinglive/live-stream`
      const emitted = wrapper.emitted().onClickShareBtn[0][0]
      assert.equal(emitted.title, vm.livePlay.vodLiveGoodsNm)
      assert.equal(emitted.description, '')
      assert.equal(emitted.imageUrl, vm.livePlay.vodLiveImg)
      assert.equal(emitted.likeCount, 0)
      assert.equal(emitted.viewCount, 0)
      assert.equal(emitted.shareUrl, testShareUrl)
    })
  })

  describe('onClickRightOrderBtn', () => {
    it('emit 확인', () => {
      vm.onClickRightOrderBtn('12345678')
      assert.equal(wrapper.emitted().onClickRightOrderBtn[0], '12345678')
    })
  })

  describe('setRemainingTime', () => {
    it('remainingDttm이 null이 아닐 경우 확인', () => {
      vm.livePlay.remainingDttm = '20201231235900'
      vm.setRemainingTime()
      assert.isNotNull(vm.remainingTime)
    })
  })
})
