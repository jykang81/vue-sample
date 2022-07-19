/**
 * ms 만큼 대기
 * @param {number} ms - 대기시간
 * @returns {Promise}
 */
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default sleep
