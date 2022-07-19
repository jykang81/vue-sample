import { assert } from 'chai'
import { isEmail } from '@utils/commonutil/commonUtil'

describe('isEmail', () => {
  describe('이메일 형식 검사', () => {
    it('@ 기호가 복수개 포함된 입력되면 false를 반환한다', () => {
      const containsMultipleAtSign = 'hello@abc.com@'

      const result = isEmail(containsMultipleAtSign)

      assert.isFalse(result)
    })

    it('탑레벨 도메인이 2~4 글자 사이가 아닐 경우 false를 반환한다', () => {
      const incorrectTopLevelDomain = 'hello@abc.c'

      const result = isEmail(incorrectTopLevelDomain)

      assert.isFalse(result)
    })

    it('이메일 형식의 문자열을 입력하면 true를 반환한다', () => {
      const mockEmail = 'hello@abc.com'

      const result = isEmail(mockEmail)

      assert.isTrue(result)
    })
  })
})
