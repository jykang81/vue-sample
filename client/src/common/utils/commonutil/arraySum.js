/**
 * 배열의 요소들의 합
 *
 * @param {array} array (필수) 대상 배열
 * @returns {array} 배열의 요소들의 합
 */
function arraySum (array) {
  return array.reduce((a, b) => a + b, 0)
}

export default arraySum
