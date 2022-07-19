import isNull from '@utils/commonutil/isNull'

/**
 * 문자열의 특정 문자 혹은 문자열 치환
 *
 * @param {String} ment - 치환 대상 문자열
 * @param {String} regex - 치환할 문자열
 * @param {String} replacement - 치환될 문자열
 * @returns {string}
 */
function replaceAll (ment, regex, replacement) {
  if (isNull(ment)) {
    return ment
  }
  if (isNull(regex)) {
    return ment
  }
  if (isNull(replacement)) {
    return ment
  }

  let tmpStr = ment
  while (tmpStr.indexOf(regex) !== -1) {
    tmpStr = tmpStr.replace(regex, replacement)
  }
  return tmpStr
}

export default replaceAll
