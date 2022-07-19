/**
 * 문자열 마스킹처리
 *
 * @param {String, Number, Number} 마스킹대상문자열, 마스킹처리없이 노출되는 길이, 최대 노출 길이
 * @returns {String}
 */
function getMaskingStr (str, len = 3, max = 6) {
  return str.slice(0, len) + (len < max ? '*'.repeat(max - len) : '')
}

export default getMaskingStr
