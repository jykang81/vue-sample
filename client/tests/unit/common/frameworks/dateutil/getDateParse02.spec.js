import { assert } from 'chai'
import {
  getDateParse02
} from '@frameworks/dateutil/dateUtil'

describe('getDateParse02', () => {
  describe('특정 날짜 Date Type으로 파싱 (분 or 초를 자동으로 붙임)', () => {
    it('특정 날짜 Date Type으로 파싱 (분 or 초를 자동으로 붙임)', function () {
      const actual = getDateParse02('202012312359').getTime()
      const expected = new Date('2020', '11', '31', '23', '59', '00').getTime()

      assert.equal(actual, expected)
    })
  })
})
