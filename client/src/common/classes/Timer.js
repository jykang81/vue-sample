/**
 * Timer 기본 옵션
 * @typedef {Object} TimerOptions
 * @property {Number} minutes - 분
 * @property {Number} seconds - 초
 * @property {null|String} intervalId - setInterval 반환 값
 */

/** @type TimerOptions */
const defaultTimerOptions = {
  minutes: 5,
  seconds: 0,
  intervalId: null
}

/**
 * @class
 * @classdesc 타이머 클래스
 */
class Timer {
  /** @type {number} 분 */
  minutes = 0

  /** @type {number} 초 */
  seconds = 0

  /** @type {null|String} 현재 돌아가고 있는 타이머 콜백 아이디 (setInterval 반환값) */
  intervalId = null

  /** @type {null|Date} 타이머 시작 시간 */
  startedTime = null

  /** @type {Number} 분 (타이머 시작 시점) */
  minutesWhenTimerStarted

  /** @type {Number} 초 (타이머 시작 시점) */
  secondsWhenTimerStarted

  /**
   * javascript Date 관리용 단위 객체
   * @typedef {Object} TIME_UNIT
   * @property {Number} SECOND - 초
   * @property {Number} MINUTE - 분
   */
  TIME_UNIT = {
    SECOND: 1000,
    get MINUTE () {
      return this.SECOND * 60
    },
    get HOUR () {
      return this.MINUTE * 60
    }
  }

  /**
   * 타이머 객체 생성
   * @param {TimerOptions} options
   */
  constructor (options = defaultTimerOptions) {
    /** @type {TimerOptions} 타이머 옵션 */
    this.timerOptions = options
  }

  /**
   * 경과 시간 (ms 단위)
   * @returns {Number}
   */
  getElapsedTime () {
    return Math.abs(this.startedTime - new Date())
  }

  /**
   * 타이머 시작
   * @param {Timer} timer 타이머 객체
   */
  startTimer (timer) {
    if (timer.startedTime === null) {
      timer.startedTime = new Date()
      timer.minutesWhenTimerStarted = timer.minutes
      timer.secondsWhenTimerStarted = timer.seconds

      return
    }

    const elapsedTime = timer.getElapsedTime()

    // 경과 시간 계산
    const elapsedHours = parseInt(elapsedTime / 1000 / 3600, 10)
    const elapsedMinutes = parseInt(elapsedTime / 1000 % 3600 / 60, 10)
    const elapsedSeconds = parseInt(elapsedTime / 1000 % 3600 % 60, 10)

    let revisedHours = elapsedHours
    let displayMinutes = 0
    let revisedMinutes = elapsedMinutes
    let displaySeconds = 0

    // 남은 시간 초 보정
    if (timer.secondsWhenTimerStarted < elapsedSeconds) {
      displaySeconds = 60 - Math.abs(timer.secondsWhenTimerStarted - elapsedSeconds)
      revisedMinutes = elapsedMinutes + 1
    } else {
      displaySeconds = timer.secondsWhenTimerStarted - elapsedSeconds
    }

    // 남은 시간 분 보정
    if (timer.minutesWhenTimerStarted < revisedMinutes) {
      displayMinutes = 60 - Math.abs(timer.minutesWhenTimerStarted - revisedMinutes)
      revisedHours = elapsedHours + 1
    } else {
      displayMinutes = timer.minutesWhenTimerStarted - revisedMinutes
    }

    // 시간 초과 확인
    if (
      revisedHours > 0 ||
      (timer.minutes === 0 && timer.seconds === 0) ||
      timer.minutes < 0 || timer.seconds < 0 // timer 이상 동작 방지
    ) {
      timer.minutes = 0
      timer.seconds = 0
      timer.stopTimer()

      return
    }

    // 시간 갱신
    timer.minutes = displayMinutes
    timer.seconds = displaySeconds
  }

  /**
   * 타이머 초기화
   */
  resetTimer () {
    /** 기존 타이머 중지 */
    this.stopTimer()

    this.minutes = this.timerOptions.minutes
    this.seconds = this.timerOptions.seconds
  }

  /**
   * 타이머 중지
   */
  stopTimer () {
    this.startedTime = null

    if (this.intervalId) {
      clearTimeout(this.intervalId)
    }
  }

  /**
   * 남은 시간 포매팅
   * @returns {String}
   */
  formattedLimitTime () {
    return `${this.minutes ? (this.minutes > 9 ? this.minutes : `0${this.minutes}`) : '00'
      }:${this.seconds > 9 ? this.seconds : `0${this.seconds}`}`
  }

  /**
   * timer 초기화 및 시작 등 종합 처리
   */
  setTimerAllInOne () {
    /** 인증번호 입력 유효시간 확인(180초) */
    this.resetTimer() // 타이머 초기화
    this.intervalId = setInterval(this.startTimer, 100, this) // 타이머 시작
  }

  /**
   * 잔여시간 여부
   * @returns {Boolean}
   */
  hasRemainingTime () {
    if (this.minutes === 0 && this.seconds === 0) {
      return false
    }

    return true
  }
}

export default Timer
