import { assert } from 'chai'
import {
  getTimeStamp
} from '@frameworks/dateutil/dateUtil'

describe('getTimeStamp', () => {
  describe('yyyyMMddHHmmssSSSS 반환', () => {
    it('yyyyMMddHHmmssSSSS 반환', () => {
      const actual = getTimeStamp(false)

      assert.ok(actual)
    })
  })
})
