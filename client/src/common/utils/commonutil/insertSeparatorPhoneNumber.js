import isNull from '@utils/commonutil/isNull'
import getPhoneNumber from '@utils/commonutil/getPhoneNumber'

/**
 * 전화번호에 구분자 추가
 *
 * @param {string} pNumber
 * @param {string|undefined} separator
 * @param {(boolean|undefined)} isRequired
 * @returns {string}
 */
function insertSeparatorPhoneNumber (pNumber, separator, isRequired) {
  if (undefined === separator) {
    separator = '-'
  }

  if (isRequired) {
    return getPhoneNumber(pNumber, '1') + separator + getPhoneNumber(pNumber, '2') + separator + getPhoneNumber(pNumber, '3')
  }

  if (isNull(pNumber)) {
    return ''
  }

  pNumber = pNumber.replace(/-/gi, '') // 하이픈이 추가된 경우 제거

  if (['0130', '0303', '0502', '0503', '0504', '0505', '0506', '0507'].includes(pNumber.substring(0, 4))) {
    if (pNumber.length > 11) {
      pNumber = pNumber.substring(0, 4) + separator + pNumber.substring(4, 8) + separator + pNumber.substring(8, 12)
    } else if (pNumber.length > 7) {
      pNumber = pNumber.substring(0, 4) + separator + pNumber.substring(4, 7) + separator + pNumber.substring(7, 11)
    } else {
      pNumber = pNumber.substring(0, 4) + separator + pNumber.substring(4)
    }
  } else if (pNumber.substring(0, 2) === '02') {
    if (pNumber.length > 9) {
      pNumber = pNumber.substring(0, 2) + separator + pNumber.substring(2, 6) + separator + pNumber.substring(6, 10)
    } else if (pNumber.length > 5) {
      pNumber = pNumber.substring(0, 2) + separator + pNumber.substring(2, 5) + separator + pNumber.substring(5, 9)
    } else {
      pNumber = pNumber.substring(0, 2) + separator + pNumber.substring(2)
    }
  } else {
    if (pNumber.length > 10) {
      pNumber = pNumber.substring(0, 3) + separator + pNumber.substring(3, 7) + separator + pNumber.substring(7, 11)
    } else if (pNumber.length > 6) {
      pNumber = pNumber.substring(0, 3) + separator + pNumber.substring(3, 6) + separator + pNumber.substring(6, 10)
    } else if (pNumber.length > 3) {
      pNumber = pNumber.substring(0, 3) + separator + pNumber.substring(3)
    }
  }
  return pNumber
}

export default insertSeparatorPhoneNumber
