import { assert } from 'chai'
import { serializeToObject } from '@utils/commonutil/commonUtil'

describe('serializeToObject', () => {
  describe('query string 형식의 문자열을 object의 key - value로 매핑하여 변환한다', () => {
    it('apple, banana, cherry를 key로, 사과, 바나나, 체리를 value로 하는 객체를 반환한다', () => {
      const queryString = 'apple=사과&banana=바나나&cherry=체리'

      const serializedObject = serializeToObject(queryString)

      assert.isObject(serializedObject)

      assert.equal(serializedObject.apple, '사과')
      assert.equal(serializedObject.banana, '바나나')
      assert.equal(serializedObject.cherry, '체리')
    })
  })
})
