import ProductLayer from '@/components/media/ProductLayer'
import { livePlay } from '@unit/views/store/mock/thinglive'
import { assert } from 'chai'
import { shallowMount } from '@vue/test-utils'

const liveProd = livePlay.msg[0]._EZ_THING_LIVE[0]._vod_main_product

describe('ProductLayer', () => {
  const wrapper = shallowMount(ProductLayer, {
    propsData: {
      liveProd
    }
  })
  const vm = wrapper.vm

  describe('computed', () => {
    it('commonUtil', () => {
      assert.isNotNull(wrapper.vm.commonUtil)
    })
  })

  describe('methods', () => {
    it('layerClose ', () => {
      vm.layerClose()
      assert.equal(wrapper.emitted().layerClose.length, 1)
    })

    it('onClickRightOrderBtn', () => {
      vm.onClickRightOrderBtn('12345678')
      assert.equal(wrapper.emitted().clickRightOrderBtn[0], '12345678')
    })

    it('onClickConsultationRequestBtn', () => {
      vm.onClickConsultationRequestBtn('12345678')
    })

    it('thinsLiveProdTagging ', () => {
      vm.thinsLiveProdTagging(liveProd[0])
    })
  })
})
