import { assert } from 'chai'
import { getBytes } from '@utils/commonutil/commonUtil'

describe('getBytes', () => {
  describe('입력 문자열의 byte 반환', () => {
    it('빈문자열을 입력하면 0을 반환한다', () => {
      const result = getBytes('')

      assert.equal(result, 0)
    })

    it('영어를 입력하면 문자열 길이와 반환 값이 동일하다', () => {
      const onlyEnglish = 'apple'

      const result = getBytes(onlyEnglish)

      const expectedBytes = onlyEnglish.length

      assert.equal(result, expectedBytes)
    })

    it('한글은 글자당 2바이트로 계산된다', () => {
      const onlyHangul = '사과'

      const result = getBytes(onlyHangul)

      const BYTES_OF_HANGUL_PER_CHARACTER = 2
      const expectedBytes = onlyHangul.length * BYTES_OF_HANGUL_PER_CHARACTER

      assert.equal(result, expectedBytes)
    })
  })
})
