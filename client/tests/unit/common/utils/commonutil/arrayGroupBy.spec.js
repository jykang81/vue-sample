import { assert } from 'chai'
import { arrayGroupBy } from '@utils/commonutil/commonUtil'

describe('arrayGroupBy', () => {
  it('Object로 이루어진 배열을 특정 키 값으로 groupBy', () => {
    const mockArray = [
      { a: 'abc' },
      { a: 'abc' },
      { a: 'def' }
    ]

    const actual = arrayGroupBy(mockArray, 'a')

    const expected = {
      abc: [
        { a: 'abc' },
        { a: 'abc' }
      ],
      def: [
        { a: 'def' }
      ]
    }

    assert.deepEqual(actual, expected)
  })
})
