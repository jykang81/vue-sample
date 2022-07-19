/**
 * json 형변환 가능한 문자열인지 검증
 *
 * @param {string} text 문자열
 * @returns {boolean}
 */
function isJsonString (text) {
  try {
    const parsed = JSON.parse(text)

    return typeof (parsed) === 'object'
  } catch (e) {
    return false
  }
}

export default isJsonString
