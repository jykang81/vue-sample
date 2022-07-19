import { assert } from 'chai'
import localStorageUtil from '@frameworks/localStorageUtil'
import COMM_CONST from '@constants/framework/constants'

describe('localStorageUtil', function () {
  describe('setSearchWord', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('최근 검색 설정', () => {
      const keyword = '사과'
      const searchWord = { keyword }

      localStorageUtil.setSearchWord(searchWord)

      const searchWords = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)
      const result = searchWords.pop()

      assert.equal(result.keyword, keyword)
    })

    it('검색어 키워드가 중복되면, 검색 기록을 저장하지 않는다', () => {
      const keyword = '사과'
      const searchWord = { keyword }

      localStorageUtil.setSearchWord(searchWord)
      localStorageUtil.setSearchWord(searchWord)

      const searchWords = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)

      assert.notEqual(searchWords.length, 2)
    })

    it('검색 기록이 maxCnt에 도달하면, 기존 검색 기록이 교체된다', () => {
      const MAX_CNT = 3
      const keyword1 = '사과'
      const keyword2 = '배'
      const keyword3 = '망고'
      const keyword4 = '바나나'

      const searchWord1 = { keyword: keyword1 }
      const searchWord2 = { keyword: keyword2 }
      const searchWord3 = { keyword: keyword3 }
      const searchWord4 = { keyword: keyword4 }

      localStorageUtil.setSearchWord(searchWord1, MAX_CNT)
      localStorageUtil.setSearchWord(searchWord2, MAX_CNT)
      localStorageUtil.setSearchWord(searchWord3, MAX_CNT)
      localStorageUtil.setSearchWord(searchWord4, MAX_CNT)

      const searchWords = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)

      assert.equal(searchWords.length, 3)
    })

    it('특정 키워드의 검색 기록을 삭제한다', () => {
      const keyword1 = '사과'
      const keyword2 = '배'
      const keyword3 = '망고'
      const keyword4 = '바나나'

      const searchWord1 = { keyword: keyword1 }
      const searchWord2 = { keyword: keyword2 }
      const searchWord3 = { keyword: keyword3 }
      const searchWord4 = { keyword: keyword4 }

      localStorageUtil.setSearchWord(searchWord1)
      localStorageUtil.setSearchWord(searchWord2)
      localStorageUtil.setSearchWord(searchWord3)
      localStorageUtil.setSearchWord(searchWord4)

      localStorageUtil.deleteSearchWordByKeyword(keyword2)

      const searchWords = localStorageUtil.get(COMM_CONST.STORAGE_KEY.SEARCH_WORD_LIST)
      const filteredSearchWords = searchWords.filter(item => {
        return item.keyword === keyword2
      })

      assert.isEmpty(filteredSearchWords)
    })
  })
})
