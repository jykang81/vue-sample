/**
 * 문자열 총 바이트 수 구하기(한글, 영문 모두 가능)
 *
 * @param {string} value - 문자열
 * @returns {number} 총 바이트
 */
function getBytes (value) {
  const str = value
  let l = 0
  for (let i = 0; i < str.length; i++) {
    l += (str.charCodeAt(i) > 128) ? 2 : 1
  }
  return l
}

export default getBytes
