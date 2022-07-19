/**
 * 문자를 입력받아 문자의 앞을 0으로 채운다
 *
 * @param {String or Number} str (필수) 0을 채울 문자
 * @param {Number} len (필수) 0을 채우고 난 후의 문자의 길이
 * @returns {string} 0으로 채워진 문자열
 */
function zf (str, len) {
  str += ''

  if (len > str.length) {
    return '0'.repeat(len - str.length) + str
  } else {
    return str
  }
}

export default zf
