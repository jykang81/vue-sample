import { assert } from 'chai'
import { stringFormat } from '@utils/commonutil/commonUtil'

describe('stringFormat', () => {
  describe('문자열의 {x} 자리에 파라미터가 매핑된다', () => {
    it('문자열과 파라미터 세 개를 입력하면 매핑된 문자열이 반환된다', () => {
      const testString = 'placeholder {0} placeholder {1} placeholder {2}'

      const firstPlaceholder = '하나'
      const secondPlaceholder = '둘'
      const thirdPlaceholder = '셋'

      const result = stringFormat(testString, firstPlaceholder, secondPlaceholder, thirdPlaceholder)

      const expected = `placeholder ${firstPlaceholder} placeholder ${secondPlaceholder} placeholder ${thirdPlaceholder}`

      assert.equal(result, expected)
    })
  })
})
