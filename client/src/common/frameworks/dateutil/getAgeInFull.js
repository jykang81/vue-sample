import checkPeriodMonth from '@frameworks/dateutil/checkPeriodMonth'
import getAddDate from '@frameworks/dateutil/getAddDate'

/**
 * 년월일 형식의 생일을 입력 받아 만나이를 계산해 리턴한다.
 * bAgeChk의 값이 true로 입력될경우 만 14세 이상인지 리턴한다.
 *
 * @param {String} birthday (필수) 년월일 생일(yyyymmdd or yyyy-mm-dd 형식)
 * @param {Boolean} bAgeChk (필수) true가 들어올경우 만 14세이상인지 판당하여 이상일 경우 true리턴, 만 14세 미만일 경우 false 리턴한다.
 * @param {number} [pAge=14] (선택) 기준 나이 값 미 입력이 만14세를 기준으로 한다. 미입력시 혹은 true가 아닐경우 만14세 여부 판단 안함.
 * @param {Boolean} [pAgeInFull=false] (선택)  만 나이 체크시 생년 만 가지고 체크 할것인지 생년월일 까지 체크 할것인지 (fasle || 미입력 : 생년월일까지 체크 / true : 생년만 체크)
 * @returns {Boolean} bAgeChk값이 true로 입력된 경우 만 14세 이상일 경우 true 리턴, 미만은 false 리턴
 * @returns {Number} bAgeChk값이 미입력 혹은 true가 아닌경우 만나이 계산하여 리턴
 */
function getAgeInFull (birthday, bAgeChk, pAge = 14, pAgeInFull = false) {
  birthday = birthday.replace(/-/g, '')
  const year = birthday.substr(0, 4)
  const month = birthday.substr(4, 2)
  const day = birthday.substr(6, 2)

  const now = new Date()
  let birth = new Date(year, month, day)

  if (pAgeInFull) {
    birth = new Date(year)
  }

  const result = Math.floor((now - birth) / 1000 / 60 / 60 / 24 / 365)

  // 오늘 날짜와, 생일 날짜의 차이가 만 14세 개월 수( 14 * 12) 보다 1일이라도 초과 시 false, 아니면 true
  let isChild
  if (pAgeInFull) {
    isChild = checkPeriodMonth(`${year}0000`, getAddDate('day', 1), pAge * 12)
  } else {
    isChild = checkPeriodMonth(birthday, getAddDate('day', 1), pAge * 12)
  }

  // 만 14세 이상인가 판단 (기준나이 변경시 비교 숫자 변경 필요)
  return bAgeChk ? !isChild : result
}

export default getAgeInFull
