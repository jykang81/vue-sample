import { assert } from 'chai'
import { replaceAll } from '@utils/commonutil/commonUtil'

describe('replaceAll', () => {
  describe('문자열의 특정 문자 혹은 문자열 치환하여 반환한다', () => {
    it('치환할 문자열을 누락하면 입력 값을 그대로 반환한다', () => {
      const plainText = 'apple'

      const result = replaceAll(plainText)

      assert.equal(result, plainText)
    })

    it('치환될 문자열을 누락하면 입력 값을 그대로 반환한다', () => {
      const plainText = '/nsmobilehub.html'

      const result = replaceAll(plainText, '/')

      assert.equal(result, plainText)
    })

    it('/를 #으로 치환하여 반환한다', () => {
      const plainText = '/nsmobilehub.html'
      const regex = '/'
      const replacement = '#'

      const result = replaceAll(plainText, regex, replacement)

      const expected = '#nsmobilehub.html'

      assert.equal(result, expected)
    })
  })
})
