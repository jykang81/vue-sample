import { assert } from 'chai'
import { checkByteLength } from '@utils/commonutil/commonUtil'

describe('checkByteLength', () => {
  describe('객체 value 프로퍼티의 byte lenth와 입력 값의 일치여부를 반환한다', () => {
    it('한글이 포함될 경우 byte length는 문자열의 길이+1과 일치하지 않는다', () => {
      const value = '10222한'
      const mockObject = {
        value
      }

      const result = checkByteLength(mockObject, value.length + 1)

      assert.isFalse(result)
    })

    it('한글이 포함되지 않을 경우 byte length는 문자열의 길이+1과 일치한다', () => {
      const value = '10'
      const mockObject = {
        value
      }

      const result = checkByteLength(mockObject, value.length + 1)

      assert.isTrue(result)
    })
  })
})
