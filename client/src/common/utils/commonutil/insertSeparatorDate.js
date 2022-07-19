import isNull from '@utils/commonutil/isNull'

/**
 * yyyymmdd 형식을 yyyy-mm-dd 로변경한다.
 *
 * @param {String} yyyymmdd
 * @returns {String}}
 */
function insertSeparatorDate (strDate) {
  if (isNull(strDate) || strDate.length < 8) {
    return ''
  }
  const year = strDate.substr(0, 4)
  const month = strDate.substr(4, 2)
  const day = strDate.substr(6, 2)
  return `${year}-${month}-${day}`
}

export default insertSeparatorDate
