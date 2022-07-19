/**
 * 현재 날짜에 특정 년/월/일을 더한 날짜를 return
 *
 * @param {String} flag (필수) 년/월/일 flag
 * @param {Number} num (필수) 년/월/일에 얼마만큼 더할 것인지
 * @returns {String} 현재 날짜에 num 만큼 더해진 날짜
 */
function getAddDate (flag, num) {
  const now = new Date()
  switch (flag) {
    case 'year': now.setFullYear(now.getFullYear() + num)
      break
    case 'month' : now.setMonth(now.getMonth() + num)
      break
    case 'day' : now.setDate(now.getDate() + num)
      break
    default: break
  }
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const date = ((now.getDate() < 10) ? '0' : '') + now.getDate()
  return now.getFullYear() + months[now.getMonth()] + date
}

export default getAddDate
