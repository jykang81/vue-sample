import {
  isJsonString
} from '@utils/commonutil/commonUtil'
import COMM_CONST from '@constants/framework/constants'
import cipherUtil from '@frameworks/cipherUtil'
import CONST from '@constants/framework/framework'

const localStorageUtil = {
  /**
   * localStorage getItem 유틸
   * @param {String} name (필수) 키 값
   * @returns {*} LocalStorage 키에 해당하는 값
   */
  get: name => {
    let result = null

    if (localStorage !== null) {
      result = localStorage.getItem(name)
    }

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
   * localStorage setItem 유틸
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

    if (localStorage !== null) {
      localStorage.setItem(name, result)
    }
  },
  /**
   * localStorage removeItem 유틸
   * @param {String} name (필수) 삭제할 키 값
   */
  del: name => {
    localStorage.setItem(name, '') // NSSR-9277 모바일 크롬버젼에 따른 자동로그인 오류

    if (localStorage.getItem(name) !== '') {
      localStorage.removeItem(name)
    }
  },
  /**
   * 최근 검색어 설정
   * @param {Object} searchWord 최근검색어 객체
   * @param {Number} [maxCnt=100] 검색어 최대 저장 개수
   */
  setSearchWord (searchWord, maxCnt = 100) {
    const name = COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST

    let searchWords = this.get(name)

    if (searchWords === null) {
      searchWords = []
    }

    const { keyword } = searchWord
    if (this.validateDuplicateKeyword(searchWords, keyword)) {
      return
    }

    this.handleExceedingMaxCnt(searchWords, maxCnt)

    searchWords.push(searchWord)

    this.set(name, searchWords)
  },
  /**
   * 검색어 중복 여부 반환
   * @param {Object} searchWords 검색어 리스트
   * @param {String} keyword 검색 키워드
   * @returns {Boolean}
   */
  validateDuplicateKeyword (searchWords, keyword) {
    let isDuplicated = false

    for (const searchWord of searchWords) {
      if (searchWord.keyword === keyword) {
        isDuplicated = true
      }
    }

    return isDuplicated
  },
  /**
   * 검색어 초과 저장 대응
   * @param {Object} searchWords 검색어 리스트
   * @param {Number} maxCnt 검색어 최대 저장 갯수
   */
  handleExceedingMaxCnt (searchWords, maxCnt) {
    if (searchWords.length >= maxCnt) {
      searchWords.shift()
    }
  },
  /**
   * 키워드 기반 검색어 삭제
   * @param {String} keyword 검색어 키워드
   */
  deleteSearchWordByKeyword (keyword) {
    const name = COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST

    const searchWords = this.get(name)

    const result = searchWords.filter(searchWord => {
      if (searchWord.keyword !== keyword) {
        return searchWord
      }
    })

    this.set(name, result)
  }
}

export default localStorageUtil
