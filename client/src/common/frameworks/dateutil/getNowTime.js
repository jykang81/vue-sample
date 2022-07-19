/**
 * 현재 시간
 * @param {String} [separator=''] (필수) 시간 구분자
 * @returns {String} 현재 시간
 */
function getNowTime (separator = '') {
  const date = new Date()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  return (hour < 10 ? `0${hour}` : hour) + separator + (min < 10 ? `0${min}` : min) + separator + (sec < 10 ? `0${sec}` : sec)
}

export default getNowTime
