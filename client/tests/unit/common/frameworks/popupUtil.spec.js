// import { assert } from 'chai'
import flushPromises from 'flush-promises'

import popupUtil from '@frameworks/popupUtil'
import COMM_CONST from '@constants/framework/constants'
import CONST from '@constants/framework/framework'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import NSAjaxEventPopupResponse from '@unit/common/frameworks/mock/NSAjaxEventPopupResponse'

describe('popupUtil', () => {
  describe('show & close', () => {
    it('팝업을 열고 닫는다', () => {
      const multiLayerParam = {
        title: '회원 가입'
      }

      const showMultiLayerCallback = callbackData => {

      }

      popupUtil.show('test/MultiModal1', multiLayerParam, showMultiLayerCallback)

      const callbackData = callbackData => {

      }

      popupUtil.close(callbackData)
    })
  })

  describe('openEventPopup', () => {
    let mock

    before(() => {
      mock = new MockAdapter(axios)

      const NSAjaxEventPopupURL = `${CONST.API_URL}/NSAjaxEventPopup`

      mock
        .onPost(NSAjaxEventPopupURL)
        .reply(200, NSAjaxEventPopupResponse)
    })

    after(() => {
      mock.reset()
    })

    it('로그인 타입의 이벤트 팝업을 호출한다', async () => {
      const params = {
        type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_LOGIN,
        okayCallback () {},
        partNumber: 26030598, // 테스트용 상품번호
        vendorId: 105964 // 테스트용 업체번호
      }

      popupUtil.openEventPopup(params)

      await flushPromises()
    })

    it('회원가입 타입의 이벤트 팝업을 호출한다', async () => {
      const params = {
        type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_REGIST,
        okayCallback () {},
        partNumber: 26030598, // 테스트용 상품번호
        vendorId: 105964 // 테스트용 업체번호
      }

      popupUtil.openEventPopup(params)

      await flushPromises()
    })

    it('메인 타입의 이벤트 팝업을 호출한다', async () => {
      const params = {
        type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_MAIN,
        okayCallback () {},
        partNumber: 26030598, // 테스트용 상품번호
        vendorId: 105964 // 테스트용 업체번호
      }

      popupUtil.openEventPopup(params)

      await flushPromises()
    })

    it('전시매장 타입의 이벤트 팝업을 호출한다', async () => {
      const params = {
        type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_EXHABIT,
        okayCallback () {},
        partNumber: 26030598, // 테스트용 상품번호
        vendorId: 105964 // 테스트용 업체번호
      }

      popupUtil.openEventPopup(params)

      await flushPromises()
    })

    it('상품상세 타입의 이벤트 팝업을 호출한다', async () => {
      const params = {
        type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_DETAIL,
        okayCallback () {},
        partNumber: 26030598, // 테스트용 상품번호
        vendorId: 105964 // 테스트용 업체번호
      }

      popupUtil.openEventPopup(params)

      await flushPromises()
    })
  })
})
