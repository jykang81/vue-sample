import modalUtil from '@frameworks/modalUtil'

/**
 * 캘린더 선택 창 open
 * @param {Object} param 캘린더 옵션 객체
 * @param {String} [param.titleName] 타이틀
 * @param {Boolean} [param.isYearUsed] 년도 사용 여부
 * @param {Boolean} [param.isMonthUsed] 월 사용 여부
 * @param {Boolean} [param.isDayUsed] 일 사용 여부
 * @param {Number} [param.startYear] 시작년도 (endYear와 함께 쓰여야 함)
 * @param {Number} [param.endYear] 시작년도 (startYear 함께 쓰여야 함)
 * @param {String} [param.setDate] 초기 날짜 ex) '2019-07-05'
 * @param {Function} callbackFunction 콜백
 */
function openCalendar (param, callbackFunction) {
  if (param === undefined || param === null) {
    param = {}
  }

  if (callbackFunction === undefined || callbackFunction === null) {
    callbackFunction = function (result) {
      console.log('default callback result:', result)
    }
  }

  modalUtil.show('common/NsCalendar', param, callbackFunction)
}

export default openCalendar
