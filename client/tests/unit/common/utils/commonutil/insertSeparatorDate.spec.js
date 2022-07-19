import { assert } from 'chai'
import { insertSeparatorDate } from '@utils/commonutil/commonUtil'

describe('insertSeparatorDate', () => {
  describe('yyyymmdd 날짜 형식을 yyyy-mm-dd 로 변경한다.', () => {
    it('입력이 없으면 빈 문자열을 반환한다', () => {
      const result = insertSeparatorDate()

      assert.equal(result, '')
    })

    it('입력이 8자 미만이면 빈 문자열을 반환한다', () => {
      const stringArray = Array(7).fill(0)
      const reducer = (accumulator, value) => accumulator + value
      const shoterThan8char = stringArray.reduce(reducer, '')

      const result = insertSeparatorDate(shoterThan8char)

      assert.equal(result, '')
    })

    it('yyyymmdd 형식 문자열을 입력하면 yyyy-mm-dd 형식 문자열을 반환한다', () => {
      const yyyymmddFormatDate = '20001231'

      const result = insertSeparatorDate(yyyymmddFormatDate)

      assert.equal(result, '2000-12-31')
    })
  })
})
