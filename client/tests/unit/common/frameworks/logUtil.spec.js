import Vuex from 'vuex'
// import { assert } from 'chai'
// import store from '@/vuex'
import CONST from '@constants/framework/framework'
import { createLocalVue } from '@vue/test-utils'
import nslog from '@frameworks/logUtil'

describe('logUtil', function () {
  let localVue

  beforeEach(function () {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })

  describe('sendRecord', function () {
    it('로그 미전송 : type 파라미터 값이 undefined인 경우', () => {
      const type = undefined
      const errorMessage = '[logUtil.spec.js] Test Error Message'
      const errorStack = '[logUtil.spec.js] Test Error stack'
      nslog.sendRecord(type, CONST.LOG.MESSAGE.REQUEST.ERROR, errorMessage, errorStack)
    })

    it('로그 미전송 : args 파라미터 값의 length가 0인 경우', () => {
      const type = CONST.LOG.TYPE.ERROR
      nslog.sendRecord(type)
    })

    it('로그 미전송 : 개발모드인 경우', () => {
      CONST.IS_DEV_LOG = 'true'
      const errorMessage = '[logUtil.spec.js] Test Error Message'
      const errorStack = '[logUtil.spec.js] Test Error stack'
      nslog.sendRecord(CONST.LOG.TYPE.ERROR, CONST.LOG.MESSAGE.REQUEST.ERROR, errorMessage, errorStack)
    })

    it('로그 전송 : Error 로그 전송', () => {
      CONST.IS_DEV_LOG = 'false'
      const errorMessage = '[logUtil.spec.js] Test Error Message'
      const errorStack = '[logUtil.spec.js] Test Error stack'
      nslog.sendRecord(CONST.LOG.TYPE.ERROR, CONST.LOG.MESSAGE.REQUEST.ERROR, errorMessage, errorStack)
    })

    it('로그 전송 : WCS API 로그 전송', () => {
      const url = '[logUtil.spec.js] WCS API URL'
      const data = '[logUtil.spec.js] WCS API Data'
      const resultResponse = '[logUtil.spec.js] WCS API Response'
      nslog.sendRecord(CONST.LOG.TYPE.RESPONSE, url, data, resultResponse)
    })
  })
})
