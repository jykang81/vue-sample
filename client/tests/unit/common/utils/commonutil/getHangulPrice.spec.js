import { assert } from 'chai'
import { getHangulPrice } from '@utils/commonutil/commonUtil'

describe('getHangulPrice', () => {
  it('0을 입력하면 문자열 0이 반환된다', () => {
    const result = getHangulPrice(0)

    assert.equal(result, '0')
  })

  it('1000넘는 금액을 입력하면 문자열 천을 붙여 반환한다', () => {
    const result = getHangulPrice(2000)

    assert.equal(result, '2천')
  })

  it('10000이 넘는 금액을 입력하면 문자열 만을 붙여 반환한다', () => {
    const result = getHangulPrice(30000)

    assert.equal(result, '3만')
  })

  it('1만이 넘는 입력 값은 각 자리를 확인하여 만, 천, 백, 십 등의 문자열을 붙여 반환한다 case 1', () => {
    const result = getHangulPrice(354321)

    assert.equal(result, '35만 4천 3백 2십 1')
  })

  it('1만이 넘는 입력 값은 각 자리를 확인하여 만, 천, 백, 십 등의 문자열을 붙여 반환한다 case 2', () => {
    const result = getHangulPrice('103,000')

    assert.equal(result, '10만 3천')
  })

  it('1억 이상의 값은 10,000만으로 표기한다.', () => {
    const result = getHangulPrice('500000000')

    assert.equal(result, '50,000만')
  })
})
