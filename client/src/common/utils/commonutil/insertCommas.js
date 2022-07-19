/**
 * 컴마삽입
 *
 * @param {*} value
 * @returns {string}
 */
function insertCommas (value) {
  let num = String(value).replace(/,/g, '')
  let prefix = ''
  if (num && num.charAt(0) === '-') {
    prefix = '-'
    num = num.substring(1)
  }

  if (num !== '') {
    num = Number(num)
    if (isNaN(num)) {
      num = 0
    }
  } else {
    num = 0
  }

  let result = ''
  const numStr = num.toString()
  for (let i = 0; i < numStr.length; i++) {
    const tmp = numStr.length - (i + 1)
    if (i % 3 === 0 && i !== 0) {
      result = `,${result}`
    }
    result = numStr.charAt(tmp) + result
  }
  return prefix + result
}

export default insertCommas
