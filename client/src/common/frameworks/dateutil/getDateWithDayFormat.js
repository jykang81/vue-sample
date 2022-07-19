/**
 * 8자리 날짜 > M/dd(요일) 포맷으로 변환
 *
 * @param {String} inputDate (필수) 8자리 날짜
 * @returns {String} M/dd(요일)
 */
function getDateWithDayFormat (inputDate) {
  const week = ['일', '월', '화', '수', '목', '금', '토']
  const dt = `${inputDate.substring(4, 6)}/${inputDate.substring(6, 8)}/${inputDate.substring(0, 4)}`
  const date = new Date(dt)

  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${month}/${day}(${week[date.getDay()]})`
}

export default getDateWithDayFormat
