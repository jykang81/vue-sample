import {
  isJsonString
} from '@utils/commonutil/commonUtil'
import cipherUtil from '@frameworks/cipherUtil'
import CONST from '@constants/framework/framework'

//  sessionStorage 관련 함수
const sessionStorageUtil = {
  /**
   * sessionStorage getItem 유틸
   * @param {String} name (필수) 키 값
   * @returns {*} sessionStorage 키에 해당하는 값
   */
  get: name => {
    let result = null

    result = sessionStorage.getItem(name)

    if (!result) {
      return result
    }

    // 복호화
    if (CONST.IS_CIPHER_ON_STORAGE) {
      result = cipherUtil.decryptLightly(result)
    }

    if (isJsonString(result)) {
      result = JSON.parse(result)
    }

    return result
  },
  /**
   * sessionStorage setItem 유틸
   * @param {String} name (필수) key (@utils/constants -> COMM_CONST.STORAGE_KEY 객체 안에 정의)
   * @param {*} val (필수) value
   */
  set: (name, val) => {
    let result

    if (typeof val === 'string') {
      result = val
    } else {
      result = JSON.stringify(val)
    }

    // 암호화
    if (CONST.IS_CIPHER_ON_STORAGE) {
      result = cipherUtil.encryptLightly(result)
    }

    sessionStorage.setItem(name, result)
  },
  /**
   * sessionStorage에서 삭제
   * @param {String} name (필수) 삭제할 키 값
   */
  del: name => {
    sessionStorage.setItem(name, '') // NSSR-9277 모바일 크롬버젼에 따른 자동로그인 오류

    if (sessionStorage.getItem(name) !== '') {
      sessionStorage.removeItem(name)
    }
  },
  clear: () => {
    sessionStorage.clear()
  }
}

export default sessionStorageUtil
