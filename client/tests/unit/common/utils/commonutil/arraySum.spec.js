import { assert } from 'chai'
import { arraySum } from '@utils/commonutil/commonUtil'

describe('arraySum', () => {
  it('배열 요소들의 합을 반환한다', () => {
    const mockArray = [1, 2, 3]

    const actual = arraySum(mockArray)

    const expected = 6

    assert.equal(actual, expected)
  })
})
