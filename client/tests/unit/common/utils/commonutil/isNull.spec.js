import { assert } from 'chai'
import {
  isNull
} from '@utils/commonutil/commonUtil'

describe('isNull', () => {
  it('null과 유사한 값이면 true를 반환한다.', () => {
    const result = isNull(null)

    assert.isTrue(result)
  })

  it('value가 null과 유사한 값이 아니고 changeStr 문자열이 있으면 changeStr을 반환한다', () => {
    const changeStr = 'tt'

    const result = isNull(null, changeStr)

    assert.equal(result, changeStr)
  })

  it('value가 null과 유사한 값이 아니고 changeStr 문자열이 있으면 value를 반환한다', () => {
    const value = 'd'
    const changeStr = 'tt'

    const result = isNull(value, changeStr)

    assert.equal(result, value)
  })
})
