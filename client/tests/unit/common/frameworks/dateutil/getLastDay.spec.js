import { assert } from 'chai'
import {
  getLastDay
} from '@frameworks/dateutil/dateUtil'

describe('getLastDay', () => {
  describe('입력한 월의 마지막 날짜구하기', () => {
    it('입력한 월의 마지막 날짜구하기', () => {
      let actual = getLastDay(2020, 1)
      assert.equal(actual, 31)

      actual = getLastDay(2020, 3)
      assert.equal(actual, 31)

      actual = getLastDay('2020', '04')
      assert.equal(actual, 30)
    })
  })
})
