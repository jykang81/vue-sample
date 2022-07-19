import { assert } from 'chai'
import cipherUtil from '@frameworks/cipherUtil'

describe('cipherUtil', () => {
  describe('encryptValue', () => {
    it('문자열을 넣으면 암호화된 문자열을 반환한다', () => {
      const testStr = '안녕하세요'

      const encryptedValue = cipherUtil.encryptValue(testStr)

      assert.notEqual(encryptedValue, testStr)
    })

    it('객체를 넣으면 암호화된 문자열을 반환한다', () => {
      const testObj = {
        hi: '안녕'
      }

      const encryptedValue = cipherUtil.encryptValue(testObj)

      assert.isNotObject(encryptedValue)
    })
  })

  describe('decryptValue', () => {
    it('암호문을 넣으면 복호화 문자열이 반환된다. ', () => {
      const originalValue = '김덕배'

      /** 암호화 검증 */
      const encryptedValue = cipherUtil.encryptValue(originalValue)

      assert.notEqual(encryptedValue, originalValue) // 암호문/평문 비교

      /** 복호화 검증 */
      const decryptedValue = cipherUtil.decryptValue(encryptedValue)

      assert.equal(decryptedValue, originalValue) // 복호문/평문 비교
    })

    it('암호문이 이전에 객체라면 복호화 결과로 객체를 반환한다.', () => {
      const mockObject = {
        bye: '잘가'
      }

      const encryptedValue = cipherUtil.encryptValue(mockObject)

      assert.isNotObject(encryptedValue) // 암호문 타입 체크

      /** 복호화 */
      const decryptedValue = cipherUtil.decryptValue(encryptedValue)

      assert.isObject(decryptedValue) // 복호화 값 타입 체크
    })
  })

  describe('getCipherObject', () => {
    it('암복호화용 객체를 반환한다', () => {
      const { key, iv, salt } = cipherUtil.getCipherObject()

      assert.isNotNull(key)
      assert.isNotNull(iv)
      assert.isNotNull(salt)
    })
  })

  describe('getSecretKey', () => {
    it('암복호화 키를 반환한다', () => {
      const secretKey = cipherUtil.getSecretKey()

      assert.isNotNull(secretKey)
    })
  })
})
