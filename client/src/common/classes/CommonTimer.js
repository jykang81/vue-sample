/**
 * Timer 옵션
 * @typedef {Object} TimerOptions
 * @property {Number} hours - 시
 * @property {Number} minutes - 분
 * @property {Number} seconds - 초
 */

/** @type TimerOptions */
const defaultTimerOptions = {
  hours: 0,
  minutes: 0,
  seconds: 0
}

/**
 * @class
 * @classdesc 공용 타이머 클래스
 */
class CommonTimer {
  /** @type {number} 시 */
  hours = 0

  /** @type {number} 분 */
  minutes = 0

  /** @type {number} 초 */
  seconds = 0

  /** @type {string|null} 현재 돌아가고 있는 타이머 콜백 아이디 (setInterval 반환 값과 동일) */
  intervalId = null

  /** @type {Date|null} 타이머 시작 시간 */
  startedTime = null

  /** @type {Number} 시 (타이머 시작 시점) */
  hoursWhenTimerStarted

  /** @type {Number} 분 (타이머 시작 시점) */
  minutesWhenTimerStarted

  /** @type {Number} 초 (타이머 시작 시점) */
  secondsWhenTimerStarted

  /** @type {TimerOptions} 타이머 옵션 */
  timerOptions = {
    hours: 0,
    minutes: 0,
    seconds: 0
  }

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
   * @param {TimerOptions} [options] 타이머 옵션
   */
  constructor (options = defaultTimerOptions) {
    this.validateTimerOptions(options)

    this.timerOptions = options
  }

  /**
   * 타이머 시작
   */
  startTimer () {
    if (!this.intervalId) {
      this.intervalId = setInterval(this.elapseTime, 10, this) // 타이머 시작
    }
  }

  /**
   * 경과 시간 (ms 단위)
   * @returns {Number}
   */
  getElapsedTime () {
    return Math.abs(this.startedTime - new Date())
  }

  /**
   * 시간 흐름에 따라 시/분/초 갱신
   * setInterval 함수의 콜백으로 사용되기 때문에 this 대신 파라미터 timer를 사용한다.
   * @param {TimerExtended} timer 객체
   */
  elapseTime (timer) {
    // 타이머 이상동작 방지
    try {
      timer.validateTimerState(timer)
    } catch {
      timer.stopTimer()
      timer.hours = 0
      timer.minutes = 0
      timer.seconds = 0

      return
    }

    // 타이머 초기 동작
    if (timer.startedTime === null) {
      timer.startedTime = new Date()
      timer.hoursWhenTimerStarted = timer.hours
      timer.minutesWhenTimerStarted = timer.minutes
      timer.secondsWhenTimerStarted = timer.seconds

      return
    }

    const elapsedTime = timer.getElapsedTime()

    // 경과 시간 계산
    const elapsedHours = parseInt(elapsedTime / 1000 / 3600, 10)
    const elapsedMinutes = parseInt(elapsedTime / 1000 % 3600 / 60, 10)
    const elapsedSeconds = parseInt(elapsedTime / 1000 % 3600 % 60, 10)

    let displayHours = 0
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

    // 남은 시간 시 보정
    displayHours = timer.hoursWhenTimerStarted - revisedHours

    // 시간 초과 확인
    if (
      displayHours < 0 ||
      (displayHours === 0 && displayMinutes === 0 && displaySeconds === 0) ||
      displayHours < 0 || displayMinutes < 0 || displaySeconds < 0 // timer 이상 동작 방지
    ) {
      timer.stopTimer()
      timer.hours = 0
      timer.minutes = 0
      timer.seconds = 0

      return
    }

    // 시간 갱신
    timer.hours = displayHours
    timer.minutes = displayMinutes
    timer.seconds = displaySeconds
  }

  /**
   * 타이머 초기화
   */
  initTimer () {
    /** 기존 타이머 중지 */
    this.stopTimer()

    this.hours = this.timerOptions.hours
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
      this.intervalId = null
    }
  }

  /**
   * 남은 시간 포매팅
   * @returns {String}
   */
  formattedLimitTime () {
    return `${this.hours ? (this.hours > 9 ? this.hours : `0${this.hours}`) : '00'
    }:${
    this.minutes ? (this.minutes > 9 ? this.minutes : `0${this.minutes}`) : '00'
    }:${
    this.seconds > 9 ? this.seconds : `0${this.seconds}`}`
  }

  /**
   * timer 초기화 및 시작 등 종합 처리
   */
  setTimerAllInOne () {
    this.initTimer() // 타이머 초기화
    this.startTimer() // 타이머 시작
  }

  /**
   * 잔여시간 여부
   * @returns {Boolean}
   */
  hasRemainingTime () {
    if (this.hours === 0 && this.minutes === 0 && this.seconds === 0) {
      return false
    }

    return true
  }

  /**
   * 타이머 옵션 설정
   * @param {TimerOptions} timerOptions
   */
  setTimerOptions (timerOptions) {
    this.validateTimerOptions(timerOptions)

    const { hours, minutes, seconds } = timerOptions

    this.timerOptions.hours = hours
    this.timerOptions.minutes = minutes
    this.timerOptions.seconds = seconds

    this.hours = hours
    this.minutes = minutes
    this.seconds = seconds
  }

  /**
   * timer option 유효성 검증
   * @param {TimerOptions} timerOptios 타이머 옵션
   */
  validateTimerOptions (timerOptios) {
    const { hours, minutes, seconds } = timerOptios

    if (
      typeof hours !== 'number' ||
      typeof minutes !== 'number' ||
      typeof seconds !== 'number'
    ) {
      throw new TypeError(`inappropriate timer options. timer option: ${timerOptios}`)
    }
  }

  /**
   * 타이머 검사
   * @param {CommonTimer} timer
   */
  validateTimerState (timer) {
    const { hours, minutes, seconds } = timer

    if (
      typeof hours !== 'number' ||
      typeof minutes !== 'number' ||
      typeof seconds !== 'number'
    ) {
      throw new TypeError(`invalid timer state. timer state: ${timer}`)
    }
  }
}

export default CommonTimer
