import unique from '@utils/commonutil/unique'
import { assert } from 'chai'

describe('unique 테스트', function () {
  describe('unique', function () {
    it('중복 제거 Number', function () {
      const actual = unique([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])
      const expected = [1, 2, 3, 4, 5]

      assert.deepEqual(actual, expected)
    })

    // 단위 테스트 설정
    it('중복 제거 String', function () {
      const actual = unique(['abc', 'def'])
      const expected = ['abc', 'def']

      assert.deepEqual(actual, expected)
    })
  })
})
