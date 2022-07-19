/**
 * 현재 날짜와 입력 날짜의 기간차 년/월/일/시간 중 가장 최근 값 반환
 *
 * @param {string} date - YYYYMMDDHHMMSS (ex. 20181019180230)
 * @returns {string} 포맷팅된 값 반환 (1시간 전/ 1일 전/ 1주 전/ 1달 전/ 1년 전)
 */
function vodDateDiff (date) {
  var HOUR = 1 * 60 * 60 * 1000
  var DAY = 1 * 24 * 60 * 60 * 1000
  var WEEK = 7 * 24 * 60 * 60 * 1000
  var MONTH = 30 * 24 * 60 * 60 * 1000
  var YEAR = 365 * 24 * 60 * 60 * 1000
  var nowDate = new Date()

  var vodYear = date.substring(0, 4) * 1
  var vodMonth = date.substring(4, 6) * 1
  var vodDay = date.substring(6, 8) * 1
  var vodHour = date.substring(8, 10) * 1
  var vodMin = date.substring(10, 12) * 1

  var vodDate = new Date(vodYear, vodMonth - 1, vodDay, vodHour, vodMin)

  var diff = nowDate - vodDate
  var dateString

  if (diff < DAY) {
    diff = parseInt(diff / HOUR, 10) === 0 ? 1 : parseInt(diff / HOUR, 10)
    dateString = `${diff}시간 전`
    return dateString
  } else if (diff < WEEK) {
    diff = parseInt(diff / DAY, 10)
    dateString = `${diff}일 전`
    return dateString
  } else if (diff < MONTH) {
    diff = parseInt(diff / WEEK, 10)
    dateString = `${diff}주 전`
    return dateString
  } else if (diff < YEAR) {
    diff = parseInt(diff / MONTH, 10)
    dateString = `${diff}달 전`
    return dateString
  } else {
    diff = parseInt(diff / YEAR, 10)
    dateString = `${diff}년 전`
    return dateString
  }
}

export default vodDateDiff
