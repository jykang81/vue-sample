import { assert } from 'chai'
import { htmlDecode } from '@utils/commonutil/commonUtil'

describe('htmlDecode', () => {
  describe('인코딩 된 문자열 HTML을 디코딩한다', () => {
    it('&lt;과 같은 인코딩 문자가 태그로 변환된 값이 반환된다', () => {
      const encodedHTML = '&lt;div&gt;테스트&lt;/div&gt;'

      const result = htmlDecode(encodedHTML)

      const expectedDecodedHTML = '<div>테스트</div>'

      assert.equal(result, expectedDecodedHTML)
    })
  })
})
