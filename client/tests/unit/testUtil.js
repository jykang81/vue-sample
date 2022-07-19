import qs from 'qs'
import { setWCSCommonParameter } from '@frameworks/axiosUtil'
import nativeUtil from '@frameworks/nativeUtil'
import sinon from 'sinon'

/**
 * parameter 반환 함수 (WCS http request 용도)
 *
 * @param {string} method (필수) 요청 종류 ex) get, post, etc...
 * @param {Object} param (필수) 요청 파라미터
 * @returns {string} 가공 파라미터 반환 (querystring 형식)
 */
function getProcessedWCSParameter (method, param) {
  if (method !== 'get') {
    setWCSCommonParameter(param)
  }

  return qs.stringify(param, { arrayFormat: 'repeat' })
}

/**
 * mock util 생성
 * @param {Object} util
 * @returns {Object}
 */
function createMockUtil (util) {
  const keys = Object.keys(util)

  const mockUtil = {}
  for (const key of keys) {
    mockUtil[key] = () => {}
  }

  return mockUtil
}

const nativeTestUtil = {
  sandbox: sinon.createSandbox(),
  setMockNativeUtil () {
    this.sandbox.restore()
    window.NSHub = {}
    this.sandbox.stub(nativeUtil)
  },
  clearMockNativeUtil () {
    window.NSHub = undefined
    this.sandbox.restore()
  }
}

const testUtil = {
  getProcessedWCSParameter,
  createMockUtil
}

export { testUtil as default, getProcessedWCSParameter, nativeTestUtil }
