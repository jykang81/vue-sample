import { assert } from 'chai'
import {
  getAddDate,
  calcDate
} from '@frameworks/dateutil/dateUtil'

describe('getAddDate', () => {
  describe('현재 날짜에 특정 년/월/일을 더한 날짜 반환', () => {
    const today = new Date()

    it('현재 날짜에 1년 더한 날짜 return', () => {
      const actual = getAddDate('year', 1)
      const expected = calcDate(today, 1, 0, 0, 0, 'yyyyMMdd')

      assert.equal(actual, expected)
    })

    it('현재 날짜에 1개월 더한 날짜 return', () => {
      const actual = getAddDate('month', 1)
      const expected = calcDate(today, 0, 1, 0, 0, 'yyyyMMdd')

      assert.equal(actual, expected)
    })

    it('현재 날짜에 1일 더한 날짜 return', () => {
      const actual = getAddDate('day', 1)
      const expected = calcDate(today, 0, 0, 0, 1, 'yyyyMMdd')

      assert.equal(actual, expected)
    })
  })
})
