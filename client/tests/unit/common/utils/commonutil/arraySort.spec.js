import { assert } from 'chai'
import { arraySort } from '@utils/commonutil/commonUtil'

describe('arraySort', () => {
  it('Object로 이루어진 배열을 특정 키 값으로 정렬', () => {
    const mockArray = [
      { a: 'abc' },
      { a: 'abc' },
      { a: 'def' }
    ]

    const actual = arraySort(mockArray, 'a', 'desc')

    const expected = [
      { a: 'def' },
      { a: 'abc' },
      { a: 'abc' }
    ]

    assert.deepEqual(actual, expected)
  })
})
