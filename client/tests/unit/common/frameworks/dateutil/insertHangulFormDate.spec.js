import { assert } from 'chai'
import {
  insertHangulFormDate
} from '@frameworks/dateutil/dateUtil'

describe('insertHangulFormDate', () => {
  describe('한글형식의 날짜로 변환 ex) 19990101 => 1999년 1월 1일', () => {
    it('19990101 => 1999년1월1일', () => {
      const actual = insertHangulFormDate('19990101')
      const expected = '1999년1월1일'

      assert.equal(actual, expected)
    })
  })
})
