/**
 * 금액에서 콤마 등 특수문자 제거(소숫점, 마이너스기호 제외)
 *
 * @param {*} value
 * @returns {string}
 */
function moneyUnformat (value) {
  let temp = ''
  const afterStr = String(value)
  const len = afterStr.length
  let pos = 0
  let ch = ''
  while (pos < len) {
    ch = afterStr.charAt(pos)
    if (((ch >= '0') && (ch <= '9')) || (ch === '-') || (ch === '.')) {
      temp = temp + ch
    }
    pos = pos + 1
  }
  return temp
}

export default moneyUnformat
