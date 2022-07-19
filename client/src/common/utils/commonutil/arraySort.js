/**
 * Object로 이루어진 배열을 특정 키 값으로 정렬
 *
 * @param {array} array (필수) 대상 배열
 * @param {string} key (필수) 키 값
 * @param {string} [sortOrder='asc'] (선택) 정렬순서 (asc: 오름차순, desc: 내림차순. 기본값 asc)
 * @returns {array} 정렬 결과 array
 */
function arraySort (array, key, sortOrder = 'asc') {
  return array.sort((a, b) =>
    sortOrder === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key])
  )
}

export default arraySort
