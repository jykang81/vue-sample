/**
 * 특수문자 포함여부
 *
 * @param {String} str 유효성 검사 문자열
 * @returns {Object} 포함여부 결과
 */
/**
 * 특수문자 체크
 */
function includeSpecialCharacter (str) {
  const pattern = /[!$%^&*()_+|~=`{}[\]:";'\\<>?,./]/
  const specialCharPattern = /&quot;|&amp;|&lt;|&gt;|&#60;|&#62;/

  if (!str || str.length === 0) {
    return false
  }
  return pattern.test(str) || specialCharPattern.test(str)
}

export default includeSpecialCharacter
