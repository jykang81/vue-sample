import { assert } from 'chai'
import {
  isDate
} from '@frameworks/dateutil/dateUtil'

describe('isDate', () => {
  describe('날짜형식 체크', () => {
    it('nulluable 값을 입력하면 false를 반환한다', () => {
      const nullable = null

      const result = isDate(nullable)

      assert.isFalse(result)
    })

    it('월 범위의 값이 아니라면 false를 반환한다', () => {
      const invalidMonth = '20001301'

      const result = isDate(invalidMonth)

      assert.isFalse(result)
    })

    it('일 범위의 값이 아니라면 false를 반환한다', () => {
      const invalidDay = '20000132'

      const result = isDate(invalidDay)

      assert.isFalse(result)
    })

    it('4월 31일을 입력하면 false를 반환한다 (31일이 없는 달의 일 유효성 확인)', () => {
      const invalidRelation = '20000431'

      const result = isDate(invalidRelation)

      assert.isFalse(result)
    })

    it('2월 30일을 입력하면 false를 반환한다', () => {
      const thirtyOnethOnFeb = '20200231'

      const result = isDate(thirtyOnethOnFeb)

      assert.isFalse(result)
    })

    it('윤년이 아닐 때 2월 29을 입력하면 false를 반환한다 (윤년 2월 말일 확인)', () => {
      const notLeapYear = '20190229'

      const result = isDate(notLeapYear)

      assert.isFalse(result)
    })

    it('날짜형식 체크', () => {
      const actual = isDate('19990101')

      assert.equal(actual, true)
    })
  })
})
