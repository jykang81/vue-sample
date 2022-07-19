import { assert } from 'chai'
import { getPhoneNumber } from '@utils/commonutil/commonUtil'

describe('getPhoneNumber', () => {
  describe('전화번호 앞자리, 가운데, 끝자리 구하기', () => {
    it('입력 값이 없으면 빈 문자열을 반환한다', () => {
      const result = getPhoneNumber()

      assert.equal(result, '')
    })

    it('구분 타입이 문자열 1일 땐 전화번호 첫번째 구분자 이전 값을 반환한다', () => {
      const result = getPhoneNumber('0130-2222-33333', '1')

      assert.equal(result, '0130')
    })

    it('구분 타입이 문자열 2일 땐 전화번호 5~7 자리의 값을 반환한다', () => {
      const result = getPhoneNumber('0130-2222-33', '2')

      assert.equal(result, '222')
    })

    it('구분 타입이 문자열 3일 땐 전화번호 8 자리 이후 값을 반환한다', () => {
      const result = getPhoneNumber('02-222-1234', '3')

      assert.equal(result, '1234')
    })

    it('구분 타입이 문자열 4일 땐 전화번호 8 자리 이후 값을 반환한다', () => {
      const result = getPhoneNumber('02-1234-1234', '4')

      assert.equal(result, '1234')
    })

    it('구분 타입이 없으면 빈 문자열을 반환한다', () => {
      const result = getPhoneNumber('00-1234-1234')

      assert.equal(result, '')
    })
  })
})
