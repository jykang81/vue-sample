/**
 * 숫자를 제외한 문자 제거
 *
 * @param {string} value
 * @returns {string} 숫자가 제거된 문자
 */
function onlyNumFormat (value) {
  let temp = ''
  const afterStr = String(value)
  const len = afterStr.length
  let pos = 0
  let ch = ''
  while (pos < len) {
    ch = afterStr.charAt(pos)
    if (((ch >= '0') && (ch <= '9'))) {
      temp = temp + ch
    }
    pos = pos + 1
  }
  return temp
}

export default onlyNumFormat
