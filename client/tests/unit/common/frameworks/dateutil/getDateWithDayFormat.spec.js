import { assert } from 'chai'
import {
  getDateWithDayFormat
} from '@frameworks/dateutil/dateUtil'

describe('getDateWithDayFormat', () => {
  describe('8자리 날짜 > M/dd(요일) 포맷으로 변환', () => {
    it('M/dd(요일) 포맷 return', function () {
      const actual = getDateWithDayFormat('20200403')
      const expected = '4/3(금)'

      assert.equal(actual, expected)
    })
  })
})
