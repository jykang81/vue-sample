import { assert } from 'chai'
import { getStepNumberString } from '@utils/commonutil/commonUtil'

describe('getStepNumberString.spec.js', () => {
  it('index를 입력하면 함수 내부 배열 값을 반환한다.', () => {
    const result = getStepNumberString(0)

    assert.equal('첫', result)
  })
})
