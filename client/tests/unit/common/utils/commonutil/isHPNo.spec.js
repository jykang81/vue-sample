import { assert } from 'chai'
import { isHPNo } from '@utils/commonutil/commonUtil'

describe('isHPNo', () => {
  describe('입력 값이 휴대폰 번호 형식과 일치여부를 반환한다', () => {
    it('3-4-4 형식의 문자열은 휴대폰번호이다', () => {
      const result = isHPNo('010-2222-3333')

      assert.isTrue(result)
    })

    it('3-4-5 형식의 문자열은 휴대폰번호가 아니다', () => {
      const result = isHPNo('010-2222-33333')

      assert.isFalse(result)
    })

    it('010 문자열은 휴대폰번호가 아니다', () => {
      const result = isHPNo('010')

      assert.isFalse(result)
    })
  })
})
