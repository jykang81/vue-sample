import CryptoJS from 'crypto-js'
import {
  isJsonString
} from '@utils/commonutil/commonUtil'
import CONST from '@constants/framework/framework'

const cipherUtil = {
  /**
   * 평문 암호화 (AES 128 암호화)
   * @param {(String|Array|Object)} value 암호화 대상 값
   * @returns {String} 암호화 문자열
   */
  encryptValue (value) {
    const secretKey = this.getSecretKey()
    const cipherOptions = this.getCipherOption()

    let targetValue
    if (typeof value === 'string') {
      targetValue = value
    } else {
      targetValue = JSON.stringify(value)
    }

    const ciphertext = CryptoJS.AES.encrypt(targetValue, secretKey, cipherOptions).toString()

    return ciphertext
  },
  /**
   * 암호문 복호화 (AES 128 복호화)
   * @param {String} ciphertext
   * @returns {*} 복호화 값
   */
  decryptValue (ciphertext) {
    const secretKey = this.getSecretKey()
    const cipherOptions = this.getCipherOption()

    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey, cipherOptions)
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8)

    let originalValue
    if (isJsonString(decryptedValue)) {
      originalValue = JSON.parse(decryptedValue)
    } else {
      originalValue = decryptedValue
    }

    return originalValue
  },
  /**
   * 암복호화 비밀키 객체 반환
   * @returns {Object}
   */
  getSecretKey () {
    const { passPhrase, salt } = this.getCipherObject()
    const keySize = 128
    const iterationCount = 1000

    if (CONST.IS_TEST_REPORT) { // unit test timeout 방지
      return passPhrase
    }

    const options = {
      keySize: keySize / 32,
      iterations: iterationCount
    }

    const secretKey = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), options)

    return secretKey
  },
  /**
   * 암복호화용 객체 반환
   * @returns {Object}
   */
  getCipherObject () {
    return {
      passPhrase: CONST.CIPHER_ENC_KEY,
      iv: CONST.CIPHER_IV,
      salt: CONST.CIPHER_SALT
    }
  },
  /**
   * 암복호화 옵션 객체 반환
   * @returns {Object}
   */
  getCipherOption () {
    const { iv } = this.getCipherObject()

    if (CONST.IS_TEST_REPORT) { // unit test timeout 방지
      return {}
    }

    const cipherOptions = { iv: CryptoJS.enc.Hex.parse(iv) }

    return cipherOptions
  },
  /**
   * 경량 암호화
   * @param {(String|Array|Object)} value 암호화 대상 값
   * @returns {String} 암호화 문자열
   */
  encryptLightly (value) {
    const { passPhrase } = this.getCipherObject()

    let targetValue
    if (typeof value === 'string') {
      targetValue = value
    } else {
      targetValue = JSON.stringify(value)
    }

    const ciphertext = CryptoJS.Rabbit.encrypt(targetValue, passPhrase).toString()

    return ciphertext
  },
  /**
   * 경량 복호화
   * @param {String} ciphertext
   * @returns {*} 복호화 값
   */
  decryptLightly (ciphertext) {
    const { passPhrase } = this.getCipherObject()

    const bytes = CryptoJS.Rabbit.decrypt(ciphertext, passPhrase)
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8)

    let originalValue
    if (isJsonString(decryptedValue)) {
      originalValue = JSON.parse(decryptedValue)
    } else {
      originalValue = decryptedValue
    }

    return originalValue
  }
}

export default cipherUtil
