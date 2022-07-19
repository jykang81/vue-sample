import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'
import ThingliveBeforeAfter from '@/views/store/module/ThingliveBeforeAfter'
import { livePlay } from '@unit/views/store/mock/thinglive'

describe('ThingliveBeforeAfter', () => {
  describe('이전 방송 일 때', () => {
    // wrapper 생성
    const wrapper = shallowMount(ThingliveBeforeAfter, {
      propsData: {
        responseData: livePlay.msg[0]._EZ_THING_LIVE[0],
        type: 'prev'
      }
    })

    it('setThingliveBeforeAfter', async () => {
      await wrapper.vm.setThingliveBeforeAfter()
      assert.notEqual(wrapper.vm.beforeAfterProd, [])
    })
  })

  describe('다음 방송 일 때', () => {
    // wrapper 생성
    const wrapper = shallowMount(ThingliveBeforeAfter, {
      propsData: {
        responseData: livePlay.msg[0]._EZ_THING_LIVE[0],
        type: 'prev'
      }
    })

    it('setThingliveBeforeAfter', async () => {
      await wrapper.vm.setThingliveBeforeAfter()
      assert.notEqual(wrapper.vm.beforeAfterProd, [])
    })
  })
})
