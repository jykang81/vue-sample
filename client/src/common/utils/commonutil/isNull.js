/**
 * 입력된 값이 undefined, null, 빈스트링일 경우 true를 리턴
 * schangeStr값이 있을 경우(undefined, null이 아닌경우)
 * value의 값이 undefined, null, 빈스트링일 경우 changeStr의 값을 리턴한다.
 * value의 값이 undefined, null, 빈스트링이 아니면 value의 값을 그대로 리턴한다.
 *
 * @param {*} value
 * @param {*} changeStr
 * @returns {(boolean|string)}
 */
function isNull (value, changeStr) {
  let bReturn = false

  if (value === undefined || value === null || value === '' || value === 'null' || value === 'undefined') {
    bReturn = true
  }

  if (undefined !== changeStr && changeStr !== null) {
    if (bReturn) {
      return changeStr
    }

    return value
  }

  return bReturn
}

export default isNull
