import { assert } from 'chai'
import {
  onKeyUpOnlyNumber
} from '@utils/commonutil/commonUtil'

describe('onKeyUpOnlyNumber', () => {
  it('validation을 모두 통과하면 값은 그대로이다', () => {
    const objThis = { value: '01099055544' }

    onKeyUpOnlyNumber(objThis, 18, true, 999999999999, 'ttt')

    assert.equal(objThis.value, '01099055544')
  })

  it('숫자 외의 문자열을 모두 제거한다', () => {
    const numericString = '2'
    const objThis = { value: `${numericString}ssssssssssssssssssss` }

    onKeyUpOnlyNumber(objThis, 18, true, 999999999999, 'ttt')

    assert.equal(objThis.value, numericString)
  })

  it('최대값을 초과하는 값은 절삭된다.', () => {
    const objThis = { value: '222222222222222222222222222222222222222222' }

    const maxValue = 999999999999
    const maxValueString = String(maxValue)

    onKeyUpOnlyNumber(objThis, 18, true, maxValue, 'ttt')

    assert.equal(objThis.value, maxValueString)
  })

  it('', () => {
    const objThis = { value: '10' }

    onKeyUpOnlyNumber(objThis, 1, false, 9, 'ttt')

    assert.equal(objThis.value, '9')
  })

  it('validation을 모두 통과하면 객체 값은 그대로이다', () => {
    const objThis = {}

    objThis.value = '10'
    onKeyUpOnlyNumber(objThis, 1, false, 9, 'ttt')
    assert.equal('9', objThis.value)

    objThis.value = '10'
    onKeyUpOnlyNumber(objThis, 2, true, 9)
    assert.equal('9', objThis.value)
  })
})
