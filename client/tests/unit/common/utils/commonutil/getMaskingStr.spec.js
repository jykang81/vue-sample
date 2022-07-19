import { assert } from 'chai'
import { getMaskingStr } from '@utils/commonutil/commonUtil'

describe('getMaskingStr', () => {
  describe('입력 문자열의 masking 처리', () => {
    it('아이디만 입력한 경우 3자리까지 보여주고 나머지는 마스킹처리한 문자열을 반환한다', () => {
      const result = getMaskingStr('abcde@email.com')

      assert.equal(result, 'abc***')
    })
  })
})
