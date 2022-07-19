/**
 * iframe 에서 parent 로 data 를 전달한다.
 *
 * @param {String} 실행 구분 값  cmd - {cmd: 'callback', params: data}
 * @param {Object} 전달할 data - {cmd: 'callback', params: data}
 * @returns {void}
 */
function iframePostMessage (cmd = '', data = null) {
  const parent = window.parent
  parent.postMessage({ cmd, params: data }, window.location.origin)
}

export default iframePostMessage
