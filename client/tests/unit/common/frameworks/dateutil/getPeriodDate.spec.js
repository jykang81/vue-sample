import { assert } from 'chai'
import {
  calcDate,
  getPeriodDate
} from '@frameworks/dateutil/dateUtil'

describe('getPeriodDate', () => {
  describe('오늘날짜와 입력한 날짜의 차이 기간에 따라 특정 결과를 리턴한다', () => {
    const today = new Date()

    it('내일 날짜를 입력하고 0일 남았는지 체크', () => {
      const tommorow = calcDate(today, 0, 0, 0, 1, 'yyyyMMddHHmmss')

      const actual = getPeriodDate(tommorow, 'days', 0)
      const expected = 0

      assert.equal(actual, expected)
    })
  })
})
