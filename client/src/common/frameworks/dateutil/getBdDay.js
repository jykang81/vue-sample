import getNowDate from '@frameworks/dateutil/getNowDate'
import getNowTime from '@frameworks/dateutil/getNowTime'

/**
 * 현재날짜와 시간을 기준으로 입력된 일시가 남아있으면 true리턴, 일시가 지나면 false
 * 입력된 data가 yyyyMMdd 형식의 8자리일 경우 시분초는 모두 0으로 세팅된다
 * 숫자형 문자열이 아니거나 잘릿수가 8혹은 14가 아니면 false를 리턴한다.
 * @param {String} strEnd (필수) yyyyMMdd혹은 yyyyMMddHHmmss 형식의 숫자형 문자열('-', ':' 형시은 허용)
 * @param {Boolean} [isToday=false] (선택) 오늘날자를 포함 여부 체크 (true인 경우 오늘 포함)
 * @returns {Boolean} 현일시기준으로 입력한 일시까지 남아 있을경우 true, 지났을 경우 false
 */
function getBdDay (strEnd, isToday = false) {
  let strTarget = strEnd
  strTarget = strTarget.replace(/ /gi, '')
  strTarget = strTarget.replace(/-/gi, '')
  strTarget = strTarget.replace(/:/gi, '')

  // 자릿수가 8 ~ 14 가 아니면 false 리턴
  if (strTarget.length !== 8 && strTarget.length !== 14) {
    return false
  }

  if (!Number(strTarget)) {
    return false
  }

  const strNowDate = getNowDate() + getNowTime()

  const strNyear = strNowDate.substring(0, 4)
  const strNmonth = strNowDate.substring(4, 6)
  const strNday = strNowDate.substring(6, 8)
  const strNhour = strNowDate.substring(8, 10)
  const strNminute = strNowDate.substring(10, 12)
  const strNsecond = strNowDate.substring(12, 14)

  const strTyear = strTarget.substring(0, 4)
  const strTmonth = strTarget.substring(4, 6)
  const strTday = strTarget.substring(6, 8)
  let strThour = strTarget.substring(8, 10) === '' ? '00' : strTarget.substring(8, 10)
  let strTminute = strTarget.substring(10, 12) === '' ? '00' : strTarget.substring(10, 12)
  let strTsecond = strTarget.substring(12, 14) === '' ? '00' : strTarget.substring(12, 14)

  if (isToday === true) {
    strThour = '23'
    strTminute = '59'
    strTsecond = '59'
  }

  const dtNow = new Date(strNyear, Number(strNmonth) - 1, strNday, strNhour, strNminute, strNsecond)
  const dtTarget = new Date(strTyear, Number(strTmonth) - 1, strTday, strThour, strTminute, strTsecond)

  return dtNow < dtTarget
}

export default getBdDay
