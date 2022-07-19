/**
 * 중복 제거
 *
 * @param {array} array 대상 배열
 * @returns {array} 중복 제거된 배열
 */
export default array => [...new Set(array)]
