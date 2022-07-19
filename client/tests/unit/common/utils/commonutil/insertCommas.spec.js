import { assert } from 'chai'
import { insertCommas } from '@utils/commonutil/commonUtil'

describe('insertCommas', () => {
  it('음수 문자열을 입력하면 콤마가 삽입된 문자열을 반환한다', () => {
    const plainText = '-1900000093'

    const result = insertCommas(plainText)

    const addedCommasText = '-1,900,000,093'

    assert.equal(result, addedCommasText)
  })

  it('빈 문자열을 입력하면 문자열 0을 반환한다', () => {
    const emptyString = ''

    const result = insertCommas(emptyString)

    assert.equal(result, '0')
  })
})
