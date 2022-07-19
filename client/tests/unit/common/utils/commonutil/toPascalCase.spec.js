import { assert } from 'chai'
import { toPascalCase } from '@utils/commonutil/commonUtil'

describe('toPascalCase', () => {
  it('문자열 PascalCase로 변환', () => {
    const actual = toPascalCase('THEMACATE')
    const expected = 'Themacate'

    assert.equal(actual, expected)
  })
})
