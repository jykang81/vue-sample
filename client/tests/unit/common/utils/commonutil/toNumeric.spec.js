import { assert } from 'chai'
import { toNumeric } from '@utils/commonutil/commonUtil'

describe('toNumeric', () => {
  it('입력이 없으면 숫자 0을 반환한다', () => {
    const result = toNumeric()

    assert.equal(result, 0)
  })

  it('입력 값에 콤마가 있다면 제거한다. 제거 후 빈 문자열이면 0을 반환한다', () => {
    const result = toNumeric(',,,')

    assert.equal(result, 0)
  })

  it('string type 숫자를 입력하면 number type 숫자를 반환한다', () => {
    const result = toNumeric('1900000093')

    assert.equal(result, 1900000093)
  })
})
