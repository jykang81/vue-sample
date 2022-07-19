import { assert } from 'chai'
import { objectToQueryString } from '@utils/commonutil/commonUtil'

describe('objectToQueryString', () => {
  describe('JSON 형식의 객체를 입력 받아 query string 파라미터 형식으로 반환한다', () => {
    it('apple, banana, cherry 세 가지 property를 갖는 객체를 입력하면 이것과 매핑되는 query string 문자열이 반환된다', () => {
      const mockObject = {
        apple: '사과',
        banana: '바나나',
        cherry: '체리'
      }

      const result = objectToQueryString(mockObject)

      const expected = 'apple=사과&banana=바나나&cherry=체리'

      assert.equal(result, expected)
    })
  })

  describe('Array 객체를 입력 받아 파라미터 형식으로 반환한다', () => {
    it('하나, 둘, 셋이 담긴 배열을 입력하면 배열의 인덱스와 매핑되는 query string을 반환한다', () => {
      const key = 'mockArray'
      const containArray = {
        [key]: ['하나', '둘', '셋']
      }

      const result = objectToQueryString(containArray)

      const expected = `${key}=하나&${key}=둘&${key}=셋`

      assert.equal(result, expected)
    })
  })
})
