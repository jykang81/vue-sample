import { assert } from 'chai'
import { isHangul } from '@utils/commonutil/commonUtil'

describe('isHangul', () => {
  describe('문자열 한글 체크', () => {
    it('영어를 입력하면 false를 반환한다', () => {
      const englishOnly = 'sufferedCOVID19Now'

      const result = isHangul(englishOnly)

      assert.isFalse(result)
    })

    it('알파벳 포함가능 여부를 추가하고 영어와 한글이 섞인 입력을 하면 true를 반환한다', () => {
      const hangulWithEnglish = 'mazeltov힘내봐'

      const result = isHangul(hangulWithEnglish, true)

      assert.isTrue(result)
    })

    it('한글을 입력하면 true를 반환한다', () => {
      const onlyHangul = '나랏말싸미듕귁에달아'

      const result = isHangul(onlyHangul)

      assert.isTrue(result)
    })
  })
})
