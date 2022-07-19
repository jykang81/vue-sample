/**
 * 현재 날짜
 *
 * @param {string} [separator=''] (필수) 날짜 구분자
 * @returns {String} 현재 날짜
 */
function getNowDate (separator = '') {
  const now = new Date()
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const date = ((now.getDate() < 10) ? '0' : '') + now.getDate()
  return now.getFullYear() + separator + months[now.getMonth()] + separator + date
}

export default getNowDate
