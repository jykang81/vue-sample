const mediaUtil = {
  /**
   * video js duration을 00:00:00 또는 00:00 형식으로 바꿔주는 함수
   * @param {Number} inputDuration - 비디오의 시간(초)
   * @param {Boolean} includeHour - duration이 60분 미만일 경우 hh 노출 여부 (true: 00:00:00 / false: 00:00 )
   * @returns {String} 00:00:00 또는 00:00 형태의 문자열
   */
  setDurationTimeForm (inputDuration, includeHour) {
    // 10진수 정수 값 반환
    inputDuration = parseInt(inputDuration, 10)

    // 시/분/초 분류
    const hh = inputDuration / 3600 // 시
    const mm = (inputDuration % 3600) / 60 // 분
    const ss = (inputDuration % 3600) % 60 // 초

    let outputDuration = ''
    if (!includeHour && hh < 1) {
      outputDuration = `${this.makeTwoDigits(mm)}:${this.makeTwoDigits(ss)}` // 00:00 형식
    } else {
      outputDuration = `${this.makeTwoDigits(hh)}:${this.makeTwoDigits(mm)}:${this.makeTwoDigits(ss)}` // 00:00:00 형식
    }

    return outputDuration
  },

  /**
   * 숫자를 두 자리 문자열로 바꿔주는 함수
   * 한 자리 숫자일 경우 앞에 0을 붙여준다.
   *
   * @param {Number} inputNum - 문자열로 변경하려는 숫자
   * @returns {String} 두 자리 문자열 (ex. 00)
   */
  makeTwoDigits (inputNum) {
    // 10진수 정수 값 반환 및 문자열로 변환
    inputNum = `${parseInt(inputNum, 10)}`

    return (inputNum.length === 1 ? `0${inputNum}` : inputNum)
  }
}

export default mediaUtil
