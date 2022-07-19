import nativeMarketingUtil from '@frameworks/nativeMarketingUtil'

describe('nativeMarketingUtil Native 브리지 함수 테스트', function () {
  before(function () {
    // console.log('블록 범위 내 모든 테스트 전에 실행')
    window.NSHub = {
      naGa360LoggerNativeSend (a, b) {
        console.log('call native naGoHome')
      },
      naAiquaLoggerNativeSend (a, b) {
        console.log('call native naBack')
      },
      naAirbridgeLoggerNativeSend (a, b) {
        console.log('call native naCloseWebView')
      }
    }
  })

  after(function () {
    // console.log('블록 범위 내 모든 테스트 후에 실행')
    window.NSHub = undefined
  })

  it('ga360LoggerNativeSend GA360 log', function () {
    const type = '1'
    const jsonObj = {}
    nativeMarketingUtil.ga360LoggerNativeSend(type, jsonObj)
  })

  it('aiquaLoggerNativeSend AIQUA log', function () {
    const type = '1'
    const jsonObj = {}
    nativeMarketingUtil.aiquaLoggerNativeSend(type, jsonObj)
  })

  it('airbridgeLoggerNativeSend AirBridge log', function () {
    const type = '1'
    const jsonObj = {}
    nativeMarketingUtil.airbridgeLoggerNativeSend(type, jsonObj)
  })
})
