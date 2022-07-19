import { assert } from 'chai'
import { mount } from '@vue/test-utils'
import ThingliveBanner from '@/views/store/module/ThingliveBanner'
import { liveBanner } from '@unit/views/store/mock/thinglive'
import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'

describe('ThingliveBanner', () => {
  // swiper 사용
  Vue.use(VueAwesomeSwiper)

  // wrapper 생성
  const wrapper = mount(ThingliveBanner, {
    propsData: {
      responseData: liveBanner.msg.espotList[0]._EZ_THING_LIVE_CNTNT
    }
  })

  it('setThingliveBanner', async () => {
    await wrapper.vm.setThingliveBanner()
    assert.equal(wrapper.vm.liveBanner, liveBanner.msg.espotList[0]._EZ_THING_LIVE_CNTNT)
  })

  it('computed', async () => {
    assert.isNotNull(wrapper.vm.bizUtil)
  })
})
