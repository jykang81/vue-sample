/**
 * iframe 에서 parent 로 data 를 전달 받기위해 사용됨
 *
 * @param {object} vueObject 컴포넌트 인스턴스 (라이프사이클 접근용)
 * @param {Function} callback 실행될 callback 함수
 * @return {Function} postMessage 이벤트 제거를 위해 callback 리턴
 */
function iframeReceiveMessage (vueObject, callback) {
  const callbackFunction = e => {
    e.preventDefault()
    if (callback) {
      callback(e.data)
    }
  }
  window.addEventListener('message', callbackFunction)

  if (vueObject) {
    vueObject.$on('hook:deactivated', () => {
      window.removeEventListener('message', callbackFunction)
    })
    vueObject.$on('hook:beforeDestroy', () => {
      window.removeEventListener('message', callbackFunction)
    })
  }

  return callbackFunction
}

export default iframeReceiveMessage
