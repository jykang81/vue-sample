import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import cipherUtil from '@frameworks/cipherUtil'
import localStorageUtil from '@frameworks/localStorageUtil'

const storageValidationUtil = {
  PLAIN_TEXT: 'NS홈쇼핑',
  /**
   * storage 갱신 필요 여부 확인
   */
  checkStorageResetRequired () {
    const storedStorageResetRequired = localStorage.getItem(COMM_CONST.STORAGE_KEY.STORAGE_RESET_REQUIRED)

    // 검증 값 없을 때
    if (storedStorageResetRequired === null) {
      this.resetStorage()

      return
    }

    // storage 갱신 필요 여부 확인
    const isCipherOnStorage = CONST.IS_CIPHER_ON_STORAGE
    const PLAIN_TEXT = this.PLAIN_TEXT

    if (isCipherOnStorage) { // 암호 사용
      if (PLAIN_TEXT === storedStorageResetRequired) { // 암호화 적용되지 않은 경우
        this.resetStorage()
      }

      const decryptedText = cipherUtil.decryptLightly(storedStorageResetRequired)
      if (decryptedText !== PLAIN_TEXT) { // 복호화 값이 다른 경우
        this.resetStorage()
      }
    } else { // 암호 미사용
      if (PLAIN_TEXT !== storedStorageResetRequired) { // 암호화 적용된 경우
        this.resetStorage()
      }
    }
  },
  /**
   * storage 초기화
   */
  resetStorage () {
    const PLAIN_TEXT = this.PLAIN_TEXT

    localStorage.clear()
    sessionStorage.clear()
    localStorageUtil.set(COMM_CONST.STORAGE_KEY.STORAGE_RESET_REQUIRED, PLAIN_TEXT)
  }
}

export default storageValidationUtil
