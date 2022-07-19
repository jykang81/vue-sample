import { isNull } from '@utils/commonutil/commonUtil'

/**
 * 날짜형식 체크
 *
 * @param {String} dateStr - 8자리 날짜 문자열
 * @returns {Boolean} 날짜형식 여부
 */
function isDate (dateStr) {
  if (isNull(dateStr) || dateStr.length < 8) {
    return false
  }
  dateStr = dateStr.replace(/-/gi, '')

  const year = Number(dateStr.substr(0, 4))
  const month = Number(dateStr.substr(4, 2))
  const day = Number(dateStr.substr(6, 2))

  if (month < 1 || month > 12) { // check month range
    return false
  }

  if (day < 1 || day > 31) {
    return false
  }

  if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
    return false
  }

  if (month === 2) { // check for february 29th
    const isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0))
    if (day > 29 || (day === 29 && !isleap)) {
      return false
    }
  }

  return true
}

export default isDate
