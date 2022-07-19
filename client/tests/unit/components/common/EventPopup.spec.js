import { assert } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'
import store from '@/vuex'
import router from '@/router'
import EventPopup from '@components/common/EventPopup'
import popupUtil from '@frameworks/popupUtil'

describe('EventPopup', () => {
  let localVue
  let wrapper
  let vm
  let callbackResult = null

  const eventPopupList = [{
    coCd: '110',
    popAreaLv1: '04',
    popAreaLv2: '',
    popAreaValue: '',
    popCont: '&lt;IMG onclick="javascript:HUB_INIT.doDownNsCoupon(\'100000030251\');" style="CURSOR: pointer" name=downpopCoupon src="http://image.nsmall.com/ec_comimages/nsupload/xplat/2018/20180307/8508404827064216.jpg"&gt;',
    popHeight: 500,
    popLeftMargin: 500,
    popOpenGb: '01',
    popScrollYn: 'Y',
    popTitle: '모바일 다운로드용 쿠폰 개발_테스트_상품상세',
    popTopMargin: 500,
    popWidth: 500,
    seq: 42
  }]

  const okayCallback = () => {
    callbackResult = true
  }

  const cancelCallback = () => {
    callbackResult = false
  }

  const params = {}

  const props = {
    msg: eventPopupList,
    okCb: okayCallback,
    canCb: cancelCallback || null,
    okTxt: params.okTxt || null,
    canTxt: params.canTxt || null,
    topScroll: params.top || null,
    close: true,
    type: 'event'
  }

  before(async () => {
    localVue = createLocalVue()
    localVue.use(Vuex)

    wrapper = mount(EventPopup, {
      localVue,
      store,
      router,
      propsData: {
        param: props
      }
    })

    await flushPromises()

    vm = wrapper.vm
  })

  beforeEach(() => {
    callbackResult = null

    popupUtil.show('common/EventPopup', props)
  })

  describe('handleNoWatchToday', () => {
    it('오늘 하루 더보지 않기 요소에 바인딩 된 콜백이 실행된다.', () => {
      vm.handleNoWatchToday()

      assert.isTrue(callbackResult)
    })
  })

  describe('handleClose', () => {
    it('닫기 요소에 바인딩 된 콜백이 실행된다.', () => {
      vm.handleClose()

      assert.isFalse(callbackResult)
    })
  })
})
