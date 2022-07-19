import format from '@frameworks/dateutil/format'

/**
 * 시작일에서 특정 년,월,일이 +,- 된 날짜를 구함
 *
 * @param {string} startDate (필수) 시작일
 * @param {string} year (필수) 계산할 년 수
 * @param {string} month (필수) 계산할 월 수
 * @param {string} week (필수) 계산할 주 수
 * @param {string} day (필수) 계산할 일 수
 * @param {String} [dateFormat='yyyy-MM-dd'] (선택) 출력할 날짜 포맷
 * @returns {string} 계산된 날짜
 *
 * calcDate('', 0, 0, 0, 0,'yyyy.MM.dd');  //오늘
 * calcDate('', 0, 0,-1, 0,'yyyy.MM.dd');  // Week-1
 * calcDate('', 0, 0, 0,-15,'yyyy.MM.dd');   // day-15
 * calcDate('', 0,-1, 0, 0,'yyyy.MM.dd');    // month-1
 */
function calcDate (startDate, year, month, week, day, dateFormat = 'yyyy-MM-dd') {
  let dtReturn

  if (startDate.length < 1) { // 빈 문자열
    dtReturn = new Date()
  } else if (startDate instanceof Date) { // Date 객체
    dtReturn = new Date(startDate)
  } else { // 문자열 날짜 (safari 및 아이폰 대응용)
    dtReturn = new Date(startDate.replace(/\s/g, 'T'))
  }

  if (year !== 0) {
    dtReturn.setYear(dtReturn.getFullYear() + year)
  }

  if (month !== 0) {
    dtReturn.setMonth(dtReturn.getMonth() + month)
  }

  if (week !== 0) {
    day += (week * 7)
  }

  if (day !== 0) {
    dtReturn.setDate(dtReturn.getDate() + day)
  }

  return format(dtReturn, dateFormat)
}

export default calcDate
