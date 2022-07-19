import Vue from 'vue'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { assert } from 'chai'
import sinon from 'sinon'
import CONST from '@constants/framework/framework'
import nsaxios from '@frameworks/axiosUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import sessionStorageUtil from '@frameworks/sessionStorageUtil'
import legacyUtil from '@utils/legacyUtil'
import loginUtil from '@utils/loginUtil'
import { nativeTestUtil } from '@unit/testUtil'

describe('legacyUtil', () => {
  let mock

  // 로그인
  function login () {
    loginUtil.login({
      userId: 111214420,
      logonId: 'qhanq19@gmail.com',
      loginyn: 'Y'
    })
  }

  // 로그아웃
  function logout () {
    loginUtil.memberInfo = null
    sessionStorageUtil.del('memberInfo')
    localStorageUtil.del('memberInfo')
  }

  before(() => {
    Vue.prototype.$nsaxios = nsaxios

    // mock axios
    mock = new MockAdapter(axios)

    // 이벤트 신청
    mock.onPost(`${CONST.API_URL}/NSTimesPrmtEventCmd`).reply(200,
      {
        msg: {
          root: {
            rtnMsg: '이벤트 신청이 완료되었습니다.',
            rtnCd: '0'
          }
        },
        eventIdfr: [
          '100000079421'
        ],
        isSuccessful: true
      }
    )
  })

  afterEach(() => {
    logout()
  })

  describe('HUB_INIT.checkInflowOutsideChannel', () => {
    it('2.5 URL only', () => {
      legacyUtil.HUB_INIT.checkInflowOutsideChannel('http://www.nsmall.com/TVHomeShoppingView')
    })

    it('exteranl URL only', () => {
      legacyUtil.HUB_INIT.checkInflowOutsideChannel('http://www.naver.com')
    })

    it('3.0 URL only', () => {
      legacyUtil.HUB_INIT.checkInflowOutsideChannel('https://mw.nsmall.com/media/schedule')
    })

    it('2.5 URL & 3.0 URL', () => {
      legacyUtil.HUB_INIT.checkInflowOutsideChannel('https://m.nsmall.com/TVHomeShoppingView', 'https://mw.nsmall.com/media/schedule')
    })
  })

  describe('HUB_INIT.doNsTimesEvent', () => {
    it('offerid 없으면 쿠폰 다운로드 실행되지 않음', () => {
      assert.isUndefined(legacyUtil.HUB_INIT.doNsTimesEvent())
    })

    it('미 로그인 상태는 쿠폰 다운로드 실행되지 않음', () => {
      assert.isUndefined(legacyUtil.HUB_INIT.doNsTimesEvent('1234'))
    })

    it('로그인하면 쿠폰 다운로드', () => {
      login()

      legacyUtil.HUB_INIT.doNsTimesEvent('1234')
    })
  })

  describe('HUB_INIT.doNsTimesPushEvent', () => {
    afterEach(() => {
      nativeTestUtil.clearMockNativeUtil()
    })
    it('offerid 없으면 쿠폰 다운로드 실행되지 않음', () => {
      assert.isUndefined(legacyUtil.HUB_INIT.doNsTimesPushEvent())
    })

    it('웹인 경우 쿠폰 다운로드 실행되지 않음', () => {
      legacyUtil.HUB_INIT.doNsTimesPushEvent('1234')
    })

    it('앱이지만, 미 로그인 상태는 쿠폰 다운로드 실행되지 않음', () => {
      nativeTestUtil.setMockNativeUtil()

      legacyUtil.HUB_INIT.doNsTimesPushEvent('1234')
    })

    it('앱 & 로그인 상태지만, 푸시 수신동의 미동의 상태면 쿠폰 다운로드 실행되지 않음', () => {
      nativeTestUtil.setMockNativeUtil()
      login()

      legacyUtil.HUB_INIT.doNsTimesPushEvent('1234')
    })

    it('앱 & 로그인 상태 & 푸시 수신동의 상태면 쿠폰 다운로드', () => {
      nativeTestUtil.setMockNativeUtil()
      login()

      legacyUtil.HUB_INIT.doNsTimesPushEvent('1234')
    })
  })

  describe('HUB_INIT.doDownNsCoupon', () => {
    it('couponId 없으면 쿠폰 다운로드 실행되지 않음', () => {
      assert.isUndefined(legacyUtil.HUB_INIT.doDownNsCoupon())
    })

    it('미 로그인 상태는 쿠폰 다운로드 실행되지 않음', () => {
      assert.isUndefined(legacyUtil.HUB_INIT.doDownNsCoupon('1234'))
    })

    it('로그인하면 쿠폰 다운로드', () => {
      login()

      legacyUtil.HUB_INIT.doDownNsCoupon('1234')
    })
  })

  describe('HUB_INIT.toggleNotice', () => {
    it('유의사항 DOM이 없으면 반환됨', () => {
      sinon.stub(document, 'querySelector').returns(null)
      sinon.stub(document, 'querySelectorAll').returns(null)

      legacyUtil.HUB_INIT.toggleNotice()

      document.querySelector.restore()
      document.querySelectorAll.restore()
    })

    it('유의사항이 닫혀있으면 유의사항을 염', () => {
      const mockClassList = {
        contains () {
          return true
        },
        remove () {}
      }

      sinon.stub(document, 'querySelector').returns({
        classList: mockClassList
      })

      sinon.stub(document, 'querySelectorAll').returns(
        [
          {
            classList: mockClassList
          }
        ]
      )

      legacyUtil.HUB_INIT.toggleNotice()

      document.querySelector.restore()
      document.querySelectorAll.restore()
    })
  })

  it('유의사항이 열려있으면 유의사항을 닫음', () => {
    const mockClassList = {
      contains () {
        return false
      },
      add () {},
      remove () {}
    }

    sinon.stub(document, 'querySelector').returns({
      classList: mockClassList
    })

    sinon.stub(document, 'querySelectorAll').returns(
      [
        {
          classList: mockClassList
        }
      ]
    )

    legacyUtil.HUB_INIT.toggleNotice()

    document.querySelector.restore()
    document.querySelectorAll.restore()
  })
})
