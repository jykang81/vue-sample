import insertCommas from '@utils/commonutil/insertCommas'

/**
 * 금액 형식으로 포맷팅(콤마 삽입, 0보다 크면 앞의 부호 삽입)
 *
 * @param {string} prefix
 * @param {string} value
 * @returns {string} 금액 형식으로 포맷팅된 문자열
 */
function getMoneyFormat (prefix, value) {
  const returnValue = insertCommas(value)
  if (returnValue !== '0') {
    return prefix + returnValue
  }
  return returnValue
}

export default getMoneyFormat
