import { assert } from 'chai'
import {
  getDateParse
} from '@frameworks/dateutil/dateUtil'

describe('getDateParse', () => {
  describe('특정 날짜 Date Type으로 파싱', () => {
    it('특정 날짜 Date Type으로 파싱', () => {
      const actual = getDateParse('2020-12-31 00:00:00').getTime()
      const expected = new Date('2020', '11', '31', '00', '00', '00').getTime()

      assert.equal(actual, expected)
    })
  })
})
