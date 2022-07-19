import { assert } from 'chai'
import { validatePassword } from '@utils/commonutil/commonUtil'

describe('validatePassword', () => {
  const VALID_CODE = '00'
  const INVALID_CODE = '99'

  describe('비밀번호 유효성 검사', () => {
    it('한글이 포함될 경우 validStatus 값으로 99를 할당한다', () => {
      const containsHangul = 'son흥민'

      const resultObject = validatePassword(containsHangul)

      assert.equal(resultObject.validStatus, INVALID_CODE)
    })

    it('입력값에 대문자가 포함되지 않을 경우 validStatus 값으로 99를 할당한다', () => {
      const notContainCapitalLetter = 'mithra'

      const resultObject = validatePassword(notContainCapitalLetter)

      assert.equal(resultObject.validStatus, INVALID_CODE)
    })

    it('연속된 문자가 3개 포함될 경우 validStatus 값으로 99를 할당한다', () => {
      const sequential = 'Mithra123@'

      const resultObject = validatePassword(sequential)

      assert.equal(resultObject.validStatus, INVALID_CODE)
    })

    it('동일한 문자가 연속으로 3번 사용될 경우 validStatus 값으로 99를 할당한다', () => {
      const repetitive = 'Mithra111@'

      const resultObject = validatePassword(repetitive)

      assert.equal(resultObject.validStatus, INVALID_CODE)
    })

    it('입력값이 8자 미만일 경우 validStatus 값으로 99를 할당한다', () => {
      const lessThanEightCharacter = 'oneD1!'

      const resultObject = validatePassword(lessThanEightCharacter)

      assert.equal(resultObject.validStatus, INVALID_CODE)
    })

    it('대소문자를 섞고 특수문자를 섞고 8자에서 16자 미만이라면 validStatus 값으로 00을 할당한다', () => {
      const validPassword = 'Tukutz1@'

      const resultObject = validatePassword(validPassword)

      assert.equal(resultObject.validStatus, VALID_CODE)
    })
  })
})
