import { assert } from 'chai'
import { isEmpty } from '@utils/commonutil/commonUtil'

describe('isEmpty', () => {
  describe('객체 또는 배열이 비어있는지 확인', () => {
    it('입력이 없으면 true를 반환한다', () => {
      const result = isEmpty()

      assert.isTrue(result)
    })

    it('빈 객체를 입력하면 true를 반환한다', () => {
      const emptyObject = {}

      const result = isEmpty(emptyObject)

      assert.isTrue(result)
    })

    it('프로퍼티가 있는 객체를 입력하면 false를 반환한다', () => {
      const objectContainsProps = { a: 'apple', b: 'banana' }

      const result = isEmpty(objectContainsProps)

      assert.isFalse(result)
    })

    it('빈 배열을 입력하면 true를 반환한다', () => {
      const emptyArray = []

      const result = isEmpty(emptyArray)

      assert.isTrue(result)
    })

    it('요소가 있는 배열을 입력하면 false를 반환한다', () => {
      const arrayContainsElement = [1, 2, 3]

      const result = isEmpty(arrayContainsElement)

      assert.isFalse(result)
    })
  })
})
