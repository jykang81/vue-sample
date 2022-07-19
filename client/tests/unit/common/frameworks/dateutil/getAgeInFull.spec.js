import { assert } from 'chai'
import {
  getAgeInFull
} from '@frameworks/dateutil/dateUtil'

describe('getAgeInFull', () => {
  describe(`년월일 형식의 생일을 입력 받아 만나이를 계산해 리턴한다.
    bAgeChk의 값이 true로 입력될경우 만 14세 이상인지 리턴한다.
  `, () => {
    it('만 14세 이상인가 판단', () => {
      const actual = getAgeInFull('20050101', true, 14, true)

      assert.isTrue(actual)
    })
  })
})
