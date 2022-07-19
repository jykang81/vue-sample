/**
 * 입력한 두 날짜 사이의 개월 수 가 넘는지 계산하여 true/false 값을 리턴
 *
 * @param {string} startDate 시작 날짜 [dateFormat='yyyyMMdd']
 * @param {string} endDate 종료 날짜 [dateFormat='yyyyMMdd']
 * @param {number} month 기준 개월 수
 * @returns {boolean} 입력한 두 날짜 사이의 개월 수 가 month를 넘는지 여부 (안 넘으면 true, 넘었으면 false)
 */
function checkPeriodMonth (startDate, endDate, month) {
  startDate = startDate.replace(/[.-]/g, '')
  endDate = endDate.replace(/[.-]/g, '')

  const startDateYear = startDate.substring(0, 4)
  const startDateMonth = startDate.substring(4, 6)
  const startDateDay = startDate.substring(6, 8)

  const endDateYear = endDate.substring(0, 4)
  const endDateMonth = endDate.substring(4, 6)
  const endDateDay = endDate.substring(6, 8)

  const yearGap = endDateYear - startDateYear
  const monthGap = endDateMonth - startDateMonth
  const dayGap = endDateDay - startDateDay

  if ((yearGap * 12) + monthGap < month) {
    return true
  } else if ((yearGap * 12) + monthGap > month) {
    return false
  } else {
    return dayGap <= 0
  }
}

export default checkPeriodMonth
