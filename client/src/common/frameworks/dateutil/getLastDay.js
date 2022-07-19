/**
 * 달을 입력받아 마지막 날짜를 리턴
 *
 * @param {String or Number} pYear 마지막날짜 리턴받을 년
 * @param {String or Number} pMonth 마지막날짜 리턴받을 월
 * @returns {Number} 마지막날짜
 */
function getLastDay (pYear, pMonth) {
  const lastDay = (new Date(pYear, pMonth, 0)).getDate()
  return lastDay
}

export default getLastDay
