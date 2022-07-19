import { assert } from 'chai'
import { getCutBytes } from '@utils/commonutil/commonUtil'

describe('getCutBytes', () => {
  describe('입력 문자열을 인자 크기에 해당하는 바이트 만큼 잘라서 반환한다.', () => {
    it('15바이트 한글 문자열과 2을 입력하면 첫글자만 반환한다', () => {
      const fifteenBytesHangul = '안녕하세요'

      const result = getCutBytes(fifteenBytesHangul, 2)

      assert.equal(result, '안')
    })

    it('5바이트 영어 문자열과 5을 입력하면 모든 글자를 반환한다', () => {
      const fiveBytesEnglish = 'apple'

      const result = getCutBytes(fiveBytesEnglish, 5)

      assert.equal(result, fiveBytesEnglish)
    })
  })
})
