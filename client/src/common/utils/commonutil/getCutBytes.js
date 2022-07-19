/**
 * 문자열을 특정 바이트 숫자 만큼만 리턴한다.
 *
 * @param {string} value - 문자열
 * @param {*} maxVal - byte
 * @returns {string}
 */
function getCutBytes (value, maxVal) {
  const str = value
  let l = 0
  let maxLength = 0

  for (let i = 0; i < str.length; i++) {
    l += (str.charCodeAt(i) > 128) ? 2 : 1

    if (l > maxVal) {
      break
    } else {
      maxLength = i
    }
  }

  return value.substring(0, maxLength + 1)
}

export default getCutBytes
