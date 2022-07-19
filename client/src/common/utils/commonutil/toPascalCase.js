/**
 * 문자열 PascalCase로 변환
 *
 * @param {string} value PascalCase로 변환할 문자열
 * @returns {String} PascalCase로 변환된 문자열
 */
const toPascalCase = val => {
  return val.match(/[a-z0-9]+/gi)
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    })
    .join('')
}

export default toPascalCase
