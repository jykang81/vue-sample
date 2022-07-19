import { assert } from 'chai'
import { extend } from '@utils/commonutil/commonUtil'

describe('extend', () => {
  describe('복수개의 객체를 병합한다', () => {
    it('복수의 객체를 입력하면 첫번째 객체에 모든 객체의 내용이 병합된다', () => {
      const targetObject = {
        apple: '사과'
      }

      const object = {
        numeberGroup: {
          one: '하나'
        }
      }

      extend(targetObject, object)

      assert.equal(targetObject.numeberGroup.one, object.numeberGroup.one)
    })

    it('첫번째 매개변수로 true을 입력하면 deep copy 객체를 반환한다', () => {
      const targetObject = {
        apple: '사과'
      }

      const object = {
        numeberGroup: {
          one: '하나'
        }
      }

      const result = extend(true, {}, targetObject, object)

      assert.equal(result.apple, targetObject.apple)
      assert.equal(result.numeberGroup.one, object.numeberGroup.one)
    })
  })
})
