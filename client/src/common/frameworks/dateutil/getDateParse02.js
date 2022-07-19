/**
 * 특정 날짜 Date Type으로 파싱 (분 or 초를 자동으로 붙임)
 *
 * @param {String} date (필수) 특정 날짜 ex) '2020123100'
 * @returns {Date} 특정 날짜
 */
function getDateParse02 (date) {
  let dateStr = date
  if (date.length === 10) {
    dateStr = `${date}0000`
  } else if (date.length === 12) {
    dateStr = `${date}00`
  }

  // 한달 범위 오류로 인해 수정
  const month = Number(dateStr.substring(4, 6)) - 1

  return new Date(dateStr.substring(0, 4), month, dateStr.substring(6, 8), dateStr.substring(8, 10), dateStr.substring(10, 12), dateStr.substring(12, 14))
}

export default getDateParse02
