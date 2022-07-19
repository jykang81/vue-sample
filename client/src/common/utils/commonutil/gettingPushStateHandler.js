import nativeUtil from '@frameworks/nativeUtil'

/**
 * 푸시 동의 상태 조회 및 후처리기 (webview 전용)
 * @param {Object} opitons 처리기 옵션
 * @param {Function} opitons.callback 푸시 동의 상태 조회 후처리 콜백
 * @param {Object} [options.params] 콜백 파라미터
 * @param {String} [opitons.name] 전역에 바인딩 되는 콜백 이름 (브릿지 매개용)
 */
function gettingPushStateHandler (options) {
  const { callback, params, name = 'pushStateHandler' } = options

  // validation
  if (typeof callback !== 'function') {
    return
  }

  window[name] = callback // 콜백 전역 바인딩 (브릿지용)

  // 콜백 매개변수 설정
  const defaultParams = {
    pushState: 'N'
  }

  let actualParams
  if (!params) {
    actualParams = defaultParams
  } else {
    if (!params.pushState) {
      params.pushState = 'N'
    }

    actualParams = params
  }
  const stringifiedParams = JSON.stringify(actualParams)

  nativeUtil.getPushAgreeYn(stringifiedParams, name)
}

export default gettingPushStateHandler
