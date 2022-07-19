import { assert } from 'chai'
import { insertSeparatorPhoneNumber } from '@utils/commonutil/commonUtil'

describe('insertSeparatorPhoneNumber', () => {
  describe('입력 값에 휴대폰 번호 형식의 구분자를 추가하여 반환한다', () => {
    it('입력 값이 없으면 빈 문자열을 반환한다', () => {
      const result = insertSeparatorPhoneNumber()

      assert.equal('', result)
    })

    it('입력 값에 - 구분자를 추가하여 반환한다', () => {
      const result = insertSeparatorPhoneNumber('01022223333')

      assert.equal(result, '010-2222-3333')
    })

    it('구분자 .를 넣으면 입력 값에 . 구분자를 추가하여 반환한다', () => {
      const result = insertSeparatorPhoneNumber('01022223333', '.', true)

      assert.equal(result, '010.2222.3333')
    })

    it('구분자 -를 넣으면 입력 값에 - 구분자를 추가하여 반환한다', () => {
      const result = insertSeparatorPhoneNumber('01022223333', '-', false)

      assert.equal(result, '010-2222-3333')
    })

    it('11자리 초과 입력 값은 초과 값을 제외시키고 반환한다', () => {
      const result = insertSeparatorPhoneNumber('010222233330000', '-', false)

      assert.equal(result, '010-2222-3333')
    })

    it('11자리 미만의 입력값은 자리수에 맞춰 구분자가 입력된다', () => {
      let result = insertSeparatorPhoneNumber('010222', '-', false)
      assert.equal(result, '010-222')

      result = insertSeparatorPhoneNumber('04302', '-', false)
      assert.equal(result, '043-02')

      result = insertSeparatorPhoneNumber('042', '-', false)
      assert.equal(result, '042')
    })

    it('지역번호를 입력하면 지역번호 뒤에 구분자를 추가하여 반환한다', () => {
      const result = insertSeparatorPhoneNumber('0202220000', '-', false)

      assert.equal(result, '02-0222-0000')
    })

    it('구분자 포함된 입력값은 12자리 뒤의 값을 제거하여 반환한다', () => {
      const result = insertSeparatorPhoneNumber('0130-2222-33333', '-')

      assert.equal(result, '0130-2222-3333')
    })
  })
})
