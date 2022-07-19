import { assert } from 'chai'
import {
  calcTime
} from '@frameworks/dateutil/dateUtil'

describe('calcTime', () => {
  describe('시간 계산 함수', () => {
    /**
     * 시간 관련 값 2자리 포매팅
     * @param {Number} time
     * @returns {String}
     */
    function formatTimeTo2Digit (time) {
      if (time < 10) {
        return `0${time}`
      }

      return time
    }

    /**
     * 현재 시간 HHMMSS 포맷으로 반환
     * @returns {String}
     */
    function getCurrentHHmmss () {
      const current = new Date()

      const hours = current.getHours()
      const minutes = current.getMinutes()
      const second = current.getSeconds()

      const HH = formatTimeTo2Digit(hours)
      const MM = formatTimeTo2Digit(minutes)
      const SS = formatTimeTo2Digit(second)

      return `${HH}${MM}${SS}`
    }

    it('number 타입이 아니면 false를 반환한다', () => {
      const result = calcTime('not a number')

      assert.isFalse(result)
    })

    it('8자 이상 입력하면 false를 반환한다', () => {
      const moreThanSevenDigit = '12345678'

      const result = calcTime(moreThanSevenDigit)

      assert.isFalse(result)
    })

    it('현재 시간에 10초 before를 입력하면 false를 반환한다', () => {
      const currentHHMMSS = getCurrentHHmmss()

      const result = calcTime(currentHHMMSS, 0, 0, 10, 'before')

      assert.isFalse(result)
    })

    it('현재 시간에 10초 after를 입력하면 true를 반환한다', () => {
      const currentHHMMSS = getCurrentHHmmss()

      const result = calcTime(currentHHMMSS, 0, 0, 10, 'after')

      assert.isTrue(result)
    })
  })
})
