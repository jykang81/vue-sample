/* eslint-disable */
import { assert } from 'chai'
import {
  vodDateDiff
} from '@frameworks/dateutil/dateUtil'

describe('vodDateDiff', () => {
  const UNIT_SECOND = 1000
  const UNIT_MINUTE = UNIT_SECOND * 60
  const UNIT_HOUR = UNIT_MINUTE * 60
  const UNIT_DAY = UNIT_HOUR * 24
  const UNIT_WEEK = UNIT_DAY * 7
  const UNIT_MONTH = UNIT_DAY * 30
  const UNIT_YEAR = UNIT_DAY * 365

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
   * 날짜 YYYYMMDDHHmmss 형식 반환
   * @param {Date} date Date 객체
   * @returns {String} 날짜 형식 문자열
   */
  function getYYYYMMDDHHmmss (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // getMonth returns zero-based value
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const YYYY = year
    const MM = formatTimeTo2Digit(month)
    const DD = formatTimeTo2Digit(day)
    const HH = formatTimeTo2Digit(hours)
    const mm = formatTimeTo2Digit(minutes)

    return `${YYYY}${MM}${DD}${HH}${mm}`
  }

  describe('현재 날짜와 입력 날짜의 기간차 년/월/일/시간 중 가장 최근 값 반환', () => {
    it('일(day)보다 적은 차이면 \'x시간 전\'을 반환한다', () => {
      const twoHoursAgo = new Date(Date.now() - UNIT_HOUR * 2)
      const formattedTwoHoursAgo = getYYYYMMDDHHmmss(twoHoursAgo)

      const result = vodDateDiff(formattedTwoHoursAgo)

      assert.include(result, '시간 전')
    })

    it('일(day)보다 크고 주(week)보다 적은 차이면 \'x일 전\'을 반환한다', () => {
      const threeDaysAgo = new Date(Date.now() - UNIT_DAY * 3)
      const formattedThreeDaysAgo = getYYYYMMDDHHmmss(threeDaysAgo)

      const result = vodDateDiff(formattedThreeDaysAgo)

      assert.include(result, '일 전')
    })

    it('주(week)보다 크고 달(month)보다 적은 차이면 \'x주 전\'을 반환한다', () => {
      const twoWeeksAgo = new Date(Date.now() - UNIT_WEEK * 2)
      const formattedTwoWeeksAgo = getYYYYMMDDHHmmss(twoWeeksAgo)

      const result = vodDateDiff(formattedTwoWeeksAgo)

      assert.include(result, '주 전')
    })

    it('달(month)보다 크고 년(month)보다 적은 차이면 \'x달 전\'을 반환한다', () => {
      const fourMonthsAgo = new Date(Date.now() - UNIT_MONTH * 4)
      const formattedFourMonthsAgo = getYYYYMMDDHHmmss(fourMonthsAgo)

      const result = vodDateDiff(formattedFourMonthsAgo)

      assert.include(result, '달 전')
    })

    it('년(year)보다 큰 차이면 \'x년 전\'을 반환한다', () => {
      const sevenYearsAgo = new Date(Date.now() - UNIT_YEAR * 7)
      const formattedSevenYearsAgo = getYYYYMMDDHHmmss(sevenYearsAgo)

      const result = vodDateDiff(formattedSevenYearsAgo)

      assert.include(result, '년 전')
    })
  })
})
