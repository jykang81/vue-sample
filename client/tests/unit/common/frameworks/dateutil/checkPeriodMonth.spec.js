import { assert } from 'chai'
import {
  checkPeriodMonth
} from '@frameworks/dateutil/dateUtil'

describe('checkPeriodMonth', () => {
  describe('입력한 두 날짜 사이의 개월 수 가 넘는지 계산하여 true/false 값 반환', () => {
    it('1년 째 되는 날은 12개월을 넘지 않음', () => {
      assert.isTrue(checkPeriodMonth('20200101', '20210101', 12))
    })

    it('1년 째 되는 날 다음 날은 12개월을 넘음', () => {
      assert.isFalse(checkPeriodMonth('20200101', '20210102', 12))
    })

    it('2개월 차이는 1개월 차이 넘음', () => {
      assert.isFalse(checkPeriodMonth('20200101', '20200301', 1))
    })

    it('2개월 차이는 3개월 차이 안 넘음', () => {
      assert.isTrue(checkPeriodMonth('20200101', '20200301', 3))
    })
  })
})
