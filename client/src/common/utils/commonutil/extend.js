/**
 * @description 객체 병합 및 병합 객체 반환 (가변 인자)
 * case1) (target [, object1 ] [, objectN ])
 * case2) ([deep], target, object1 [, objectN ])
 * @param {boolean} [deep] - deep copy flag
 * @param {object} target - 병합 결과 객체
 * @param {object} objectN - 피병합 객체
 * @returns {object}
 */
function extend (...args) {
  const class2type = {}
  const hasOwn = class2type.hasOwnProperty
  const support = {}

  const helper = {
    type (obj) {
      if (obj === null) {
        return 'null'
      }
      return typeof obj === 'object' || typeof obj === 'function'
        ? class2type[toString.call(obj)] || 'object'
        : typeof obj
    },
    isFunction (obj) {
      return this.type(obj) === 'function'
    },
    isWindow (obj) {
      return obj !== null && obj === obj.window
    },
    isPlainObject (obj) {
      let key

      // IE 대응
      if (!obj || this.type(obj) !== 'object' || obj.nodeType || this.isWindow(obj)) {
        return false
      }

      try {
        if (obj.constructor &&
          !hasOwn.call(obj, 'constructor') &&
          !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
          return false
        }
      } catch (e) {
        // IE8,9
        return false
      }

      // Support: IE<9
      if (!support.ownFirst) {
        for (key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return hasOwn.call(obj, key)
          }
        }
      }

      return key === undefined || hasOwn.call(obj, key)
    },
    isArray: Array.isArray || function (obj) {
      return this.type(obj) === 'array'
    }
  }

  let src
  let copyIsArray
  let copy
  let name
  let options
  let clone
  let target = args[0] || {}
  let i = 1
  const length = args.length
  let deep = false

  // deep copy flag 처리
  if (typeof target === 'boolean') {
    deep = target

    target = args[i] || {}
    i++
  }

  // 예외 처리 ex) string
  if (typeof target !== 'object' && !helper.isFunction(target)) {
    target = {}
  }

  for (; i < length; i++) {
    // non-null/undefined 값만 처리
    if ((options = args[i]) !== null) {
      for (name in options) {
        if (Object.prototype.hasOwnProperty.call(options, name)) {
          src = target[name]
          copy = options[name]

          // 무한 루프 방지
          if (target === copy) {
            continue
          }

          // 객체 복사 재귀 처리
          if (deep && copy && (helper.isPlainObject(copy) ||
        (copyIsArray = helper.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false
              clone = src && helper.isArray(src) ? src : []
            } else {
              clone = src && helper.isPlainObject(src) ? src : {}
            }

            // 원본 유지 및 객체 복사
            target[name] = extend(deep, clone, copy)

            // undefined 처리
          } else if (copy !== undefined) {
            target[name] = copy
          }
        }
      }
    }
  }

  return target
}

export default extend
