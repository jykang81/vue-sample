const timerObject = {
  m_timer: 0,
  /**
   * 타이머 초기화
   *
   */
  checkTimerObject () {
    if (this.m_timer !== 0) {
      clearInterval(this.m_timer)
      this.m_timer = 0
    }
  }
}

export default timerObject
