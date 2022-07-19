import { assert } from 'chai'
import {
  getBdDay,
  format
} from '@frameworks/dateutil/dateUtil'

describe('getBdDay', () => {
  describe('시작일에서 특정 년,월,일이 +,- 된 날짜를 구함', () => {
    const today = new Date()
    const todayStr = format(today, 'yyyyMMddHHmmss')

    it('오늘이 지났는지 체크', () => {
      const actual = getBdDay(todayStr, true)
      const expected = true

      assert.equal(actual, expected)
    })

    it('자릿수가 8 ~ 14 가 아니면 false', () => {
      const actual = getBdDay('2020040100000000', false)
      const expected = false

      assert.equal(actual, expected)
    })

    it('숫자가 아니면 false', function () {
      const actual = getBdDay('aaaaaaaa', false)
      const expected = false

      assert.equal(actual, expected)
    })
  })
})
