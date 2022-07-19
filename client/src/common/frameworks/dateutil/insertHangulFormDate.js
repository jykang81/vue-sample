import { isNull } from '@utils/commonutil/commonUtil'

/**
 * 한글형식의 날짜로 변환 ex) 19990101 => 1999년 1월 1일
 *
 * @param {string} strDate (필수) 날짜 yyyyMMdd
 * @returns {string} 한글형식의 날짜
 */
function insertHangulFormDate (strDate) {
  if (isNull(strDate) || strDate.length < 8) {
    return ''
  }
  const year = strDate.substr(0, 4)
  let month = strDate.substr(4, 2)
  let day = strDate.substr(6, 2)

  if (Number(month) < 10) {
    month = month.replace('0', '')
  }

  if (Number(day) < 10) {
    day = day.replace('0', '')
  }

  return `${year}년${month}월${day}일`
}

export default insertHangulFormDate
