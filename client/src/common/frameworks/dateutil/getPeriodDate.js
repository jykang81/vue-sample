import getDateParse02 from '@frameworks/dateutil/getDateParse02'

/**
 * 오늘날짜와 입력한 날짜의 차이 기간에 따라 특정 결과를 리턴한다
 *
 * @param {String} date (필수) 입력한 날짜
 * @param {String} gunbunValue (필수) 출력 구분값
 * @param {Number} saleRate (선택) 할인율
 * @returns
 */
function getPeriodDate (date, gunbunValue, saleRate) {
  date = date.replace(/[.-]/g, '')
  date = date.replace(/:/g, '')
  date = date.replace(/(\s*)/g, '')
  saleRate = isNaN(saleRate) === true ? 0 : saleRate

  const msecPerMinute = 1000 * 60
  const msecPerHour = msecPerMinute * 60
  const msecPerDay = msecPerHour * 24

  const now = new Date()
  const dday = getDateParse02(date) // 원하는 날짜, 시간 정확하게 초단위까지 기입.
  const interval = dday.getTime() - now.getTime()

  const days = interval / msecPerDay
  let daysRound = Math.floor(days)
  const hours = interval / msecPerHour - (24 * daysRound)
  let hoursRound = Math.floor(hours)
  const minutes = interval / msecPerMinute - (24 * 60 * daysRound) - (60 * hoursRound)
  let minutesRound = Math.floor(minutes)
  const seconds = interval / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound)
  let secondsRound = Math.round(seconds)

  if (Number(daysRound) < 10 && (Math.sign(Number(daysRound)) === 1)) {
    daysRound = `0${daysRound}`
  }
  hoursRound = Number(hoursRound) < 10 ? `0${hoursRound}` : hoursRound
  minutesRound = Number(minutesRound) < 10 ? `0${minutesRound}` : minutesRound
  secondsRound = Number(secondsRound) < 10 ? `0${secondsRound}` : secondsRound

  let htmlTxt = `<p class="d_date">D- <span>${daysRound}</span>일 <span>${hoursRound}</span>:<span>${minutesRound}</span></p>`
  if (saleRate >= 90) {
    htmlTxt += '<span class="tag item-feature soldout"><span class="head">매진임박</span></span>'
  }
  if (daysRound === '00') {
    htmlTxt += '<span class="tag item-feature deadline"><span class="head">마감임박</span></span>'
  }

  // gunbunValue 값에 따라 htmlFormat 구조 추가 하여 수정
  switch (gunbunValue) {
    case 'days' : return daysRound
    case 'hours' : return hoursRound
    case 'minutes' : return minutesRound
    case 'seconds' : return secondsRound
    case 'htmlFormat' : return htmlTxt
    case 'json' : return { day: daysRound, hour: hoursRound, minute: minutesRound, second: secondsRound, html: htmlTxt }
    default: break
  }
}

export default getPeriodDate
