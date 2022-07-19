/**
 * 문자열의 {Number} 부분을 파라미터로 치환한다
 *
 * @param {string} str 치환대상 문자열
 * @param {...string} args 치환할 문자열
 * @returns {string} 치환된 문자열
 */
function stringFormat (str, ...args) {
  for (let i = 0; i < args.length; i++) {
    const re = new RegExp(`\\{${i}\\}`, 'g')
    str = str.replace(re, args[i])
  }
  return str
}

export default stringFormat
