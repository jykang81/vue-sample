/**
 * Object로 이루어진 배열을 특정 키 값으로 groupBy
 *
 * @param {array} array (필수) 대상 배열
 * @param {string} key (필수) 키 값
 * @returns {object} groupBy 결과 Object
 */
function arrayGroupBy (array, key) {
  return array.reduce((accumulator, currentValue) => {
    (accumulator[currentValue[key]] = accumulator[currentValue[key]] || []).push(currentValue)
    return accumulator
  }, {})
}

export default arrayGroupBy
