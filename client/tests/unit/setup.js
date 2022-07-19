require('jsdom-global')(undefined, { url: 'https://local.nsmall.com:3000' })
const Audio = require('./mock/Audio')
const IntersectionObserver = require('./mock/IntersectionObserver')

global.localStorage = window.localStorage
global.sessionStorage = window.sessionStorage
global.crypto = {
  getRandomValues: () => 1
}
window.Date = Date
window.scrollTo = () => {}
window.pageYOffset = 0
window.performance = {}
window.scroll = () => {}
window.open = () => {}
window.setTimeout = () => {}
window.close = () => {}

// 마케팅 스크립트 부분
// GA 360
window.ga = () => {}
window.marketingRoute = {
  name: 'testGa360',
  fullPath: '/test/test-ga360-log',
  meta: {
    title: 'GA 360',
    depth: '아키텍처>테스트>GA 360'
  }
}

// Recobell
window._eglconf = {}
window._eglconf.forceTrackVisit = true
window.eglc = {}
window.eglc.op = () => {}
window.eglc.clearData = () => {}

// 네이버 프리미엄 로그
window.wcs = {}
window.wcs.inflow = () => {}
window.wcs.cnv = () => {}
window.wcs_do = () => {}

// Airbridge
window.airbridge = {}
window.airbridge.init = () => {}
window.airbridge.events = {}
window.airbridge.events.signUp = () => {}
window.airbridge.events.signIn = () => {}
window.airbridge.events.signOut = () => {}
window.airbridge.events.homeViewEvent = () => {}
window.airbridge.events.productDetailsViewEvent = () => {}
window.airbridge.events.productListViewEvent = () => {}
window.airbridge.events.searchResultViewEvent = () => {}
window.airbridge.events.addedToCart = () => {}
window.airbridge.events.purchased = () => {}
window.airbridge.events.send = () => {}

// AIQUA
window.AIQUA = () => {}
window.AIQUA.init = {
  appId: '966ef26ddcc00f25775f',
  timeout: 5000
}
window.qg = () => {}

// DTSI
window.dlight = {}
window.dlight.sendConversion = () => {}

// 홈쇼핑 모아
// window.buzzni_rt = {}
// window.buzzni_rt.setDevelop = () => {}
// 마케팅 스크립트 부분

Element.prototype.offsetTop = 0
Element.prototype.style = { maxHeight: 0 }
Element.prototype.scrollHeight = 0
Element.prototype.scrollIntoView = () => {}
Element.prototype.call = () => {}
Element.prototype.scrollTo = () => {}

// 테스트를 위해 document.cookie의 getter 및 setter를 재정의
(function (document) {
  Object.defineProperty(window, 'opener', {
    value: {
      vm: {
        callbackResult: params => {},
        callbackNspayPasswordChangeResult: params => {},
        callbackNspayPasswordResult: params => {},
        callbackNspayInfoResult: params => {},
        certSuccess: params => {},
        recoverCertSuccess: params => {},
        snsDataCallBack: params => {},
        callbackName: ''
      }
    },
    writable: true
  })

  let cookies = {}
  document.__defineGetter__('cookie', function () {
    const output = []
    for (const cookieName in cookies) {
      if (Object.prototype.hasOwnProperty.call(cookies, cookieName)) {
        output.push(`${cookieName}=${cookies[cookieName]}`)
      }
    }
    return output.join(';')
  })
  document.__defineSetter__('cookie', function (s) {
    const indexOfSeparator = s.indexOf('=')
    const key = s.substr(0, indexOfSeparator)
    const value = s.substring(indexOfSeparator + 1)
    cookies[key] = value
    return `${key}=${value}`
  })
  document.clearCookies = function () {
    cookies = {}
  }
})(document)

/** mock intersection observer */
global.IntersectionObserver = IntersectionObserver

/** mock audio */
global.Audio = Audio
