import isNull from '@utils/commonutil/isNull'

/**
 * 객체 또는 배열이 비어있는지 확인
 *
 * @param {object|array} param - 확인할 객체 또는 배열
 * @returns {boolean}
 */
function isEmpty (param) {
  if (isNull(param)) {
    return true
  } else if (param.constructor === Object) {
    return Object.keys(param).length === 0
  } else if (param.constructor === Array) {
    return param.length === 0
  } else {
    return false
  }
}

export default isEmpty
