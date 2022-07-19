import { assert } from 'chai'
import {
  calcDate
} from '@frameworks/dateutil/dateUtil'

describe('calcDate', () => {
  describe('시작일에서 특정 년,월,일이 +,- 된 날짜를 구함', () => {
    const date = new Date('2020-04-03')

    it('특정 날짜에서 1년 뺀 날짜', () => {
      const actual = calcDate(date, -1, 0, 0, 0, 'yyyy.MM.dd')
      const expected = '2019.04.03'

      assert.equal(actual, expected)
    })

    it('특정 날짜에서 1달 뺀 날짜', () => {
      const actual = calcDate(date, 0, -1, 0, 0, 'yyyy.MM.dd')
      const expected = '2020.03.03'

      assert.equal(actual, expected)
    })

    it('특정 날짜에서 1주 뺀 날짜', () => {
      const actual = calcDate(date, 0, 0, -1, 0, 'yyyy.MM.dd')
      const expected = '2020.03.27'

      assert.equal(actual, expected)
    })

    it('특정 날짜에서 1일 뺀 날짜', () => {
      const actual = calcDate(date, 0, 0, 0, -1, 'yyyy.MM.dd')
      const expected = '2020.04.02'

      assert.equal(actual, expected)
    })
  })
})
