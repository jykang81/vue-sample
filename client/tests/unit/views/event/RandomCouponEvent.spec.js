import { mount, createLocalVue } from '@vue/test-utils'
import RandomCouponEvent from '@/views/event/RandomCouponEvent'
import { assert } from 'chai'
import { getEventHtml } from '@unit/views/event/mock/randomcoupon'

import {
  htmlDecode
} from '@utils/commonutil/commonUtil'

// 본문에서 $nsaxios 사용 시 추가
import Vue from 'vue'
import nsaxios from '@frameworks/axiosUtil'

// router 추가
import VueRouter from 'vue-router'
const localVue = createLocalVue()

Vue.prototype.$nsaxios = nsaxios
localVue.use(VueRouter)
const router = new VueRouter()
let wrapper = null

describe('RandomCouponEvent', function () {
  // using beforeEach to ensure we have a clean wrapper before each test.
  beforeEach(() => {
    wrapper = mount(RandomCouponEvent, {
      localVue,
      router
    })
    router.history.current.params.offerId = getEventHtml.msg.eventDetail.offerIdfr
  })

  it('eventHtml 업데이트 후, UI 정상 노출 확인', async function () {
    assert.notInclude(wrapper.text(), '랜덤쿠폰')
    wrapper.vm.eventHtml = htmlDecode(getEventHtml.msg.eventDetail.dweditcont)
    await Vue.nextTick()
    assert.include(wrapper.text(), '랜덤쿠폰')
  })

  it('setRepeatImg 함수 실행 후, intervalId 정상 생성 확인', function () {
    document.body.innerHTML = htmlDecode(getEventHtml.msg.eventDetail.dweditcont)
    assert.isNull(wrapper.vm.intervalId)
    wrapper.vm.setRepeatImg()
    assert.isNotNull(wrapper.vm.intervalId)
  })
})
