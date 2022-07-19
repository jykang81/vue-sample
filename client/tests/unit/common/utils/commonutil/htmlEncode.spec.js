import { assert } from 'chai'
import { htmlEncode } from '@utils/commonutil/commonUtil'

describe('htmlEncode', () => {
  describe('HTML 문자열을 인코딩한다', () => {
    it('태그의 꺽새가 치환된다', () => {
      const stringHTML = '<div>테스트</div>'

      const result = htmlEncode(stringHTML)

      const expectedEncodedHTML = '&lt;div&gt;테스트&lt;/div&gt;'

      assert.equal(result, expectedEncodedHTML)
    })
  })
})
