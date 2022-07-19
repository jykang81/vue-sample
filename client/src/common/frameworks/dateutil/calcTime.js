import getNowDate from '@frameworks/dateutil/getNowDate'

/**
 * 시간 계산 함수
 * @param {String} calcTime 계산할 시간 (HHMMSS 만 사용)
 * @param {Number} hour 시
 * @param {Number} min 분
 * @param {Number} sec 초
 * @param {String} gubun 구분 ( before 와 after로 구분 )
 * @returns {Booelan} 계산된 시간이 현재 시간보다 지나지 않았으면 true 현재 시간을 지났으면 false
 */
function calcTime (calcTime, hour, min, sec, gubun) {
  // 계산시간이 숫자가 아니면 false
  if (!Number(calcTime)) {
    return false
  }

  // 길이는 무조건 6자리
  if (calcTime.length > 7) {
    return false
  }
  const calcDate = getNowDate() + calcTime

  const strCyear = calcDate.substring(0, 4)
  const strCmonth = calcDate.substring(4, 6)
  const strCday = calcDate.substring(6, 8)
  const strChour = calcDate.substring(8, 10)
  const strCminute = calcDate.substring(10, 12)
  const strCsecond = calcDate.substring(12, 14)

  const calc = new Date(strCyear, Number(strCmonth) - 1, strCday, strChour, strCminute, strCsecond)
  const now = new Date()

  switch (gubun) {
    case 'before' :
      calc.setHours(calc.getHours() - hour)
      calc.setMinutes(calc.getMinutes() - min)
      calc.setSeconds(calc.getSeconds() - sec)
      break
    case 'after' :
      calc.setHours(calc.getHours() + hour)
      calc.setMinutes(calc.getMinutes() + min)
      calc.setSeconds(calc.getSeconds() + sec)
      break
  }

  if (calc > now) {
    return true
  } else {
    return false
  }
}

export default calcTime
