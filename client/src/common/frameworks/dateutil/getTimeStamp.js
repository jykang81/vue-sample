/**
 * yyyyMMddHHmmssSSSS 반환
 *
 * @param {String} noMilisec (필수) millisecond 사용 여부
 * @returns {String} 현재 날짜, 시간
 */
function getTimeStamp (noMilisec) {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  let milisec = date.getMilliseconds()

  let m = 0
  let d = 0
  let h = 0
  let mi = 0
  let s = 0

  if (month < 10) {
    m = `0${month}`
  } else if (month >= 10) {
    m = String(month)
  }

  if (day < 10) {
    d = `0${day}`
  } else if (day >= 10) {
    d = String(day)
  }

  if (hour < 10) {
    h = `0${hour}`
  } else if (hour >= 10) {
    h = String(hour)
  }

  if (min < 10) {
    mi = `0${min}`
  } else if (min >= 10) {
    mi = String(min)
  }

  if (sec < 10) {
    s = `0${sec}`
  } else if (sec >= 10) {
    s = String(sec)
  }

  if (Math.floor(milisec / 10) === 0) {
    milisec = `00${milisec}`
  } else if (Math.floor(milisec / 100) === 0) {
    milisec = `0${milisec}`
  }

  return year + m + d + h + mi + s + (noMilisec ? '' : milisec)
}

export default getTimeStamp
